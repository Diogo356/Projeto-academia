// src/components/admin/WorkoutViewModal.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaTimes, FaDumbbell, FaClock, FaFire,
   FaWeightHanging, FaRunning,
  FaHeartbeat, FaUser, FaSnowflake
} from 'react-icons/fa';

const WorkoutViewModal = ({ workout, isOpen, onClose }) => {
  if (!isOpen || !workout) return null;

  // Ícones para categorias
  const categoryIcons = {
    cardio: FaRunning,
    strength: FaDumbbell,
    hiit: FaFire,
    yoga: FaUser,
    pilates: FaHeartbeat,
    mobility: FaSnowflake,
    custom: FaDumbbell
  };

  // Ícones para tipos de exercício
  const exerciseTypeIcons = {
    strength: FaWeightHanging,
    cardio: FaRunning,
    bodyweight: FaUser,
    flexibility: FaSnowflake,
    warmup: FaFire,
    cooldown: FaHeartbeat
  };

  // Traduzir categoria
  const translateCategory = (category) => {
    const translations = {
      cardio: 'Cardio',
      strength: 'Força',
      hiit: 'HIIT',
      yoga: 'Yoga',
      pilates: 'Pilates',
      mobility: 'Mobilidade',
      custom: 'Personalizado'
    };
    return translations[category] || category;
  };

  // Traduzir dificuldade
  const translateDifficulty = (difficulty) => {
    const translations = {
      beginner: 'Iniciante',
      intermediate: 'Intermediário',
      advanced: 'Avançado'
    };
    return translations[difficulty] || difficulty;
  };

  // Traduzir tipo de exercício
  const translateExerciseType = (type) => {
    const translations = {
      strength: 'Força',
      cardio: 'Cardio',
      bodyweight: 'Peso Corporal',
      flexibility: 'Flexibilidade',
      warmup: 'Aquecimento',
      cooldown: 'Desaquecimento'
    };
    return translations[type] || type;
  };

  // Formatar duração
  const formatDuration = (seconds) => {
    if (!seconds) return '0 min';
    
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}min`;
    }
    return `${minutes} min`;
  };

  // Calcular totais
  const totalExercises = workout.exercises?.length || 0;
  const totalDuration = workout.totalDuration || workout.exercises?.reduce((total, exercise) => {
    return total + (exercise.duration || 0) + (exercise.restTime || 0);
  }, 0) || 0;

  const CategoryIcon = categoryIcons[workout.category] || FaDumbbell;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 h-full  z-50 flex items-center justify-center p-4"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div 
              className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-4">
                    <div className="p-3  border shadow-lg rounded-2xl">
                      <CategoryIcon className="text-2xl " />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{workout.name}</h2>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
                          {translateCategory(workout.category)}
                        </span>
                        <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
                          {translateDifficulty(workout.difficulty)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white hover:bg-opacity-20 rounded-xl transition-colors"
                  >
                    <FaTimes className="text-xl" />
                  </button>
                </div>

                {workout.description && (
                  <p className="mt-4 text-blue-100 text-lg">
                    {workout.description}
                  </p>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 p-6 bg-gray-50 border-b">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 text-gray-600 mb-1">
                    <FaDumbbell />
                    <span className="font-semibold">Exercícios</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{totalExercises}</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 text-gray-600 mb-1">
                    <FaClock />
                    <span className="font-semibold">Duração</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {formatDuration(totalDuration)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 text-gray-600 mb-1">
                    <FaFire />
                    <span className="font-semibold">Intensidade</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 capitalize">
                    {workout.difficulty}
                  </div>
                </div>
              </div>

              {/* Exercises List */}
              <div className="max-h-96 overflow-y-auto p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                  <FaDumbbell className="text-blue-500" />
                  <span>Exercícios do Treino</span>
                </h3>

                {!workout.exercises || workout.exercises.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <FaDumbbell className="text-4xl mx-auto mb-3 text-gray-300" />
                    <p>Nenhum exercício adicionado a este treino.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {workout.exercises.map((exercise, index) => {
                      const ExerciseTypeIcon = exerciseTypeIcons[exercise.type] || FaDumbbell;
                      
                      return (
                        <motion.div
                          key={exercise._id || index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4 flex-1">
                              <div className="p-2 bg-blue-50 rounded-xl mt-1">
                                <ExerciseTypeIcon className="text-blue-600 text-lg" />
                              </div>
                              
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                  <h4 className="font-bold text-gray-900 text-lg">
                                    {exercise.name}
                                  </h4>
                                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
                                    {translateExerciseType(exercise.type)}
                                  </span>
                                </div>
                                
                                {exercise.description && (
                                  <p className="text-gray-600 mb-3 text-sm">
                                    {exercise.description}
                                  </p>
                                )}

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                  {exercise.sets && (
                                    <div className="flex items-center space-x-2 text-gray-600">
                                      <span>{exercise.sets} séries</span>
                                    </div>
                                  )}
                                  
                                  {exercise.reps && (
                                    <div className="flex items-center space-x-2 text-gray-600">
                                      <FaDumbbell className="text-gray-400" />
                                      <span>{exercise.reps}reps</span>
                                    </div>
                                  )}
                                  
                                  {exercise.duration && (
                                    <div className="flex items-center space-x-2 text-gray-600">
                                      <FaClock className="text-gray-400" />
                                      <span>{formatDuration(exercise.duration)}</span>
                                    </div>
                                  )}
                                  
                                  {exercise.restTime && (
                                    <div className="flex items-center space-x-2 text-gray-600">
                                      <FaHeartbeat className="text-gray-400" />
                                      <span>Descanso: {formatDuration(exercise.restTime)}</span>
                                    </div>
                                  )}
                                </div>

                                {/* Equipment and Instructions */}
                                <div className="mt-3 space-y-2">
                                  {exercise.equipment && exercise.equipment.length > 0 && (
                                    <div className="flex items-start space-x-2 text-sm text-gray-600">
                                      <span className="font-medium">Equipamento:</span>
                                      <span>{exercise.equipment.join(', ')}</span>
                                    </div>
                                  )}
                                  
                                  {exercise.instructions && (
                                    <div className="text-sm text-gray-600">
                                      <span className="font-medium">Instruções:</span>
                                      <p className="mt-1">{exercise.instructions}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <div className="text-2xl font-bold text-gray-300 ml-4">
                              #{index + 1}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-4 border-t flex justify-end">
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors font-medium"
                >
                  Fechar
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default WorkoutViewModal;