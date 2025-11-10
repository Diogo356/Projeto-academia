import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

const AdminLayout = ({ children, activeTab, setActiveTab }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [company, setCompany] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem('companySettings');
    if (saved) setCompany(JSON.parse(saved));
  }, []);

  // Aplicar tema dinâmico
  useEffect(() => {
    if (company.primaryColor) {
      document.documentElement.style.setProperty('--primary', company.primaryColor);
      document.documentElement.style.setProperty('--secondary', company.secondaryColor || company.primaryColor);
    }
  }, [company]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:ml-64 min-w-0 transition-all duration-300">
        <AdminHeader
          company={company}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="flex-1 p-4 lg:p-8">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;