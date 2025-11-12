// src/components/workout/WorkoutHeader.jsx - VERSÃO SIMPLIFICADA
import React from 'react';
import { useAuthStore } from '../../services/authService';

const WorkoutHeader = ({ workout, currentExercise }) => {
  const { company } = useAuthStore();

  // Dados da empresa (apenas nome e slogan)
  const companyData = {
    name: company?.name || 'Academia FitPro',
    slogan: company?.slogan || 'Sua saúde em primeiro lugar',
    logo: company?.logo?.url || null
  };

  // Informações do exercício atual (apenas nome)
  const exerciseInfo = currentExercise ? {
    name: currentExercise.name,
    type: currentExercise.type || 'strength'
  } : null;

  // Função para obter ícone do tipo de exercício
  const getExerciseIcon = (type) => {
    const icons = {
      cardio: '🏃‍♂️',
      strength: '🏋️‍♂️',
      hiit: '⚡',
      yoga: '🧘‍♂️',
      pilates: '💫',
      mobility: '🔄'
    };
    return icons[type] || '💪';
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        
        {/* Lado Esquerdo - Logo e Nome da Empresa */}
        <div className="flex items-center space-x-4">
          {/* Logo da Academia */}
          {companyData.logo ? (
            <img 
              src={companyData.logo} 
              alt={companyData.name}
              className="w-12 h-12 rounded-lg object-cover border border-gray-200"
            />
          ) : (
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">F</span>
            </div>
          )}
          
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-gray-900">
              {companyData.name}
            </h1>
            <p className="text-sm text-gray-600">
              {companyData.slogan}
            </p>
          </div>
        </div>

        {/* Lado Direito - Nome do Treino e Exercício Atual */}
        {workout && exerciseInfo && (
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <span className="text-lg">{getExerciseIcon(exerciseInfo.type)}</span>
              </div>
              <div className="text-right lg:text-left">
                <h2 className="font-semibold text-gray-900 text-sm">
                  {workout.name}
                </h2>
                <p className="text-xs text-gray-600">
                  {exerciseInfo.name}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutHeader;