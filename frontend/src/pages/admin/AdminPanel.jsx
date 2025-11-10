// src/components/admin/AdminPanel.jsx
import React, { useState } from 'react';
import WorkoutCreator from '../../components/admin/WorkoutCreator';
import WorkoutList from '../../components/admin/WorkoutList';
import MuscleManager from '../../components/admin/MuscleManager';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('create');

  const tabs = [
    { id: 'create', name: 'Criar Treino', icon: '➕' },
    { id: 'list', name: 'Meus Treinos', icon: '📋' },
    { id: 'muscles', name: 'Gerenciar Músculos', icon: '💪' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header do Admin */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                🏋️‍♂️ Painel Administrativo
              </h1>
              <p className="text-gray-600 mt-2">
                Gerencie seus treinos e exercícios
              </p>
            </div>
            <div className="mt-4 lg:mt-0">
              <button className="btn btn-primary">
                📊 Ver Estatísticas
              </button>
            </div>
          </div>
        </div>

        {/* Navegação por Abas */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-2 mb-6">
          <div className="flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium transition-all flex-1 justify-center ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span>{tab.icon}</span>
                <span className="hidden sm:inline">{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Conteúdo das Abas */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          {activeTab === 'create' && <WorkoutCreator />}
          {activeTab === 'list' && <WorkoutList />}
          {activeTab === 'muscles' && <MuscleManager />}
        </div>

      </div>
    </div>
  );
};

export default AdminPanel;