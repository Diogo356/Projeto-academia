// src/components/workout/ActiveWorkout.jsx - COMPONENTE OTIMIZADO COM MÍDIA E DICAS CORRETAS
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FaDumbbell, 
  FaClock, 
  FaBullseye, 
  FaListAlt, 
  FaCheck,
  FaSync,
  FaRunning,
  FaSpinner
} from 'react-icons/fa';
import { 
  GiMuscleUp, 
  GiDuration,
  GiTargeted
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

// --- Sub-Componente para Dicas (MANTIDO) ---
const ExerciseTips = ({ tips, type }) => (
  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 lg:p-6 h-full">
    <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-4 flex items-center">
      <MdTipsAndUpdates className="w-5 h-5 mr-2 text-yellow-500" />
      Dicas do Exercício
      <span className="ml-2 text-sm font-normal text-gray-500 capitalize">
        ({type})
      </span>
    </h3>
    {/* <ul className="space-y-3 overflow-y-auto max-h-[300px] lg:max-h-[calc(100%-40px)] pr-2">
      {tips.length > 0 ? (
        tips.map((tip, index) => (
          <li key={index} className="flex items-start text-gray-700 text-sm lg:text-base">
            <MdCircle className="w-3 h-3 mt-1 mr-2 flex-shrink-0 text-yellow-500" />
            <span>{tip}</span>
          </li>
        ))
      ) : (
        <li className="text-gray-500 italic">Nenhuma dica específica disponível para este exercício.</li>
      )}
    </ul> */}
  </div>
);
// --- Fim do Sub-Componente ---

// --- Sub-Componente para Mídia (MANTIDO) ---
const ExerciseMedia = ({ videoUrl, exerciseName }) => {
  const isVideo = videoUrl && videoUrl.match(/\.(mp4|webm|ogg|mov)$/i);
  const isGif = videoUrl && videoUrl.match(/\.(gif)$/i);

  if (isVideo) {
    return (
      <video
        key={videoUrl}
        src={videoUrl}
        className="w-full h-full object-cover absolute top-0 left-0"
        autoPlay
        loop
        muted
        playsInline
        title={`Demonstração de ${exerciseName}`}
      >
        Seu navegador não suporta o elemento de vídeo.
      </video>
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
    <div className="text-center text-white p-4">
      <MdOndemandVideo className="text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl mb-2 lg:mb-3 xl:mb-4 mx-auto text-blue-400" />
      <p className="text-base lg:text-lg xl:text-xl 2xl:text-2xl font-semibold mb-1 lg:mb-2">Demonstração Indisponível</p>
      <p className="text-gray-300 text-xs lg:text-sm xl:text-base">
        Nenhuma mídia de demonstração encontrada para este exercício.
      </p>
    </div>
  );
};
// --- Fim do Sub-Componente ---


// --- Funções Auxiliares (AJUSTADAS) ---

/**
 * Retorna uma URL de vídeo/GIF fallback se o campo mediaFile estiver vazio.
 * NOTA: No seu caso, 'mediaFile.url' já foi mapeado corretamente para 'video'
 * no fetch, mas mantemos isso como um último recurso.
 */
const getFallbackMedia = (type) => {
    const media = {
      cardio: '/videos/cardio-demo.mp4',
      strength: '/videos/strength-demo.mp4',
      hiit: '/videos/hiit-demo.mp4',
      yoga: '/videos/yoga-demo.mp4',
      pilates: '/videos/pilates-demo.mp4',
      mobility: '/videos/mobility-demo.mp4',
      warmup: '/gifs/warmup-demo.gif' // Exemplo de um GIF fallback
    };
    return media[type] || '/videos/default-demo.mp4';
};


/**
 * Retorna dicas genéricas baseadas no tipo de exercício, usadas apenas
 * se o exercício NÃO tiver dicas específicas.
 * (Renomeada de getExerciseTips para getFallbackTips para clareza)
 */
const getFallbackTips = (type) => {
    const tipsByType = {
      cardio: [
        'Mantenha uma postura ereta durante todo o exercício',
        'Controle sua respiração - inspire pelo nariz, expire pela boca',
        'Ajuste a intensidade conforme seu condicionamento',
        // ... outras dicas cardio
      ],
      strength: [
        'Mantenha o core contraído durante o movimento',
        'Execute o movimento de forma controlada',
        'Não trave as articulações no final do movimento',
        // ... outras dicas strength
      ],
      warmup: [
        'Comece com movimentos leves e controlados.',
        'Aumente a amplitude gradualmente.',
        'Siga o ritmo do seu corpo, sem forçar.',
        // ... outras dicas warmup
      ],
      // ... (outros tipos)
    };

    const defaultTips = [
      'Mantenha a postura correta durante o exercício',
      'Respire de forma constante e controlada',
      'Beba água para manter-se hidratado',
      'Use roupas adequadas para a atividade',
      'Respeite seus limites e evolua gradualmente'
    ];

    // Se as dicas por tipo forem mais robustas, use-as. Caso contrário, use as default.
    return tipsByType[type] || defaultTips;
};
// --- Fim das Funções Auxiliares ---

const ActiveWorkout = () => {
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


  // Buscar dados do treino (LÓGICA AJUSTADA AQUI)
  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        setLoading(true);
        // Simulação do serviço real:
        // const workout = await workoutService.getWorkoutById(publicId);
        
        // Usando seus dados de exemplo (SIMULAÇÃO):
        const workout = {
            publicId: '0fd01bb2-9fd3-44c7-9f72-1e9447ee339c',
            name: 'aasfasfasf',
            description: 'asfasfasf',
            exercises: [
                {
                    completed: false,
                    duration: 120,
                    id: 1,
                    instructions: "asfasfasfasf",
                    mediaFile: {
                        url: 'https://res.cloudinary.com/df7cl2fvb/image/upload/v16763009948/exercise-media/vjzwiafbvwovxzduer1p.gif',
                        type: 'image',
                        name: 'fcdda54c67d2a13389eea05e4b150407.gif'
                    },
                    name: "safasfasf",
                    publicId: "e7fa15a1-ad7e-4836-b725-9518e438c0c5",
                    reps: 0,
                    restTime: 30,
                    sets: 1,
                    targetMuscles: [],
                    // Este é o array que você quer priorizar:
                    tips: ['Mantenha a postura correta durante o exercício', 'Respire de forma constante e controlada', 'Beba água para manter-se hidratado', 'Use roupas adequadas para a atividade', 'Respeite seus limites e evolua gradualmente'],
                    type: "warmup",
                    weight: 0
                }
            ]
        };

        const transformedWorkout = {
          ...workout,
          exercises: workout.exercises?.map((exercise, index) => {
            
            // 1. Dicas: Prioriza as dicas do objeto do exercício.
            const exerciseTips = Array.isArray(exercise.tips) && exercise.tips.length > 0
                ? exercise.tips
                : getFallbackTips(exercise.type); // Caso contrário, usa o fallback.

            // 2. Mídia: Usa a URL do mediaFile. Caso contrário, usa o fallback.
            const mediaUrl = exercise.mediaFile?.url || getFallbackMedia(exercise.type);

            return {
                ...exercise,
                id: exercise.id || index + 1,
                duration: exercise.duration || 60,
                type: exercise.type || 'strength',
                video: mediaUrl, // 'video' agora armazena a URL de vídeo ou GIF
                tips: exerciseTips,
                completed: false
            };
          }) || []
        };
        
        console.log('Dados do Treino Transformados:', transformedWorkout);
        setWorkoutData(transformedWorkout);

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

  // ... (Restante da Lógica (Countdown, Timer, completeExercise, etc.) - MANTIDO)

  // Countdown para iniciar automaticamente
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
    if (!isRunning || timeRemaining <= 0) return;

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


  // ROLAGEM AUTOMÁTICA do exercício atual
  useEffect(() => {
    if (exerciseRefs.current[currentExerciseIndex]) {
      exerciseRefs.current[currentExerciseIndex].scrollIntoView({
        behavior: 'smooth',
        inline: 'center' 
      });
    }
  }, [currentExerciseIndex]);

  const startWorkout = () => {
    if (!workoutData?.exercises?.length) return;

    const firstExercise = workoutData.exercises[0];
    setTimeRemaining(firstExercise.duration);
    setIsRunning(true);
  };

  const completeExercise = () => {
    if (!workoutData) return;

    const updatedExercises = workoutData.exercises.map((ex, index) =>
      index === currentExerciseIndex ? { ...ex, completed: true } : ex
    );

    const nextIndex = currentExerciseIndex + 1;

    if (nextIndex < workoutData.exercises.length) {
      setWorkoutData(prev => ({
        ...prev,
        exercises: updatedExercises
      }));

      setCurrentExerciseIndex(nextIndex);
      setTimeRemaining(workoutData.exercises[nextIndex].duration);
    } else {
      setWorkoutData(prev => ({
        ...prev,
        exercises: updatedExercises
      }));

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

  const getProgressPercentage = () => {
    if (!workoutData?.exercises?.length) return 0;
    return ((currentExerciseIndex + 1) / workoutData.exercises.length) * 100;
  };

  // ... (Estados de loading e error - MANTIDO)
  if (loading) {
    return (
      <div className="h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4">
            <FaSpinner className="w-8 h-8 text-blue-600 mx-auto" />
          </div>
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
          <div className="text-red-500 text-6xl mb-4">
            <MdError className="w-16 h-16 mx-auto" />
          </div>
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

  const currentExercise = workoutData.exercises[currentExerciseIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0">
        <WorkoutHeader
          workout={workoutData}
          currentExercise={currentExercise}
        />
      </div>

      {/* Countdown Overlay (OK) */}
      {showCountdown && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="text-center text-white">
            <div className="text-8xl font-bold mb-4">{countdown}</div>
            <p className="text-xl">Preparando seu treino...</p>
            <p className="text-gray-300 mt-2">O treino começará automaticamente</p>
          </div>
        </div>
      )}

      {/* Conteúdo Principal (MANTIDO) */}
      <div className="flex-1 overflow-y-auto pt-4 pb-12"> 
        <div className="h-full max-w-[1920px] mx-auto px-4">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 h-full">
            
            {/* Coluna Principal (Card do Exercício Atual) */}
            <div className="xl:col-span-8 flex flex-col h-full">
              <div className="grid grid-rows-[1fr] gap-4 h-full">

                {/* Card do Exercício Atual (MANTIDO) */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4 lg:p-6 xl:p-8 flex flex-col">
                  {/* ... (Header e Stats - MANTIDO) ... */}
                  <div className="text-center mb-4 lg:mb-6 xl:mb-8">
                    <h2 className="text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold text-gray-900 mb-2">
                      {currentExercise.name}
                    </h2>
                    <div className="flex flex-wrap justify-center items-center gap-3 lg:gap-4 xl:gap-6 text-sm lg:text-base xl:text-lg text-gray-600">
                      <span className="flex items-center space-x-1 lg:space-x-2">
                        <FaDumbbell className="w-4 h-4 text-gray-500" />
                        <span className="capitalize">{currentExercise.type}</span>
                      </span>
                      <span className="flex items-center space-x-1 lg:space-x-2">
                        <FaClock className="w-4 h-4 text-gray-500" />
                        <span>{Math.floor(currentExercise.duration / 60) || 1} min</span>
                      </span>
                      <span className="flex items-center space-x-1 lg:space-x-2">
                        <FaBullseye className="w-4 h-4 text-gray-500" />
                        <span>{currentExerciseIndex + 1}/{workoutData.exercises.length}</span>
                      </span>
                    </div>
                  </div>

                  {/* Área Central - Cronômetro (MANTIDO) */}
                  <div className="flex-1 flex flex-col justify-center items-center mb-4 lg:mb-6 xl:mb-8">
                    <div className="text-5xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-mono font-extrabold text-blue-600 mb-3 lg:mb-4 xl:mb-6 text-center leading-none">
                      {formatTime(timeRemaining)}
                    </div>
                    <p className="text-base lg:text-lg xl:text-xl 2xl:text-1xl text-gray-600 text-center">
                      Tempo Restante deste Exercício
                    </p>
                  </div>

                  {/* Barra de Progresso (MANTIDO) */}
                  <div className="mb-4 lg:mb-6 xl:mb-8">
                    <div className="flex justify-between text-sm lg:text-base xl:text-lg text-gray-600 mb-2 lg:mb-3 xl:mb-4">
                      <span className="font-semibold">Progresso do Exercício</span>
                      <span className="font-mono">
                         {Math.round(((currentExercise.duration - timeRemaining) / currentExercise.duration) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 lg:h-3 xl:h-4">
                      <div
                        className="bg-gradient-to-r from-green-500 to-green-600 h-2 lg:h-3 xl:h-4 rounded-full transition-all duration-1000 shadow-sm"
                        style={{
                          width: `${((currentExercise.duration - timeRemaining) / currentExercise.duration) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Estatísticas Rápidas (MANTIDO) */}
                  <div className="grid grid-cols-3 gap-3 lg:gap-4 xl:gap-6">
                    <div className="text-center p-3 lg:p-4 xl:p-5 bg-blue-50 rounded-xl">
                      <div className="text-lg lg:text-xl xl:text-2xl 2xl:text-3xl font-bold text-blue-600">
                        {currentExerciseIndex + 1}
                      </div>
                      <div className="text-xs lg:text-sm text-gray-600 mt-1 flex items-center justify-center">
                        <MdFitnessCenter className="w-3 h-3 mr-1" />
                        Exercício Atual
                      </div>
                    </div>
                    <div className="text-center p-3 lg:p-4 xl:p-5 bg-green-50 rounded-xl">
                      <div className="text-lg lg:text-xl xl:text-2xl 2xl:text-3xl font-bold text-green-600">
                        {workoutData.exercises.length}
                      </div>
                      <div className="text-xs lg:text-sm text-gray-600 mt-1 flex items-center justify-center">
                        <FaListAlt className="w-3 h-3 mr-1" />
                        Total
                      </div>
                    </div>
                    <div className="text-center p-3 lg:p-4 xl:p-5 bg-purple-50 rounded-xl">
                      <div className="text-lg lg:text-xl xl:text-2xl 2xl:text-3xl font-bold text-purple-600">
                        {Math.round(getProgressPercentage())}%
                      </div>
                      <div className="text-xs lg:text-sm text-gray-600 mt-1 flex items-center justify-center">
                        <GiTargeted className="w-3 h-3 mr-1" />
                        Completo
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Coluna da Demonstração (Mídia) - MANTIDO (USA AS PROPS CORRETAS) */}
            <div className="xl:col-span-4 flex flex-col h-full gap-4">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden flex-1 flex flex-col min-h-0">
                <div className="flex-1 bg-gray-900 flex items-center justify-center relative min-h-[300px] lg:min-h-[400px]">
                  
                  {/* INSERÇÃO DO COMPONENTE DE MÍDIA */}
                  <ExerciseMedia 
                    videoUrl={currentExercise.video} 
                    exerciseName={currentExercise.name}
                  />

                  {/* Temporizador sobre a Mídia (MANTIDO) */}
                  {/* <div className="absolute top-2 lg:top-3 xl:top-4 right-2 lg:right-3 xl:right-4 bg-black bg-opacity-70 text-white px-3 lg:px-4 xl:px-5 py-1.5 lg:py-2 xl:py-3 rounded-lg z-10">
                    <div className="text-sm lg:text-lg xl:text-xl 2xl:text-2xl font-mono font-bold">
                      {formatTime(timeRemaining)}
                    </div>
                  </div> */}
                </div>

                {/* Status do Exercício (MANTIDO) */}
                <div className="p-2 lg:p-3 xl:p-4 bg-gray-800 text-white">
                  <div className="flex justify-between items-center">
                    <span className="text-xs lg:text-sm flex items-center">
                      <FaRunning className="w-3 h-3 mr-1 text-blue-400" />
                      Exercício em Andamento
                    </span>
                    <span className="text-sm lg:text-base xl:text-lg font-mono font-bold text-blue-300">
                      {formatTime(timeRemaining)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* LISTA DE EXERCÍCIOS E DICAS (MANTIDO) */}
          <div className="mt-4">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
              
              {/* Lista de Exercícios (MANTIDO) */}
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
                                : 'bg-gray-50 border-gray-200 hover:border-gray-300'
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

                          {/* Nome do exercício */}
                          <h4 className={`font-bold text-base lg:text-lg mb-3 truncate ${index === currentExerciseIndex
                              ? 'text-blue-700'
                              : exercise.completed
                                ? 'text-green-700'
                                : 'text-gray-700'
                            }`}>
                            {exercise.name}
                          </h4>

                          {/* Informações na HORIZONTAL */}
                          <div className="flex items-center justify-between gap-3 mb-3">
                            <div className="flex items-center gap-1 lg:gap-2">
                              <GiMuscleUp className="w-4 h-4 text-gray-500" />
                              <span className="font-medium capitalize text-gray-700 text-xs lg:text-sm">
                                {exercise.type}
                              </span>
                            </div>

                            <div className="flex items-center gap-1 lg:gap-2">
                              <GiDuration className="w-4 h-4 text-gray-500" />
                              <span className="font-medium text-gray-700 text-xs lg:text-sm">
                                {Math.floor(exercise.duration / 60)}min
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Aba de Dicas (MANTIDO) */}
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

export default ActiveWorkout;