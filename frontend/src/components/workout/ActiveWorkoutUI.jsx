import React from 'react';
import {
  FaDumbbell, FaClock, FaBullseye, FaListAlt, FaCheck,
  FaSync, FaRunning
} from 'react-icons/fa';
import { GiMuscleUp, GiDuration, GiTargeted } from 'react-icons/gi';
import { MdFitnessCenter, MdPlaylistPlay } from 'react-icons/md';
import WorkoutHeader from './WorkoutHeader';
import ExerciseMedia from './ExerciseMedia';
import ExerciseTips from './ExerciseTips';
import { formatTime } from '../../utils/workoutUtils'; // Importa o util

// Este é um componente puramente de apresentação
const ActiveWorkoutUI = ({
  workoutData,
  currentExercise,
  currentExerciseIndex,
  timeRemaining,
  progressPercentage,
  exerciseListRef,
  exerciseRefs,
}) => {

  // Evita divisão por zero se a duração for 0
  const exerciseProgress = (currentExercise.duration > 0)
    ? ((currentExercise.duration - timeRemaining) / currentExercise.duration) * 100
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0">
        <WorkoutHeader
          workout={workoutData}
          currentExercise={currentExercise}
        />
      </div>

      {/* Conteúdo Principal */}
      <div className="flex-1 overflow-y-auto pt-4 pb-12">
        <div className="h-full max-w-[1920px] mx-auto px-4">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 h-full">

            {/* Coluna Principal (Card do Exercício Atual) */}
            <div className="xl:col-span-8 flex flex-col h-full">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4 lg:p-6 xl:p-8 flex flex-col">

                {/* Header e Stats */}
                <div className="text-center mb-4 lg:mb-6 xl:mb-8">
                  <h2 className="text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold text-gray-900 mb-2">
                    {currentExercise.name}
                  </h2>
                  <div className="flex flex-wrap justify-center items-center gap-3 lg:gap-6 text-sm lg:text-lg text-gray-600">
                    <span className="flex items-center space-x-2">
                      <FaDumbbell className="w-4 h-4 text-gray-500" />
                      <span className="capitalize">{currentExercise.type}</span>
                    </span>
                    <span className="flex items-center space-x-2">
                      <FaClock className="w-4 h-4 text-gray-500" />
                      <span>{formatTime(currentExercise.duration)}</span>
                    </span>
                    <span className="flex items-center space-x-2">
                      <FaBullseye className="w-4 h-4 text-gray-500" />
                      <span>{currentExerciseIndex + 1}/{workoutData.exercises.length}</span>
                    </span>
                  </div>
                </div>

                {/* Cronômetro */}
                <div className="flex-1 flex flex-col justify-center items-center mb-4 lg:mb-8">
                  <div className="text-5xl lg:text-7xl xl:text-9xl font-mono font-extrabold text-blue-600 mb-4 xl:mb-6">
                    {formatTime(timeRemaining)}
                  </div>
                  <p className="text-base lg:text-xl text-gray-600">
                    Tempo Restante do Exercício
                  </p>
                </div>

                {/* Barra de Progresso do Exercício */}
                <div className="mb-4 lg:mb-8">
                  <div className="flex justify-between text-sm lg:text-base text-gray-600 mb-3">
                    <span className="font-semibold">Progresso do Exercício</span>
                    <span className="font-mono">{Math.round(exerciseProgress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 xl:h-4">
                    <div
                      className="bg-gradient-to-r from-green-500 to-green-600 h-3 xl:h-4 rounded-full transition-all duration-1000"
                      style={{ width: `${exerciseProgress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Stats Rápidas (Progresso Total) */}
                <div className="grid grid-cols-3 gap-3 lg:gap-6">
                  <div className="text-center p-3 lg:p-5 bg-blue-50 rounded-xl">
                    <div className="text-lg lg:text-3xl font-bold text-blue-600">
                      {currentExerciseIndex + 1}
                    </div>
                    <div className="text-xs lg:text-sm text-gray-600 mt-1 flex items-center justify-center">
                      <MdFitnessCenter className="w-3 h-3 mr-1" />
                      Exercício
                    </div>
                  </div>
                  <div className="text-center p-3 lg:p-5 bg-green-50 rounded-xl">
                    <div className="text-lg lg:text-3xl font-bold text-green-600">
                      {workoutData.exercises.length}
                    </div>
                    <div className="text-xs lg:text-sm text-gray-600 mt-1 flex items-center justify-center">
                      <FaListAlt className="w-3 h-3 mr-1" />
                      Total
                    </div>
                  </div>
                  <div className="text-center p-3 lg:p-5 bg-purple-50 rounded-xl">
                    <div className="text-lg lg:text-3xl font-bold text-purple-600">
                      {Math.round(progressPercentage)}%
                    </div>
                    <div className="text-xs lg:text-sm text-gray-600 mt-1 flex items-center justify-center">
                      <GiTargeted className="w-3 h-3 mr-1" />
                      Completo
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Coluna da Mídia */}
            <div className="xl:col-span-4 flex flex-col h-full gap-4">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden flex-1 flex flex-col min-h-0">
                <div className="flex-1 bg-gray-900 flex items-center justify-center relative min-h-[300px] lg:min-h-[400px]">
                  <ExerciseMedia
                    videoUrl={currentExercise.video}
                    exerciseName={currentExercise.name}
                  />
                </div>
                <div className="p-2 lg:p-4 bg-gray-800 text-white">
                  <div className="flex justify-between items-center">
                    <span className="text-xs lg:text-sm flex items-center">
                      <FaRunning className="w-3 h-3 mr-1 text-blue-400" />
                      Exercício em Andamento
                    </span>
                    <span className="text-sm lg:text-lg font-mono font-bold text-blue-300">
                      {formatTime(timeRemaining)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Lista de Exercícios e Dicas */}
          <div className="mt-4">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">

              {/* Lista de Exercícios */}
              <div className="xl:col-span-8">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4 lg:p-6">
                  <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <MdPlaylistPlay className="w-5 h-5 mr-2 text-blue-500" />
                    Lista de Exercícios
                    <span className="ml-2 text-sm font-normal text-gray-500">
                      ({currentExerciseIndex + 1} de {workoutData.exercises.length})
                    </span>
                  </h3>

                  <div
                    ref={exerciseListRef}
                    className="overflow-x-auto snap-x snap-mandatory hide-scrollbar"
                  >
                    <div className="flex space-x-4 lg:space-x-5 pb-1 min-w-max">
                      {workoutData.exercises.map((exercise, index) => (
                        <div
                          key={exercise.id}
                          ref={el => exerciseRefs.current[index] = el}
                          className={`flex-shrink-0 w-64 lg:w-72 px-4 pt-4 rounded-xl border-2 transition-all duration-300 snap-center
                            ${index === currentExerciseIndex
                              ? 'bg-blue-50 border-blue-400 shadow-xl scale-[1.02] border-4'
                              : exercise.completed
                                ? 'bg-green-50 border-green-300'
                                : 'bg-gray-50 border-gray-200'
                            }`}
                        >
                          {/* Header com número e status */}
                          <div className="flex items-center justify-between mb-1">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${index === currentExerciseIndex
                              ? 'bg-blue-600 text-white shadow-md'
                              : exercise.completed
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-400 text-white'
                              }`}>
                              {index + 1}
                            </div>

                            {index === currentExerciseIndex && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                <FaSync className="w-3 h-3 mr-1 animate-spin" />
                                Em Andamento
                              </span>
                            )}
                            {exercise.completed && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <FaCheck className="w-3 h-3 mr-1" />
                                Concluído
                              </span>
                            )}
                          </div>

                          {/* Nome */}
                          <h4 className={`font-bold text-base lg:text-lg mb-3 truncate ${index === currentExerciseIndex
                              ? 'text-blue-700'
                              : exercise.completed
                                ? 'text-green-700'
                                : 'text-gray-700'
                            }`}>
          _                 {exercise.name}
                          </h4>

                          {/* Info */}
                          <div className="flex items-center justify-between gap-3 mb-3">
                            <div className="flex items-center gap-2">
                              <GiMuscleUp className="w-4 h-4 text-gray-500" />
                              {/* CORREÇÃO 1: Removido `_ _` */}
                              <span className="font-medium capitalize text-gray-700 text-sm">
                                {exercise.type}
                              </span>
              _             </div>
                            <div className="flex items-center gap-2">
                              <GiDuration className="w-4 h-4 text-gray-500" />
                              {/* CORREÇÃO 2: Removido o <div> extra */}
                              <span className="font-medium text-gray-700 text-sm">
                                {formatTime(exercise.duration)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
  
                  {/* CORREÇÃO 3: Tags </div> descomentadas */}
                </div> {/* Fecha div.bg-white */}
              </div> {/* Fecha div.xl:col-span-8 */}


              {/* Dicas */}
              <div className="xl:col-span-4">
                <ExerciseTips
                  tips={currentExercise.tips}
                  type={currentExercise.type}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveWorkoutUI;