import React from 'react';

const WorkoutHeader = ({ workout, currentExercise }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center">
            <span className="text-2xl text-white">💪</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {workout.name}
            </h1>
            <p className="text-gray-600 flex items-center space-x-2">
              <span>Exercício atual: {currentExercise.name}</span>
              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
              <span className="text-blue-600 font-medium">
                {Math.floor(currentExercise.completedTime / 60)}min decorridos
              </span>
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 mt-4 lg:mt-0">
          <div className="text-right">
            <div className="text-sm text-gray-500">Sessão</div>
            <div className="font-semibold text-gray-900">#{Math.random().toString(36).substr(2, 9).toUpperCase()}</div>
          </div>
          <div className="w-px h-8 bg-gray-300"></div>
          <button className="btn btn-outline btn-sm">
            📊 Relatório
          </button>
          <button className="btn btn-primary btn-sm">
            ⚙️ Configurações
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkoutHeader;