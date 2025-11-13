// src/components/admin/WorkoutViewModal.jsx - VERSÃO MELHORADA
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaTimes, FaDumbbell, FaClock, FaFire,
  FaWeightHanging, FaRunning, FaHeartbeat, FaUser,
  FaSnowflake, FaPlay, FaImage, FaRedo, 
  FaLayerGroup, FaPauseCircle, FaTools
} from 'react-icons/fa';

// --- Sub-componente: MediaThumbnail (Copilado do WorkoutList) ---
// É bom ter este componente aqui para ser usado nos exercícios
const MediaThumbnail = React.memo(({ media, className = "" }) => {
  if (!media) {
    // Placeholder se não houver mídia
    return (
      <div className={`relative rounded-xl overflow-hidden shadow-inner bg-gray-100 ${className}`}>
        <div className="w-full h-full flex items-center justify-center">
          <FaImage className="text-gray-300 text-4xl" />
        </div>
      </div>
    );
  }
  
  const isVideo = media.type === 'video';
  const imageUrl = isVideo ? (media.thumbnail || media.url) : media.url;

  return (
    <div className={`relative rounded-xl overflow-hidden shadow-md ${className}`}>
      <img
        src={imageUrl}
        alt={isVideo ? "Vídeo do exercício" : "Imagem do exercício"}
        className="w-full h-full object-cover"
      />
      {isVideo && (
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <FaPlay className="text-white text-2xl drop-shadow" />
        </div>
      )}
    </div>
  );
});

// --- Sub-componente: StatBadge (Para detalhes do exercício) ---
const StatBadge = ({ icon: Icon, value, label, unit }) => {
  if (!value && value !== 0) return null;
  return (
    <div className="flex items-center gap-1.5 bg-gray-100 text-gray-800 px-3 py-1.5 rounded-lg text-sm">
      <Icon className="text-gray-500" />
      <span className="font-semibold">{value}</span>
      {label && <span className="text-gray-600">{label}</span>}
      {unit && <span className="text-gray-600">{unit}</span>}
    </div>
  );
};

// --- Sub-componente: ExerciseItem (Otimizado) ---
const ExerciseItem = React.memo(({ exercise, index, formatDuration }) => {
  const ExerciseTypeIcon = exerciseTypeIcons[exercise.type] || FaDumbbell;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Coluna da Mídia */}
        <div className="md:col-span-1 p-4 md:p-0 md:pr-0">
          <MediaThumbnail media={exercise.mediaFile} className="w-full h-48 md:h-full md:rounded-l-2xl md:rounded-r-none" />
        </div>

        {/* Coluna de Conteúdo */}
        <div className="md:col-span-2 p-4 pt-0 md:pt-4">
          {/* Header do Exercício */}
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-bold text-gray-900 text-lg">
              {index + 1}. {exercise.name}
            </h4>
            <span className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
              <ExerciseTypeIcon />
              {translateExerciseType(exercise.type)}
            </span>
          </div>

          {/* Stats do Exercício */}
          <div className="flex flex-wrap gap-2 mb-4">
            <StatBadge icon={FaLayerGroup} value={exercise.sets} label="séries" />
            <StatBadge icon={FaRedo} value={exercise.reps} label="reps" />
            <StatBadge icon={FaClock} value={formatDuration(exercise.duration)} />
            <StatBadge icon={FaWeightHanging} value={exercise.weight} unit="kg" />
            <StatBadge icon={FaPauseCircle} value={formatDuration(exercise.restTime)} label="descanso" />
          </div>

          {/* Instruções */}
          {exercise.instructions && (
            <div className="mb-3">
              <h5 className="font-semibold text-gray-700 text-sm mb-1">Instruções:</h5>
              {/* Usamos 'prose' para formatar automaticamente parágrafos, listas, etc. */}
              <div className="prose prose-sm text-gray-600 max-w-none"
                   dangerouslySetInnerHTML={{ __html: exercise.instructions.replace(/\n/g, '<br />') }} />
            </div>
          )}

          {/* Equipamentos */}
          {exercise.equipment && exercise.equipment.length > 0 && (
            <div>
              <h5 className="font-semibold text-gray-700 text-sm mb-1 flex items-center gap-1.5">
                <FaTools className="text-gray-500" />
                Equipamento:
              </h5>
              <p className="text-sm text-gray-600">{exercise.equipment.join(', ')}</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
});

// --- Mapeamentos de Ícones e Traduções (Movidos para fora do componente) ---
const categoryIcons = {
  cardio: FaRunning,
  strength: FaDumbbell,
  hiit: FaFire,
  yoga: FaUser,
  pilates: FaHeartbeat,
  mobility: FaSnowflake,
  custom: FaDumbbell
};

const exerciseTypeIcons = {
  strength: FaWeightHanging,
  cardio: FaRunning,
  bodyweight: FaUser,
  flexibility: FaSnowflake,
  warmup: FaFire,
  cooldown: FaHeartbeat,
  default: FaDumbbell
};

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

const translateDifficulty = (difficulty) => {
  const translations = {
    beginner: 'Iniciante',
    intermediate: 'Intermediário',
    advanced: 'Avançado'
  };
  return translations[difficulty] || difficulty;
};

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

// --- Funções de Formatação de Duração Aprimoradas ---
const formatTotalDuration = (seconds) => {
  if (!seconds) return '0 min';
  const m = Math.floor(seconds / 60);
  const h = Math.floor(m / 60);
  if (h > 0) return `${h}h ${m % 60}min`;
  return `${m} min`;
};

const formatExerciseDuration = (seconds) => {
  if (!seconds || seconds <= 0) return null; // Retorna nulo para o StatBadge ignorar
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m > 0) return `${m}min ${s > 0 ? `${s}s` : ''}`;
  return `${s}s`;
};


// --- Componente Principal: WorkoutViewModal ---
const WorkoutViewModal = ({ workout, isOpen, onClose }) => {
  if (!isOpen || !workout) return null;

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
            className="fixed inset-0 bg-black/70 h-full z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div 
              className="bg-gray-50 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white flex-shrink-0">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg rounded-2xl">
                      <CategoryIcon className="text-2xl" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{workout.name}</h2>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium">
                          {translateCategory(workout.category)}
                        </span>
                        <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium">
                          {translateDifficulty(workout.difficulty)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 -mr-2 text-blue-100 hover:bg-white/20 rounded-xl transition-colors"
                    title="Fechar"
                  >
                    <FaTimes className="text-xl" />
                  </button>
                </div>

                {workout.description && (
                  <p className="mt-4 text-blue-100/90 text-base">
                    {workout.description}
                  </p>
                )}
              </div>

              {/* === ÁREA DE CONTEÚDO COM SCROLL === */}
              <div className="overflow-y-auto flex-1 bg-white">
                
                {/* Stats (Redesenhados) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-gray-50 border-b border-gray-200">
                  <StatCard icon={FaDumbbell} label="Exercícios" value={totalExercises} color="blue" />
                  <StatCard icon={FaClock} label="Duração Total" value={formatTotalDuration(totalDuration)} color="green" />
                  <StatCard icon={FaFire} label="Intensidade" value={translateDifficulty(workout.difficulty)} color="orange" />
                </div>

                {/* Exercises List */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Rotina de Exercícios
                  </h3>

                  {!workout.exercises || workout.exercises.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">
                      <FaDumbbell className="text-4xl mx-auto mb-3 text-gray-300" />
                      <p>Nenhum exercício adicionado a este treino.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {workout.exercises.map((exercise, index) => (
                        <ExerciseItem
                          key={exercise._id || index}
                          exercise={exercise}
                          index={index}
                          formatDuration={formatExerciseDuration}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end flex-shrink-0">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors font-medium text-sm"
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

// --- Sub-componente: StatCard (Para a barra de stats principal) ---
const StatCard = ({ icon: Icon, label, value, color }) => {
  const colors = {
    blue: 'text-blue-600 bg-blue-50',
    green: 'text-green-600 bg-green-50',
    orange: 'text-orange-600 bg-orange-50',
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center space-x-3">
      <div className={`p-3 rounded-lg ${colors[color] || colors.blue}`}>
        <Icon className="text-xl" />
      </div>
      <div>
        <div className="text-sm text-gray-500 font-medium">{label}</div>
        <div className="text-xl font-bold text-gray-900 capitalize">{value}</div>
      </div>
    </div>
  );
};

export default React.memo(WorkoutViewModal);