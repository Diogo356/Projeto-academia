// src/services/userService.js
import api from './api';
import toast from 'react-hot-toast';

class UserService {
  // === LISTAR USUÁRIOS ===
  async getUsers(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);
      if (filters.search) params.append('search', filters.search);
      if (filters.role) params.append('role', filters.role);
      
      const response = await api.get(`/users?${params.toString()}`);
      
      if (!response.success) throw new Error(response.message);
      
      return response;
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      toast.error(error.message || 'Erro ao carregar usuários');
      throw error;
    }
  }

  // === CRIAR USUÁRIO ===
  async createUser(userData) {
    try {
      const response = await api.post('/users', userData);
      
      if (!response.success) throw new Error(response.message);
      
      toast.success('Usuário criado com sucesso!');
      return response;
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      toast.error(error.message || 'Erro ao criar usuário');
      throw error;
    }
  }

  // === ATUALIZAR USUÁRIO ===
  async updateUser(publicId, userData) {
    try {
      const response = await api.put(`/users/${publicId}`, userData);
      
      if (!response.success) throw new Error(response.message);
      
      toast.success('Usuário atualizado com sucesso!');
      return response;
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      toast.error(error.message || 'Erro ao atualizar usuário');
      throw error;
    }
  }

  // === DELETAR USUÁRIO ===
  async deleteUser(publicId) {
    try {
      const response = await api.delete(`/users/${publicId}`);
      
      if (!response.success) throw new Error(response.message);
      
      toast.success('Usuário excluído com sucesso!');
      return response;
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      toast.error(error.message || 'Erro ao excluir usuário');
      throw error;
    }
  }

  // === ATUALIZAR SENHA ===
  async updatePassword(publicId, passwordData) {
    try {
      const response = await api.put(`/users/${publicId}/password`, passwordData);
      
      if (!response.success) throw new Error(response.message);
      
      toast.success('Senha atualizada com sucesso!');
      return response;
    } catch (error) {
      console.error('Erro ao atualizar senha:', error);
      toast.error(error.message || 'Erro ao atualizar senha');
      throw error;
    }
  }

  // === ALTERNAR STATUS ===
  async toggleUserStatus(publicId) {
    try {
      const response = await api.patch(`/users/${publicId}/toggle-status`);
      
      if (!response.success) throw new Error(response.message);
      
      toast.success(`Usuário ${response.status === 'active' ? 'ativado' : 'desativado'} com sucesso!`);
      return response;
    } catch (error) {
      console.error('Erro ao alternar status:', error);
      toast.error(error.message || 'Erro ao alternar status');
      throw error;
    }
  }
}

export default new UserService();