import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ExerciseForm from './ExerciseForm';
import ExerciseList from './ExerciseList';
import WorkoutSummary from './WorkoutSummary';
import workoutService from '../../../../services/workoutService';
import { 
  FaSave, FaTrashAlt, FaPlus, FaCheckCircle, 
  FaExclamationCircle, FaEdit, FaClock, FaDumbbell,
  FaSpinner, FaTimes, FaLayerGroup, FaArrowCircleDown,
  FaHourglassHalf, FaRedo // Ícones novos
} from 'react-icons/fa';

// --- FUNÇÕES DE DURAÇÃO (COPIADAS DO EXERCISEFORM) ---
// Trazidas para cá para serem reutilizadas nos novos campos
const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const parseFlexibleDuration = (input) => {
  if (!input) return 0;
  const str = input.toString().trim().toLowerCase().replace(/\s/g, '');
  const colonMatch = str.match(/^(\d+):(\d*)$/);
  if (colonMatch) {
    const mins = parseInt(colonMatch[1], 10) || 0;
    const secs = parseInt(colonMatch[2], 10) || 0;
    return (mins * 60) + secs;
  }
  const unitMatch = str.match(/^(\d+)(min|s|h)?(\d*)$/);
  if (unitMatch) {
    const value = parseInt(unitMatch[1], 10) || 0;
    const unit = unitMatch[2];
    const extra = parseInt(unitMatch[3], 10) || 0;
    if (unit === 'h') return (value * 3600) + (extra * 60);
    if (unit === 'min') return value * 60;
    if (unit === 's') return value;
    if (!unit && extra === 0) return value;
  }
  return 0;
};

// --- COMPONENTE DE INPUT DE DURAÇÃO REUTILIZÁVEL ---
// Criado para os novos campos, usando a lógica do ExerciseForm
const WorkoutTimerInput = ({ label, icon: Icon, value, onChange, disabled }) => {
  const [rawInput, setRawInput] = useState(formatDuration(value));
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isFocused) {
      setRawInput(formatDuration(value));
    }
  }, [value, isFocused]);

  const handleInputChange = (e) => {
    const raw = e.target.value;
    setRawInput(raw);
    const seconds = parseFlexibleDuration(raw);
    onChange(Math.max(0, Math.min(seconds, 7200))); // Limite de 2h
  };

  const handleFocus = () => setIsFocused(true);

  const handleBlur = () => {
    setIsFocused(false);
    setRawInput(formatDuration(value));
  };

  return (
    <div>
      <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
        {Icon && <Icon className="mr-2 text-blue-600" />}
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          value={rawInput}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`w-full px-4 py-3 pr-16 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 font-mono text-lg tracking-wider border-gray-200 hover:border-gray-300 focus:border-blue-500`}
          placeholder="00:00"
          disabled={disabled}
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
          {isFocused ? "ex: 1:30" : "min"}
        </span>
      </div>
    </div>
  );
};


// --- CONSTANTES ---
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

const INITIAL_WORKOUT_DATA = {
  name: '',
  description: '',
  exercises: [],
  transitionTime: 10, // ⭐️ NOVO CAMPO (10 segundos padrão)
  restAtEnd: 60,      // ⭐️ NOVO CAMPO (60 segundos padrão)
};

// --- COMPONENTE PRINCIPAL ---
const WorkoutCreator = () => {
  const [workoutData, setWorkoutData] = useState(INITIAL_WORKOUT_DATA);
  const [currentExercise, setCurrentExercise] = useState(DEFAULT_EXERCISE); 
  const [editingIndex, setEditingIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [actionStatus, setActionStatus] = useState({ type: '', message: '' });
  const [nameTouched, setNameTouched] = useState(false);
  const [exerciseTouched, setExerciseTouched] = useState({});

  // 1. VALIDAÇÃO DO TREINO
  const workoutErrors = useMemo(() => {
    const err = {};
    if (!workoutData.name.trim()) err.name = 'Nome do treino é obrigatório.';
    if (workoutData.exercises.length === 0) err.exercises = 'O treino deve ter pelo menos um exercício.';
    // Validações para os novos campos (opcional, mas bom)
    if (workoutData.transitionTime < 0) err.transitionTime = 'Tempo de transição não pode ser negativo.';
    if (workoutData.restAtEnd < 0) err.restAtEnd = 'Descanso final não pode ser negativo.';
    return err;
  }, [workoutData]); // Adicionado workoutData como dep

  const canSave = Object.keys(workoutErrors).length === 0; // Simplificado

  // 2. VALIDAÇÃO DO EXERCÍCIO ATUAL (Sem mudanças)
  const exerciseErrors = useMemo(() => {
    const err = {};
    const { name, duration, reps, sets, type } = currentExercise;
    if ((exerciseTouched.name || currentExercise.name) && !name?.trim()) {
      err.name = 'Nome é obrigatório.';
    }
    if (type === 'cardio' || type === 'flexibility') {
      if ((exerciseTouched.duration || currentExercise.duration !== 0) && (!duration || duration <= 0)) {
        err.duration = 'Duração (segundos) > 0 é obrigatória.';
      }
    }
    if (type === 'strength') {
      if ((exerciseTouched.sets || currentExercise.sets !== 1) && (!sets || sets <= 0)) {
        err.sets = 'Séries > 0 são obrigatórias para treino de Força.';
      }
      if ((exerciseTouched.reps || currentExercise.reps !== 0) && (!reps || reps <= 0)) {
        err.reps = 'Repetições > 0 são obrigatórias para treino de Força.';
      }
    }
    return err;
  }, [currentExercise, exerciseTouched]);

  const canAddOrUpdateExercise = Object.keys(exerciseErrors).length === 0;

  // ⭐️ NOVO HANDLER para campos do workoutData (nome, descrição, tempos)
  const handleWorkoutDataChange = useCallback((field, value) => {
    setWorkoutData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // HANDLE EXERCISE CHANGE (Sem mudanças)
  const handleExerciseChange = useCallback((field, value) => {
    setCurrentExercise(prev => {
      const updated = { ...prev, [field]: value };
      if (!exerciseTouched[field] && value !== '' && value !== 0) {
        setExerciseTouched(prevTouched => ({ ...prevTouched, [field]: true }));
      }
      return updated;
    });
  }, [exerciseTouched]);

  // ADICIONAR/EDITAR EXERCÍCIO (Sem mudanças)
  const addOrUpdateExercise = useCallback((exerciseData) => {
    setWorkoutData(prev => {
      const updated = [...prev.exercises];
      if (editingIndex !== null) {
        const existingMedia = prev.exercises[editingIndex]?.mediaFile;
        updated[editingIndex] = { 
          ...prev.exercises[editingIndex], 
          ...exerciseData,
          mediaFile: exerciseData.mediaFile || existingMedia
        };
      } else {
        updated.push({ ...exerciseData, id: Date.now() });
      }
      return { ...prev, exercises: updated };
    });
    resetForm();
  }, [editingIndex]);

  // (Restante dos handlers: resetForm, removeExercise, startEditing - Sem mudanças)
  const resetForm = useCallback(() => {
    setCurrentExercise(DEFAULT_EXERCISE);
    setEditingIndex(null);
    setExerciseTouched({});
  }, []);

  const removeExercise = useCallback((index) => {
    setWorkoutData(prev => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index)
    }));
    if (editingIndex === index) resetForm();
  }, [editingIndex, resetForm]);

  const startEditing = useCallback((index) => {
    const exerciseToEdit = { ...workoutData.exercises[index] };
    setCurrentExercise(exerciseToEdit);
    setEditingIndex(index);
    
    const touchedFields = {};
    Object.keys(exerciseToEdit).forEach(key => {
      if (exerciseToEdit[key] !== '' && exerciseToEdit[key] !== 0) {
        touchedFields[key] = true;
      }
    });
    setExerciseTouched(touchedFields);
    
    document.getElementById('exercise-form-section')?.scrollIntoView({ behavior: 'smooth' });
  }, [workoutData.exercises]);


  // SALVAR (Sem mudanças, pois workoutData já é salvo com spread)
  const saveWorkout = async () => {
    if (!canSave) {
        setNameTouched(true);
        // Mostra o primeiro erro encontrado
        const firstError = Object.values(workoutErrors)[0];
        setActionStatus({ type: 'error', message: firstError || 'Verifique os campos do treino.' });
        return;
    }

    setIsLoading(true);
    setActionStatus({ type: '', message: '' });

    try {
      // workoutData já contém transitionTime e restAtEnd,
      // então é salvo automaticamente.
      const workoutToSave = {
          ...workoutData,
          exercises: workoutData.exercises.map(ex => {
              const { mediaFile, ...rest } = ex;
              if (typeof mediaFile === 'string') {
                return { ...rest, mediaFile };
              }
              return rest;
          })
      };

      const response = await workoutService.createWorkout(workoutToSave);
      
      setActionStatus({
        type: 'success',
        message: response.message || 'Treino criado com sucesso!'
      });

      setTimeout(() => {
        setWorkoutData(INITIAL_WORKOUT_DATA);
        resetForm();
        setNameTouched(false);
        setActionStatus({ type: '', message: '' });
      }, 2500);

    } catch (error) {
      console.error("Erro ao salvar treino:", error);
      setActionStatus({
        type: 'error',
        message: error.message || 'Erro ao salvar o treino. Tente novamente.'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // (useEffect do actionStatus - Sem mudanças)
  useEffect(() => {
    if (actionStatus.message) {
      const timer = setTimeout(() => {
        setActionStatus({ type: '', message: '' });
      }, 5000); 
      return () => clearTimeout(timer);
    }
  }, [actionStatus.message]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-6">
      {/* Header (Sem mudanças) */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-4xl font-extrabold text-gray-900 flex items-center gap-3">
            <FaDumbbell className="text-blue-600 text-3xl" />
            Criar Novo Treino
          </h2>
          <p className="text-gray-600 mt-2">Gerencie e construa sequências de exercícios de forma eficiente.</p>
        </div>
        <div className="flex items-center gap-4">
          <WorkoutSummary workoutData={workoutData} />
          <button 
            onClick={() => window.location.href = '/admin/workouts'}
            className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all flex items-center space-x-2 shadow-sm border border-gray-200"
            disabled={isLoading}
          >
            <FaTimes />
            <span>Sair</span>
          </button>
        </div>
      </div>

      {/* Status Message (Sem mudanças) */}
      <AnimatePresence>
        {actionStatus.message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-2xl border-2 flex items-center space-x-3 transition-colors ${
              actionStatus.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            {actionStatus.type === 'success' ? (
              <FaCheckCircle className="text-green-500 text-xl flex-shrink-0" />
            ) : (
              <FaExclamationCircle className="text-red-500 text-xl flex-shrink-0" />
            )}
            <span className="font-medium">{actionStatus.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Coluna Principal */}
        <div className="xl:col-span-2 space-y-8">
          
          {/* Informações Básicas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 lg:p-8"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3 border-b pb-4">
              <FaEdit className="text-blue-600" />
              1. Detalhes Principais do Treino
            </h3>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nome do Treino *
                </label>
                <input
                  type="text"
                  placeholder="Ex: Treino de Peito e Tríceps - Foco Hipertrofia"
                  value={workoutData.name}
                  onBlur={() => setNameTouched(true)} 
                  onChange={(e) => handleWorkoutDataChange('name', e.target.value)} // ⭐️ AJUSTADO
                  className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-4 focus:ring-blue-100 transition-all ${
                    workoutErrors.name && nameTouched
                      ? 'border-red-400 bg-red-50 focus:border-red-500'
                      : 'border-gray-200 focus:border-blue-500'
                  }`}
                  disabled={isLoading}
                />
                {workoutErrors.name && nameTouched && ( 
                  <p className="text-red-600 text-sm mt-2 flex items-center">
                    <FaExclamationCircle className="mr-1" /> {workoutErrors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Descrição (Opcional)
                </label>
                <textarea
                  value={workoutData.description}
                  onChange={(e) => handleWorkoutDataChange('description', e.target.value)} // ⭐️ AJUSTADO
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 resize-none transition-all"
                  rows="3"
                  placeholder="Descreva o objetivo, público alvo ou quaisquer notas importantes sobre este treino..."
                  disabled={isLoading}
                />
              </div>

              {/* ⭐️⭐️ SEÇÃO ADICIONADA ⭐️⭐️ */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                <WorkoutTimerInput
                  label="Tempo de Transição"
                  icon={FaHourglassHalf}
                  value={workoutData.transitionTime}
                  onChange={(val) => handleWorkoutDataChange('transitionTime', val)}
                  disabled={isLoading}
                />
                <WorkoutTimerInput
                  label="Descanso Final (Loop)"
                  icon={FaRedo}
                  value={workoutData.restAtEnd}
section                 onChange={(val) => handleWorkoutDataChange('restAtEnd', val)}
                  disabled={isLoading}
                />
              </div>
              <p className="text-xs text-gray-500 -mt-4 px-1">
                Defina os tempos de transição *entre* exercícios e o descanso no final *antes* de recomeçar o loop.
              </p>
              {/* ⭐️⭐️ FIM DA SEÇÃO ADICIONADA ⭐️⭐️ */}

            </div>
          </motion.div>

          {/* Formulário de Exercício (Sem mudanças) */}
          <motion.div
            id="exercise-form-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 lg:p-8"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3 border-b pb-4">
              {editingIndex !== null ? (
                <>
                  <FaEdit className="text-orange-600" />
                  2. Editar Exercício <span className="text-lg font-normal text-gray-500">#{editingIndex + 1}</span>
                </>
              ) : (
                <>
                  <FaPlus className="text-blue-600" />
                  2. Adicionar Novo Exercício
                </>
              )}
            </h3>
            <ExerciseForm
              exercise={currentExercise}
              onChange={handleExerciseChange} 
              onSubmit={addOrUpdateExercise}
              onCancel={resetForm}
              editingIndex={editingIndex}
              errors={exerciseErrors}
              canSubmit={canAddOrUpdateExercise} 
              isLoading={isLoading}
            />
          </motion.div>

          {/* Lista de Exercícios (Sem mudanças) */}
          <AnimatePresence>
            {workoutData.exercises.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 lg:p-8"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3 border-b pb-4">
                  <FaLayerGroup className="text-purple-600" />
                  3. Sequência de Exercícios ({workoutData.exercises.length})
                  {workoutErrors.exercises && (
                    <span className="text-base font-medium text-red-500 ml-4">
                        (Mínimo 1 exercício para salvar)
                    </span>
                  )}
                </h3>
                <ExerciseList
                  exercises={workoutData.exercises}
                  onEdit={startEditing}
                  onRemove={removeExercise}
                  disabled={isLoading}
                />
              </motion.div>
            )}
            {workoutData.exercises.length === 0 && workoutData.name.trim() && (
                   <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="p-6 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 rounded-lg flex items-center gap-3"
section             >
                      <FaArrowCircleDown className="text-2xl flex-shrink-0" />
                      <span className="font-medium">Adicione o primeiro exercício acima para completar o treino.</span>
                   </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Sidebar (Ajustado para mostrar erro dos novos campos) */}
        <div className="space-y-8">

          {/* Ações */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sticky top-6"
          >
            <h3 className="font-bold text-lg text-gray-900 mb-4 border-b pb-3">Ações do Treino</h3>
            <div className="space-y-4">
              <button
                onClick={saveWorkout}
                disabled={!canSave || isLoading}
                className={`w-full py-3 rounded-xl font-bold text-lg transition-all flex items-center justify-center space-x-2 shadow-lg ${
                  canSave && !isLoading
                    ? 'bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-[1.01] active:scale-100'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isLoading ? <FaSpinner className="animate-spin" /> : <FaSave />}
                <span>{isLoading ? 'Salvando...' : 'Salvar Treino'}</span>
              </button>
              {!canSave && (
                    <p className="text-red-500 text-xs text-center">
                        {workoutErrors.name || workoutErrors.exercises || workoutErrors.transitionTime || workoutErrors.restAtEnd}
                    </p>
              )}

              <button
                onClick={() => {
                  if (window.confirm('Tem certeza que deseja limpar TODO o treino? Essa ação não pode ser desfeita.')) {
                    setWorkoutData(INITIAL_WORKOUT_DATA);
                    resetForm();
                    setNameTouched(false);
                    setActionStatus({ type: 'info', message: 'Formulário limpo com sucesso.' });
                  }
                }}
                disabled={isLoading}
CSS               className="w-full py-3 rounded-xl border-2 border-red-300 text-red-600 font-semibold hover:bg-red-50 transition-colors flex items-center justify-center space-x-2"
              >
                <FaTrashAlt />
                <span>Limpar Tudo</span>
              </button>
            </div>
          </motion.div>

          {/* Dicas (Sem mudanças) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
      _       className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-6 border border-blue-200"
          >
            <h3 className="font-bold text-lg text-blue-900 mb-3 border-b border-blue-200 pb-2">Dicas de Conteúdo</h3>
            <ul className="text-sm text-blue-700 space-y-2">
              <li className="flex items-start gap-2">
                <FaCheckCircle className="text-blue-500 mt-0.5 flex-shrink-0" />
              <span>Use nomes **claros e descritivos** no treino e exercícios.</span>
              </li>
              <li className="flex items-start gap-2">
                <FaCheckCircle className="text-blue-500 mt-0.5 flex-shrink-0" />
                <span>Para **Força**, preencha Reps e Sets. Para **Cardio/Flexibilidade**, preencha Duração.</span>
            </li>
              <li className="flex items-start gap-2">
                <FaCheckCircle className="text-blue-500 mt-0.5 flex-shrink-0" />
                <span>Descreva instruções detalhadas, focando na **execução correta**.</span>
              </li>
              <li className="flex items-start gap-2">
                <FaCheckCircle className="text-blue-500 mt-0.5 flex-shrink-0" />
                <span>Adicione mídia demonstrativa para **orientação visual**.</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutCreator;