// src/components/admin/AdminSidebar.jsx - ATUALIZADO
import React from 'react';
import { 
  FaChartBar, 
  FaPlus, 
  FaList, 
  FaDumbbell, 
  FaCog,
  FaBars,
  FaTimes,
  FaUserShield,
  FaBuilding 
} from 'react-icons/fa';
import { useAuthStore } from '../../services/authService';
import { useLocation, useNavigate } from 'react-router-dom';

const menuItems = [
  { 
    id: 'dashboard', 
    label: 'Dashboard', 
    icon: FaChartBar,
    path: '/admin'
  },
  { 
    id: 'create', 
    label: 'Criar Treino', 
    icon: FaPlus,
    path: '/admin/create'
  },
  { 
    id: 'list', 
    label: 'Meus Treinos', 
    icon: FaList,
    path: '/admin/list'
  },
  { 
    id: 'muscles', 
    label: 'Músculos', 
    icon: FaDumbbell,
    path: '/admin/muscles'
  },
  { 
    id: 'settings', 
    label: 'Configurações', 
    icon: FaCog,
    path: '/admin/settings'
  },
];

const AdminSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const company = useAuthStore(state => state.company);
  const user = useAuthStore(state => state.user);
  const location = useLocation();
  const navigate = useNavigate();

  // Determina a tab ativa baseada na URL
  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/admin' || path === '/admin/') return 'dashboard';
    if (path.includes('/admin/create')) return 'create';
    if (path.includes('/admin/list')) return 'list';
    if (path.includes('/admin/muscles')) return 'muscles';
    if (path.includes('/admin/settings')) return 'settings';
    return 'dashboard';
  };

  const activeTab = getActiveTab();

  const handleNavigation = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Header Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 bg-white rounded-lg shadow-md border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          {sidebarOpen ? (
            <FaTimes className="text-gray-700 text-lg" />
          ) : (
            <FaBars className="text-gray-700 text-lg" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:z-30 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center shadow-sm justify-between px-6 py-3.5 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div 
              className="p-2 rounded-xl shadow-md transition-all"
              style={{
                background: 'linear-gradient(135deg, #3B82F6, #1E40AF)'
              }}
            >
              {company?.logo?.url ? (
                <img 
                  src={company.logo.url} 
                  alt={`Logo ${company.name}`}
                  className="w-6 h-6 object-contain"
                />
              ) : (
                <FaDumbbell className="text-white text-lg" />
              )}
            </div>
            <div>
              <h2 
                className="text-xl font-bold flex items-center transition-colors"
                style={{ color: '#1F2937' }}
              >
                {company?.name || 'Minha Academia'}
              </h2>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <FaBuilding className="text-gray-400 text-xs" />
                {company?.slogan || 'Gerenciar Academia'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaTimes className="text-gray-500 text-sm" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 mt-2">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? 'text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  style={{
                    backgroundColor: isActive 
                      ? '#3B82F6'
                      : 'transparent',
                    boxShadow: isActive 
                      ? '0 10px 15px -3px rgba(59, 130, 246, 0.25)'
                      : 'none'
                  }}
                >
                  <Icon className={`text-lg transition-colors ${
                    isActive 
                      ? 'text-white' 
                      : 'text-gray-400 group-hover:text-gray-600'
                  }`} />
                  <span className="font-medium">{item.label}</span>
                  
                  {/* Active indicator */}
                  {isActive && (
                    <div 
                      className="ml-auto w-2 h-2 rounded-full"
                      style={{ 
                        backgroundColor: '#FFFFFF'
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-3">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md"
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
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.name || 'Administrador'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email || 'admin@academia.com'}
              </p>
              <p 
                className="text-xs font-medium capitalize mt-0.5"
                style={{ 
                  color: '#3B82F6'
                }}
              >
                {user?.role === 'super_admin' ? 'Super Admin' : 
                 user?.role === 'admin' ? 'Administrador' : 
                 user?.role === 'viewer' ? 'Visualizador' :
                 user?.role || 'Usuário'}
              </p>
            </div>
          </div>

          {/* Status da Empresa */}
          {company && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Plano:</span>
                <span 
                  className="font-medium capitalize px-2 py-1 rounded-full"
                  style={{
                    backgroundColor: '#F3F4F6',
                    color: '#374151'
                  }}
                >
                  {company.plan === 'free' ? 'Grátis' : 
                   company.plan === 'pro' ? 'Profissional' : 
                   company.plan === 'enterprise' ? 'Enterprise' : 
                   company.plan}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs mt-1">
                <span className="text-gray-500">Status:</span>
                <span 
                  className={`font-medium px-2 py-1 rounded-full ${
                    company.status === 'active' 
                      ? 'bg-green-100 text-green-800'
                      : company.status === 'suspended'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {company.status === 'active' ? 'Ativo' : 
                   company.status === 'suspended' ? 'Suspenso' : 
                   'Cancelado'}
                </span>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main content overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-10 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default AdminSidebar;