// src/services/workoutService.js
import api from './api';

const workoutService = {
    async getWorkouts(params = {}) {
        try {
            const result = await api.get('/workouts', { params });

            if (!result) {
                throw new Error('Resposta vazia da API');
            }

            // A nova estrutura retorna { success, data: { workouts, ... } }
            const data = result.data || result;

            if (result.success === false) {
                throw new Error(result.message || 'Erro ao buscar treinos');
            }

            // Acessar workouts através da nova estrutura
            const workouts = data.data?.workouts || data.workouts || data || [];

            return {
                workouts: Array.isArray(workouts) ? workouts : [],
                totalPages: data.data?.totalPages || data.totalPages || 1,
                currentPage: data.data?.currentPage || data.currentPage || 1,
                total: data.data?.total || data.total || (Array.isArray(workouts) ? workouts.length : 0)
            };
        } catch (error) {
            console.error('Erro ao buscar treinos:', error);
            throw this.handleError(error);
        }
    },

    async getWorkoutById(publicId) {
        try {
            const result = await api.get(`/workouts/${publicId}`);

            if (result && typeof result === 'object') {
                if (result.success === false) {
                    throw new Error(result.message || 'Erro ao buscar treino');
                }
                return result.data || result;
            } else {
                throw new Error('Resposta inválida da API');
            }
        } catch (error) {
            console.error('❌ Erro ao buscar treino por ID:', error);
            throw this.handleError(error);
        }
    },

    async createWorkout(workoutData) {
        try {
            const formData = new FormData();

            formData.append('name', workoutData.name?.trim() || '');
            formData.append('description', workoutData.description?.trim() || '');

            // Processar cada exercício
            workoutData.exercises?.forEach((exercise, index) => {
                // Campos básicos do exercício
                formData.append(`exercises[${index}][name]`, exercise.name?.trim() || '');
                formData.append(`exercises[${index}][instructions]`, exercise.instructions?.trim() || '');
                formData.append(`exercises[${index}][duration]`, (parseInt(exercise.duration) || 60).toString());
                formData.append(`exercises[${index}][type]`, exercise.type || 'cardio');
                formData.append(`exercises[${index}][restTime]`, (parseInt(exercise.restTime) || 30).toString());
                formData.append(`exercises[${index}][sets]`, (parseInt(exercise.sets) || 1).toString());
                formData.append(`exercises[${index}][reps]`, (parseInt(exercise.reps) || 0).toString());
                formData.append(`exercises[${index}][weight]`, (parseFloat(exercise.weight) || 0).toString());

                // Músculos alvo - enviar como string JSON
                if (Array.isArray(exercise.targetMuscles)) {
                    formData.append(`exercises[${index}][targetMuscles]`, JSON.stringify(exercise.targetMuscles));
                }

                // Dicas - enviar como string JSON
                if (Array.isArray(exercise.tips)) {
                    formData.append(`exercises[${index}][tips]`, JSON.stringify(exercise.tips));
                }

                // Adicionar arquivo de mídia se existir
                if (exercise.mediaFile?.file) {
                    formData.append(`exercises[${index}][mediaFile]`, exercise.mediaFile.file);
                }
            });

            // Validação básica
            if (!workoutData.name || workoutData.name.trim() === '') {
                throw new Error('Nome do treino é obrigatório');
            }

            if (!workoutData.exercises || workoutData.exercises.length === 0) {
                throw new Error('Pelo menos um exercício é obrigatório');
            }


            const result = await api.post('/workouts', formData, {
                timeout: 120000,
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    }
                }
            });

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

            if (error.response) {
                console.error('📊 Response data do erro:', error.response.data);
                console.error('🔧 Status do erro:', error.response.status);
                console.error('🔧 Headers do erro:', error.response.headers);
            }

            throw this.handleError(error);
        }
    },

    async updateWorkout(publicId, workoutData) {
        try {
            // Criar FormData para update também
            const formData = new FormData();


            // Adicionar campos básicos
            formData.append('name', workoutData.name?.trim() || '');
            formData.append('description', workoutData.description?.trim() || '');

            // Adicionar exercícios
            workoutData.exercises?.forEach((exercise, index) => {
                // Campos básicos do exercício
                formData.append(`exercises[${index}][name]`, exercise.name?.trim() || '');
                formData.append(`exercises[${index}][instructions]`, exercise.instructions?.trim() || '');
                formData.append(`exercises[${index}][duration]`, parseInt(exercise.duration) || 60);
                formData.append(`exercises[${index}][type]`, exercise.type || 'cardio');
                formData.append(`exercises[${index}][restTime]`, parseInt(exercise.restTime) || 30);
                formData.append(`exercises[${index}][sets]`, parseInt(exercise.sets) || 1);
                formData.append(`exercises[${index}][reps]`, parseInt(exercise.reps) || 0);
                formData.append(`exercises[${index}][weight]`, parseFloat(exercise.weight) || 0);

                // Se o exercício tem publicId (para updates), enviar também
                if (exercise.publicId) {
                    formData.append(`exercises[${index}][publicId]`, exercise.publicId);
                }

                // Músculos alvo
                if (Array.isArray(exercise.targetMuscles)) {
                    exercise.targetMuscles.forEach((muscle, muscleIndex) => {
                        formData.append(`exercises[${index}][targetMuscles][${muscleIndex}]`, muscle);
                    });
                }

                // Dicas
                if (Array.isArray(exercise.tips)) {
                    exercise.tips.forEach((tip, tipIndex) => {
                        formData.append(`exercises[${index}][tips][${tipIndex}]`, tip);
                    });
                }

                // Adicionar arquivo de mídia se existir
                if (exercise.mediaFile?.file) {
                    formData.append(`exercises[${index}][mediaFile]`, exercise.mediaFile.file);
                }
            });

            const result = await api.put(`/workouts/${publicId}`, formData, {
                timeout: 120000,
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    }
                }
            });

            if (result && typeof result === 'object') {
                if (result.success === false) {
                    throw new Error(result.message || 'Erro ao atualizar treino');
                }
                return result.data || result;
            } else {
                throw new Error('Resposta inválida da API');
            }
        } catch (error) {
            console.error('❌ Erro ao atualizar treino:', error);
            throw this.handleError(error);
        }
    },

    async deleteWorkout(publicId) {
        try {
            const result = await api.delete(`/workouts/${publicId}`);

            if (result && typeof result === 'object') {
                if (result.success === false) {
                    throw new Error(result.message || 'Erro ao deletar treino');
                }
                return result.data || result;
            } else {
                throw new Error('Resposta inválida da API');
            }
        } catch (error) {
            console.error('❌ Erro ao deletar treino:', error);
            throw this.handleError(error);
        }
    },

    async getWorkoutStats() {
        try {
            const result = await api.get('/workouts/stats');

            if (result && typeof result === 'object') {
                if (result.success === false) {
                    throw new Error(result.message || 'Erro ao buscar estatísticas');
                }
                return result.data || result;
            } else {
                throw new Error('Resposta inválida da API');
            }
        } catch (error) {
            console.error('❌ Erro ao buscar estatísticas:', error);
            throw this.handleError(error);
        }
    },

    async testAuth() {
        try {
            const result = await api.get('/workouts/debug/auth');

            if (result && typeof result === 'object') {
                if (result.success === false) {
                    throw new Error(result.message || 'Erro no teste de autenticação');
                }
                return result.data || result;
            } else {
                throw new Error('Resposta inválida da API');
            }
        } catch (error) {
            console.error('❌ Erro no teste de autenticação:', error);
            throw this.handleError(error);
        }
    },

    handleError(error) {
        console.error('Erro no workoutService:', error);

        if (error.response) {
            return {
                message: error.response.data?.message || 'Erro desconhecido',
                errors: error.response.data?.errors,
                status: error.response.status
            };
        } else if (error.request) {
            return { message: 'Erro de conexão', status: 0 };
        } else {
            return { message: error.message, status: -1 };
        }
    }
};

export default workoutService;