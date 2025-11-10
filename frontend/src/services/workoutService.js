// src/services/workoutService.js
import api from './api';

const workoutService = {
  // LISTAR
  async getWorkouts(params = {}) {
    try {
      const response = await api.get('/workouts', { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // POR ID
  async getWorkoutById(publicId) {
    try {
      const response = await api.get(`/workouts/${publicId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // CRIAR
  async createWorkout(workoutData) {
    try {
      const formatted = {
        name: workoutData.name,
        description: workoutData.description || '',
        exercises: workoutData.exercises.map(ex => ({
          name: ex.name,
          duration: ex.duration,
          type: ex.type,
          targetMuscles: ex.targetMuscles || [],
          mediaFile: ex.mediaFile ? {
            url: ex.mediaFile.url,
            type: ex.mediaFile.type,
            name: ex.mediaFile.name
          } : null,
          instructions: ex.instructions || '',
          restTime: ex.restTime || 0,
          sets: ex.sets || 1,
          reps: ex.reps || 0,
          weight: ex.weight || 0
        }))
      };

      const response = await api.post('/workouts', formatted);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // ATUALIZAR
  async updateWorkout(publicId, workoutData) {
    try {
      const formatted = {
        name: workoutData.name,
        description: workoutData.description || '',
        exercises: workoutData.exercises.map(ex => ({
          name: ex.name.name,
          duration: ex.duration,
          type: ex.type,
          targetMuscles: ex.targetMuscles || [],
          mediaFile: ex.mediaFile ? {
            url: ex.mediaFile.url,
            type: ex.mediaFile.type,
            name: ex.mediaFile.name
          } : null,
          instructions: ex.instructions || '',
          restTime: ex.restTime || 0,
          sets: ex.sets || 1,
          reps: ex.reps || 0,
          weight: ex.weight || 0
        }))
      };

      const response = await api.put(`/workouts/${publicId}`, formatted);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // DELETAR
  async deleteWorkout(publicId) {
    try {
      const response = await api.delete(`/workouts/${publicId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // ESTATÍSTICAS
  async getWorkoutStats() {
    try {
      const response = await api.get('/workouts/stats');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // ERRO
  handleError(error) {
    if (error.response) {
      return {
        message: error.response.data?.message || 'Erro no servidor',
        status: error.response.status
      };
    }
    return { message: 'Sem conexão com o servidor', status: 0 };
  }
};

export default workoutService;