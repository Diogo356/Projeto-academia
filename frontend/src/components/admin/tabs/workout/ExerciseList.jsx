// src/components/admin/ExerciseList.jsx
import React from 'react';

const ExerciseList = ({ exercises = [], onEdit, onRemove, errors = {}, disabled = false }) => {
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')} min`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-lg font-bold text-gray-900">
          Exercícios no Treino ({exercises.length})
        </h4>
        {errors.exercises && (
          <p className="text-red-500 text-sm">{errors.exercises}</p>
        )}
      </div>

      <div className="space-y-4">
        {exercises.map((exercise, index) => (
          <div
            key={exercise.id || index}
            className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center space-x-4 flex-1">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm">
                {index + 1}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 text-lg mb-1">
                  {exercise.name}
                </div>
                <div className="text-sm text-gray-600 flex flex-wrap items-center gap-2">
                  <span className="bg-white px-2 py-1 rounded-full border">
                    ⏱️ {formatDuration(exercise.duration)}
                  </span>
                  <span className="bg-white px-2 py-1 rounded-full border capitalize">
                    🏷️ {exercise.type}
                  </span>
                  {exercise.restTime > 0 && (
                    <span className="bg-white px-2 py-1 rounded-full border">
                      💤 {exercise.restTime}s descanso
                    </span>
                  )}
                  {exercise.targetMuscles && exercise.targetMuscles.length > 0 && (
                    <span className="bg-white px-2 py-1 rounded-full border">
                      💪 {exercise.targetMuscles.length} músculos
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(index)}
                disabled={disabled}
                className="px-4 py-2 bg-white text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ✏️ Editar
              </button>
              <button
                onClick={() => onRemove(index)}
                disabled={disabled}
                className="px-4 py-2 bg-white text-red-600 border border-red-200 rounded-lg hover:bg-red-50 hover:border-red-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                🗑️ Remover
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExerciseList;