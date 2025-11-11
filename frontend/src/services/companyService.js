// src/services/companyService.js
import api from './api';
import { useAuthStore } from './authService';

const companyService = {
  // Buscar configurações da empresa
  async getCompanySettings() {
    try {
      const response = await api.get('/company/settings/settings');
      
      // SEU INTERCEPTOR já retorna response.data, então acesse diretamente
      if (!response.success) {
        throw new Error(response.message || 'Erro ao buscar configurações');
      }

      return response;
    } catch (error) {
      console.error('❌ Erro ao buscar configurações:', error);
      throw this.handleError(error);
    }
  },

  // Atualizar configurações da empresa
  async updateCompanySettings(settings, logoFile = null) {
    try {

      // Criar FormData para enviar arquivos
      const formData = new FormData();

      // Adicionar campos de texto
      Object.keys(settings).forEach(key => {
        if (key !== 'logoPreview' && settings[key] !== undefined) {
          const value = settings[key];
          formData.append(
            key,
            typeof value === 'object' ? JSON.stringify(value) : value
          );
        }
      });

      // Adicionar arquivo de logo se existir
      if (logoFile) {
        formData.append('logo', logoFile);
      }

      // Adicionar flag para remover logo se não há preview
      if (!settings.logoPreview && settings.removeLogo !== false) {
        formData.append('removeLogo', 'true');
      }

      const response = await api.put('/company/settings/settings', formData);
      

      // SEU INTERCEPTOR já retorna response.data, então acesse diretamente
      if (!response.success) {
        throw new Error(response.message || 'Erro ao atualizar configurações');
      }

      // Atualiza o store global com as novas informações da empresa
      const authStore = useAuthStore.getState();
      if (authStore.company && response.data) {
        const updatedCompany = {
          ...authStore.company,
          name: response.data.name,
          slogan: response.data.slogan,
          logo: response.data.logo ? { url: response.data.logo } : null,
          theme: {
            primaryColor: response.data.primaryColor,
            secondaryColor: response.data.secondaryColor
          },
          settings: {
            ...authStore.company.settings,
            language: response.data.language
          },
          contact: response.data.contact,
          social: response.data.social
        };

        authStore.setAuth(authStore.user, updatedCompany);
      }

      return response;
    } catch (error) {
      console.error('❌ Erro ao atualizar configurações:', error);
      throw this.handleError(error);
    }
  },

  // Buscar informações do plano
  async getPlanInfo() {
    try {
      const response = await api.get('/company/settings/plan');

      // SEU INTERCEPTOR já retorna response.data
      if (!response.success) {
        throw new Error(response.message || 'Erro ao buscar informações do plano');
      }
      return response;
    } catch (error) {
      console.error('❌ Erro ao buscar informações do plano:', error);
      throw this.handleError(error);
    }
  },

  // Atualizar plano
  async updatePlan(plan) {
    try {

      const response = await api.put('/company/settings/plan', { plan });

      // SEU INTERCEPTOR já retorna response.data
      if (!response.success) {
        throw new Error(response.message || 'Erro ao atualizar plano');
      }
      // Atualiza o store global com o novo plano
      const authStore = useAuthStore.getState();
      if (authStore.company && response.data) {
        const updatedCompany = {
          ...authStore.company,
          plan: response.data.plan,
          settings: {
            ...authStore.company.settings,
            maxUsers: response.data.maxUsers
          }
        };

        authStore.setAuth(authStore.user, updatedCompany);
      }

      return response;
    } catch (error) {
      console.error('❌ Erro ao atualizar plano:', error);
      throw this.handleError(error);
    }
  },

  handleError(error) {
    console.error('🔴 Erro no companyService:', error);

    if (error.response) {
      return {
        message: error.response.data?.message || error.message || 'Erro no servidor',
        errors: error.response.data?.errors,
        status: error.response.status
      };
    } else if (error.request) {
      return {
        message: 'Erro de conexão com o servidor',
        status: 0
      };
    } else {
      return {
        message: error.message || 'Erro desconhecido',
        status: -1
      };
    }
  }
};

export default companyService;