// src/components/workout/ViewerWorkoutList.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaSpinner, FaExclamationTriangle, FaDumbbell,
    FaClock, FaFire, FaHeartbeat, FaUser,
    FaSnowflake, FaRunning, FaEye
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

    // Buscar treinos do back-end
    const fetchWorkouts = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await workoutService.getWorkouts();
            const workoutsData = response.workouts || [];

            setWorkouts(workoutsData);

        } catch (err) {
            console.error('❌ Erro ao buscar treinos:', err);
            setError(err.message || 'Erro ao carregar treinos');
        } finally {
            setLoading(false);
        }
    };

    // Carregar treinos ao montar o componente
    useEffect(() => {
        fetchWorkouts();
    }, []);

    // Função para abrir o modal de visualização
    const openWorkoutModal = (workout) => {
        setSelectedWorkout(workout);
        setIsModalOpen(true);
    };

    // Função para fechar o modal
    const closeWorkoutModal = () => {
        setIsModalOpen(false);
        setSelectedWorkout(null);
    };

    // Formatar data
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('pt-BR');
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

    // Obter cor da dificuldade
    const getDifficultyColor = (difficulty) => {
        const colors = {
            beginner: 'green',
            intermediate: 'yellow',
            advanced: 'red'
        };
        return colors[difficulty] || 'gray';
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="text-gray-600 mt-4">Carregando treinos...</p>
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
                        Visualize todos os treinos da academia
                    </p>
                </div>

                {error ? (
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
                ) : workouts.length === 0 ? (
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
                ) : (
                    <motion.div
                        layout
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        <AnimatePresence>
                            {workouts.map((workout, index) => {
                                const CategoryIcon = categoryIcons[workout.category] || FaDumbbell;
                                const difficultyColor = getDifficultyColor(workout.difficulty);

                                return (
                                    <motion.div
                                        key={workout.publicId || workout._id || index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group cursor-pointer"
                                        onClick={() => openWorkoutModal(workout)}
                                    >
                                        {/* Header */}
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="p-2 bg-blue-50 rounded-xl">
                                                    <CategoryIcon className="text-blue-600 text-xl" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-blue-600 transition-colors">
                                                        {workout.name}
                                                    </h3>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColor === 'green' ? 'bg-green-100 text-green-800' :
                                                            difficultyColor === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                                                                'bg-red-100 text-red-800'
                                                        }`}>
                                                        {translateDifficulty(workout.difficulty)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Informações */}
                                        <div className="space-y-3 mb-4">
                                            <div className="flex items-center text-sm text-gray-600">
                                                <FaClock className="mr-2 text-gray-400" />
                                                <span>{formatDuration(workout.totalDuration)}</span>
                                            </div>
                                            <div className="flex items-center text-sm text-gray-600">
                                                <FaDumbbell className="mr-2 text-gray-400" />
                                                <span>{(workout.exercises && workout.exercises.length) || 0} exercícios</span>
                                            </div>
                                            <div className="flex items-center text-sm text-gray-600">
                                                <span className="mr-2">🏷️</span>
                                                <span>{translateCategory(workout.category)}</span>
                                            </div>
                                            {workout.description && (
                                                <p className="text-sm text-gray-600 line-clamp-2">
                                                    {workout.description}
                                                </p>
                                            )}
                                        </div>

                                        {/* Ação Única - Visualizar */}
                                        <div className="flex space-x-2 pt-4 border-t border-gray-100">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openWorkoutModal(workout);
                                                }}
                                                className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded-xl hover:bg-blue-100 hover:border-blue-300 transition-colors flex items-center justify-center space-x-1 text-sm font-medium"
                                            >
                                                <FaEye className="text-xs" />
                                                <span>Visualizar Treino</span>
                                            </button>
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