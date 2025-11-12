// src/services/workoutService.js
import api from './api';

const workoutService = {
    async getWorkouts(params = {}) {
        try {
            const result = await api.get('/workouts', { params });

            if (!result) {
                throw new Error('Resposta vazia da API');
            }

            const data = result.data || result;

            if (result.success === false) {
                throw new Error(result.message || 'Erro ao buscar treinos');
            }

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

    // Upload de mídia (GIF/Video) para exercícios
     async uploadExerciseMedia(file) {
        try {
            const formData = new FormData();
            formData.append('media', file);

            console.log('📤 Iniciando upload do arquivo:', file.name, 'Tipo:', file.type, 'Tamanho:', file.size);

            const result = await api.post('/workouts/upload-exercise-media', formData, {
                headers: {
                    // REMOVER a definição manual de Content-Type para FormData
                    // O axios/browser vai definir automaticamente com boundary
                },
                timeout: 60000, // 60 segundos para uploads grandes
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        console.log(`📊 Progresso do upload: ${percentCompleted}%`);
                    }
                }
            });

            console.log('✅ Upload concluído com sucesso:', result);

            if (result && typeof result === 'object') {
                if (result.success === false) {
                    throw new Error(result.message || 'Erro no upload de mídia');
                }
                return result.data || result;
            } else {
                throw new Error('Resposta inválida da API');
            }
        } catch (error) {
            console.error('❌ Erro detalhado no upload de mídia:', error);
            
            // Log mais detalhado do erro
            if (error.response) {
                console.error('📊 Response data:', error.response.data);
                console.error('🔧 Status:', error.response.status);
                console.error('🧩 Headers:', error.response.headers);
            } else if (error.request) {
                console.error('🌐 Request error:', error.request);
            } else {
                console.error('⚡ Error message:', error.message);
            }

            throw this.handleError(error);
        }
    },

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
                    video: exercise.video || null, // Campo para URL do vídeo/GIF
                    tips: exercise.tips || [], // Campo para dicas
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
                console.error('🧩 Headers do erro:', error.response.headers);
            }

            throw this.handleError(error);
        }
    },

    async updateWorkout(publicId, workoutData) {
        try {
            const formatted = {
                name: workoutData.name?.trim(),
                description: workoutData.description?.trim() || '',
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
                    video: exercise.video || null,
                    tips: exercise.tips || [],
                    order: index,
                })) || []
            };

            const result = await api.put(`/workouts/${publicId}`, formatted);
            
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