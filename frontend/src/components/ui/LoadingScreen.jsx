// src/components/ui/LoadingScreen.jsx
import React from 'react';
import { FaDumbbell } from 'react-icons/fa';

const LoadingScreen = ({ message = "Carregando...", showError = false }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-bounce mb-6">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto">
            <FaDumbbell className="text-white text-2xl" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Academia Pro</h2>
        <p className="text-gray-600">{message}</p>
        {showError && (
          <p className="mt-2 text-sm text-orange-600">
            Problema de conexão. Tentando novamente...
          </p>
        )}
        <div className="mt-4 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;