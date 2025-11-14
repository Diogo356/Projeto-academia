import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AdminPanel from './pages/admin/AdminPanel';
import ViewerWorkoutList from './components/workout/ViewerWorkoutList';
import ActiveWorkout from './components/workout/ActiveWorkout';
import AccessDenied from './components/auth/AccessDenied';
import { useAuthStore } from './services/authService';
import AuthService from './services/authService';
import LoadingScreen from './components/ui/LoadingScreen';
import './index.css';

// Helper para verificar se é admin
const isAdminUser = (user) => {
  return user && (user.role === 'super_admin' || user.role === 'admin');
};

// Helper para verificar se é viewer
const isViewerUser = (user) => {
  return user && user.role === 'viewer';
};

function App() {
  const user = useAuthStore((state) => state.user);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);
  const [initializationError, setInitializationError] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Verificando autenticação...");

  const isAuthenticated = !!user;
  const isAdmin = isAdminUser(user);
  const isViewer = isViewerUser(user);

  // Verificar autenticação ao carregar o app
  useEffect(() => {
    const initializeAuth = async () => {
      setInitializationError(false);
      setLoadingMessage("Conectando ao servidor...");
      try {
        // Apenas chamamos o checkAuth.
        await AuthService.checkAuth();
      } catch (error) {
        console.error('Erro ao inicializar autenticação:', error);
        setInitializationError(true);
        // Garante que o loading pare se o checkAuth quebrar
        useAuthStore.getState().setCheckingAuth(false);
      }
    };

    // ⭐️ MUDANÇA CRUCIAL ⭐️
    // Removemos a condição e deixamos o array de dependência vazio [].
    // Isso garante que 'initializeAuth' rode EXATAMENTE UMA VEZ
    // quando o componente App for montado, e nunca mais.
    initializeAuth();
  
  }, []); // <-- O ARRAY VAZIO QUEBRA O LOOP!

  // Determina a rota padrão baseada no role
  const getDefaultRoute = () => {
    if (!isAuthenticated) return '/login';
    if (isAdmin) return '/admin';
    if (isViewer) return '/workout';
    return '/login';
  };

  // Loading enquanto verifica
  if (isCheckingAuth) {
    return (
      <LoadingScreen
        message={loadingMessage}
        showError={initializationError}
      />
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Rotas Públicas */}
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to={getDefaultRoute()} replace /> : <Login />}
          />
          <Route
            path="/register"
            element={isAuthenticated ? <Navigate to={getDefaultRoute()} replace /> : <Register />}
          />

          {/* Rotas do Admin - APENAS para admin/super_admin */}
          <Route
            path="/admin/*"
            element={
              isAuthenticated && isAdmin
                ? <AdminPanel />
                : <AccessDenied />
            }
          />

          {/* Rota de Lista de Workouts - PARA TODOS OS USUÁRIOS AUTENTICADOS */}
          <Route
            path="/workout"
            element={
              isAuthenticated
                ? <ViewerWorkoutList />
                : <Navigate to="/login" replace />
            }
          />

          {/* ✅ NOVA ROTA: Workout Ativo */}
          <Route
            path="/workout/:publicId"
            element={
              isAuthenticated
                ? <ActiveWorkout />
                : <Navigate to="/login" replace />
            }
          />

          {/* Rota de Access Denied */}
          <Route
            path="/access-denied"
            element={<AccessDenied />}
          />

          {/* Rota Padrão - Redireciona baseado no role */}
          <Route
            path="/"
            element={<Navigate to={getDefaultRoute()} replace />}
          />

          {/* 404 - Redireciona para rota apropriada */}
          <Route path="*" element={<Navigate to={getDefaultRoute()} replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;