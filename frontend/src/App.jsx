// src/App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AdminPanel from './pages/admin/AdminPanel';
import ActiveWorkout from './components/workout/ActiveWorkout';
import { useAuthStore } from './services/authService';
import AuthService from './services/authService';
import './index.css';

function App() {
  const user = useAuthStore((state) => state.user);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);
  const [isInitialized, setIsInitialized] = useState(false);
  const [initializationError, setInitializationError] = useState(false);

  const isAuthenticated = !!user;

  // Verificar autenticação ao carregar o app
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Timeout para inicialização
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout na inicialização')), 15000)
        );

        await Promise.race([AuthService.checkAuth(), timeoutPromise]);
        setInitializationError(false);
      } catch (error) {
        console.error('Erro ao inicializar autenticação:', error);
        setInitializationError(true);
        // Garante que a aplicação não fique travada
        useAuthStore.getState().setCheckingAuth(false);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, []);

  // Loading enquanto verifica
  if (!isInitialized || isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="mt-4 text-gray-600">Verificando autenticação...</p>
          {initializationError && (
            <p className="mt-2 text-sm text-orange-600">
              Problema de conexão. Tentando novamente...
            </p>
          )}
        </div>
      </div>
    );
  }

  // Se houve erro na inicialização mas já finalizou, mostra a app normalmente
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Rotas Públicas */}
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/admin" replace /> : <Login />}
          />
          <Route
            path="/register"
            element={isAuthenticated ? <Navigate to="/admin" replace /> : <Register />}
          />

          {/* Rotas Protegidas */}
          <Route
            path="/admin/*"
            element={isAuthenticated ? <AdminPanel /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/workout"
            element={isAuthenticated ? <ActiveWorkout /> : <Navigate to="/login" replace />}
          />

          {/* Rota Padrão */}
          <Route
            path="/"
            element={<Navigate to={isAuthenticated ? "/admin" : "/login"} replace />}
          />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;