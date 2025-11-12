// src/components/admin/ExerciseForm.jsx
import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { 
  FaRunning, FaDumbbell, FaFire, FaSnowflake, FaUser,
  FaSave, FaPlus, FaTrash, FaUndo, FaVideo, FaImage,
  FaCheckCircle, FaExclamationCircle, FaUpload, FaSpinner,
  FaTimes
} from 'react-icons/fa';
import MuscleSelector from './MuscleSelector';
import { motion, AnimatePresence } from 'framer-motion';
import workoutService from '../../../../services/workoutService';

const EXERCISE_TYPES = [
  { value: 'cardio', label: 'Cardio', icon: FaRunning, color: 'blue', bg: 'bg-blue-50', border: 'border-blue-500', text: 'text-blue-700', iconColor: 'text-blue-600' },
  { value: 'strength', label: 'Força', icon: FaDumbbell, color: 'red', bg: 'bg-red-50', border: 'border-red-500', text: 'text-red-700', iconColor: 'text-red-600' },
  { value: 'warmup', label: 'Aquecimento', icon: FaFire, color: 'orange', bg: 'bg-orange-50', border: 'border-orange-500', text: 'text-orange-700', iconColor: 'text-orange-600' },
  { value: 'cooldown', label: 'Desaquecimento', icon: FaSnowflake, color: 'purple', bg: 'bg-purple-50', border: 'border-purple-500', text: 'text-purple-700', iconColor: 'text-purple-600' },
  { value: 'flexibility', label: 'Flexibilidade', icon: FaUser, color: 'green', bg: 'bg-green-50', border: 'border-green-500', text: 'text-green-700', iconColor: 'text-green-600' }
];

const SUPPORTED_FILE_TYPES = {
  image: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'],
  video: ['video/mp4', 'video/quicktime', 'video/webm']
};

const MAX_FILE_SIZE = 50 * 1024 * 1024;

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
  video: '', // URL do Cloudinary
  instructions: ''
};

// Função de validação de arquivo
const validateFile = (file) => {
  const validTypes = [...SUPPORTED_FILE_TYPES.image, ...SUPPORTED_FILE_TYPES.video];
  
  if (!validTypes.includes(file.type)) {
    throw new Error('Formato não suportado. Use PNG, JPG, GIF, MP4 ou WEBM.');
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error('Arquivo muito grande! Máximo: 50MB');
  }

  if (file.size === 0) {
    throw new Error('Arquivo vazio');
  }

  return true;
};

const ExerciseForm = ({ 
  exercise = DEFAULT_EXERCISE, 
  onChange, 
  onSubmit, 
  onCancel, 
  editingIndex, 
  errors = {},
  isLoading = false 
}) => {
  const isEditing = editingIndex !== null;
  const [showSuccess, setShowSuccess] = useState(false);
  const [touchedFields, setTouchedFields] = useState({});
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const fileInputRef = useRef(null);

  const safeExercise = exercise || DEFAULT_EXERCISE;

  // FUNÇÕES SIMPLES - SEM useCallback para melhor performance
  const handleChange = (field, value) => {
    onChange(prev => ({ ...prev, [field]: value }));
  };

  const handleFieldBlur = (field) => {
    setTouchedFields(prev => ({ ...prev, [field]: true }));
  };

  const handleMuscleSelect = (muscle) => {
    onChange(prev => ({
      ...prev,
      targetMuscles: prev.targetMuscles.includes(muscle)
        ? prev.targetMuscles.filter(m => m !== muscle)
        : [...prev.targetMuscles, muscle]
    }));
  };

  // Upload de mídia para o Cloudinary
  const handleMediaUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // Validar arquivo antes do upload
      validateFile(file);

      setUploadingMedia(true);

      console.log('📤 Iniciando upload...', {
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified
      });

      // Fazer upload para o Cloudinary
      const result = await workoutService.uploadExerciseMedia(file);
      
      console.log('✅ Upload bem-sucedido:', result);

      // Atualizar o exercício com a URL do Cloudinary
      onChange(prev => ({
        ...prev,
        video: result.url, // URL do Cloudinary
        mediaFile: {
          file,
          url: result.url,
          type: file.type.startsWith('video/') ? 'video' : 'image',
          name: file.name,
          size: file.size
        }
      }));

    } catch (error) {
      console.error('❌ Erro no upload:', error);
      
      // Mensagens de erro mais específicas
      let errorMessage = 'Erro ao fazer upload da mídia. ';
      
      if (error.message.includes('Formato não suportado')) {
        errorMessage = error.message;
      } else if (error.message.includes('muito grande')) {
        errorMessage = error.message;
      } else if (error.message.includes('Unexpected end of form')) {
        errorMessage = 'Erro de conexão durante o upload. Verifique sua internet e tente novamente.';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Upload demorou muito tempo. Tente um arquivo menor ou verifique sua conexão.';
      } else if (error.response?.status === 413) {
        errorMessage = 'Arquivo muito grande para o servidor. Tente um arquivo menor.';
      } else {
        errorMessage += error.message || 'Tente novamente.';
      }
      
      alert(errorMessage);
    } finally {
      setUploadingMedia(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeMedia = () => {
    onChange(prev => ({ 
      ...prev, 
      mediaFile: null,
      video: '' // Limpar URL também
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Marca todos os campos como touched na submissão
    const allFields = ['name', 'duration'];
    if (safeExercise.type === 'strength') {
      allFields.push('reps');
    }
    
    const newTouchedFields = {};
    allFields.forEach(field => {
      newTouchedFields[field] = true;
    });
    setTouchedFields(newTouchedFields);
    
    // Verifica se há erros antes de submeter
    const hasErrors = Object.keys(errors).length > 0;
    if (!hasErrors) {
      // Preparar dados para envio (sem mediaFile, apenas video URL)
      const exerciseToSubmit = {
        ...safeExercise,
        video: safeExercise.video || '', // Garantir que video seja enviado
        // Remover mediaFile pois não é necessário no backend
        mediaFile: undefined
      };
      
      onSubmit(exerciseToSubmit);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleTypeSelect = (type) => {
    handleChange('type', type);
    if (type !== 'strength') {
      handleChange('sets', 1);
      handleChange('reps', 0);
      handleChange('weight', 0);
    }
  };

  // Cálculos simples sem useMemo
  const durationInMinutes = Math.floor(safeExercise.duration / 60);
  const formTitle = isEditing ? 'Editar Exercício' : 'Novo Exercício';
  const submitButtonText = isEditing ? 'Atualizar' : 'Adicionar';
  const submitButtonIcon = isEditing ? FaSave : FaPlus;

  // Helper para mostrar erro apenas se o campo foi tocado
  const shouldShowError = (field) => touchedFields[field] && errors[field];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl w-full border shadow-sm border-gray-100 p-6 lg:p-8 mx-auto"
    >
      <div className="flex items-center mb-8">
        <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mr-3 shadow-sm"></div>
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
                shouldShowError('exerciseName') 
                  ? 'border-red-400 bg-red-50' 
                  : 'border-gray-200 hover:border-gray-300 focus:border-blue-500'
              } ${isLoading ? 'opacity-50' : ''}`}
              placeholder="Ex: Supino Reto com Barra"
              disabled={isLoading}
            />
            <AnimatePresence>
              {shouldShowError('exerciseName') && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center text-red-600 text-sm mt-2"
                >
                  <FaExclamationCircle className="mr-1" /> {errors.exerciseName}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div>
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
              Duração <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                max="300"
                value={durationInMinutes}
                onChange={(e) => handleChange('duration', (parseInt(e.target.value) || 0) * 60)}
                onBlur={() => handleFieldBlur('duration')}
                className={`w-full px-4 py-3 pr-12 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 ${
                  shouldShowError('duration') 
                    ? 'border-red-400 bg-red-50' 
                    : 'border-gray-200 hover:border-gray-300 focus:border-blue-500'
                }`}
                placeholder="30"
                disabled={isLoading}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">min</span>
            </div>
            <AnimatePresence>
              {shouldShowError('duration') && (
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
                  onClick={() => handleTypeSelect(type.value)}
                  disabled={isLoading || uploadingMedia}
                  className={`relative p-5 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center space-y-2 ${
                    selected
                      ? `${type.border} ${type.bg} shadow-lg ring-4 ring-${type.color}-100`
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                  } ${isLoading || uploadingMedia ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  {selected && (
                    <motion.div
                      layoutId="activeTypeIndicator"
                      className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent pointer-events-none"
                    />
                  )}
                  <Icon className={`text-2xl ${selected ? type.iconColor : 'text-gray-500'}`} />
                  <span className={`font-semibold text-sm ${selected ? type.text : 'text-gray-700'}`}>
                    {type.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Campos de Força */}
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
              disabled={isLoading || uploadingMedia}
            />
          </div>

          <AnimatePresence>
            {safeExercise.type === 'strength' && (
              <>
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Séries</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={safeExercise.sets}
                    onChange={(e) => handleChange('sets', parseInt(e.target.value) || 1)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                    disabled={isLoading || uploadingMedia}
                  />
                </motion.div>

                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
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
                      shouldShowError('reps') ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-gray-300 focus:border-blue-500'
                    }`}
                    disabled={isLoading || uploadingMedia}
                  />
                  <AnimatePresence>
                    {shouldShowError('reps') && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center text-red-600 text-sm mt-2"
                      >
                        <FaExclamationCircle className="mr-1" /> {errors.reps}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Peso (kg)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={safeExercise.weight}
                    onChange={(e) => handleChange('weight', parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                    placeholder="0"
                    disabled={isLoading || uploadingMedia}
                  />
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Músculos */}
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-3 block">Músculos Alvo</label>
          <MuscleSelector
            selectedMuscles={safeExercise.targetMuscles}
            onMuscleSelect={handleMuscleSelect}
            disabled={isLoading || uploadingMedia}
          />
        </div>

        {/* Upload de Mídia */}
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-3 block">
            Mídia Demonstrativa {uploadingMedia && <FaSpinner className="animate-spin inline ml-2" />}
          </label>
          
          {!safeExercise.mediaFile && !safeExercise.video ? (
            <label className="flex flex-col items-center justify-center w-full h-48 border-3 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all group">
              <input 
                type="file" 
                accept="image/*,video/*" 
                onChange={handleMediaUpload} 
                className="hidden" 
                disabled={isLoading || uploadingMedia}
                ref={fileInputRef}
              />
              {uploadingMedia ? (
                <>
                  <FaSpinner className="animate-spin text-4xl text-blue-500 mb-3" />
                  <p className="text-blue-600 font-medium">Fazendo upload...</p>
                  <p className="text-xs text-blue-500 mt-1">Não feche esta página</p>
                </>
              ) : (
                <>
                  <FaUpload className="text-4xl text-gray-400 group-hover:text-blue-500 transition-colors mb-3" />
                  <p className="text-gray-600 font-medium">Clique para fazer upload</p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF, MP4, WEBM • até 50MB</p>
                </>
              )}
            </label>
          ) : (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative bg-gray-50 rounded-2xl p-5 border-2 border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {safeExercise.mediaFile?.type === 'video' || safeExercise.video?.includes('.mp4') ? (
                    <div className="relative w-20 h-20 bg-gradient-to-br from-red-400 to-red-600 rounded-xl overflow-hidden shadow-md">
                      <video 
                        src={safeExercise.mediaFile?.url || safeExercise.video} 
                        className="w-full h-full object-cover" 
                        muted 
                        preload="metadata"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <FaVideo className="text-white text-xl" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl overflow-hidden shadow-md">
                      <img 
                        src={safeExercise.mediaFile?.url || safeExercise.video} 
                        alt="Preview" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-900 truncate max-w-xs">
                      {safeExercise.mediaFile?.name || 'Mídia carregada'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {safeExercise.mediaFile?.type === 'video' || safeExercise.video?.includes('.mp4') ? 'Vídeo' : 'Imagem'} 
                      {safeExercise.mediaFile?.size && ` • ${(safeExercise.mediaFile.size / 1024 / 1024).toFixed(1)} MB`}
                    </p>
                    {safeExercise.video && (
                      <p className="text-xs text-green-600 mt-1 flex items-center">
                        <FaCheckCircle className="mr-1" />
                        Salvo no Cloudinary
                      </p>
                    )}
                  </div>
                </div>
                <button 
                  type="button" 
                  onClick={removeMedia} 
                  className="p-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all" 
                  disabled={isLoading || uploadingMedia}
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
            disabled={isLoading || uploadingMedia}
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
              disabled={isLoading || uploadingMedia}
              className="px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all flex items-center justify-center"
            >
              <FaUndo className="mr-2" /> Cancelar
            </button>
          )}
          <button 
            type="submit" 
            disabled={isLoading || uploadingMedia || Object.keys(errors).length > 0}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading || uploadingMedia ? (
              <FaSpinner className="animate-spin mr-2" />
            ) : (
              React.createElement(submitButtonIcon, { className: "mr-2" })
            )}
            {isLoading || uploadingMedia ? 'Processando...' : submitButtonText}
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
                <p className="text-sm">Exercício salvo com sucesso.</p>
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
    targetMuscles: PropTypes.arrayOf(PropTypes.string),
    mediaFile: PropTypes.object,
    video: PropTypes.string,
    instructions: PropTypes.string
  }),
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  editingIndex: PropTypes.number,
  errors: PropTypes.object,
  isLoading: PropTypes.bool
};

ExerciseForm.defaultProps = {
  exercise: DEFAULT_EXERCISE,
  errors: {},
  isLoading: false
};

export default ExerciseForm;