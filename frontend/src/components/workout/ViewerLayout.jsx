// src/components/workout/ViewerLayout.jsx - CORRIGIDO
import React from 'react';
import { FaDumbbell, FaSignOutAlt } from 'react-icons/fa';
import { useAuthStore } from '../../services/authService';
import AuthService from '../../services/authService';
import { useCompanyData } from '../../hooks/useCompanyData'; // 1. Importar o hook

const ViewerLayout = ({ children }) => {
  // 2. Chamar o hook para carregar os dados da empresa
  useCompanyData();

  const user = useAuthStore(state => state.user);
  const company = useAuthStore(state => state.company);

  const handleLogout = async () => {
    await AuthService.logout();
  };

  // Variáveis para o logo (mesma lógica dos outros headers)
  const logoUrl = company?.logo?.url || null;
  const fallbackInitial = company?.name?.charAt(0).toUpperCase() || 'A';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo e Nome */}
            <div className="flex items-center space-x-3">
              
              {/* 3. Substituir o ícone estático pela lógica do logo */}
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={company.name}
                  className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{fallbackInitial}</span>
                </div>
            	)}
              
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {company?.name || 'Academia'}
                </h1>
                <p className="text-sm text-gray-500">Treinos</p>
              </div>
            </div>

            {/* User Info e Logout (Sem alterações) */}
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">Visualizador</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Sair"
              >
                <FaSignOutAlt className="text-lg" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default ViewerLayout;