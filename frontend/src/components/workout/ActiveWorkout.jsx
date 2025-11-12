// src/components/workout/ActiveWorkout.jsx - COMPONENTE OTIMIZADO E RESPONSIVO
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FaDumbbell, 
  FaClock, 
  FaBullseye, 
  FaVideo, 
  FaListAlt, 
  FaLightbulb, 
  FaStar,
  FaCheck,
  FaSync,
  FaExclamationTriangle,
  FaRunning,
  FaHeartbeat,
  FaYinYang,
  FaFire,
  FaMountain,
  FaSpinner
} from 'react-icons/fa';
import { 
  GiMuscleUp, 
  GiDuration,
  GiTargeted
} from 'react-icons/gi';
import { 
  MdFitnessCenter,
  MdTimer,
  MdOndemandVideo,
  MdPlaylistPlay,
  MdTipsAndUpdates,
  MdError
} from 'react-icons/md';
import WorkoutHeader from './WorkoutHeader';
import workoutService from '../../services/workoutService';

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

  // Buscar dados do treino
  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        setLoading(true);
        const workout = await workoutService.getWorkoutById(publicId);

        const transformedWorkout = {
          ...workout,
          exercises: workout.exercises?.map((exercise, index) => ({
            ...exercise,
            id: exercise.id || index + 1,
            duration: exercise.duration || 60,
            type: exercise.type || 'strength',
            video: exercise.video || getExerciseVideo(exercise.type),
            tips: exercise.tips || getExerciseTips(exercise.type, exercise.name),
            completed: false
          })) || []
        };

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

  // Funções auxiliares
  const getExerciseVideo = (type) => {
    const videos = {
      cardio: '/videos/cardio-demo.mp4',
      strength: '/videos/strength-demo.mp4',
      hiit: '/videos/hiit-demo.mp4',
      yoga: '/videos/yoga-demo.mp4',
      pilates: '/videos/pilates-demo.mp4',
      mobility: '/videos/mobility-demo.mp4'
    };
    return videos[type] || '/videos/default-demo.mp4';
  };

  const getExerciseTips = (type, name) => {
    const tips = {
      cardio: [
        'Mantenha uma postura ereta durante todo o exercício',
        'Controle sua respiração - inspire pelo nariz, expire pela boca',
        'Ajuste a intensidade conforme seu condicionamento',
        'Use tênis apropriado para amortecimento',
        'Hidrate-se antes, durante e após o exercício'
      ],
      strength: [
        'Mantenha o core contraído durante o movimento',
        'Execute o movimento de forma controlada',
        'Não trave as articulações no final do movimento',
        'Foque na qualidade do movimento, não no peso',
        'Mantenha a respiração constante'
      ],
      hiit: [
        'Dê o máximo durante os intervalos de alta intensidade',
        'Use os períodos de descanso para recuperar o fôlego',
        'Mantenha a hidratação durante todo o treino',
        'Escute seu corpo e ajuste a intensidade',
        'Não pule o aquecimento e o alongamento'
      ],
      yoga: [
        'Foque na respiração profunda e consciente',
        'Respeite os limites do seu corpo',
        'Mantenha a concentração no momento presente',
        'Use roupas confortáveis que permitam movimento',
        'Pratique em superfície firme e antiderrapante'
      ],
      pilates: [
        'Mantenha o alinhamento postural durante todo o exercício',
        'Controle a respiração de forma ritmada',
        'Foque na precisão dos movimentos',
        'Mantenha o core ativado',
        'Execute movimentos fluidos e controlados'
      ],
      mobility: [
        'Movimente-se lentamente e com controle',
        'Não force além do seu limite atual',
        'Respire profundamente durante os alongamentos',
        'Mantenha cada posição por tempo suficiente',
        'Foque na qualidade do movimento'
      ]
    };

    const defaultTips = [
      'Mantenha a postura correta durante o exercício',
      'Respire de forma constante e controlada',
      'Beba água para manter-se hidratado',
      'Use roupas adequadas para a atividade',
      'Respeite seus limites e evolua gradualmente'
    ];

    return tips[type] || defaultTips;
  };

  const startWorkout = () => {
    if (!workoutData?.exercises?.length) return;

    const firstExercise = workoutData.exercises[0];
    setTimeRemaining(firstExercise.duration);
    setIsRunning(true);
  };

  const completeExercise = () => {
    if (!workoutData) return;

    const nextIndex = currentExerciseIndex + 1;

    if (nextIndex < workoutData.exercises.length) {
      const updatedExercises = workoutData.exercises.map((ex, index) =>
        index === currentExerciseIndex ? { ...ex, completed: true } : ex
      );

      setWorkoutData(prev => ({
        ...prev,
        exercises: updatedExercises
      }));

      setCurrentExerciseIndex(nextIndex);
      setTimeRemaining(workoutData.exercises[nextIndex].duration);
    } else {
      const updatedExercises = workoutData.exercises.map((ex, index) =>
        index === currentExerciseIndex ? { ...ex, completed: true } : ex
      );

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

  // Estados de loading e error
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

      {/* Countdown Overlay */}
      {showCountdown && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="text-center text-white">
            <div className="text-8xl font-bold mb-4">{countdown}</div>
            <p className="text-xl">Preparando seu treino...</p>
            <p className="text-gray-300 mt-2">O treino começará automaticamente</p>
          </div>
        </div>
      )}

      {/* Conteúdo Principal */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full max-w-[1920px] mx-auto px-4">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 h-full">
            <div className="xl:col-span-8 flex flex-col h-full">
              <div className="grid grid-rows-[1fr] gap-4 h-full">

                {/* Card do Exercício Atual */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 lg:p-6 xl:p-8 flex flex-col">
                  {/* Header do Exercício */}
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
                        <span>{Math.floor(currentExercise.duration / 60)} min</span>
                      </span>
                      <span className="flex items-center space-x-1 lg:space-x-2">
                        <FaBullseye className="w-4 h-4 text-gray-500" />
                        <span>{currentExerciseIndex + 1}/{workoutData.exercises.length}</span>
                      </span>
                    </div>
                  </div>

                  {/* Área Central - Cronômetro */}
                  <div className="flex-1 flex flex-col justify-center items-center mb-4 lg:mb-6 xl:mb-8">
                    <div className="text-5xl lg:text-7xl xl:text-7xl 2xl:text-8xl font-mono font-bold text-blue-600 mb-3 lg:mb-4 xl:mb-6 text-center leading-none">
                      {formatTime(timeRemaining)}
                    </div>
                    <p className="text-base lg:text-lg xl:text-xl 2xl:text-1xl text-gray-600 text-center">
                      Tempo Restante deste Exercício
                    </p>
                  </div>

                  {/* Barra de Progresso */}
                  <div className="mb-4 lg:mb-6 xl:mb-8">
                    <div className="flex justify-between text-sm lg:text-base xl:text-lg text-gray-600 mb-2 lg:mb-3 xl:mb-4">
                      <span className="font-semibold">Progresso do Exercício</span>
                      <span className="font-mono">{formatTime(timeRemaining)}</span>
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

                  {/* Estatísticas Rápidas */}
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

            <div className="xl:col-span-4 flex flex-col h-full gap-4">

              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden flex-1 flex flex-col min-h-0">
                <div className="flex-1 bg-gray-900 flex items-center justify-center relative min-h-[300px]">
                  <div className="text-center text-white p-4">
                    <MdOndemandVideo className="text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl mb-2 lg:mb-3 xl:mb-4 mx-auto" />
                    <p className="text-base lg:text-lg xl:text-xl 2xl:text-2xl font-semibold mb-1 lg:mb-2">Demonstração</p>
                    <p className="text-gray-300 text-xs lg:text-sm xl:text-base">
                      {currentExercise.video ? 'Vídeo tutorial' : 'GIF demonstrativo'}
                    </p>
                  </div>

                  <div className="absolute top-2 lg:top-3 xl:top-4 right-2 lg:right-3 xl:right-4 bg-black bg-opacity-70 text-white px-2 lg:px-3 xl:px-4 py-1 lg:py-1.5 xl:py-2 rounded-lg">
                    <div className="text-base lg:text-lg xl:text-xl 2xl:text-2xl font-mono font-bold">
                      {formatTime(timeRemaining)}
                    </div>
                  </div>
                </div>

                <div className="p-2 lg:p-3 xl:p-4 bg-gray-800 text-white">
                  <div className="flex justify-between items-center">
                    <span className="text-xs lg:text-sm flex items-center">
                      <FaRunning className="w-3 h-3 mr-1" />
                      Exercício em Andamento
                    </span>
                    <span className="text-sm lg:text-base xl:text-lg font-mono font-bold">
                      {formatTime(timeRemaining)}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* LISTA DE EXERCÍCIOS E DICAS - LADO A LADO */}
          <div className="mt-4">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
              
              {/* Lista de Exercícios */}
              <div className="xl:col-span-8">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 lg:p-6">
                  <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-2 flex items-center">
                    <MdPlaylistPlay className="w-5 h-5 mr-2" />
                    Lista de Exercícios
                    <span className="ml-2 text-sm font-normal text-gray-500">
                      ({currentExerciseIndex + 1} de {workoutData.exercises.length})
                    </span>
                  </h3>

                  <div className="overflow-x-auto">
                    <div className="flex space-x-3 lg:space-x-4 pb-1 min-w-max">
                      {workoutData.exercises.map((exercise, index) => (
                        <div
                          key={exercise.id}
                          className={`flex-shrink-0 w-64 lg:w-72 px-4 pt-4 rounded-xl border-2 transition-all duration-300 ${index === currentExerciseIndex
                              ? 'bg-blue-50 border-blue-400 shadow-lg scale-105'
                              : exercise.completed
                                ? 'bg-green-50 border-green-300'
                                : 'bg-gray-50 border-gray-200'
                            }`}
                        >
                          {/* Header com número e status */}
                          <div className="flex items-center justify-between mb-1">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${index === currentExerciseIndex
                                ? 'bg-blue-500 text-white'
                                : exercise.completed
                                  ? 'bg-green-500 text-white'
                                  : 'bg-gray-300 text-gray-600'
                              }`}>
                              {index + 1}
                            </div>

                            {index === currentExerciseIndex && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                <FaSync className="w-3 h-3 mr-1" />
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
                          <h4 className={`font-bold text-sm lg:text-base mb-3 truncate ${index === currentExerciseIndex
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
                              <GiMuscleUp className="w-3 h-3 text-gray-500" />
                              <span className="font-medium capitalize text-gray-700 text-xs lg:text-sm">
                                {exercise.type}
                              </span>
                            </div>

                            <div className="flex items-center gap-1 lg:gap-2">
                              <GiDuration className="w-3 h-3 text-gray-500" />
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

              {/* Aba de Dicas */}
              <div className="xl:col-span-4">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 lg:p-6 h-full">
                  <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <MdTipsAndUpdates className="w-5 h-5 mr-2" />
                    Dicas do Exercício
                    <span className="ml-2 text-sm font-normal text-gray-500">
                      {currentExercise.type}
                    </span>
                  </h3>
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