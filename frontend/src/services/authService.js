import { create } from 'zustand';
import api from './api';
import toast from 'react-hot-toast';

// === ZUSTAND STORE (Sem alterações) ===
export const useAuthStore = create((set) => ({
    user: null,
    company: null,
    isLoading: false,
    isCheckingAuth: false,

    setAuth: (user, company) => {
        set({ user, company });
    },

    clearAuth: () => {
        set({ user: null, company: null });
    },

    setCheckingAuth: (checking) => set({ isCheckingAuth: checking }),

    updateCompanySettings: (settings) => set((state) => ({
        company: state.company ? { ...state.company, ...settings } : null
    })),

    updateCompanyPlan: (plan, maxUsers) => set((state) => ({
        company: state.company ? {
            ...state.company,
            plan,
            settings: { ...state.company.settings, maxUsers }
        } : null
    }))
}));

// === AUTH SERVICE ===
class AuthService {
    constructor() {
        this._checkAuthPromise = null;
    }

    // === REGISTRO (Sem alterações) ===
    async register(companyData) {
        useAuthStore.setState({ isLoading: true });
        try {
            const response = await api.post('/auth/register', companyData);
            if (!response.success) throw new Error(response.message);
            const { user, company } = response.data;
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

    // === LOGIN (Sem alterações) ===
    async login(credentials) {
        useAuthStore.setState({ isLoading: true });
        try {
            const response = await api.post('/auth/login', credentials);
            if (!response.success) throw new Error(response.message);
            const { user, company } = response.data;
            useAuthStore.getState().setAuth(user, company);
            toast.success(`Bem-vindo, ${user.name}!`);
            return { success: true, user, company };

        } catch (error) {
            // ⭐️ AJUSTE DE SEGURANÇA AQUI ⭐️
            // Define sua mensagem genérica padrão para falhas de login
            const genericMessage = 'Email ou senha incorreta.';

            if (error.response) {
                const status = error.response.status;

                // Se for 401 (Não autorizado), 423 (Bloqueado), ou 404 (Não encontrado)
                // Nós FORÇAMOS a mensagem genérica no front-end.
                if (status === 401 || status === 423 || status === 404) {
                    // NÃO mostre toast. APENAS LANCE o erro genérico.
                    throw new Error(genericMessage);
                } else {
                    // Para outros erros (ex: 500), podemos mostrar a mensagem do backend
                    toast.error(error.response.data?.message || 'Erro inesperado no login.');
                }
            } else {
                // Para erros sem resposta (ex: rede)
                toast.error('Não foi possível conectar ao servidor.');
            }

            throw error; // Lança o erro para o formulário (ex: React Hook Form)

        } finally {
            useAuthStore.setState({ isLoading: false });
        }
    }

    // === REFRESH TOKEN (Sem alterações) ===
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

    // === LOGOUT (Sem alterações) ===
    async logout() {
        try {
            await api.post('/auth/logout').catch(() => { });
        } catch (error) {
            console.error('Erro no logout:', error);
        } finally {
            useAuthStore.getState().clearAuth();
            toast.success('Sessão encerrada');
        }
    }

    // === VERIFICA AUTENTICAÇÃO (CORRIGIDO) ===
    async checkAuth() {
        // Previne múltiplas verificações simultâneas
        if (this._checkAuthPromise) {
            return this._checkAuthPromise;
        }

        const store = useAuthStore.getState();

        // ⭐️ MUDANÇA: Previne que o checkAuth seja chamado se já estiver rodando
        // (Embora o useEffect(..) em App.js já previna isso, é uma boa defesa)
        if (store.isCheckingAuth) {
            return;
        }

        store.setCheckingAuth(true);

        this._checkAuthPromise = new Promise(async (resolve) => {
            try {
                // ⭐️ MUDANÇA 1: Adiciona a flag '_isInitialAuthCheck: true'
                // Isso dirá ao interceptor para NÃO tentar dar refresh nesta chamada
                const authPromise = api.get('/auth/me', {
                    _isInitialAuthCheck: true
                });

                // ⭐️ MUDANÇA 2: Remove o Promise.race.
                const response = await authPromise;

                if (response.success) {
                    const { user, company } = response.data;
                    store.setAuth(user, company);
                    resolve(true); // Sucesso!
                } else {
                    // Isso não deve acontecer se a API seguir o padrão de jogar erro
                    throw new Error('Resposta não sucedida');
                }
            } catch (error) {
                // ⭐️ MUDANÇA 3: Isso agora vai pegar o 401 IMEDIATAMENTE
                // pois o interceptor (api.js) não vai mais tentar o refresh.

                console.warn('Falha na verificação de autenticação inicial:', error.message);
                this.clearAuthSilently();
                resolve(false); // Falha (e rápido!)
            } finally {
                store.setCheckingAuth(false);
                this._checkAuthPromise = null;
            }
        });

        return this._checkAuthPromise;
    }

    // === LIMPEZA SILENCIOSA (Sem alterações) ===
    clearAuthSilently() {
        useAuthStore.setState({ user: null, company: null });
    }

    // === GETTERS (Sem alterações) ===
    isAuthenticated() {
        return !!useAuthStore.getState().user;
    }
    getCurrentUser() {
        return useAuthStore.getState().user;
    }
    getCurrentCompany() {
        return useAuthStore.getState().company;
    }
    get isLoading() {
        return useAuthStore.getState().isLoading;
    }
    get isCheckingAuth() {
        return useAuthStore.getState().isCheckingAuth;
    }

    // === MÉTODO DE ATUALIZAÇÃO (Sem alterações) ===
    updateCompanyInStore(companyData) {
        const store = useAuthStore.getState();
        if (store.company) {
            store.setAuth(store.user, { ...store.company, ...companyData });
        }
    }
}

export default new AuthService();