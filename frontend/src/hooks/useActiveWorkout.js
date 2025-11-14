import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import workoutService from '../services/workoutService';
import { getFallbackMedia, getFallbackTips } from '../utils/workoutUtils';

export const useActiveWorkout = (publicId) => {
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

  // 1. BUSCAR E TRANSFORMAR OS DADOS
  useEffect(() => {
    const fetchWorkout = async () => {
      if (!publicId) {
        setError('ID do treino não fornecido');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        // AQUI USAMOS O SERVIÇO REAL (removendo a simulação)
        const workout = await workoutService.getWorkoutById(publicId);

        if (!workout || !workout.exercises || workout.exercises.length === 0) {
          throw new Error('Treino não encontrado ou não contém exercícios.');
        }

        const transformedWorkout = {
          ...workout,
          exercises: workout.exercises.map((exercise, index) => {
            // 1. Dicas: Prioriza as dicas do exercício, senão usa fallback
            const exerciseTips = (Array.isArray(exercise.tips) && exercise.tips.length > 0)
              ? exercise.tips
              : getFallbackTips(exercise.type);

            // 2. Mídia: Usa a URL do mediaFile, senão usa fallback
            const mediaUrl = exercise.mediaFile?.url || getFallbackMedia(exercise.type);

            return {
              ...exercise,
              id: exercise.id || index + 1, // Garante um ID
              duration: exercise.duration > 0 ? exercise.duration : 60, // Garante duração
              type: exercise.type || 'strength',
              video: mediaUrl,
              tips: exerciseTips,
              completed: false,
            };
          }),
        };
        
        console.log('Dados do Treino Transformados:', transformedWorkout);
        setWorkoutData(transformedWorkout);
        // Define o tempo do primeiro exercício
        setTimeRemaining(transformedWorkout.exercises[0].duration);

      } catch (err) {
        console.error('Erro ao carregar treino:', err);
        setError(err.message || 'Erro ao carregar treino');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkout();
  }, [publicId]); // Dependência apenas no publicId

  // 2. LÓGICA DE HANDLERS
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

    setWorkoutData(prev => ({
      ...prev,
      exercises: updatedExercises
    }));

    if (nextIndex < workoutData.exercises.length) {
      setCurrentExerciseIndex(nextIndex);
      setTimeRemaining(workoutData.exercises[nextIndex].duration);
    } else {
      // Treino concluído
      setIsRunning(false);
      setTimeout(() => {
        alert('🎉 Treino concluído com sucesso!');
        navigate('/workout'); // Ou para uma página de sumário
      }, 1000);
    }
  };

  // 3. EFEITOS (TIMERS E SCROLL)
  // Countdown inicial
  useEffect(() => {
    if (loading || !showCountdown) return;

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
  }, [loading, showCountdown]);

  // Timer do exercício
  useEffect(() => {
    if (!isRunning || timeRemaining <= 0) {
      if (isRunning && timeRemaining <= 0) {
        completeExercise();
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, timeRemaining]);

  // Scroll automático
  useEffect(() => {
    if (exerciseRefs.current[currentExerciseIndex]) {
      exerciseRefs.current[currentExerciseIndex].scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [currentExerciseIndex]);

  // 4. DADOS CALCULADOS
  const currentExercise = workoutData?.exercises[currentExerciseIndex];
  
  const getProgressPercentage = () => {
    if (!workoutData?.exercises?.length) return 0;
    // +1 porque o index é 0-based
    return ((currentExerciseIndex + 1) / workoutData.exercises.length) * 100;
  };
  
  const progressPercentage = getProgressPercentage();

  // 5. RETORNO DO HOOK
  return {
    loading,
    error,
    workoutData,
    currentExercise,
    currentExerciseIndex,
    timeRemaining,
    isRunning,
    showCountdown,
    countdown,
    progressPercentage,
    exerciseListRef,
    exerciseRefs,
    // Não precisamos expor os 'setters'
  };
};