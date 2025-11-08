// src/components/workout/ProfessionalMuscleView.jsx
import React from 'react';
import BodyHighlighter from '@mjcdev/react-body-highlighter';

const ProfessionalMuscleView = ({ exercise, className = '' }) => {
  const getBodyData = () => {
    const exerciseMap = {
      'Esteira Profissional': ['quadriceps', 'calves', 'gluteal', 'hamstring'],
      'Bicicleta Ergométrica': ['quadriceps', 'calves', 'gluteal'],
      'Elíptico': ['quadriceps', 'calves', 'gluteal', 'hamstring', 'deltoids'],
      'Remo': ['upper-back', 'deltoids', 'biceps', 'trapezius'],
      'Supino Reto': ['chest', 'deltoids', 'triceps'],
      'Agachamento Livre': ['quadriceps', 'gluteal', 'hamstring', 'calves'],
      'Leg Press': ['quadriceps', 'gluteal'],
      'Puxada Alta': ['upper-back', 'deltoids', 'biceps'],
      'Rosca Direta': ['biceps', 'forearm'],
      'Tríceps Corda': ['triceps'],
      'Abdominal Crunch': ['abs'],
      'Elevação Pélvica': ['gluteal', 'hamstring']
    };

    const muscles = exerciseMap[exercise.name] || ['quadriceps'];
    return muscles.map(slug => ({ slug, intensity: 1 }));
  };

  const getMuscleDescriptions = () => {
    const descriptions = {
      'quadriceps': 'Quadríceps', 'gluteal': 'Glúteos', 'hamstring': 'Posterior', 
      'calves': 'Panturrilhas', 'upper-back': 'Costas', 'deltoids': 'Ombros',
      'chest': 'Peitoral', 'biceps': 'Bíceps', 'triceps': 'Tríceps', 
      'trapezius': 'Trapézios', 'forearm': 'Antebraços', 'abs': 'Abdominais'
    };

    return getBodyData().map(item => descriptions[item.slug] || item.slug);
  };

  const bodyData = getBodyData();
  const muscleDescriptions = getMuscleDescriptions();

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-200 p-4 ${className}`}>
      <h3 className="text-md font-semibold text-gray-900 mb-4 text-center">
        🎯 Músculos Ativados
      </h3>

      <div className="flex flex-col items-center">
        {/* DOIS CORPOS LADO A LADO - Compactos */}
        <div className="flex justify-center space-x-4 mb-4">
          <div className="text-center">
            <div className="border border-gray-200 rounded-lg bg-gray-50 p-2">
              <BodyHighlighter
                data={bodyData}
                side="front"
                style={{ width: '70px', height: '180px' }}
              />
            </div>
            <span className="text-xs text-gray-600 mt-1">Frente</span>
          </div>

          <div className="text-center">
            <div className="border border-gray-200 rounded-lg bg-gray-50 p-2">
              <BodyHighlighter
                data={bodyData}
                side="back"
                style={{ width: '70px', height: '180px' }}
              />
            </div>
            <span className="text-xs text-gray-600 mt-1">Costas</span>
          </div>
        </div>

        {/* Legenda Compacta */}
        <div className="w-full">
          <div className="grid grid-cols-2 gap-1 mb-3">
            {muscleDescriptions.map((description, index) => (
              <div key={index} className="flex items-center space-x-1 p-1 bg-blue-50 rounded">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <span className="text-xs text-blue-800 font-medium truncate">
                  {description}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Dica Compacta */}
        <div className="p-2 bg-amber-50 rounded-lg border border-amber-200 w-full">
          <p className="text-xs text-amber-800 text-center">
            {exercise.name === 'Esteira Profissional' && 'Mantenha postura ereta e ritmo constante'}
            {exercise.name === 'Bicicleta Ergométrica' && 'Ajuste o banco corretamente'}
            {exercise.name === 'Elíptico' && 'Use braços para melhor resultado'}
            {exercise.name === 'Remo' && 'Costas retas, puxe com as costas'}
            {exercise.name === 'Supino Reto' && 'Core contraído, ombros estáveis'}
            {!['Esteira Profissional', 'Bicicleta Ergométrica', 'Elíptico', 'Remo', 'Supino Reto'].includes(exercise.name) && 
             'Foque na técnica correta'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalMuscleView;