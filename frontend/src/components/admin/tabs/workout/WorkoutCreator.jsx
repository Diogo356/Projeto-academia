// src/components/admin/WorkoutCreator.jsx
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ExerciseForm from './ExerciseForm';
import ExerciseList from './ExerciseList';
import WorkoutSummary from './WorkoutSummary';
import workoutService from '../../../../services/workoutService';
import { 
  FaSave, FaTrashAlt, FaPlus, FaCheckCircle, 
  FaExclamationCircle, FaEdit, FaClock, FaDumbbell,
  FaSpinner, FaTimes, FaLayerGroup, FaArrowCircleDown
} from 'react-icons/fa';

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
  exercises: []
};

// --- COMPONENTE PRINCIPAL ---
const WorkoutCreator = () => {
  const [workoutData, setWorkoutData] = useState(INITIAL_WORKOUT_DATA);
  const [currentExercise, setCurrentExercise] = useState(DEFAULT_EXERCISE); 
  const [editingIndex, setEditingIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [actionStatus, setActionStatus] = useState({ type: '', message: '' });
  const [nameTouched, setNameTouched] = useState(false);
  const [exerciseTouched, setExerciseTouched] = useState({}); // Novo estado para controle de touched dos exercícios

  // 1. VALIDAÇÃO DO TREINO
  const workoutErrors = useMemo(() => {
    const err = {};
    if (!workoutData.name.trim()) err.name = 'Nome do treino é obrigatório.';
    if (workoutData.exercises.length === 0) err.exercises = 'O treino deve ter pelo menos um exercício.';
    return err;
  }, [workoutData.name, workoutData.exercises.length]);

  const canSave = !workoutErrors.name && !workoutErrors.exercises;

  // 2. VALIDAÇÃO DO EXERCÍCIO ATUAL - CORRIGIDA
  const exerciseErrors = useMemo(() => {
    const err = {};
    const { name, duration, reps, sets, type } = currentExercise;

    // Só valida se o campo foi tocado OU se está tentando submeter
    if ((exerciseTouched.name || currentExercise.name) && !name?.trim()) {
      err.name = 'Nome é obrigatório.';
    }
    
    if (type === 'cardio' || type === 'flexibility') {
      if ((exerciseTouched.duration || currentExercise.duration !== 0) && (!duration || duration <= 0)) {
        err.duration = type === 'cardio' 
          ? 'Duração (segundos) > 0 é obrigatória.' 
          : 'Duração (segundos) > 0 é obrigatória.';
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

  // HANDLE EXERCISE CHANGE - CORRIGIDO
  const handleExerciseChange = useCallback((field, value) => {
    setCurrentExercise(prev => {
      const updated = { ...prev, [field]: value };
      
      // Marca o campo como tocado quando há alteração
      if (!exerciseTouched[field] && value !== '' && value !== 0) {
        setExerciseTouched(prevTouched => ({ ...prevTouched, [field]: true }));
      }
      
      return updated;
    });
  }, [exerciseTouched]);

  // ADICIONAR/EDITAR EXERCÍCIO - CORRIGIDO
  const addOrUpdateExercise = useCallback((exerciseData) => {
    setWorkoutData(prev => {
      const updated = [...prev.exercises];
      if (editingIndex !== null) {
        // Mantém o mediaFile existente se não foi alterado
        const existingMedia = prev.exercises[editingIndex]?.mediaFile;
        updated[editingIndex] = { 
          ...prev.exercises[editingIndex], 
          ...exerciseData,
          mediaFile: exerciseData.mediaFile || existingMedia // Preserva mediaFile existente
        };
      } else {
        updated.push({ ...exerciseData, id: Date.now() });
      }
      return { ...prev, exercises: updated };
    });
    resetForm();
  }, [editingIndex]);

  const resetForm = useCallback(() => {
    setCurrentExercise(DEFAULT_EXERCISE);
    setEditingIndex(null);
    setExerciseTouched({}); // Reseta os campos tocados
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
    
    // Marca todos os campos como tocados quando edita
    const touchedFields = {};
    Object.keys(exerciseToEdit).forEach(key => {
      if (exerciseToEdit[key] !== '' && exerciseToEdit[key] !== 0) {
        touchedFields[key] = true;
      }
    });
    setExerciseTouched(touchedFields);
    
    document.getElementById('exercise-form-section')?.scrollIntoView({ behavior: 'smooth' });
  }, [workoutData.exercises]);

  // SALVAR
  const saveWorkout = async () => {
    if (!canSave) {
        setNameTouched(true);
        setActionStatus({ type: 'error', message: workoutErrors.name || workoutErrors.exercises });
        return;
    }

    setIsLoading(true);
    setActionStatus({ type: '', message: '' });

    try {
      const workoutToSave = {
          ...workoutData,
          exercises: workoutData.exercises.map(ex => {
              // Remove apenas a propriedade mediaFile se for um objeto File
              // Mantém se for uma URL string
              const { mediaFile, ...rest } = ex;
              if (typeof mediaFile === 'string') {
                return { ...rest, mediaFile }; // Preserva URLs
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
      {/* Header */}
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

      {/* Status Message */}
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
                  onChange={(e) => setWorkoutData(prev => ({ ...prev, name: e.target.value }))}
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
                  onChange={(e) => setWorkoutData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 resize-none transition-all"
                  rows="3"
                  placeholder="Descreva o objetivo, público alvo ou quaisquer notas importantes sobre este treino..."
                  disabled={isLoading}
                />
              </div>
            </div>
          </motion.div>

          {/* Formulário de Exercício */}
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
              onChange={handleExerciseChange} // CORRIGIDO
              onSubmit={addOrUpdateExercise}
              onCancel={resetForm}
              editingIndex={editingIndex}
              errors={exerciseErrors}
              canSubmit={canAddOrUpdateExercise} 
              isLoading={isLoading}
            />
          </motion.div>

          {/* Lista de Exercícios */}
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
                    >
                      <FaArrowCircleDown className="text-2xl flex-shrink-0" />
                      <span className="font-medium">Adicione o primeiro exercício acima para completar o treino.</span>
                   </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Sidebar */}
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
                        {workoutErrors.name || workoutErrors.exercises}
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
                className="w-full py-3 rounded-xl border-2 border-red-300 text-red-600 font-semibold hover:bg-red-50 transition-colors flex items-center justify-center space-x-2"
              >
                <FaTrashAlt />
                <span>Limpar Tudo</span>
              </button>
            </div>
          </motion.div>

          {/* Dicas */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-6 border border-blue-200"
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