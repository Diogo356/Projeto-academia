// src/services/workoutService.js
import api from './api';

const workoutService = {
    async getWorkouts(params = {}) {
        try {
            const result = await api.get('/workouts', { params });

            // CORREÇÃO: Verifique a estrutura da resposta mais cuidadosamente
            if (!result) {
                throw new Error('Resposta vazia da API');
            }

            // A resposta pode vir em diferentes formatos, então vamos verificar
            const data = result.data || result; // Tenta acessar .data ou usa o result diretamente

            // Se a API retorna um objeto com propriedade success
            if (result.success === false) {
                throw new Error(result.message || 'Erro ao buscar treinos');
            }

            // Verifica se temos workouts no formato esperado
            const workouts = data.workouts || data || [];


            return {
                workouts: Array.isArray(workouts) ? workouts : [],
                totalPages: data.totalPages || 1,
                currentPage: data.currentPage || 1,
                total: data.total || (Array.isArray(workouts) ? workouts.length : 0)
            };
        } catch (error) {
            console.error('Erro ao buscar treinos:', error);
            throw this.handleError(error);
        }
    },

    async getWorkoutById(publicId) {
        try {
            const result = await api.get(`/workouts/${publicId}`);
            if (!result.success) throw new Error(result.message);
            return result.data;
        } catch (error) {
            throw this.handleError(error);
        }
    },

    // src/services/workoutService.js
    // src/services/workoutService.js
    async createWorkout(workoutData) {
        try {
            // Formatação dos dados para a API
            const formatted = {
                name: workoutData.name?.trim(),
                description: workoutData.description?.trim() || '',
                category: 'custom',
                difficulty: 'intermediate',
                exercises: workoutData.exercises?.map((exercise, index) => ({
                    name: exercise.name?.trim(),
                    description: exercise.instructions?.trim() || '',
                    duration: parseInt(exercise.duration) || 60,
                    restTime: parseInt(exercise.restTime) || 30,
                    type: exercise.type || 'cardio',
                    sets: parseInt(exercise.sets) || 1,
                    reps: parseInt(exercise.reps) || 0,
                    weight: parseFloat(exercise.weight) || 0,
                    targetMuscles: exercise.targetMuscles || [],
                    order: index,
                })) || []
            };

            // Validação básica antes do envio
            if (!formatted.name || formatted.name.trim() === '') {
                throw new Error('Nome do treino é obrigatório');
            }

            if (formatted.exercises.length === 0) {
                throw new Error('Pelo menos um exercício é obrigatório');
            }
            const result = await api.post('/workouts', formatted);
            // Verifica diferentes estruturas possíveis de resposta
            if (result && typeof result === 'object') {
                if (result.success === false) {
                    throw new Error(result.message || 'Erro ao criar treino');
                }
                return result;
            } else {
                throw new Error('Resposta inválida da API');
            }

        } catch (error) {
            console.error('❌ Erro detalhado no createWorkout:', error);

            // Log mais detalhado do erro
            if (error.response) {
                console.error('📊 Response data do erro:', error.response.data);
                console.error('🔧 Status do erro:', error.response.status);
                console.error('🧩 Headers do erro:', error.response.headers);
            }

            throw this.handleError(error);
        }
    },

    async updateWorkout(publicId, workoutData) {
        try {
            const formatted = { /* ... */ };
            const result = await api.put(`/workouts/${publicId}`, formatted);
            if (!result.success) throw new Error(result.message);
            return result.data;
        } catch (error) {
            throw this.handleError(error);
        }
    },

    async deleteWorkout(publicId) {
        try {
            const result = await api.delete(`/workouts/${publicId}`);
            if (!result.success) throw new Error(result.message);
            return result.data;
        } catch (error) {
            throw this.handleError(error);
        }
    },

    async getWorkoutStats() {
        try {
            const result = await api.get('/workouts/stats');
            if (!result.success) throw new Error(result.message);
            return result.data;
        } catch (error) {
            throw this.handleError(error);
        }
    },

    async testAuth() {
        try {
            const result = await api.get('/workouts/debug/auth');
            if (!result.success) throw new Error(result.message);
            return result.data;
        } catch (error) {
            throw this.handleError(error);
        }
    },

    handleError(error) {
        console.error('Erro no workoutService:', error);

        if (error.status !== undefined) {
            return {
                message: error.message || 'Erro desconhecido',
                errors: error.data?.errors,
                status: error.status
            };
        } else if (error.request) {
            return { message: 'Erro de conexão', status: 0 };
        } else {
            return { message: error.message, status: -1 };
        }
    }
};

export default workoutService;