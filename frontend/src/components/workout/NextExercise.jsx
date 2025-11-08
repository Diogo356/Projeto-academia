import React from 'react';

const NextExercise = ({ nextExercise }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        ⏭️ Próximo Exercício
      </h3>
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
          <span className="text-2xl">🚴‍♂️</span>
        </div>
        <div>
          <h4 className="font-semibold text-gray-800">{nextExercise.name}</h4>
          <p className="text-sm text-gray-600">
            {Math.floor(nextExercise.duration / 60)} minutos
          </p>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200">
        <button className="btn btn-outline btn-sm w-full">
          Ver Detalhes
        </button>
      </div>
    </div>
  );
};

export default NextExercise;