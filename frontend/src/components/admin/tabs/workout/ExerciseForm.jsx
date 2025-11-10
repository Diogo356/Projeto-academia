// src/components/admin/ExerciseForm.jsx
import React from 'react';
import MuscleSelector from './MuscleSelector';

const ExerciseForm = ({ exercise, onChange, onSubmit, onCancel, editingIndex, errors }) => {
  const exerciseTypes = [
    { value: 'cardio', label: 'Cardio', icon: '🏃‍♂️', color: 'blue' },
    { value: 'strength', label: 'Força', icon: '🏋️‍♂️', color: 'red' },
    { value: 'warmup', label: 'Aquecimento', icon: '🔥', color: 'orange' },
    { value: 'cooldown', label: 'Desaquecimento', icon: '❄️', color: 'purple' },
    { value: 'flexibility', label: 'Flexibilidade', icon: '🧘‍♂️', color: 'green' }
  ];

  const handleChange = (field, value) => {
    onChange(prev => ({ ...prev, [field]: value }));
  };

  const handleMuscleSelect = (muscle) => {
    onChange(prev => ({
      ...prev,
      targetMuscles: prev.targetMuscles.includes(muscle)
        ? prev.targetMuscles.filter(m => m !== muscle)
        : [...prev.targetMuscles, muscle]
    }));
  };

  const handleMediaUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        onChange(prev => ({
          ...prev,
          mediaFile: {
            file,
            url: e.target.result,
            type: file.type.startsWith('video/') ? 'video' : 'image',
            name: file.name
          }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeMedia = () => {
    onChange(prev => ({ ...prev, mediaFile: null }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(exercise);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
        <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
        {editingIndex !== null ? 'Editar Exercício' : 'Adicionar Novo Exercício'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Nome e Duração */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome do Exercício *
            </label>
            <input
              type="text"
              value={exercise.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={`input input-bordered w-full text-lg ${errors.exerciseName ? 'input-error' : ''}`}
              placeholder="Ex: Supino Reto com Barra"
            />
            {errors.exerciseName && <p className="text-red-500 text-sm mt-2">{errors.exerciseName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duração (minutos) *
            </label>
            <input
              type="number"
              value={exercise.duration / 60}
              onChange={(e) => handleChange('duration', (parseInt(e.target.value) || 0) * 60)}
              className={`input input-bordered w-full text-lg ${errors.duration ? 'input-error' : ''}`}
              placeholder="30"
            />
            {errors.duration && <p className="text-red-500 text-sm mt-2">{errors.duration}</p>}
          </div>
        </div>

        {/* Tipo de Exercício - ESTILO WORKOUTINFOFORM */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Tipo de Exercício
          </label>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            {exerciseTypes.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => handleChange('type', type.value)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  exercise.type === type.value
                    ? `border-${type.color}-500 bg-${type.color}-50 shadow-sm`
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <span className="text-2xl">{type.icon}</span>
                  <span className="font-medium text-gray-900 text-sm text-center">{type.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Descanso e Campos de Força */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descanso (segundos)
            </label>
            <input
              type="number"
              value={exercise.restTime}
              onChange={(e) => handleChange('restTime', parseInt(e.target.value) || 0)}
              className="input input-bordered w-full"
              placeholder="60"
            />
          </div>

          {/* Campos específicos para força */}
          {exercise.type === 'strength' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Séries
                </label>
                <input
                  type="number"
                  value={exercise.sets}
                  onChange={(e) => handleChange('sets', parseInt(e.target.value) || 1)}
                  className="input input-bordered w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Repetições *
                </label>
                <input
                  type="number"
                  value={exercise.reps}
                  onChange={(e) => handleChange('reps', parseInt(e.target.value) || 0)}
                  className={`input input-bordered w-full ${errors.reps ? 'input-error' : ''}`}
                />
                {errors.reps && <p className="text-red-500 text-sm mt-2">{errors.reps}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Peso (kg)
                </label>
                <input
                  type="number"
                  value={exercise.weight}
                  onChange={(e) => handleChange('weight', parseInt(e.target.value) || 0)}
                  className="input input-bordered w-full"
                  placeholder="0"
                />
              </div>
            </>
          )}
        </div>

        {/* Seletor de Músculos */}
        <MuscleSelector
          selectedMuscles={exercise.targetMuscles}
          onMuscleSelect={handleMuscleSelect}
        />

        {/* Upload de Mídia - ESTILO MELHORADO */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Mídia Demonstrativa
          </label>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleMediaUpload}
                className="file-input file-input-bordered flex-1"
              />
              <span className="text-sm text-gray-500">PNG, JPG, GIF, MP4</span>
            </div>
            
            {exercise.mediaFile && (
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border-2 border-gray-200">
                <div className="flex items-center space-x-4">
                  {exercise.mediaFile.type === 'video' ? (
                    <div className="w-16 h-16 bg-red-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-2xl">🎥</span>
                    </div>
                  ) : (
                    <img 
                      src={exercise.mediaFile.url} 
                      alt="Preview" 
                      className="w-16 h-16 rounded-lg object-cover border"
                    />
                  )}
                  <div>
                    <div className="font-semibold text-gray-900">
                      {exercise.mediaFile.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {exercise.mediaFile.type === 'video' ? 'Vídeo' : 'Imagem'} • {
                        exercise.mediaFile.type === 'video' ? 'MP4' : 'JPG/PNG'
                      }
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeMedia}
                  className="btn btn-ghost text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  🗑️ Remover
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Instruções - ESTILO MELHORADO */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Instruções de Execução
          </label>
          <textarea
            value={exercise.instructions}
            onChange={(e) => handleChange('instructions', e.target.value)}
            className="textarea textarea-bordered w-full text-lg"
            rows="4"
            placeholder="Descreva a forma correta, dicas de execução, cuidados importantes, respiração e variações possíveis..."
          />
          <div className="text-sm text-gray-500 mt-2">
            Dica: Inclua detalhes sobre postura, amplitude de movimento e respiração
          </div>
        </div>

        {/* Botões de Ação - ESTILO MELHORADO */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          {editingIndex !== null && (
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-ghost border-2 border-gray-300 hover:border-gray-400"
            >
              ↩️ Cancelar Edição
            </button>
          )}
          <button
            type="submit"
            className="btn btn-primary text-lg font-semibold px-8"
          >
            {editingIndex !== null ? '💾 Atualizar Exercício' : '➕ Adicionar Exercício'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExerciseForm;