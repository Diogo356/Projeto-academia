// src/components/admin/WorkoutInfoForm.jsx
import React from 'react';

const WorkoutInfoForm = ({ workoutData, onChange, errors }) => {
  const categories = [
    { value: 'cardio', label: 'Cardio', icon: '🏃‍♂️', color: 'blue' },
    { value: 'strength', label: 'Força', icon: '🏋️‍♂️', color: 'red' },
    { value: 'hiit', label: 'HIIT', icon: '⚡', color: 'orange' },
    { value: 'yoga', label: 'Yoga', icon: '🧘‍♂️', color: 'green' },
    { value: 'pilates', label: 'Pilates', icon: '💫', color: 'purple' },
    { value: 'mobility', label: 'Mobilidade', icon: '🔄', color: 'teal' }
  ];

  const difficulties = [
    { value: 'beginner', label: 'Iniciante', color: 'green' },
    { value: 'intermediate', label: 'Intermediário', color: 'yellow' },
    { value: 'advanced', label: 'Avançado', color: 'red' }
  ];

  const handleChange = (field, value) => {
    onChange(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
        <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
        Informações do Treino
      </h3>
      
      <div className="space-y-6">
        {/* Nome do Treino */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nome do Treino *
          </label>
          <input
            type="text"
            value={workoutData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className={`input input-bordered w-full text-lg ${errors.name ? 'input-error' : ''}`}
            placeholder="Ex: Treino Cardio Avançado"
          />
          {errors.name && <p className="text-red-500 text-sm mt-2">{errors.name}</p>}
        </div>

        {/* Categoria */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Categoria do Treino
          </label>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {categories.map((category) => (
              <button
                key={category.value}
                type="button"
                onClick={() => handleChange('category', category.value)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  workoutData.category === category.value
                    ? `border-${category.color}-500 bg-${category.color}-50 shadow-sm`
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{category.icon}</span>
                  <span className="font-medium text-gray-900">{category.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Dificuldade */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Nível de Dificuldade
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {difficulties.map((difficulty) => (
              <button
                key={difficulty.value}
                type="button"
                onClick={() => handleChange('difficulty', difficulty.value)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  workoutData.difficulty === difficulty.value
                    ? `border-${difficulty.color}-500 bg-${difficulty.color}-50 shadow-sm`
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900 capitalize">{difficulty.label}</span>
                  {workoutData.difficulty === difficulty.value && (
                    <span className="text-green-500 text-lg">✓</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Descrição */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descrição do Treino
          </label>
          <textarea
            value={workoutData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            className="textarea textarea-bordered w-full"
            rows="4"
            placeholder="Descreva o objetivo, foco principal, benefícios e observações importantes deste treino..."
          />
        </div>
      </div>
    </div>
  );
};

export default WorkoutInfoForm;