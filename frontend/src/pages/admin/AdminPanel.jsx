// src/components/admin/AdminPanel.jsx
import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import Dashboard from '../../components/admin/tabs/Dashboard';
import WorkoutCreator from '../../components/admin/tabs/workout/WorkoutCreator';
import WorkoutList from '../../components/admin/tabs/workout/WorkoutList';
import MuscleManager from '../../components/admin/tabs/MuscleManager';
import CompanySettings from '../../components/admin/tabs/CompanySettings';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'create': return <WorkoutCreator />;
      case 'list': return <WorkoutList />;
      case 'muscles': return <MuscleManager />;
      case 'settings': return <CompanySettings />;
      default: return <Dashboard />;
    }
  };

  return (
    <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderTab()}
    </AdminLayout>
  );
};

export default AdminPanel;