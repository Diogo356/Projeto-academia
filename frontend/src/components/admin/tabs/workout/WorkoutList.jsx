// src/components/admin/WorkoutList.jsx - VERSÃO MELHORADA (Cards Refatorados)
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPlus, FaTrash, FaCopy, FaEye, FaEdit,
  FaSpinner, FaExclamationTriangle, FaDumbbell,
  FaClock, FaFire, FaHeartbeat, FaUser, FaSnowflake, 
  FaRunning, FaPlay, FaImage, FaBolt, FaStar,
  FaCheck, FaTimes // Adicionados para o status
} from 'react-icons/fa';
import workoutService from '../../../../services/workoutService';
import WorkoutViewModal from './WorkoutViewModal';

// Ícones por tipo de exercício (Não utilizado neste componente, mas mantido)
const exerciseTypeIcons = {
  cardio: FaRunning,
  strength: FaDumbbell,
  warmup: FaFire,
  cooldown: FaSnowflake,
  flexibility: FaUser,
};

// Componente auxiliar para os botões de ação do card
const IconButton = ({ onClick, href, icon: Icon, title, className = '', danger = false }) => {
  const baseClasses = `p-2 rounded-lg transition-colors ${
    danger 
      ? 'text-gray-500 hover:bg-red-50 hover:text-red-600'
      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
  } ${className}`;
  
  const content = <Icon className="text-sm" />;

  const props = {
    title,
    onClick: (e) => {
      e.stopPropagation(); // Impede que o clique ative outros eventos (como o modal)
      if (onClick) onClick();
    }
  };

  if (href) {
    return (
      <a href={href} {...props} className={baseClasses}>
        {content}
      </a>
    );
  }
  
  return (
    <button type="button" {...props} className={baseClasses}>
      {content}
    </button>
  );
};


const WorkoutList = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionStatus, setActionStatus] = useState({ type: '', message: '' });
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Buscar treinos
  const fetchWorkouts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await workoutService.getWorkouts();
      const workoutsData = response.data?.workouts || response.workouts || [];
      setWorkouts(workoutsData);
    } catch (err) {
      setError(err.message || 'Erro ao carregar treinos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  // Ações
  const openWorkoutModal = useCallback(async (workout) => {
    try {
      // Tenta buscar detalhes completos, se falhar, usa os dados da lista
      const details = await workoutService.getWorkoutById(workout.publicId);
      setSelectedWorkout(details.data || details);
    } catch {
      setSelectedWorkout(workout); // Fallback para os dados já carregados
    } finally {
      setIsModalOpen(true);
    }
  }, []);

  const closeWorkoutModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedWorkout(null);
  }, []);

  const deleteWorkout = useCallback(async (publicId, name) => {
    if (!window.confirm(`Tem certeza que deseja excluir o treino "${name}"?`)) return;
    try {
      await workoutService.deleteWorkout(publicId);
      setWorkouts(prev => prev.filter(w => w.publicId !== publicId));
      showStatus('success', 'Treino excluído com sucesso!');
    } catch (err) {
      showStatus('error', 'Erro ao excluir: ' + err.message);
    }
  }, []); // Adicionar 'showStatus' ao array de dependências

  const duplicateWorkout = useCallback(async (workout) => {
    try {
      // Busca os detalhes completos para garantir que todos os campos sejam duplicados
      const fullWorkout = await workoutService.getWorkoutById(workout.publicId);
      const dataToDuplicate = fullWorkout.data || fullWorkout;
      
      const newWorkout = {
        name: `${dataToDuplicate.name} (Cópia)`,
        description: dataToDuplicate.description || '',
        // Mapeamento profundo para evitar referências
        exercises: dataToDuplicate.exercises.map(ex => ({
          name: ex.name,
          instructions: ex.instructions || '',
          duration: ex.duration,
          type: ex.type,
          restTime: ex.restTime,
          sets: ex.sets,
          reps: ex.reps,
          weight: ex.weight,
          targetMuscles: ex.targetMuscles || [],
          tips: ex.tips || [],
          mediaFile: ex.mediaFile || null // Preserva a referência da mídia
        }))
      };
      await workoutService.createWorkout(newWorkout);
      fetchWorkouts(); // Recarrega a lista para mostrar o novo treino
      showStatus('success', 'Treino duplicado com sucesso!');
    } catch (err) {
      showStatus('error', 'Erro ao duplicar: ' + err.message);
    }
  }, [fetchWorkouts]); // Adicionar 'fetchWorkouts' e 'showStatus'

  const showStatus = useCallback((type, message) => {
    setActionStatus({ type, message });
    setTimeout(() => setActionStatus({ type: '', message: '' }), 3000);
  }, []);

  // Utilitários
  const formatDate = (date) => new Date(date).toLocaleDateString('pt-BR');
  const formatDuration = (seconds) => {
    if (!seconds) return '0 min';
    const m = Math.floor(seconds / 60);
    const h = Math.floor(m / 60);
    return h > 0 ? `${h}h ${m % 60}min` : `${m} min`;
  };

  const getWorkoutIntensity = (duration, exercises) => {
    const avgDuration = duration / (exercises.length || 1);
    if (avgDuration > 180) return { label: 'Alta', icon: FaBolt, color: 'text-red-600', bg: 'bg-red-50' };
    if (avgDuration > 90) return { label: 'Média', icon: FaFire, color: 'text-orange-600', bg: 'bg-orange-50' };
    return { label: 'Baixa', icon: FaStar, color: 'text-green-600', bg: 'bg-green-50' };
  };

  const getThumbnail = (workout) => {
    if (workout.thumbnail) return { url: workout.thumbnail, type: 'image' };
    const exWithMedia = workout.exercises?.find(ex => ex.mediaFile);
    return exWithMedia?.mediaFile || null;
  };

  const countMedia = (workout) => workout.exercises?.filter(ex => ex.mediaFile).length || 0;

  // Skeleton Card
  const SkeletonCard = () => (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 animate-pulse">
      <div className="h-48 bg-gray-200 rounded-2xl mb-4"></div>
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
      <div className="flex space-x-2 mb-4">
        <div className="h-8 w-20 bg-gray-200 rounded-full"></div>
        <div className="h-8 w-16 bg-gray-200 rounded-full"></div>
      </div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mt-auto"></div>
    </div>
  );

  // Media Thumbnail
  const MediaThumbnail = React.memo(({ media, className = "" }) => {
    if (!media) return null;
    const isVideo = media.type === 'video';
    // Usa a thumbnail do vídeo se existir, senão a própria URL (para imagens)
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

  // Renderização condicional
  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <div className="h-8 bg-gray-200 rounded w-48"></div>
            <div className="h-4 bg-gray-200 rounded w-64 mt-2"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FaDumbbell className="text-blue-600" />
            Meus Treinos
          </h2>
          <p className="text-gray-600 mt-1">Gerencie seus treinos com estilo e eficiência</p>
        </div>
        <a
          href="/admin/workouts/create"
          className="px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:shadow-xl transform hover:scale-105 transition-all flex items-center justify-center lg:justify-start gap-2"
        >
          <FaPlus /> Novo Treino
        </a>
      </div>

      {/* Status */}
      <AnimatePresence>
        {actionStatus.message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-2xl border-2 flex items-center gap-3 font-medium ${
              actionStatus.type === 'success'
                ? 'bg-green-50 border-green-300 text-green-800'
                : 'bg-red-50 border-red-300 text-red-800'
            }`}
          >
            {actionStatus.type === 'success' ? <FaCheck /> : <FaTimes />}
            {actionStatus.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Erro */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center"
        >
          <FaExclamationTriangle className="text-red-500 text-4xl mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">Erro ao carregar</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchWorkouts}
            className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Tentar Novamente
          </button>
        </motion.div>
      )}

      {/* Vazio */}
      {!error && workouts.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-xl border border-gray-100 p-16 text-center"
        >
          <div className="text-7xl mb-6">🏋️‍♂️</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Nenhum treino ainda</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Crie seu primeiro treino e comece a transformar sua rotina.
          </p>
          <a
            href="/admin/workouts/create"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all"
          >
            <FaPlus /> Criar Treino
          </a>
        </motion.div>
      )}

      {/* Lista de Treinos */}
      {!error && workouts.length > 0 && (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {workouts.map((workout, index) => {
              const mediaCount = countMedia(workout);
              const thumbnail = getThumbnail(workout);
              const intensity = getWorkoutIntensity(workout.totalDuration, workout.exercises);
              const IntensityIcon = intensity.icon;
              const durationLabel = formatDuration(workout.totalDuration);
              const exerciseCount = workout.exercises?.length || 0;

              return (
                <motion.div
                  key={workout.publicId}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  className="group bg-white rounded-3xl shadow-lg shadow-gray-100/50 hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  {/* Thumbnail */}
                  <div className="relative h-48 bg-gray-100 rounded-t-3xl overflow-hidden">
                    {thumbnail ? (
                      <>
                        <MediaThumbnail 
                          media={thumbnail} 
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" 
                        />
                        {mediaCount > 1 && (
                          <div className="absolute top-3 right-3 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                            <FaImage /> {mediaCount}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <FaDumbbell className="text-gray-300 text-5xl" />
                      </div>
                    )}
                  </div>

                  {/* Conteúdo */}
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-lg text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors pr-2">
                        {workout.name}
                      </h3>
                      {/* --- NOVOS BOTÕES DE AÇÃO --- */}
                      <div className="flex items-center gap-0.5 ml-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <IconButton
                          icon={FaEye}
                          title="Ver"
                          onClick={() => openWorkoutModal(workout)}
                        />
                        <IconButton
                          icon={FaEdit}
                          title="Editar"
                          href={`/admin/workouts/edit/${workout.publicId}`}
                        />
                        <IconButton
                          icon={FaCopy}
                          title="Duplicar"
                          onClick={() => duplicateWorkout(workout)}
                        />
                        <IconButton
                          icon={FaTrash}
                          title="Excluir"
                          onClick={() => deleteWorkout(workout.publicId, workout.name)}
                          danger
                        />
                      </div>
                    </div>

                    {workout.description && (
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                        {workout.description}
                      </p>
                    )}

                    {/* --- NOVOS BADGES DE STATS --- */}
                    <div className="flex flex-wrap items-center gap-2 text-xs font-medium mb-4">
                      <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${intensity.color} ${intensity.bg}`}>
                        <IntensityIcon className="text-xs" />
                        {intensity.label}
                      </span>
                      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">
                        <FaClock />
                        {durationLabel}
                      </span>
                      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700">
                        <FaDumbbell />
                        {exerciseCount} {exerciseCount === 1 ? 'Exer.' : 'Exers.'}
                      </span>
                    </div>

                    {/* Preview de exercícios (se houver) */}
                    {mediaCount > 0 && (
                      <div className="flex gap-1.5 mb-4 overflow-hidden">
                        {workout.exercises.slice(0, 5).map((ex, i) =>
                          ex.mediaFile ? (
                            <div key={i} className="flex-shrink-0">
                              <MediaThumbnail media={ex.mediaFile} className="w-10 h-10 rounded-lg" />
                            </div>
                          ) : null
                        )}
                        {mediaCount > 5 && (
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-500 font-medium">
                            +{mediaCount - 5}
                          </div>
                        )}
                      </div>
                    )}

                    {/* --- NOVO RODAPÉ COM A DATA --- */}
                    <div className="mt-auto pt-4 text-xs text-gray-500">
                      Criado em: {formatDate(workout.createdAt)}
                    </div>

                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Modal */}
      <WorkoutViewModal
        workout={selectedWorkout}
        isOpen={isModalOpen}
        onClose={closeWorkoutModal}
      />
    </div>
  );
};

export default React.memo(WorkoutList);