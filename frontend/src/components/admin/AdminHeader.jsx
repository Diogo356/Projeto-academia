// src/components/layout/AdminHeader.jsx
import React from 'react';
import { 
  FaDumbbell, 
  FaHeartbeat, 
  FaBars,
  FaUserShield 
} from 'react-icons/fa';
import { useAuthStore } from '../../services/authService';
import { useCompanyData } from '../../hooks/useCompanyData'; // Importe o novo hook

const AdminHeader = ({ sidebarOpen, setSidebarOpen }) => {
  // Pega a company diretamente do store do Zustand
  const company = useAuthStore(state => state.company);
  const user = useAuthStore(state => state.user);
  
  // Usa o hook para garantir que os dados da empresa sejam carregados
  useCompanyData();

  const planColors = {
    free: 'gray',
    pro: 'blue',
    enterprise: 'purple'
  };

  const getPlanColorClass = (plan) => {
    const color = planColors[plan || 'pro'];
    return `bg-${color}-500`;
  };

  const getPlanDisplayName = (plan) => {
    const planNames = {
      free: 'Grátis',
      pro: 'Profissional', 
      enterprise: 'Enterprise'
    };
    return planNames[plan] || 'Profissional';
  };

  // Fallback para quando a company ainda não carregou
  if (!company) {
    return (
      <header className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 z-20 transition-colors"
          >
            <FaBars className="w-6 h-6 text-gray-600" />
          </button>
          
          <div className="flex items-center space-x-4 flex-1 justify-center lg:justify-start lg:ml-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <FaDumbbell className="text-white text-lg" />
            </div>
            <div className="text-center lg:text-left">
              <h1 className="text-xl font-bold text-gray-900">Carregando...</h1>
              <p className="text-xs text-gray-500">Aguarde</p>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4 sticky top-0 z-10 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Mobile Menu */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 z-20 transition-colors"
        >
          <FaBars className="w-6 h-6 text-gray-600" />
        </button>

        {/* Logo + Nome - Centralizado no mobile, alinhado à esquerda no desktop */}
        <div className="flex items-center space-x-4 flex-1 justify-center lg:justify-start lg:ml-4">
          {company.logo?.url ? (
            <img 
              src={company.logo.url} 
              alt={`Logo ${company.name}`} 
              className="w-10 h-10 rounded-lg object-contain border border-gray-200" 
              onError={(e) => {
                // Fallback se a imagem não carregar
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          
          {/* Fallback quando não há logo */}
          <div 
            className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-md ${!company.logo?.url ? '' : 'hidden'}`}
            style={{ 
              background: 'linear-gradient(135deg, #3B82F6, #1E40AF)'
            }}
          >
            <FaDumbbell className="text-white text-lg" />
          </div>
          
          <div className="text-center lg:text-left">
            <h1 
              className="text-xl font-bold flex items-center gap-2 transition-colors"
              style={{ color: '#1F2937' }}
            >
              {company.name || 'Minha Academia'}
            </h1>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <FaHeartbeat className="text-red-400" />
              {company.slogan || 'Gerencie com excelência'}
            </p>
          </div>
        </div>

        {/* Plano + Usuário */}
        <div className="flex items-center space-x-4">
          {/* Badge do Plano */}
          <div 
            className="hidden sm:flex items-center space-x-2 px-3 py-1 rounded-full border transition-colors"
            style={{
              backgroundColor: '#F9FAFB',
              borderColor: '#E5E7EB'
            }}
          >
            <span 
              className="text-xs font-medium capitalize"
              style={{ color: '#374151' }}
            >
              {getPlanDisplayName(company.plan)}
            </span>
            <span 
              className="w-2 h-2 rounded-full"
              style={{ 
                backgroundColor: planColors[company.plan || 'pro']
              }}
            />
          </div>

          {/* Informações do Usuário */}
          <div className="flex items-center space-x-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">
                {user?.name || 'Administrador'}
              </p>
              <p className="text-xs text-gray-500">
                {user?.email || 'admin@academia.com'}
              </p>
            </div>
            
            {/* Avatar do Usuário */}
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md transition-all hover:shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)'
              }}
            >
              {user?.name ? (
                <span className="font-bold text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              ) : (
                <FaUserShield className="text-sm" />
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;