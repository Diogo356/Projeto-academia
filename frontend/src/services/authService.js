// src/services/authService.js
import { create } from 'zustand';
import api from './api';
import toast from 'react-hot-toast';

// === ZUSTAND STORE (APENAS ESTADO DA UI) ===
export const useAuthStore = create((set) => ({
  user: null,
  company: null,
  isLoading: false,
  isCheckingAuth: false,

  setAuth: (user, company) => {
    // NÃO SALVA NADA NO LOCALSTORAGE!
    // Cookies são gerenciados automaticamente pelo backend via withCredentials
    set({ user, company });
  },

  clearAuth: () => {
    // NÃO TEM LOCALSTORAGE PARA LIMPAR!
    set({ user: null, company: null });
  },

  setCheckingAuth: (checking) => set({ isCheckingAuth: checking }),
}));

// === AUTH SERVICE ===
class AuthService {
  constructor() {
    this._checkAuthPromise = null;
  }

  // === REGISTRO ===
  async register(companyData) {
    useAuthStore.setState({ isLoading: true });
    try {
      const response = await api.post('/auth/register', companyData);
      if (!response.success) throw new Error(response.message);

      const { user, company } = response.data;
      
      // APENAS atualiza o estado da UI
      useAuthStore.getState().setAuth(user, company);
      toast.success('Cadastro realizado com sucesso!');
      return { success: true, user, company };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao cadastrar');
      throw error;
    } finally {
      useAuthStore.setState({ isLoading: false });
    }
  }

  // === LOGIN ===
  async login(credentials) {
    useAuthStore.setState({ isLoading: true });
    try {
      const response = await api.post('/auth/login', credentials);
      if (!response.success) throw new Error(response.message);

      const { user, company } = response.data;
      
      // APENAS atualiza o estado da UI
      useAuthStore.getState().setAuth(user, company);
      toast.success(`Bem-vindo, ${user.name}!`);
      return { success: true, user, company };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Credenciais inválidas');
      throw error;
    } finally {
      useAuthStore.setState({ isLoading: false });
    }
  }

  // === REFRESH TOKEN ===
  async refreshToken() {
    try {
      const response = await api.post('/auth/refresh-token');
      if (!response.success) throw new Error(response.message);
      return { success: true };
    } catch (error) {
      this.clearAuthSilently();
      throw error;
    }
  }

  // === LOGOUT ===
  async logout() {
    try {
      await api.post('/auth/logout').catch(() => {});
    } catch (error) {
      console.error('Erro no logout:', error);
    } finally {
      useAuthStore.getState().clearAuth();
      toast.success('Sessão encerrada');
    }
  }

  // === VERIFICA AUTENTICAÇÃO (SIMPLIFICADO) ===
  async checkAuth() {
    // Previne múltiplas verificações simultâneas
    if (this._checkAuthPromise) {
      return this._checkAuthPromise;
    }

    const store = useAuthStore.getState();
    
    if (store.isCheckingAuth) {
      return false;
    }

    store.setCheckingAuth(true);
    
    this._checkAuthPromise = new Promise(async (resolve) => {
      try {
        // Timeout para evitar loops
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout na verificação')), 10000)
        );

        // Faz a requisição para verificar autenticação
        // O axios automaticamente envia os cookies via withCredentials
        const authPromise = api.get('/auth/me');
        const response = await Promise.race([authPromise, timeoutPromise]);
        
        if (response.success) {
          const { user, company } = response.data;
          store.setAuth(user, company);
          resolve(true);
        } else {
          throw new Error('Resposta não sucedida');
        }
      } catch (error) {
        console.log('Erro na verificação de auth:', error.message);
        
        // Se for 401, tenta refresh token
        if (error.response?.status === 401) {
          try {
            await this.refreshToken();
            const retry = await api.get('/auth/me');
            
            if (retry.success) {
              const { user, company } = retry.data;
              store.setAuth(user, company);
              resolve(true);
            } else {
              throw new Error('Falha no retry');
            }
          } catch (refreshError) {
            console.log('Refresh token falhou:', refreshError.message);
            this.clearAuthSilently();
            resolve(false);
          }
        } else {
          // Outros erros - limpa silenciosamente
          this.clearAuthSilently();
          resolve(false);
        }
      } finally {
        store.setCheckingAuth(false);
        this._checkAuthPromise = null;
      }
    });

    return this._checkAuthPromise;
  }

  // === LIMPEZA SILENCIOSA ===
  clearAuthSilently() {
    useAuthStore.setState({ user: null, company: null });
  }

  // === GETTERS ===
  isAuthenticated() {
    return !!useAuthStore.getState().user;
  }

  getCurrentUser() { return useAuthStore.getState().user; }
  getCurrentCompany() { return useAuthStore.getState().company; }
  get isLoading() { return useAuthStore.getState().isLoading; }
  get isCheckingAuth() { return useAuthStore.getState().isCheckingAuth; }
}

export default new AuthService();