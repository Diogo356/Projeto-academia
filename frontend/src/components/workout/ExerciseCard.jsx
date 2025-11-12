// src/components/workout/ExerciseCard.jsx
import React from 'react';

const ExerciseCard = ({ exercise, index, isCurrent, timeRemaining, onSelect }) => {
  const progressPercentage = isCurrent 
    ? Math.min(100, ((exercise.duration - timeRemaining) / exercise.duration) * 100)
    : 0;

  return (
    <div
      className={`
        flex-shrink-0 w-64 xl:w-72 2xl:w-80 rounded-lg xl:rounded-xl border p-4 transition-all duration-300 hover:scale-[1.02] cursor-pointer
        ${isCurrent
          ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-md shadow-blue-100'
          : exercise.completed
            ? 'border-green-300 bg-gradient-to-br from-green-50 to-green-100 shadow-sm'
            : 'border-gray-200 bg-white hover:border-gray-300'
        }
      `}
      onClick={onSelect}
    >
      {/* Header Compacto */}
      <div className="flex items-center justify-between mb-2 xl:mb-3">
        <div className={`
          w-9 h-9 xl:w-10 xl:h-10 rounded-lg xl:rounded-xl flex items-center justify-center text-xs xl:text-sm font-bold shadow-sm
          ${isCurrent
            ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white'
            : exercise.completed
              ? 'bg-gradient-to-br from-green-600 to-green-700 text-white'
              : 'bg-gray-100 text-gray-600'
          }
        `}>
          {exercise.completed ? (
            <svg className="w-4 h-4 xl:w-5 xl:h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          ) : (
            index + 1
          )}
        </div>

        <span className={`
          px-1.5 xl:px-2 py-0.5 rounded-full text-xs xl:text-sm font-medium
          ${isCurrent
            ? 'bg-blue-100 text-blue-700'
            : exercise.completed
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-600'
          }
        `}>
          {isCurrent ? 'AGORA' :
            exercise.completed ? 'FEITO' : 'PRÓXIMO'}
        </span>
      </div>

      {/* Conteúdo Principal */}
      <div className="space-y-2 xl:space-y-3">
        <h4 className={`
          font-bold text-base xl:text-lg leading-tight line-clamp-2
          ${isCurrent
            ? 'text-blue-900'
            : exercise.completed
              ? 'text-green-900'
              : 'text-gray-900'
          }
        `}>
          {exercise.name}
        </h4>

        <div className="flex items-center gap-3 xl:gap-4 text-xs xl:text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 xl:w-4 xl:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{Math.floor(exercise.duration / 60)} min</span>
          </div>

          <div className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 xl:w-4 xl:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="capitalize">{exercise.type}</span>
          </div>
        </div>

        {/* Progresso Individual - Só no atual */}
        {isCurrent && (
          <div className="pt-1 xl:pt-2">
            <div className="flex justify-between text-xs xl:text-sm text-blue-600 mb-0.5 xl:mb-1">
              <span>Progresso</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-blue-100 rounded-full h-1 xl:h-1.5">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-1 xl:h-1.5 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExerciseCard;