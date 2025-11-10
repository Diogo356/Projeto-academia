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
  FaSpinner
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
  const [saveMessage, setSaveMessage] = useState({ type: '', text: '' });

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
    setSaveMessage({ type: '', text: '' });

    try {
      const response = await workoutService.createWorkout(workoutData);
      
      setSaveMessage({
        type: 'success',
        text: response.message || 'Treino criado com sucesso!'
      });

      setTimeout(() => {
        setWorkoutData({ name: '', description: '', exercises: [] });
        resetForm();
        setSaveMessage({ type: '', text: '' });
      }, 2000);

    } catch (error) {
      setSaveMessage({
        type: 'error',
        text: error.message || 'Erro ao salvar. Tente novamente.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">

        {/* MENSAGEM */}
        <AnimatePresence>
          {saveMessage.text && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mb-6 p-4 rounded-2xl border-2 flex items-center ${
                saveMessage.type === 'success'
                  ? 'bg-green-50 border-green-200 text-green-800'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}
            >
              {saveMessage.type === 'success' ? (
                <FaCheckCircle className="text-green-500 mr-3" />
              ) : (
                <FaExclamationCircle className="text-red-500 mr-3" />
              )}
              <span className="font-medium">{saveMessage.text}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-6 lg:p-8 mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 flex items-center">
                <FaDumbbell className="mr-3 text-blue-600" />
                Criar Treino
              </h1>
              <p className="text-gray-600 mt-2">Simples, rápido e funcional</p>
            </div>
            <WorkoutSummary workoutData={workoutData} />
          </div>

          {/* NOME */}
          <div className="mt-6">
            <input
              type="text"
              placeholder="Nome do treino"
              value={workoutData.name}
              onChange={(e) => setWorkoutData(prev => ({ ...prev, name: e.target.value }))}
              className={`w-full px-5 py-3 rounded-xl text-lg font-medium transition-all focus:outline-none focus:ring-4 focus:ring-blue-100 ${
                workoutErrors.name
                  ? 'border-2 border-red-400 bg-red-50'
                  : 'border-2 border-gray-200 focus:border-blue-500'
              }`}
              disabled={isLoading}
            />
            {workoutErrors.name && (
              <p className="text-red-600 text-sm mt-2 flex items-center">
                <FaExclamationCircle className="mr-1" /> Nome é obrigatório
              </p>
            )}
          </div>

          {/* DESCRIÇÃO */}
          <div className="mt-6">
            <textarea
              value={workoutData.description}
              onChange={(e) => setWorkoutData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 resize-none"
              rows="2"
              placeholder="Descrição (opcional)"
              disabled={isLoading}
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">

          {/* CONTEÚDO */}
          <div className="xl:col-span-3 space-y-8">

            {/* FORM EXERCÍCIO */}
            <motion.div layout className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 lg:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                {editingIndex !== null ? <FaEdit className="mr-2 text-orange-600" /> : <FaPlus className="mr-2 text-blue-600" />}
                {editingIndex !== null ? 'Editar Exercício' : 'Adicionar Exercício'}
              </h2>
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

            {/* LISTA */}
            <AnimatePresence>
              {workoutData.exercises.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 lg:p-8"
                >
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <FaClock className="mr-2 text-purple-600" />
                    Sequência ({workoutData.exercises.length} exercício{workoutData.exercises.length !== 1 ? 's' : ''})
                  </h2>
                  <ExerciseList
                    exercises={workoutData.exercises}
                    onEdit={startEditing}
                    onRemove={removeExercise}
                    disabled={isLoading}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* REVISÃO */}
            {workoutData.exercises.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-3xl p-6 lg:p-8 border border-emerald-200"
              >
                <h3 className="text-xl font-bold text-emerald-900 mb-6 flex items-center">
                  <FaCheckCircle className="mr-2 text-emerald-600" />
                  Revisão Final
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/70 backdrop-blur rounded-2xl p-4 text-center">
                    <div className="text-3xl font-bold text-emerald-600">{workoutData.exercises.length}</div>
                    <div className="text-sm text-emerald-700">Exercícios</div>
                  </div>
                  <div className="bg-white/70 backdrop-blur rounded-2xl p-4 text-center">
                    <div className="text-3xl font-bold text-teal-600">
                      {Math.floor(workoutData.exercises.reduce((t, e) => t + e.duration, 0) / 60)}:
                      {String(workoutData.exercises.reduce((t, e) => t + e.duration, 0) % 60).padStart(2, '0')}
                    </div>
                    <div className="text-sm text-teal-700">Duração</div>
                  </div>
                </div>
                {workoutErrors.exercises && (
                  <p className="text-red-600 text-sm mt-4 flex items-center">
                    <FaExclamationCircle className="mr-1" /> Adicione pelo menos 1 exercício
                  </p>
                )}
              </motion.div>
            )}
          </div>

          {/* SIDEBAR */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Ações</h3>
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
                    if (confirm('Limpar tudo?')) {
                      setWorkoutData({ name: '', description: '', exercises: [] });
                      resetForm();
                    }
                  }}
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl border-2 border-red-300 text-red-600 font-semibold hover:bg-red-50 transition-all flex items-center justify-center space-x-2"
                >
                  <FaTrashAlt />
                  <span>Limpar</span>
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-6 border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-3">Dica</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Nome claro</li>
                <li>• Vídeo ou imagem</li>
                <li>• Instruções detalhadas</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutCreator;