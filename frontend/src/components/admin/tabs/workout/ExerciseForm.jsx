// src/components/admin/ExerciseForm.jsx
import React, { useState, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import { 
  FaSave, 
  FaPlus, 
  FaUndo, 
  FaVideo, 
  FaImage,
  FaCheckCircle, 
  FaExclamationCircle, 
  FaUpload, 
  FaSpinner,
  FaTimes,
  FaDumbbell
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

// CONSTANTES E UTILITÁRIOS (simplificados para o exemplo)
const EXERCISE_TYPES = [
  { value: 'cardio', label: 'Cardio', icon: FaImage },
  { value: 'strength', label: 'Força', icon: FaDumbbell },
  { value: 'flexibility', label: 'Flexibilidade', icon: FaImage }
];

const DEFAULT_EXERCISE = {
  name: '',
  duration: 0,
  type: 'cardio',
  restTime: 30,
  sets: 1,
  reps: 0,
  weight: 0,
  targetMuscles: [],
  mediaFile: null,
  instructions: ''
};

// Hook para campos tocados
const useTouchedFields = () => {
  const [touchedFields, setTouchedFields] = useState({});

  const handleFieldBlur = (fieldName) => {
    setTouchedFields(prev => ({ ...prev, [fieldName]: true }));
  };

  const markAllFieldsAsTouched = (fields) => {
    const newTouched = {};
    fields.forEach(field => {
      newTouched[field] = true;
    });
    setTouchedFields(newTouched);
  };

  const shouldShowError = (fieldName, errors) => {
    return touchedFields[fieldName] && errors[fieldName];
  };

  return {
    touchedFields,
    handleFieldBlur,
    markAllFieldsAsTouched,
    shouldShowError
  };
};

// Utilitários corrigidos
const handleMediaAttach = async (file, fileInputRef, onChange) => {
  if (!file) return;

  // Verifica o tipo do arquivo
  const fileType = file.type.startsWith('video/') ? 'video' : 
                  file.type.startsWith('image/') ? 'image' : null;

  if (!fileType) {
    alert('Tipo de arquivo não suportado. Use imagens ou vídeos.');
    return;
  }

  // Cria object URL para preview
  const objectUrl = URL.createObjectURL(file);

  const mediaData = {
    file: file,
    name: file.name,
    type: fileType,
    size: file.size,
    url: objectUrl
  };

  // Atualiza o estado preservando outros campos
  onChange('mediaFile', mediaData);

  // Limpa o input file
  if (fileInputRef.current) {
    fileInputRef.current.value = '';
  }
};

const removeMedia = (exercise, onChange, fileInputRef) => {
  // Revoga a object URL para evitar vazamento de memória
  if (exercise.mediaFile && exercise.mediaFile.url) {
    URL.revokeObjectURL(exercise.mediaFile.url);
  }
  
  onChange('mediaFile', null);
  
  if (fileInputRef.current) {
    fileInputRef.current.value = '';
  }
};

// CORREÇÃO CRÍTICA: Esta função NÃO deve limpar o mediaFile
const handleTypeSelect = (type, onChange) => {
  // Apenas atualiza o tipo, preserva todos os outros campos incluindo mediaFile
  onChange('type', type);
};

const prepareSubmit = (exercise) => {
  // Remove a propriedade file do objeto File, mas mantém a URL para preview
  if (exercise.mediaFile && exercise.mediaFile.file) {
    const { file, ...mediaWithoutFile } = exercise.mediaFile;
    return {
      ...exercise,
      mediaFile: mediaWithoutFile
    };
  }
  return exercise;
};

const getDurationInMinutes = (durationInSeconds) => {
  return Math.round(durationInSeconds / 60) || 0;
};

const getFormTexts = (isEditing) => {
  return {
    formTitle: isEditing ? 'Editar Exercício' : 'Novo Exercício',
    submitButtonText: isEditing ? 'Atualizar Exercício' : 'Adicionar Exercício',
    submitButtonIcon: isEditing ? 'FaSave' : 'FaPlus'
  };
};

const ExerciseForm = ({ 
  exercise = DEFAULT_EXERCISE, 
  onChange,
  onSubmit, 
  onCancel, 
  editingIndex, 
  errors = {},
  isLoading = false,
  canSubmit = true
}) => {
  const isEditing = editingIndex !== null;
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const safeExercise = useMemo(() => exercise || DEFAULT_EXERCISE, [exercise]);

  const {
    touchedFields,
    handleFieldBlur,
    markAllFieldsAsTouched,
    shouldShowError
  } = useTouchedFields();

  const handleChange = (field, value) => {
    onChange(field, value);
  };

  const handleMediaAttachment = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      await handleMediaAttach(file, fileInputRef, handleChange);
    } catch (error) {
      console.error("Erro ao anexar mídia:", error);
      alert('Erro ao anexar arquivo. Tente novamente.');
    }
  };

  const handleRemoveMedia = () => {
    removeMedia(safeExercise, handleChange, fileInputRef);
  };

  const handleTypeSelection = (type) => {
    handleTypeSelect(type, handleChange);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const allFields = ['name', 'duration'];
    if (safeExercise.type === 'strength') {
      allFields.push('reps', 'sets');
    }
    markAllFieldsAsTouched(allFields);

    if (!canSubmit || Object.keys(errors).length > 0) {
      return;
    }

    const exerciseToSubmit = prepareSubmit(safeExercise);
    
    onSubmit(exerciseToSubmit);
    
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const durationInMinutes = getDurationInMinutes(safeExercise.duration);
  const { formTitle, submitButtonText, submitButtonIcon } = getFormTexts(isEditing);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl w-full border shadow-sm border-gray-100 p-6 lg:p-8"
    >
      <div className="flex items-center mb-8">
        <FaDumbbell className="text-blue-600 text-3xl mr-3" /> 
        <h3 className="text-2xl font-bold text-gray-900">{formTitle}</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Nome + Duração */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
              Nome do Exercício <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              value={safeExercise.name}
              onChange={(e) => handleChange('name', e.target.value)}
              onBlur={() => handleFieldBlur('name')}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 ${
                shouldShowError('name', errors)
                  ? 'border-red-400 bg-red-50' 
                  : 'border-gray-200 hover:border-gray-300 focus:border-blue-500'
              } ${isLoading ? 'opacity-50' : ''}`}
              placeholder="Ex: Supino Reto com Barra"
              disabled={isLoading}
            />
            <AnimatePresence>
              {shouldShowError('name', errors) && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center text-red-600 text-sm mt-2"
                >
                  <FaExclamationCircle className="mr-1" /> {errors.name}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div>
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
              Duração (em minutos) <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="300"
                value={durationInMinutes}
                onChange={(e) => handleChange('duration', (parseInt(e.target.value) || 0) * 60)}
                onBlur={() => handleFieldBlur('duration')}
                className={`w-full px-4 py-3 pr-12 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 ${
                  shouldShowError('duration', errors) 
                    ? 'border-red-400 bg-red-50' 
                    : 'border-gray-200 hover:border-gray-300 focus:border-blue-500'
                }`}
                placeholder="30"
                disabled={isLoading}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">min</span>
            </div>
            <AnimatePresence>
              {shouldShowError('duration', errors) && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center text-red-600 text-sm mt-2"
                >
                  <FaExclamationCircle className="mr-1" /> {errors.duration}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Tipo */}
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-4 block">Tipo de Exercício</label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {EXERCISE_TYPES.map((type) => {
              const Icon = type.icon;
              const selected = safeExercise.type === type.value;
              return (
                <motion.button
                  key={type.value}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => handleTypeSelection(type.value)}
                  disabled={isLoading}
                  className={`relative p-5 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center space-y-2 ${
                    selected
                      ? `border-4 border-blue-500 bg-blue-50 shadow-lg ring-4 ring-blue-100`
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                  } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  {selected && (
                    <motion.div
                      layoutId="activeTypeIndicator"
                      className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent pointer-events-none"
                    />
                  )}
                  <Icon className={`text-2xl ${selected ? 'text-blue-600' : 'text-gray-500'}`} />
                  <span className={`font-semibold text-sm ${selected ? 'text-blue-700' : 'text-gray-700'}`}>
                    {type.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Campos de Força/Resto */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Descanso (seg)</label>
            <input
              type="number"
              min="0"
              max="600"
              value={safeExercise.restTime}
              onChange={(e) => handleChange('restTime', parseInt(e.target.value) || 0)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
              placeholder="60"
              disabled={isLoading}
            />
          </div>

          <AnimatePresence>
            {safeExercise.type === 'strength' && (
              <>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  exit={{ opacity: 0, scale: 0.9 }} 
                  className="space-y-2"
                >
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    Séries <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={safeExercise.sets}
                    onChange={(e) => handleChange('sets', parseInt(e.target.value) || 1)}
                    onBlur={() => handleFieldBlur('sets')}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:ring-4 focus:ring-blue-100 ${
                       shouldShowError('sets', errors) ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-gray-300 focus:border-blue-500'
                    }`}
                    disabled={isLoading}
                  />
                  <AnimatePresence>
                    {shouldShowError('sets', errors) && (
                      <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center text-red-600 text-xs mt-1">
                        <FaExclamationCircle className="mr-1" /> {errors.sets}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="space-y-2"
                >
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    Repetições <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={safeExercise.reps}
                    onChange={(e) => handleChange('reps', parseInt(e.target.value) || 0)}
                    onBlur={() => handleFieldBlur('reps')}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:ring-4 focus:ring-blue-100 ${
                      shouldShowError('reps', errors) ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-gray-300 focus:border-blue-500'
                    }`}
                    disabled={isLoading}
                  />
                  <AnimatePresence>
                    {shouldShowError('reps', errors) && (
                      <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center text-red-600 text-xs mt-1">
                        <FaExclamationCircle className="mr-1" /> {errors.reps}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Peso (kg)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={safeExercise.weight}
                    onChange={(e) => handleChange('weight', parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                    placeholder="0"
                    disabled={isLoading}
                  />
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Anexar Mídia */}
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-3 block">
            Mídia Demonstrativa
          </label>
          
          {!safeExercise.mediaFile ? (
            <label className="flex flex-col items-center justify-center w-full h-48 border-3 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all group">
              <input 
                type="file" 
                accept="image/*,video/*" 
                onChange={handleMediaAttachment} 
                className="hidden" 
                disabled={isLoading}
                ref={fileInputRef}
              />
              <FaUpload className="text-4xl text-gray-400 group-hover:text-blue-500 transition-colors mb-3" />
              <p className="text-gray-600 font-medium">Clique para anexar arquivo</p>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF, MP4, WEBM • até 50MB</p>
              <p className="text-xs text-blue-500 mt-2">⚠️ Apenas anexo - Sem upload automático</p>
            </label>
          ) : (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative bg-gray-50 rounded-2xl p-5 border-2 border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {safeExercise.mediaFile.type === 'video' ? (
                    <div className="relative w-20 h-20 bg-gradient-to-br from-red-400 to-red-600 rounded-xl overflow-hidden shadow-md">
                      <video 
                        src={safeExercise.mediaFile.url} 
                        className="w-full h-full object-cover" 
                        muted 
                        autoPlay
                        loop
                        preload="metadata"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <FaVideo className="text-white text-xl" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl overflow-hidden shadow-md">
                      <img 
                        src={safeExercise.mediaFile.url} 
                        alt="Preview" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-900 truncate max-w-xs">
                      {safeExercise.mediaFile.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {safeExercise.mediaFile.type === 'video' ? 'Vídeo' : 'Imagem'} 
                      {` • ${(safeExercise.mediaFile.size / 1024 / 1024).toFixed(1)} MB`}
                    </p>
                    <p className="text-xs text-yellow-600 mt-1 flex items-center">
                      <FaExclamationCircle className="mr-1" />
                      Apenas anexado - Não enviado
                    </p>
                  </div>
                </div>
                <button 
                  type="button" 
                  onClick={handleRemoveMedia} 
                  className="p-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all" 
                  disabled={isLoading}
                >
                  <FaTimes />
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Instruções */}
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 block">Instruções de Execução</label>
          <textarea
            value={safeExercise.instructions}
            onChange={(e) => handleChange('instructions', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all resize-none"
            rows="5"
            placeholder="Descreva a execução correta, postura, respiração, dicas e variações..."
            disabled={isLoading}
          />
          <p className="text-xs text-gray-500 mt-2 flex items-center">
            <FaCheckCircle className="mr-1 text-green-500" />
            Inclua postura, amplitude, respiração e cuidados
          </p>
        </div>

        {/* Ações */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200">
          {isEditing && (
            <button 
              type="button" 
              onClick={onCancel} 
              disabled={isLoading}
              className="px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all flex items-center justify-center"
            >
              <FaUndo className="mr-2" /> Cancelar
            </button>
          )}
          <button 
            type="submit" 
            disabled={isLoading || !canSubmit} 
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <FaSpinner className="animate-spin mr-2" />
            ) : (
              React.createElement(submitButtonIcon === 'FaSave' ? FaSave : FaPlus, { className: "mr-2" })
            )}
            {isLoading ? 'Processando...' : submitButtonText}
          </button>
        </div>

        {/* Sucesso */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed bottom-6 right-6 bg-green-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center space-x-3 z-50"
            >
              <FaCheckCircle className="text-2xl" />
              <div>
                <p className="font-bold">Sucesso!</p>
                <p className="text-sm">Exercício adicionado à lista.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </motion.div>
  );
};

ExerciseForm.propTypes = {
  exercise: PropTypes.shape({
    name: PropTypes.string,
    duration: PropTypes.number,
    type: PropTypes.string,
    restTime: PropTypes.number,
    sets: PropTypes.number,
    reps: PropTypes.number,
    weight: PropTypes.number,
    mediaFile: PropTypes.object,
    instructions: PropTypes.string
  }),
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  editingIndex: PropTypes.number,
  errors: PropTypes.object,
  isLoading: PropTypes.bool,
  canSubmit: PropTypes.bool,
};

ExerciseForm.defaultProps = {
  exercise: DEFAULT_EXERCISE,
  errors: {},
  isLoading: false,
  canSubmit: true,
};

export default ExerciseForm;