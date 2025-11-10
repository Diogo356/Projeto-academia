// src/components/admin/tabs/DashboardTab.jsx
import React from 'react';

const Dashboard = () => {
  const stats = [
    { label: 'Treinos Criados', value: '48', color: 'blue' },
    { label: 'Exercícios', value: '127', color: 'green' },
    { label: 'Músculos Mapeados', value: '24', color: 'purple' },
    { label: 'Tempo Total', value: '18h 32m', color: 'yellow' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600">Visão geral da sua academia</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-full bg-${stat.color}-100 flex items-center justify-center`}>
                <span className={`text-2xl`}>📈</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-lg mb-4">Atividade Recente</h3>
        <div className="space-y-3">
          {['Treino "Full Body" criado', 'Músculo "Trapézio" adicionado', 'Logo atualizado'].map((act, i) => (
            <div key={i} className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-gray-700">{act}</span>
              <span className="text-gray-400 ml-auto">há 2h</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;