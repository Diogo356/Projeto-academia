// src/components/admin/WorkoutList.jsx
import React, { useState } from 'react';

const WorkoutList = () => {
  const [workouts, setWorkouts] = useState([
    // Exemplo de treinos salvos
    {
      id: 1,
      name: 'Treino Cardio Avançado',
      category: 'cardio',
      difficulty: 'advanced',
      totalDuration: 3600,
      exerciseCount: 4,
      created: '2024-01-15'
    }
  ]);

  const deleteWorkout = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este treino?')) {
      setWorkouts(prev => prev.filter(workout => workout.id !== id));
    }
  };

  const duplicateWorkout = (workout) => {
    const newWorkout = {
      ...workout,
      id: Date.now(),
      name: `${workout.name} (Cópia)`,
      created: new Date().toISOString().split('T')[0]
    };
    setWorkouts(prev => [...prev, newWorkout]);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Meus Treinos</h2>
        <button className="btn btn-primary">
          ➕ Novo Treino
        </button>
      </div>

      {workouts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏋️‍♂️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Nenhum treino criado ainda
          </h3>
          <p className="text-gray-600 mb-4">
            Comece criando seu primeiro treino personalizado
          </p>
          <button className="btn btn-primary">
            Criar Primeiro Treino
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workouts.map(workout => (
            <div key={workout.id} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-gray-900 text-lg">{workout.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  workout.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                  workout.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {workout.difficulty === 'beginner' ? 'Iniciante' :
                   workout.difficulty === 'intermediate' ? 'Intermediário' : 'Avançado'}
                </span>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Categoria:</span>
                  <span className="font-medium capitalize">{workout.category}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Duração:</span>
                  <span className="font-medium">{Math.floor(workout.totalDuration / 60)}min</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Exercícios:</span>
                  <span className="font-medium">{workout.exerciseCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Criado em:</span>
                  <span className="font-medium">{workout.created}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <button className="btn btn-sm btn-outline flex-1">
                  👁️ Visualizar
                </button>
                <button 
                  onClick={() => duplicateWorkout(workout)}
                  className="btn btn-sm btn-outline"
                >
                  📋
                </button>
                <button 
                  onClick={() => deleteWorkout(workout.id)}
                  className="btn btn-sm btn-outline text-red-600"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkoutList;