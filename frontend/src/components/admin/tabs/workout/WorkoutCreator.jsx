// src/components/admin/WorkoutCreator.jsx
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ExerciseForm from './ExerciseForm';
import ExerciseList from './ExerciseList';
import WorkoutSummary from './WorkoutSummary';
import workoutService from '../../../../services/workoutService';
import { 
  FaSave, FaTrashAlt, FaPlus, FaCheckCircle, 
  FaExclamationCircle, FaEdit, FaClock, FaDumbbell,
  FaSpinner, FaTimes
} from 'react-icons/fa';

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

const WorkoutCreator = () => {
  const [workoutData, setWorkoutData] = useState({
    name: '',
    description: '',
    exercises: []
  });

  const [currentExercise, setCurrentExercise] = useState(DEFAULT_EXERCISE);
  const [editingIndex, setEditingIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [actionStatus, setActionStatus] = useState({ type: '', message: '' });

  // VALIDAÇÃO
  const workoutErrors = useMemo(() => {
    const err = {};
    if (!workoutData.name.trim()) err.name = true;
    if (workoutData.exercises.length === 0) err.exercises = true;
    return err;
  }, [workoutData.name, workoutData.exercises.length]);

  const canSave = !workoutErrors.name && !workoutErrors.exercises;

  const exerciseErrors = useMemo(() => {
    const err = {};
    if (!currentExercise.name?.trim()) err.exerciseName = 'Nome é obrigatório';
    if (!currentExercise.duration || currentExercise.duration <= 0) {
      err.duration = 'Duração > 0';
    }
    if (currentExercise.type === 'strength' && (!currentExercise.reps || currentExercise.reps <= 0)) {
      err.reps = 'Reps obrigatórias para força';
    }
    return err;
  }, [currentExercise]);

  // ADICIONAR/EDITAR EXERCÍCIO
  const addOrUpdateExercise = (exerciseData) => {
    setWorkoutData(prev => {
      const updated = [...prev.exercises];
      if (editingIndex !== null) {
        updated[editingIndex] = { ...exerciseData, id: prev.exercises[editingIndex].id };
      } else {
        updated.push({ ...exerciseData, id: Date.now() });
      }
      return { ...prev, exercises: updated };
    });
    resetForm();
  };

  const resetForm = () => {
    setCurrentExercise(DEFAULT_EXERCISE);
    setEditingIndex(null);
  };

  const removeExercise = (index) => {
    setWorkoutData(prev => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index)
    }));
    if (editingIndex === index) resetForm();
  };

  const startEditing = (index) => {
    setCurrentExercise({ ...workoutData.exercises[index] });
    setEditingIndex(index);
  };

  // SALVAR
  const saveWorkout = async () => {
    if (!canSave) return;

    setIsLoading(true);
    setActionStatus({ type: '', message: '' });

    try {
      const response = await workoutService.createWorkout(workoutData);
      
      setActionStatus({
        type: 'success',
        message: response.message || 'Treino criado com sucesso!'
      });

      setTimeout(() => {
        setWorkoutData({ name: '', description: '', exercises: [] });
        resetForm();
        setActionStatus({ type: '', message: '' });
      }, 2000);

    } catch (error) {
      setActionStatus({
        type: 'error',
        message: error.message || 'Erro ao salvar. Tente novamente.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FaDumbbell className="text-blue-600" />
            Criar Treino
          </h2>
          <p className="text-gray-600 mt-2">Simples, rápido e funcional</p>
        </div>

        <div className="flex items-center gap-4">
          <WorkoutSummary workoutData={workoutData} />
          <button 
            onClick={() => window.location.href = '/admin/workouts'}
            className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all flex items-center space-x-2"
          >
            <FaTimes />
            <span>Cancelar</span>
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
            className={`p-4 rounded-2xl border-2 flex items-center space-x-3 ${
              actionStatus.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            {actionStatus.type === 'success' ? (
              <FaCheckCircle className="text-green-500 text-xl" />
            ) : (
              <FaExclamationCircle className="text-red-500 text-xl" />
            )}
            <span className="font-medium">{actionStatus.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Coluna Principal */}
        <div className="xl:col-span-2 space-y-6">
          {/* Informações Básicas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 lg:p-8"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <FaEdit className="text-blue-600" />
              Informações do Treino
            </h3>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nome do Treino *
                </label>
                <input
                  type="text"
                  placeholder="Ex: Treino de Peito e Tríceps"
                  value={workoutData.name}
                  onChange={(e) => setWorkoutData(prev => ({ ...prev, name: e.target.value }))}
                  className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-4 focus:ring-blue-100 transition-all ${
                    workoutErrors.name
                      ? 'border-red-400 bg-red-50 focus:border-red-500'
                      : 'border-gray-200 focus:border-blue-500'
                  }`}
                  disabled={isLoading}
                />
                {workoutErrors.name && (
                  <p className="text-red-600 text-sm mt-2 flex items-center">
                    <FaExclamationCircle className="mr-1" /> Nome é obrigatório
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Descrição
                </label>
                <textarea
                  value={workoutData.description}
                  onChange={(e) => setWorkoutData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 resize-none transition-all"
                  rows="3"
                  placeholder="Descreva o objetivo e características deste treino..."
                  disabled={isLoading}
                />
              </div>
            </div>
          </motion.div>

          {/* Formulário de Exercício */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 lg:p-8"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              {editingIndex !== null ? (
                <>
                  <FaEdit className="text-orange-600" />
                  Editar Exercício
                </>
              ) : (
                <>
                  <FaPlus className="text-blue-600" />
                  Adicionar Exercício
                </>
              )}
            </h3>
            <ExerciseForm
              exercise={currentExercise}
              onChange={setCurrentExercise}
              onSubmit={addOrUpdateExercise}
              onCancel={resetForm}
              editingIndex={editingIndex}
              errors={exerciseErrors}
              isLoading={isLoading}
            />
          </motion.div>

          <AnimatePresence>
            {workoutData.exercises.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 lg:p-8"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <FaClock className="text-purple-600" />
                  Sequência de Exercícios ({workoutData.exercises.length})
                </h3>
                <ExerciseList
                  exercises={workoutData.exercises}
                  onEdit={startEditing}
                  onRemove={removeExercise}
                  disabled={isLoading}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">

          {/* Ações */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6"
          >
            <h3 className="font-semibold text-gray-900 mb-4">Ações</h3>
            <div className="space-y-3">
              <button
                onClick={saveWorkout}
                disabled={!canSave || isLoading}
                className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2 ${
                  canSave && !isLoading
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isLoading ? <FaSpinner className="animate-spin" /> : <FaSave />}
                <span>{isLoading ? 'Salvando...' : 'Salvar Treino'}</span>
              </button>

              <button
                onClick={() => {
                  if (confirm('Tem certeza que deseja limpar todo o treino?')) {
                    setWorkoutData({ name: '', description: '', exercises: [] });
                    resetForm();
                  }
                }}
                disabled={isLoading}
                className="w-full py-3 rounded-xl border-2 border-red-300 text-red-600 font-semibold hover:bg-red-50 transition-all flex items-center justify-center space-x-2"
              >
                <FaTrashAlt />
                <span>Limpar Tudo</span>
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-6 border border-blue-200"
          >
            <h3 className="font-semibold text-blue-900 mb-3">Dicas</h3>
            <ul className="text-sm text-blue-700 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Use nomes claros e objetivos</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Adicione mídia demonstrativa</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Descreva instruções detalhadas</span>
              </li>
              {/* <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Organize por grupos musculares</span>
              </li> */}
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutCreator;