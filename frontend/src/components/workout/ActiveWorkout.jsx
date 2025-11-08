// src/components/workout/ActiveWorkout.jsx
import React, { useState, useEffect } from 'react';
import ExerciseTimer from './ExerciseTimer';
import ExerciseInfo from './ExerciseInfo';
import ProgressBar from './ProgressBar';
import Controls from './Controls';
import WorkoutHeader from './WorkoutHeader';
import StatsGrid from './StatsGrid';
import ProfessionalMuscleView from './ProfessionalMuscleView';

const ActiveWorkout = () => {
  const [workoutData, setWorkoutData] = useState({
    currentExercise: {
      id: 1,
      name: 'Esteira Profissional',
      type: 'cardio',
      duration: 1800,
      completedTime: 0,
      calories: 0,
      speed: 6.0,
      incline: 1,
      distance: 0,
      heartRate: 72,
      pace: '10:00'
    },
    workout: {
      name: 'Treino Cardio Avançado',
      totalExercises: 4,
      currentExerciseIndex: 0,
      totalDuration: 3600,
      completedDuration: 0,
      exercises: [
        {
          id: 1,
          name: 'Esteira Profissional',
          duration: 1800,
          completed: false,
          type: 'cardio',
          icon: '🏃‍♂️'
        },
        {
          id: 2,
          name: 'Bicicleta Ergométrica',
          duration: 1200,
          completed: false,
          type: 'cardio',
          icon: '🚴‍♂️'
        },
        {
          id: 3,
          name: 'Elíptico',
          duration: 900,
          completed: false,
          type: 'cardio', 
          icon: '👟'
        },
        {
          id: 4,
          name: 'Remo',
          duration: 900,
          completed: false,
          type: 'strength',
          icon: '🚣‍♂️'
        }
      ]
    },
    isRunning: false,
    isPaused: false,
    sessionStart: null
  });

  const [time, setTime] = useState(0);

  useEffect(() => {
    let interval;
    if (workoutData.isRunning && !workoutData.isPaused) {
      interval = setInterval(() => {
        setTime(prev => {
          const newTime = prev + 1;
          
          if (newTime % 3 === 0) {
            setWorkoutData(prev => ({
              ...prev,
              currentExercise: {
                ...prev.currentExercise,
                completedTime: newTime,
                distance: (newTime / 60) * (prev.currentExercise.speed / 60),
                calories: Math.floor(newTime * 0.12),
                heartRate: 72 + Math.floor(newTime / 30) * 2,
                pace: `${Math.floor(60 / prev.currentExercise.speed)}:${String(Math.floor((60 / prev.currentExercise.speed % 1) * 60)).padStart(2, '0')}`
              },
              workout: {
                ...prev.workout,
                completedDuration: newTime
              }
            }));
          }
          
          return newTime;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [workoutData.isRunning, workoutData.isPaused]);

  const handleStart = () => {
    setWorkoutData(prev => ({ 
      ...prev, 
      isRunning: true, 
      isPaused: false,
      sessionStart: new Date()
    }));
  };

  const handlePause = () => {
    setWorkoutData(prev => ({ ...prev, isPaused: true }));
  };

  const handleResume = () => {
    setWorkoutData(prev => ({ ...prev, isPaused: false }));
  };

  const handleStop = () => {
    setWorkoutData(prev => ({ 
      ...prev, 
      isRunning: false, 
      isPaused: false 
    }));
    setTime(0);
  };

  const handleComplete = () => {
    const nextExerciseIndex = workoutData.workout.currentExerciseIndex + 1;
    
    if (nextExerciseIndex < workoutData.workout.exercises.length) {
      const updatedExercises = workoutData.workout.exercises.map((ex, index) => 
        index === workoutData.workout.currentExerciseIndex 
          ? { ...ex, completed: true }
          : ex
      );

      const nextExercise = updatedExercises[nextExerciseIndex];
      setWorkoutData(prev => ({
        ...prev,
        currentExercise: {
          ...nextExercise,
          completedTime: 0,
          calories: 0,
          distance: 0,
          speed: nextExercise.type === 'cardio' ? 6.0 : 0,
          incline: nextExercise.type === 'cardio' ? 1 : 0,
          heartRate: 72,
          pace: '00:00'
        },
        workout: {
          ...prev.workout,
          exercises: updatedExercises,
          currentExerciseIndex: nextExerciseIndex
        },
        isRunning: false,
        isPaused: false
      }));
      setTime(0);
    } else {
      const updatedExercises = workoutData.workout.exercises.map((ex, index) => 
        index === workoutData.workout.currentExerciseIndex 
          ? { ...ex, completed: true }
          : ex
      );
      
      setWorkoutData(prev => ({
        ...prev,
        workout: {
          ...prev.workout,
          exercises: updatedExercises
        }
      }));
      
      alert('🎉 Parabéns! Treino concluído com sucesso!');
      handleStop();
    }
  };

  const handleSpeedChange = (newSpeed) => {
    setWorkoutData(prev => ({
      ...prev,
      currentExercise: {
        ...prev.currentExercise,
        speed: newSpeed
      }
    }));
  };

  const handleInclineChange = (newIncline) => {
    setWorkoutData(prev => ({
      ...prev,
      currentExercise: {
        ...prev.currentExercise,
        incline: newIncline
      }
    }));
  };

  const handleExerciseChange = (exerciseId) => {
    const exercise = workoutData.workout.exercises.find(ex => ex.id === exerciseId);
    if (exercise) {
      setWorkoutData(prev => ({
        ...prev,
        currentExercise: {
          ...exercise,
          completedTime: 0,
          calories: 0,
          distance: 0,
          speed: exercise.type === 'cardio' ? 6.0 : 0,
          incline: exercise.type === 'cardio' ? 1 : 0,
          heartRate: 72,
          pace: '00:00'
        },
        isRunning: false,
        isPaused: false
      }));
      setTime(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 lg:p-6">
      <div className="max-w-8xl mx-auto">
        
        {/* Header Corporativo */}
        <WorkoutHeader 
          workout={workoutData.workout}
          currentExercise={workoutData.currentExercise}
        />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6 mt-6">
          
          {/* COLUNA 1: Timer + Controles + Progresso */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 lg:p-8">
              
              {/* Timer e Controles */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
                <div className="flex flex-col items-center">
                  <ExerciseTimer 
                    time={time}
                    duration={workoutData.currentExercise.duration}
                    isRunning={workoutData.isRunning}
                    isPaused={workoutData.isPaused}
                  />
                </div>
                
                <div className="space-y-4 lg:space-y-6">
                  <ExerciseInfo exercise={workoutData.currentExercise} />
                  
                  <Controls 
                    isRunning={workoutData.isRunning}
                    isPaused={workoutData.isPaused}
                    onStart={handleStart}
                    onPause={handlePause}
                    onResume={handleResume}
                    onStop={handleStop}
                    onComplete={handleComplete}
                    onSpeedChange={handleSpeedChange}
                    onInclineChange={handleInclineChange}
                    currentSpeed={workoutData.currentExercise.speed}
                    currentIncline={workoutData.currentExercise.incline}
                  />
                </div>
              </div>

              {/* Barra de Progresso */}
              <div className="mt-6 lg:mt-8">
                <ProgressBar 
                  current={time}
                  total={workoutData.currentExercise.duration}
                />
              </div>

              {/* Grid de Estatísticas */}
              <div className="mt-6 lg:mt-8">
                <StatsGrid 
                  exercise={workoutData.currentExercise}
                  workout={workoutData.workout}
                />
              </div>
            </div>
          </div>

          {/* COLUNA 2: Sidebar com Anatomia + Exercícios */}
          <div className="space-y-4 lg:space-y-6">
            
            {/* Anatomia - Agora mais compacta */}
            <ProfessionalMuscleView 
              exercise={workoutData.currentExercise}
            />

            {/* Lista de Exercícios + Configurações em uma única card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
              
              {/* Sequência do Treino */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  📋 Sequência do Treino
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {workoutData.workout.exercises.map((exercise, index) => (
                    <div 
                      key={exercise.id}
                      className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-all ${
                        workoutData.workout.currentExerciseIndex === index 
                          ? 'bg-blue-50 border border-blue-200' 
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                      onClick={() => handleExerciseChange(exercise.id)}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                        workoutData.workout.currentExerciseIndex === index 
                          ? 'bg-blue-500 text-white' 
                          : exercise.completed 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-gray-200 text-gray-600'
                      }`}>
                        {exercise.completed ? '✓' : exercise.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`font-medium text-sm truncate ${
                          workoutData.workout.currentExerciseIndex === index 
                            ? 'text-blue-700' 
                            : exercise.completed 
                              ? 'text-green-700'
                              : 'text-gray-700'
                        }`}>
                          {exercise.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {Math.floor(exercise.duration / 60)} min • {exercise.type}
                        </div>
                      </div>
                      {workoutData.workout.currentExerciseIndex === index && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Configurações da Esteira */}
              <div className="mb-6">
                <h3 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                  Configurações
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Velocidade (km/h)
                    </label>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleSpeedChange(Math.max(1, workoutData.currentExercise.speed - 0.5))}
                        className="btn btn-xs btn-outline btn-square"
                      >
                        -
                      </button>
                      <span className="font-mono text-md font-bold text-gray-900 min-w-10 text-center">
                        {workoutData.currentExercise.speed.toFixed(1)}
                      </span>
                      <button 
                        onClick={() => handleSpeedChange(Math.min(20, workoutData.currentExercise.speed + 0.5))}
                        className="btn btn-xs btn-outline btn-square"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Inclinação (%)
                    </label>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleInclineChange(Math.max(0, workoutData.currentExercise.incline - 1))}
                        className="btn btn-xs btn-outline btn-square"
                      >
                        -
                      </button>
                      <span className="font-mono text-md font-bold text-gray-900 min-w-10 text-center">
                        {workoutData.currentExercise.incline}
                      </span>
                      <button 
                        onClick={() => handleInclineChange(Math.min(15, workoutData.currentExercise.incline + 1))}
                        className="btn btn-xs btn-outline btn-square"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progresso do Treino */}
              <div>
                <h3 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                  Progresso
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Tempo:</span>
                    <span className="font-medium">
                      {Math.floor(workoutData.workout.completedDuration / 60)}min
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Exercícios:</span>
                    <span className="font-medium">
                      {workoutData.workout.currentExerciseIndex + 1}/{workoutData.workout.totalExercises}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Calorias:</span>
                    <span className="font-medium text-green-600">
                      {workoutData.currentExercise.calories} kcal
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                    <div 
                      className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${(workoutData.workout.currentExerciseIndex / workoutData.workout.totalExercises) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveWorkout;