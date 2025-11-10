// src/services/api.js
import axios from 'axios';
import AuthService from './authService';

const API_BASE_URL = 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// === REFRESH TOKEN CONTROL ===
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    error ? prom.reject(error) : prom.resolve(token);
  });
  failedQueue = [];
};

// === REQUEST INTERCEPTOR ===
api.interceptors.request.use(
  (config) => {
    console.log('Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => Promise.reject(error)
);

// === RESPONSE INTERCEPTOR CORRIGIDO ===
api.interceptors.response.use(
  (response) => {
    console.log('Response:', response.status);
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    // Evita processar erro sem response (timeout, etc)
    if (!error.response) {
      return Promise.reject(error);
    }

    console.log('Error:', error.response?.status, error.response?.data?.message);

    // Se for 401 e não for uma tentativa de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // Evita múltiplos refresh tokens simultâneos
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await AuthService.refreshToken();
        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        // Não faz logout automático aqui - deixa o checkAuth lidar
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    const message = error.response?.data?.message || 'Erro de conexão';
    return Promise.reject(new Error(message));
  }
);

export default api;