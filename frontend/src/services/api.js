import axios from 'axios';
import AuthService from './authService';

// NOTA: Tive que importar o AuthService de forma "lazy" (tardia)
// para evitar um "loop de dependência" (api -> authService -> api)
// Esta é uma prática comum com interceptors.
const getAuthService = () => AuthService;

const API_BASE_URL = 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
});

// === INTERCEPTOR: Remove Content-Type quando for FormData ===
api.interceptors.request.use(config => {
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  return config;
}, error => Promise.reject(error));

// === RESPONSE INTERCEPTOR (CORRIGIDO) ===
api.interceptors.response.use(
  response => response.data,
  async error => {
    const originalRequest = error.config;

    if (!error.response) return Promise.reject(error);

    // ⭐️ MUDANÇA CRUCIAL AQUI ⭐️
    // Só tenta o refresh se:
    // 1. For um 401 (Não autorizado)
    // 2. Ainda não tentamos (sem _retry)
    // 3. A rota que falhou NÃO é a de refresh-token (evita loop)
    // 4. A rota que falhou NÃO é a verificação inicial de auth (que tem a flag _isInitialAuthCheck)
    // 5. ❗️A ROTA QUE FALHOU NÃO É O LOGIN NEM O REGISTRO❗️
    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== '/auth/refresh-token' &&
      originalRequest.url !== '/auth/login' &&         // ⬅️ ADICIONADO
      originalRequest.url !== '/auth/register' &&     // ⬅️ ADICIONADO (Boa prática)
      !originalRequest._isInitialAuthCheck
    ) {
      
      if (isRefreshing) {
        // Se já tem um refresh em andamento, entra na fila
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Usa o getAuthService() para evitar o loop de importação
        await getAuthService().refreshToken(); 
        processQueue(null);
        return api(originalRequest); // Tenta a requisição original de novo
      } catch (refreshError) {
        processQueue(refreshError);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Para todos os outros erros (ou 401s que não devem dar refresh), apenas rejeita
    const message = error.response?.data?.message || 'Erro de conexão';
    // ⭐️ MUDANÇA 2: Retorna o erro completo, não só a mensagem
    // Isso permite que o authService.js verifique o 'status'
    return Promise.reject(error);
  }
);

// --- Lógica de Fila de Refresh (Sem alterações) ---
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    error ? prom.reject(error) : prom.resolve(token);
  });
  failedQueue = [];
};

export default api;