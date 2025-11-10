// src/components/admin/MuscleManager.jsx
import React, { useState } from 'react';

const MuscleManager = () => {
  const [muscles, setMuscles] = useState([
    { id: 1, name: 'Peito', group: 'Superior', icon: '🦾' },
    { id: 2, name: 'Costas', group: 'Superior', icon: '💪' },
    { id: 3, name: 'Quadríceps', group: 'Inferior', icon: '🦵' },
    // ... mais músculos
  ]);

  const [newMuscle, setNewMuscle] = useState({
    name: '',
    group: 'Superior',
    icon: '💪'
  });

  const muscleIcons = ['💪', '🦾', '🦵', '🏃', '🤸', '🧘'];

  const addMuscle = () => {
    if (newMuscle.name.trim()) {
      setMuscles(prev => [...prev, {
        id: Date.now(),
        ...newMuscle
      }]);
      setNewMuscle({ name: '', group: 'Superior', icon: '💪' });
    }
  };

  const deleteMuscle = (id) => {
    setMuscles(prev => prev.filter(muscle => muscle.id !== id));
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Gerenciar Grupos Musculares</h2>
      
      {/* Adicionar Novo Músculo */}
      <div className="bg-gray-50 rounded-2xl p-6 mb-8">
        <h3 className="font-semibold text-gray-900 mb-4">Adicionar Novo Grupo Muscular</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <input
            type="text"
            value={newMuscle.name}
            onChange={(e) => setNewMuscle(prev => ({ ...prev, name: e.target.value }))}
            className="input input-bordered"
            placeholder="Nome do músculo"
          />
          
          <select
            value={newMuscle.group}
            onChange={(e) => setNewMuscle(prev => ({ ...prev, group: e.target.value }))}
            className="select select-bordered"
          >
            <option value="Superior">Superior</option>
            <option value="Inferior">Inferior</option>
            <option value="Core">Core</option>
            <option value="Full Body">Full Body</option>
          </select>

          <div className="flex space-x-2">
            <select
              value={newMuscle.icon}
              onChange={(e) => setNewMuscle(prev => ({ ...prev, icon: e.target.value }))}
              className="select select-bordered flex-1"
            >
              {muscleIcons.map(icon => (
                <option key={icon} value={icon}>{icon}</option>
              ))}
            </select>
            <button onClick={addMuscle} className="btn btn-primary">
              Adicionar
            </button>
          </div>
        </div>
      </div>

      {/* Lista de Músculos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {muscles.map(muscle => (
          <div key={muscle.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{muscle.icon}</span>
              <div>
                <div className="font-medium text-gray-900">{muscle.name}</div>
                <div className="text-sm text-gray-600">{muscle.group}</div>
              </div>
            </div>
            <button 
              onClick={() => deleteMuscle(muscle.id)}
              className="btn btn-sm btn-ghost text-red-600"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MuscleManager;