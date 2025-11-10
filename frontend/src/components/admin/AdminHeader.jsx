// src/components/admin/AdminHeader.jsx
import React from 'react';

const AdminHeader = ({ company, sidebarOpen, setSidebarOpen }) => {
  const planColors = {
    free: 'gray',
    pro: 'blue',
    enterprise: 'purple'
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4">
      <div className="flex items-center justify-between">
        {/* Mobile Menu */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Logo + Nome */}
        <div className="flex items-center space-x-4">
          {company.logoPreview ? (
            <img src={company.logoPreview} alt="Logo" className="w-10 h-10 rounded-lg object-contain" />
          ) : (
            <div className="w-10 h-10 bg-gray-200 rounded-lg border-2 border-dashed" />
          )}
          <div>
            <h1 className="text-xl font-bold text-gray-900">{company.name || 'Minha Academia'}</h1>
            <p className="text-xs text-gray-500">{company.slogan || 'Gerencie com excelência'}</p>
          </div>
        </div>

        {/* Plano + Usuário */}
        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center space-x-2 bg-gray-50 px-3 py-1 rounded-full">
            <span className="text-xs font-medium capitalize">{company.plan || 'pro'}</span>
            <span className={`w-2 h-2 rounded-full bg-${planColors[company.plan || 'pro']}-500`} />
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">Admin</p>
              <p className="text-xs text-gray-500">admin@academia.com</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
              A
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;