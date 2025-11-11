// src/hooks/useCompanySettings.js
import { useState, useEffect } from 'react';
import companyService from '../services/companyService';
import { useAuthStore } from '../services/authService';

export const useCompanySettings = () => {
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const company = useAuthStore(state => state.company);

  // Carrega as configurações quando o componente monta
  const loadSettings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await companyService.getCompanySettings();
      setSettings(response.data);
    } catch (err) {
      console.error('Erro ao carregar configurações:', err);
      setError(err.message || 'Erro ao carregar configurações');
    } finally {
      setIsLoading(false);
    }
  };

  // Atualiza as configurações
  const updateSettings = async (newSettings, logoFile = null) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await companyService.updateCompanySettings(newSettings, logoFile);
      setSettings(response.data);
      
      return { success: true, data: response };
    } catch (err) {
      console.error('Erro ao atualizar configurações:', err);
      setError(err.message || 'Erro ao atualizar configurações');
      return { success: false, error: err };
    } finally {
      setIsLoading(false);
    }
  };

  // Atualiza o plano
  const updatePlan = async (plan) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await companyService.updatePlan(plan);
      
      // Atualiza as configurações locais se necessário
      if (settings) {
        setSettings(prev => ({
          ...prev,
          plan: response.data.data.plan
        }));
      }
      
      return { success: true, data: response.data };
    } catch (err) {
      console.error('Erro ao atualizar plano:', err);
      setError(err.message || 'Erro ao atualizar plano');
      return { success: false, error: err };
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    loadSettings();
  }, []);

  // Sincroniza com o store global quando a company muda
 useEffect(() => {
    if (company && settings) {
      // Garante que as configurações locais estão sincronizadas com o store
      if (company.name !== settings.name || company.plan !== settings.plan) {
        setSettings(prev => ({
          ...prev,
          name: company.name,
          plan: company.plan,
          primaryColor: company.theme?.primaryColor,
          secondaryColor: company.theme?.secondaryColor,
          contact: company.contact,
          social: company.social
        }));
      }
    }
  }, [company, settings]);

  return {
    settings,
    isLoading,
    error,
    updateSettings,
    updatePlan,
    reloadSettings: loadSettings
  };
};