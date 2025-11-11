// src/hooks/useCompanyData.js
import { useEffect } from 'react';
import { useAuthStore } from '../services/authService';
import companyService from '../services/companyService';

export const useCompanyData = () => {
  const { company, setAuth, user } = useAuthStore();

  useEffect(() => {
    const loadCompanyData = async () => {
      // Só carrega se já temos um usuário autenticado mas não temos company completa
      if (user && (!company || !company.logo)) {
        try {
          const response = await companyService.getCompanySettings();
          
          if (response.success && response.data) {
            
            // Atualiza o store com os dados completos da empresa
            const updatedCompany = {
              ...company,
              ...response.data,
              logo: response.data.logo ? { url: response.data.logo } : company?.logo,
              theme: {
                primaryColor: response.data.primaryColor || company?.theme?.primaryColor,
                secondaryColor: response.data.secondaryColor || company?.theme?.secondaryColor
              }
            };
            
            setAuth(user, updatedCompany);
          }
        } catch (error) {
          console.error('❌ Erro ao carregar dados da empresa:', error);
        }
      }
    };

    loadCompanyData();
  }, [user, company, setAuth]);

  return { company };
};