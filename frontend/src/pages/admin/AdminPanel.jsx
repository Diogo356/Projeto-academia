// src/components/admin/AdminPanel.jsx - ATUALIZADO
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import Dashboard from '../../components/admin/tabs/Dashboard';
import WorkoutCreator from '../../components/admin/tabs/workout/WorkoutCreator';
import WorkoutList from '../../components/admin/tabs/workout/WorkoutList';
import MuscleManager from '../../components/admin/tabs/MuscleManager';
import CompanySettings from '../../components/admin/tabs/companySettings/CompanySettings';
import SettingsPanel from '../../components/admin/tabs/companySettings/SettingsPanel';

const AdminPanel = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extrai a tab ativa da URL
  const getActiveTabFromPath = () => {
    const path = location.pathname;
    if (path.includes('/admin/create')) return 'create';
    if (path.includes('/admin/list')) return 'list';
    if (path.includes('/admin/muscles')) return 'muscles';
    if (path.includes('/admin/settings')) return 'settings';
    return 'dashboard';
  };

  const [activeTab, setActiveTab] = useState(getActiveTabFromPath());

  // Atualiza a tab ativa quando a rota muda
  useEffect(() => {
    setActiveTab(getActiveTabFromPath());
  }, [location.pathname]);

  // Função para navegar entre as tabs
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    
    // Navega para a rota correspondente
    switch(tabId) {
      case 'dashboard':
        navigate('/admin');
        break;
      case 'create':
        navigate('/admin/create');
        break;
      case 'list':
        navigate('/admin/list');
        break;
      case 'muscles':
        navigate('/admin/muscles');
        break;
      case 'settings':
        navigate('/admin/settings');
        break;
      default:
        navigate('/admin');
    }
  };

  return (
    <AdminLayout activeTab={activeTab} setActiveTab={handleTabChange}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/create" element={<WorkoutCreator />} />
        <Route path="/list" element={<WorkoutList />} />
        <Route path="/muscles" element={<MuscleManager />} />
        <Route path="/settings" element={<SettingsPanel />} />
        
        {/* Redireciona rotas desconhecidas para o dashboard */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminPanel;