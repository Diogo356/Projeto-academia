// src/components/admin/CompanySettings.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  FaSave,
  FaUpload,
  FaPalette,
  FaGlobe,
  FaBuilding,
  FaEye,
  FaCheck,
  FaTimes,
  FaImage,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useCompanySettings } from '../../../../hooks/useCompanySettings';
import { useAuthStore } from '../../../../services/authService';

const CompanySettings = () => {
  const [company, setCompany] = useState({
    name: '',
    slogan: '',
    logoPreview: null,
    primaryColor: '#3B82F6',
    secondaryColor: '#1E40AF',
    language: 'pt-BR',
    contact: {
      email: '',
      phone: '',
      address: ''
    },
    social: {
      instagram: '',
      facebook: '',
      whatsapp: ''
    }
  });

  const [logoFile, setLogoFile] = useState(null);
  const fileInputRef = useRef(null);
  const [saveStatus, setSaveStatus] = useState({ type: '', message: '' });
  const [isSaving, setIsSaving] = useState(false);

  // Use o hook personalizado
  const { settings: backendSettings, updateSettings, isLoading: isInitializing } = useCompanySettings();
  const currentCompany = useAuthStore(state => state.company);

  // Carregar dados do backend quando o hook terminar de carregar
  useEffect(() => {
    if (backendSettings && !isInitializing) {

      setCompany({
        name: backendSettings.name || currentCompany?.name || '',
        slogan: backendSettings.slogan || currentCompany?.slogan || '',
        logoPreview: backendSettings.logo || currentCompany?.logo?.url || null,
        primaryColor: backendSettings.primaryColor || currentCompany?.theme?.primaryColor || '#3B82F6',
        secondaryColor: backendSettings.secondaryColor || currentCompany?.theme?.secondaryColor || '#1E40AF',
        language: backendSettings.language || currentCompany?.settings?.language || 'pt-BR',
        contact: backendSettings.contact || currentCompany?.contact || {
          email: '',
          phone: '',
          address: ''
        },
        social: backendSettings.social || currentCompany?.social || {
          instagram: '',
          facebook: '',
          whatsapp: ''
        }
      });
    }
  }, [backendSettings, isInitializing, currentCompany]);

  // Salvar configurações
  const saveSettings = async () => {
    setIsSaving(true);

    try {
      // Preparar dados para envio (remover logoPreview)
      const { logoPreview, ...settingsToSave } = company;

      const result = await updateSettings(settingsToSave, logoFile);

      if (result.success) {
        setSaveStatus({
          type: 'success',
          message: result.data?.message || 'Configurações salvas com sucesso!'
        });
        // Limpar arquivo após envio bem-sucedido
        setLogoFile(null);
      } else {
        setSaveStatus({
          type: 'error',
          message: result.error?.message || 'Erro ao salvar configurações.'
        });
      }

    } catch (error) {
      setSaveStatus({
        type: 'error',
        message: error.message || 'Erro ao salvar configurações.'
      });
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveStatus({ type: '', message: '' }), 3000);
    }
  };

  // Upload de logo
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setSaveStatus({
          type: 'error',
          message: 'Arquivo muito grande. Máximo 2MB.'
        });
        return;
      }

      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        setSaveStatus({
          type: 'error',
          message: 'Por favor, selecione um arquivo de imagem.'
        });
        return;
      }

      // Salvar o arquivo para envio
      setLogoFile(file);

      // Criar preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setCompany(prev => ({
          ...prev,
          logoPreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setCompany(prev => ({
      ...prev,
      logoPreview: null
    }));
    setLogoFile(null);

    // Limpar input file
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const languages = [
    { code: 'pt-BR', name: 'Português (BR)', flag: '🇧🇷' },
  ];

  // Cores pré-definidas para cada tipo
  const presetColors = {
    primary: [
      '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899',
      '#6366F1', '#06B6D4', '#84CC16', '#F97316', '#DC2626', '#7C3AED'
    ],
    secondary: [
      '#1E40AF', '#059669', '#D97706', '#DC2626', '#7C3AED', '#DB2777',
      '#4F46E5', '#0D9488', '#65A30D', '#EA580C', '#991B1B', '#6D28D9'
    ]
  };

  if (isInitializing && !backendSettings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-600 mt-4">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FaBuilding className="text-blue-600" />
            Configurações da Empresa
          </h2>
          <p className="text-gray-600 mt-2">Personalize sua academia com sua marca e preferências</p>
        </div>

        <button
          onClick={saveSettings}
          disabled={isSaving}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all flex items-center space-x-2 disabled:opacity-50 disabled:transform-none"
        >
          {isSaving ? (
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
          ) : (
            <FaSave className="text-lg" />
          )}
          <span>{isSaving ? 'Salvando...' : 'Salvar Alterações'}</span>
        </button>
      </div>

      {/* Status Message */}
      <AnimatePresence>
        {saveStatus.message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-2xl border-2 flex items-center space-x-3 ${saveStatus.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
              }`}
          >
            {saveStatus.type === 'success' ? (
              <FaCheck className="text-green-500 text-xl" />
            ) : (
              <FaTimes className="text-red-500 text-xl" />
            )}
            <span className="font-medium">{saveStatus.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Coluna Principal */}
        <div className="xl:col-span-2 space-y-6">
          {/* Identidade Visual */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 lg:p-8"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <FaPalette className="text-blue-600" />
              Identidade Visual
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nome da Academia *
                </label>
                <input
                  type="text"
                  value={company.name}
                  onChange={(e) => setCompany(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                  placeholder="Ex: Iron Gym"
                />
                <p className="text-xs text-gray-500 mt-1">Nome que aparecerá no sistema</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Slogan
                </label>
                <input
                  type="text"
                  value={company.slogan}
                  onChange={(e) => setCompany(prev => ({ ...prev, slogan: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                  placeholder="Ex: Força, foco e resultados"
                />
                <p className="text-xs text-gray-500 mt-1">Frase que representa sua academia</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 lg:p-8"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <FaEnvelope className="text-blue-600" />
              Informações de Contato
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <FaEnvelope className="text-gray-400" />
                  Email
                </label>
                <input
                  type="email"
                  value={company.contact.email}
                  onChange={(e) => setCompany(prev => ({
                    ...prev,
                    contact: { ...prev.contact, email: e.target.value }
                  }))}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                  placeholder="contato@academia.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <FaPhone className="text-gray-400" />
                  Telefone
                </label>
                <input
                  type="tel"
                  value={company.contact.phone}
                  onChange={(e) => setCompany(prev => ({
                    ...prev,
                    contact: { ...prev.contact, phone: e.target.value }
                  }))}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                  placeholder="(11) 99999-9999"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-gray-400" />
                  Endereço
                </label>
                <input
                  type="text"
                  value={company.contact.address}
                  onChange={(e) => setCompany(prev => ({
                    ...prev,
                    contact: { ...prev.contact, address: e.target.value }
                  }))}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                  placeholder="Rua das Academias, 123"
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl shadow-lg w-full border border-gray-100 p-6 lg:p-8"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <FaGlobe className="text-blue-600" />
              Redes Sociais
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instagram
                </label>
                <input
                  type="text"
                  value={company.social.instagram}
                  onChange={(e) => setCompany(prev => ({
                    ...prev,
                    social: { ...prev.social, instagram: e.target.value }
                  }))}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                  placeholder="@suaacademia"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Facebook
                </label>
                <input
                  type="text"
                  value={company.social.facebook}
                  onChange={(e) => setCompany(prev => ({
                    ...prev,
                    social: { ...prev.social, facebook: e.target.value }
                  }))}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                  placeholder="/suaacademia"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  WhatsApp
                </label>
                <input
                  type="text"
                  value={company.social.whatsapp}
                  onChange={(e) => setCompany(prev => ({
                    ...prev,
                    social: { ...prev.social, whatsapp: e.target.value }
                  }))}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                  placeholder="(11) 99999-9999"
                />
              </div>
            </div>
          </motion.div>

        </div>
        <div className="space-y-6">
          {/* Upload de Logo */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 text-center"
          >
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center justify-center gap-2">
              <FaImage className="text-blue-600" />
              Logo da Empresa
            </h3>

            <div className="mb-4">
              {company.logoPreview ? (
                <div className="relative">
                  <img
                    src={company.logoPreview}
                    alt="Logo"
                    className="w-32 h-32 mx-auto object-contain rounded-2xl border-4 border-gray-100 shadow-lg"
                  />
                  <button
                    onClick={removeLogo}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <FaTimes className="text-xs" />
                  </button>
                </div>
              ) : (
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl border-4 border-dashed border-gray-300 flex items-center justify-center">
                  <FaImage className="text-gray-400 text-2xl" />
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="hidden"
            />

            <button
              onClick={triggerFileInput}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 w-full"
            >
              <FaUpload />
              {company.logoPreview ? 'Alterar Logo' : 'Escolher Logo'}
            </button>

            <p className="text-xs text-gray-500 mt-2">PNG, JPG • Máx. 2MB</p>
          </motion.div>

          {/* Idioma */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6"
          >
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FaGlobe className="text-blue-600" />
              Idioma
            </h3>

            <select
              value={company.language}
              onChange={(e) => setCompany(prev => ({ ...prev, language: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </motion.div>

          {/* Informações do Plano */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6"
          >
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FaBuilding className="text-blue-600" />
              Plano Atual
            </h3>

            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl text-center">
              <div className="text-2xl font-bold mb-1">
                {currentCompany?.plan ? currentCompany.plan.charAt(0).toUpperCase() + currentCompany.plan.slice(1) : 'Básico'}
              </div>
              <div className="text-blue-100 text-sm">
                {currentCompany?.settings?.maxUsers ? `Até ${currentCompany.settings.maxUsers} usuários` : 'Até 50 usuários'}
              </div>
            </div>

            <button className="w-full mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors">
              Gerenciar Plano
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CompanySettings;