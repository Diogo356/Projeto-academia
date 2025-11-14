// src/components/workout/ActiveWorkout.jsx - DESIGN VISUAL RENOVADO E POLIDO

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FaClock,
  FaBullseye,
  FaListAlt,
  FaCheck,
  FaSync,
  FaRunning,
  FaSpinner,
  FaPlayCircle
} from 'react-icons/fa';
import {
  GiMuscleUp,
  GiDuration,
} from 'react-icons/gi';
import {
  MdFitnessCenter,
  MdOndemandVideo,
  MdPlaylistPlay,
  MdTipsAndUpdates,
  MdError,
  MdCircle
} from 'react-icons/md';
import WorkoutHeader from './WorkoutHeader';
import workoutService from '../../services/workoutService';

// --- Sub-Componente para Dicas ---
const ExerciseTips = ({ tips, type }) => (
  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 lg:p-6 h-full">
    <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-4 flex items-center">
      <MdTipsAndUpdates className="w-5 h-5 mr-2 text-yellow-500" />
      Dicas do Exercício
      <span className="ml-2 text-sm font-normal text-gray-500 capitalize">
        ({type})
      </span>
    </h3>
    {/* ⭐️ MUDANÇA: Adicionadas classes de scrollbar customizado (requer 'tailwind-scrollbar') */}
    <ul className="space-y-3 overflow-y-auto max-h-[200px] pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
      {tips && tips.length > 0 ? (
        tips.map((tip, index) => (
          <li key={index} className="flex items-start text-gray-700 text-sm">
            <MdCircle className="w-3 h-3 mt-1 mr-2 flex-shrink-0 text-yellow-500" />
            <span>{tip}</span>
          </li>
        ))
      ) : (
        <li className="text-gray-500 italic">Nenhuma dica específica disponível.</li>
      )}
    </ul>
  </div>
);
// --- Fim do Sub-Componente ---

// --- Sub-Componente para Mídia ---
const ExerciseMedia = ({ videoUrl, exerciseName }) => {
  const isVideo = videoUrl && videoUrl.match(/\.(mp4|webm|ogg|mov)$/i);
  const isGif = videoUrl && videoUrl.match(/\.(gif)$/i);

  if (isVideo) {
    return (
      <video
        key={videoUrl}
        src={videoUrl}
        // ⭐️ MUDANÇA: 'object-contain' para garantir que o vídeo inteiro apareça, sem cortes
        className="w-full h-full object-contain absolute top-0 left-0"
        autoPlay
        loop
        muted
        playsInline
        title={`Demonstração de ${exerciseName}`}
      />
    );
  }

  if (isGif || videoUrl) {
    return (
      <img
        key={videoUrl}
        src={videoUrl}
        alt={`Demonstração de ${exerciseName}`}
        className="w-full h-full object-contain absolute top-0 left-0"
      />
    );
  }

  return (
    <div className="text-center text-white p-4 flex flex-col justify-center items-center h-full">
      <MdOndemandVideo className="text-6xl mb-4 mx-auto text-blue-400" />
      <p className="text-xl font-semibold mb-2">Demonstração Indisponível</p>
      <p className="text-gray-300 text-base">
        Nenhuma mídia encontrada para este exercício.
      </p>
    </div>
  );
};
// --- Fim do Sub-Componente ---


// --- Funções Auxiliares (Sem alterações) ---
const getFallbackMedia = (type) => {
  // ... (lógica mantida)
  const media = {
    cardio: '/videos/cardio-demo.mp4',
    strength: '/videos/strength-demo.mp4',
    hiit: '/videos/hiit-demo.mp4',
    yoga: '/videos/yoga-demo.mp4',
    pilates: '/videos/pilates-demo.mp4',
    mobility: '/videos/mobility-demo.mp4',
    warmup: '/gifs/warmup-demo.gif'
  };
  return media[type] || '/videos/default-demo.mp4';
};

const getFallbackTips = (type) => {
  // ... (lógica mantida)
  const tipsByType = {
    cardio: [
      'Mantenha uma postura ereta durante todo o exercício',
      'Controle sua respiração - inspire pelo nariz, expire pela boca',
      'Ajuste a intensidade conforme seu condicionamento',
    ],
    strength: [
      'Mantenha o core contraído durante o movimento',
      'Execute o movimento de forma controlada',
      'Não trave as articulações no final do movimento',
    ],
    warmup: [
      'Comece com movimentos leves e controlados.',
      'Aumente a amplitude gradualmente.',
      'Siga o ritmo do seu corpo, sem forçar.',
    ],
  };
  const defaultTips = [
    'Mantenha a postura correta', 'Respire de forma constante', 'Beba água',
  ];
  return tipsByType[type] || defaultTips;
};
// --- Fim das Funções Auxiliares ---

const ActiveWorkout = () => {
  // --- LÓGICA DO COMPONENTE (Toda mantida, sem alterações) ---

  const { publicId } = useParams();
  const navigate = useNavigate();
  const [workoutData, setWorkoutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showCountdown, setShowCountdown] = useState(true);
  const [countdown, setCountdown] = useState(5);

  const exerciseListRef = useRef(null);
  const exerciseRefs = useRef([]);


  // ... (Toda a lógica de useEffect, fetch, timers, etc., permanece a mesma) ...

  // Buscar dados do treino
  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        setLoading(true);
        const workout = await workoutService.getWorkoutById(publicId);

        if (!workout || !workout.exercises || workout.exercises.length === 0) {
          throw new Error('Treino não encontrado ou não contém exercícios.');
        }

        const transformedWorkout = {
          ...workout,
          exercises: workout.exercises?.map((exercise, index) => {
            const exerciseTips = Array.isArray(exercise.tips) && exercise.tips.length > 0
              ? exercise.tips
              : getFallbackTips(exercise.type);

            const mediaUrl = exercise.mediaFile?.url || getFallbackMedia(exercise.type);

            return {
              ...exercise,
              id: exercise.id || index + 1,
              duration: exercise.duration > 0 ? exercise.duration : 60,
              type: exercise.type || 'strength',
              video: mediaUrl,
              tips: exerciseTips,
              completed: false
            };
          }) || []
        };

        console.log('Dados do Treino Transformados:', transformedWorkout);
        setWorkoutData(transformedWorkout);
        setTimeRemaining(transformedWorkout.exercises[0].duration);

      } catch (err) {
        console.error('Erro ao carregar treino:', err);
        setError(err.message || 'Erro ao carregar treino');
      } finally {
        setLoading(false);
      }
    };

    if (publicId) {
      fetchWorkout();
    } else {
      setError('ID do treino não fornecido');
      setLoading(false);
    }
  }, [publicId]);

  // Countdown para iniciar
  useEffect(() => {
    if (!workoutData || !showCountdown) return;

    const countdownTimer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownTimer);
          setShowCountdown(false);
          startWorkout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownTimer);
  }, [workoutData, showCountdown]);

  // Timer do exercício atual
  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          completeExercise();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, timeRemaining]);


  // ROLAGEM AUTOMÁTICA
  useEffect(() => {
    if (exerciseRefs.current[currentExerciseIndex]) {
      exerciseRefs.current[currentExerciseIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [currentExerciseIndex]);

  const startWorkout = () => {
    if (!workoutData?.exercises?.length) return;
    setIsRunning(true);
  };

  const completeExercise = () => {
    if (!workoutData) return;

    const updatedExercises = workoutData.exercises.map((ex, index) =>
      index === currentExerciseIndex ? { ...ex, completed: true } : ex
    );

    const nextIndex = currentExerciseIndex + 1;

    setWorkoutData(prev => ({ ...prev, exercises: updatedExercises }));

    if (nextIndex < workoutData.exercises.length) {
      setCurrentExerciseIndex(nextIndex);
      setTimeRemaining(workoutData.exercises[nextIndex].duration);
    } else {
      setIsRunning(false);
      setTimeout(() => {
        alert('🎉 Treino concluído com sucesso!');
        navigate('/workout');
      }, 1000);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // --- FIM DA LÓGICA ---


  // --- Telas de Loading, Erro e Countdown (Sem alterações) ---
  if (loading) {
    return (
      <div className="h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <FaSpinner className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-spin" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Preparando Treino</h3>
          <p className="text-gray-600">Carregando sua sessão...</p>
        </div>
      </div>
    );
  }

  if (error || !workoutData) {
    return (
      <div className="h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <MdError className="w-16 h-16 mx-auto text-red-500 mb-4" />
          <h3 className="text-xl font-bold text-red-800 mb-2">Erro ao Carregar Treino</h3>
          <p className="text-red-600 mb-6">{error || 'Treino não encontrado'}</p>
          <button
            onClick={() => navigate('/workout')}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Voltar para Lista de Treinos
          </button>
        </div>
      </div>
    );
  }

  {
    showCountdown && (
      <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
        <div className="text-center text-white">
          <div className="text-8xl font-bold mb-4 animate-pulse">{countdown}</div>
          <p className="text-xl">Preparando seu treino...</p>
          <p className="text-gray-300 mt-2">O treino começará automaticamente</p>
        </div>
      </div>
    )
  }

  // --- VARIÁVEIS DE RENDERIZAÇÃO ---
  const currentExercise = workoutData.exercises[currentExerciseIndex];
  const exerciseProgress = (currentExercise.duration > 0)
    ? ((currentExercise.duration - timeRemaining) / currentExercise.duration) * 100
    : 0;

  // ⭐️ MUDANÇA: Lógica da cor do timer para feedback de urgência
  const timerColor = timeRemaining <= 5
    ? 'text-red-600' // Últimos 5 seg
    : timeRemaining <= 10
      ? 'text-yellow-600' // Últimos 10 seg
      : 'text-blue-600'; // Cor padrão


  // ***************************************************************
  // *** AQUI COMEÇA O NOVO LAYOUT VISUAL ***
  // ***************************************************************
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header (Mantido) */}
      <div className="flex-shrink-0">
        <WorkoutHeader
          workout={workoutData}
          currentExercise={currentExercise}
        />
      </div>

      {/* Conteúdo Principal (Layout de 2 Colunas) */}
      <div className="flex-1 overflow-hidden p-4 lg:p-6">
        {/* ⭐️ MUDANÇA: Layout de 2 colunas ativa em 'lg' (tablets) em vez de 'xl' */}
        <div className="h-full max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 h-full">

          {/* 1. COLUNA DA MÍDIA (FOCO PRINCIPAL) */}
          <div className="lg:col-span-7 2xl:col-span-8 h-full">
            <div className="bg-gray-900 rounded-2xl shadow-xl border border-gray-200 overflow-hidden h-full flex items-center justify-center relative min-h-[40vh] lg:min-h-0">
              <ExerciseMedia
                videoUrl={currentExercise.video}
                exerciseName={currentExercise.name}
              />

              {/* ⭐️ MUDANÇA: Status flutuante agora é 'lg:hidden' (escondido em telas grandes) */}
              <div className="absolute lg:hidden top-3 left-3 bg-black bg-opacity-60 text-white px-3 py-1 rounded-lg z-10 text-sm flex items-center">
                <FaRunning className="w-4 h-4 mr-2 text-blue-300" />
                Em Andamento
              </div>
            </div>
          </div>

          {/* 2. PAINEL DE CONTROLE (BARRA LATERAL) */}
          {/* ⭐️ MUDANÇA: Ativa em 'lg' (tablets) em vez de 'xl' */}
          <div className="lg:col-span-5 2xl:col-span-4 h-full flex flex-col gap-4 lg:gap-6">

            {/* Card: Em Andamento */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 lg:p-6">
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-sm font-semibold text-blue-600 flex items-center">
                  <FaPlayCircle className="w-4 h-4 mr-2" />
                  EM ANDAMENTO
                </h3>
  _               <span className="text-sm font-medium text-gray-500">
                  {currentExerciseIndex + 1} / {workoutData.exercises.length}
                </span>
              </div>

              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mt-2 mb-4 truncate">
                {currentExercise.name}
              </h2>

              <div className="text-center my-4">
                {/* ⭐️ MUDANÇA: Cor do timer é dinâmica (timerColor) e transição suave */}
                <div className={`text-6xl lg:text-7xl font-mono font-extrabold ${timerColor} transition-colors duration-300`}>
                  {formatTime(timeRemaining)}
                </div>
                <p className="text-sm text-gray-500">Tempo Restante</p>
              </div>

              {/* Barra de Progresso do Exercício */}
              <div className="w-full bg-gray-200 rounded-full h-3 my-2">
                {/* ⭐️ MUDANÇA: Transição mais rápida e linear (ease-linear) */}
                <div
                  className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-300 ease-linear"
                  style={{ width: `${exerciseProgress}%` }}
                ></div>
              </div>
            </div>

            {/* ⭐️ MUDANÇA: Card de Dicas movido para cá (visível em todos os tamanhos) */}
            <div className="flex-shrink-0">
              <ExerciseTips
                tips={currentExercise.tips}
                type={currentExercise.type}
              />
            </div>

            {/* Card: Lista de Exercícios (Vertical) */}
            {/* ⭐️ MUDANÇA: 'flex-1' e 'min-h-0' garantem que ele preencha o espaço restante */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 lg:p-6 flex-1 flex flex-col min-h-0">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <MdPlaylistPlay className="w-5 h-5 mr-2 text-gray-500" />
                Próximos Exercícios
              </h3>

              {/* ⭐️ MUDANÇA: Adicionadas classes de scrollbar customizado */}
              <div
          _       ref={exerciseListRef}
                className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
              >
                {workoutData.exercises.map((exercise, index) => {
                  const isActive = index === currentExerciseIndex;
                  const isCompleted = exercise.completed;

                  return (
                    <div
                      key={exercise.id}
                      ref={el => exerciseRefs.current[index] = el}
                      className={`w-full flex items-center p-3 rounded-xl border-2 transition-all duration-300
                        ${isActive
                          ? 'bg-blue-50 border-blue-400 shadow-md'
                          : isCompleted
                            ? 'bg-green-50 border-green-200'
                            : 'bg-gray-50 border-gray-200'
                        }`}
                    >
                      {/* Número e Ícone */}
                      <div className={`w-9 h-9 mr-3 rounded-full flex-shrink-0 flex items-center justify-center font-bold
                          ${isActive
                          ? 'bg-blue-600 text-white'
                          : isCompleted
                            ? 'bg-green-500 text-white'
                           : 'bg-gray-400 text-white'
                        }`}>
                        {isCompleted ? <FaCheck size={14} /> : (index + 1)}
                      </div>

                      {/* Nome e Duração */}
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-bold text-sm lg:text-base truncate ${isActive ? 'text-blue-700' : isCompleted ? 'text-green-700' : 'text-gray-700'
                          }`}>
                          {exercise.name}
                        </h4>
                        <p className="text-xs text-gray-500 flex items-center gap-2">
                          <span className="flex items-center"><GiMuscleUp className="mr-1" /> {exercise.type}</span>
                          <span className="flex items-center"><GiDuration className="mr-1" /> {formatTime(exercise.duration)}</span>
                        </p>
                      </div>

                      {isActive && (
                        <FaSync className="w-4 h-4 ml-2 text-blue-500 animate-spin" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ⭐️ MUDANÇA: O card de dicas foi movido para CIMA da lista, este div 'hidden' foi removido. */}

          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveWorkout;