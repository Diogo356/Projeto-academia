// src/components/auth/AccessDenied.jsx - SIMPLIFICADO
import React from 'react';
import { FaBan, FaDumbbell } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../services/authService';

const AccessDenied = () => {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);

  const handleGoToWorkout = () => {
    navigate('/workout');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaBan className="text-red-500 text-3xl" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Acesso Restrito
          </h1>
          
          <p className="text-gray-600 mb-2">
            Olá, <strong>{user?.name || 'Usuário'}</strong>!
          </p>
          
          <p className="text-gray-600 mb-6">
            Sua conta de <strong>Visualizador</strong> não tem permissão para acessar o painel administrativo.
          </p>

          <button
            onClick={handleGoToWorkout}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all flex items-center justify-center space-x-2"
          >
            <FaDumbbell />
            <span>Ir para Meus Treinos</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;