// src/components/workout/ViewerWorkoutList.jsx - REFATORADO
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    FaSpinner, FaExclamationTriangle, FaDumbbell,
    FaClock, FaFire, FaHeartbeat, FaUser,
    FaSnowflake, FaRunning, FaEye, FaPlay, // ✅ NOVOS ÍCONES
    FaBolt, FaStar, FaImage // ✅ NOVOS ÍCONES
} from 'react-icons/fa';
import workoutService from '../../services/workoutService';
import WorkoutViewModal from '../admin/tabs/workout/WorkoutViewModal';
import ViewerLayout from './ViewerLayout';

const ViewerWorkoutList = () => {
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedWorkout, setSelectedWorkout] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    // Ícones para categorias (Mantido, mas não usado diretamente no badge do card)
    const categoryIcons = useMemo(() => ({
        cardio: FaRunning,
        strength: FaDumbbell,
        hiit: FaFire,
        yoga: FaUser,
        pilates: FaHeartbeat,
        mobility: FaSnowflake,
        custom: FaDumbbell
    }), []);

    // --- UTILS (REUTILIZADOS E MELHORADOS) ---

    // Buscar treinos do back-end
    const fetchWorkouts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            // Presumindo que o serviço de treino é igual ao da versão Admin
            const response = await workoutService.getWorkouts();
            const workoutsData = response.data?.workouts || response.workouts || [];
            setWorkouts(workoutsData);
        } catch (err) {
            console.error('❌ Erro ao buscar treinos:', err);
            setError(err.message || 'Erro ao carregar treinos');
        } finally {
            setLoading(false);
        }
    }, []);

    // Carregar treinos ao montar o componente
    useEffect(() => {
        fetchWorkouts();
    }, [fetchWorkouts]);


    // ✅ NOVA FUNÇÃO: Navegar para o treino ativo (Mantido)
    const navigateToActiveWorkout = (workout) => {
        // Assume que a rota de visualização ativa (iniciar) é /workout/:publicId
        if (workout.publicId) {
            navigate(`/workout/${workout.publicId}`);
        } else {
            console.error('Workout sem publicId:', workout);
            // Fallback: usar modal se não tiver publicId
            openWorkoutModal(workout);
        }
    };

    // Função para abrir o modal de visualização (para detalhes)
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

    // Função para fechar o modal
    const closeWorkoutModal = useCallback(() => {
        setIsModalOpen(false);
        setSelectedWorkout(null);
    }, []);

    // Formatar data (Reutilizado)
    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('pt-BR');

    // Formatar duração (Reutilizado)
    const formatDuration = (seconds) => {
        if (!seconds) return '0 min';
        const m = Math.floor(seconds / 60);
        const h = Math.floor(m / 60);
        return h > 0 ? `${h}h ${m % 60}min` : `${m} min`;
    };

    // Obter nível de intensidade do treino (Novo Utilitário)
    const getWorkoutIntensity = (duration, exercises) => {
        const avgDuration = duration / (exercises.length || 1);
        if (avgDuration > 180) return { label: 'Alta', icon: FaBolt, color: 'text-red-600', bg: 'bg-red-50' };
        if (avgDuration > 90) return { label: 'Média', icon: FaFire, color: 'text-orange-600', bg: 'bg-orange-50' };
        return { label: 'Baixa', icon: FaStar, color: 'text-green-600', bg: 'bg-green-50' };
    };

    // Obter a thumbnail (Novo Utilitário)
    const getThumbnail = (workout) => {
        if (workout.thumbnail) return { url: workout.thumbnail, type: 'image' };
        const exWithMedia = workout.exercises?.find(ex => ex.mediaFile);
        return exWithMedia?.mediaFile || null;
    };

    // Contar mídia (Novo Utilitário)
    const countMedia = (workout) => workout.exercises?.filter(ex => ex.mediaFile).length || 0;

    // Componente auxiliar para a Thumbnail (Novo Componente)
    const MediaThumbnail = React.memo(({ media, className = "" }) => {
        if (!media) return null;
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

    // Skeleton Card (Novo Componente)
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

    // --- RENDERIZAÇÃO ---

    if (loading) {
        return (
            <div className="min-h-screen p-6">
                <div className="flex justify-between items-center mb-8">
                    <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
                </div>
            </div>
        );
    }

    return (
        <ViewerLayout>
            <div className="space-y-8 p-6">
                {/* Header */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-3">
                        <FaDumbbell className="text-blue-600" />
                        Treinos Disponíveis
                    </h2>
                    <p className="text-gray-600 mt-2">
                        Visualize e comece o seu próximo treino.
                    </p>
                </div>

                {/* Bloco de Erro */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center"
                    >
                        <FaExclamationTriangle className="text-red-500 text-4xl mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-red-800 mb-2">Erro ao carregar treinos</h3>
                        <p className="text-red-600 mb-4">{error}</p>
                        <button
                            onClick={fetchWorkouts}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Tentar Novamente
                        </button>
                    </motion.div>
                )}

                {/* Bloco de Vazio */}
                {!error && workouts.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-3xl shadow-lg border border-gray-100 p-12 text-center"
                    >
                        <div className="text-6xl mb-4">🏋️‍♂️</div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                            Nenhum treino disponível
                        </h3>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                            Aguarde enquanto a academia cria os primeiros treinos.
                        </p>
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
                                        key={workout.publicId || workout._id || index}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ delay: index * 0.05 }}
                                        onClick={() => navigateToActiveWorkout(workout)}
                                        className="group bg-white rounded-3xl shadow-lg shadow-gray-100/50 hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
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
                                                <h3 className="font-bold text-xl text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors pr-2">
                                                    {workout.name}
                                                </h3>
                                            </div>

                                            {workout.description && (
                                                <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                                                    {workout.description}
                                                </p>
                                            )}

                                            {/* BADGES DE STATS */}
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

                                            {/* Rodapé com a data (Adaptado) */}
                                            <div className="mt-auto pt-4 text-xs text-gray-500 flex items-center justify-between">
                                                <span>Criado em: {formatDate(workout.createdAt)}</span>
                                                {/* Botão de Visualização (Mantido como ação secundária) */}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Impede o clique no card de navegar para o treino ativo
                                                        openWorkoutModal(workout);
                                                    }}
                                                    className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100 hover:text-blue-600 transition-colors"
                                                    title="Ver detalhes"
                                                >
                                                    <FaEye className="text-sm" />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </motion.div>
                )}

                {/* Modal de Visualização */}
                <WorkoutViewModal
                    workout={selectedWorkout}
                    isOpen={isModalOpen}
                    onClose={closeWorkoutModal}
                />
            </div>
        </ViewerLayout>
    );
};

export default ViewerWorkoutList;