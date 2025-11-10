// src/components/admin/CompanySettings.jsx
import React, { useState, useEffect } from 'react';

const CompanySettings = () => {
  const [company, setCompany] = useState({
    name: 'Minha Academia',
    slogan: 'Treine com propósito',
    logo: null,
    logoPreview: '/default-logo.png',
    primaryColor: '#3B82F6', // azul padrão
    secondaryColor: '#1E40AF',
    plan: 'pro',
    language: 'pt-BR'
  });

  const [showColorPicker, setShowColorPicker] = useState({ primary: false, secondary: false });

  // Carregar dados do localStorage (simulação de backend)
  useEffect(() => {
    const saved = localStorage.getItem('companySettings');
    if (saved) {
      const parsed = JSON.parse(saved);
      setCompany(prev => ({ ...prev, ...parsed }));
      if (parsed.logo) setCompany(prev => ({ ...prev, logoPreview: parsed.logo }));
    }
  }, []);

  // Salvar no localStorage
  const saveSettings = () => {
    localStorage.setItem('companySettings', JSON.stringify(company));
    alert('Configurações salvas com sucesso!');
  };

  // Upload de logo
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCompany(prev => ({
          ...prev,
          logo: file,
          logoPreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Planos disponíveis
  const plans = [
    { id: 'free', name: 'Grátis', color: 'gray' },
    { id: 'pro', name: 'Pro', color: 'blue' },
    { id: 'enterprise', name: 'Enterprise', color: 'purple' }
  ];

  const languages = [
    { code: 'pt-BR', name: 'Português (BR)' },
    { code: 'en-US', name: 'English (US)' },
    { code: 'es-ES', name: 'Español' }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Configurações da Empresa</h2>
          <p className="text-gray-600">Personalize sua academia com sua marca</p>
        </div>
        <button
          onClick={saveSettings}
          className="btn btn-primary"
        >
          Salvar Alterações
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna 1: Identidade Visual */}
        <div className="lg:col-span-2 space-y-6">
          {/* Nome e Slogan */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-lg mb-4">Identidade da Marca</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Academia</label>
                <input
                  type="text"
                  value={company.name}
                  onChange={(e) => setCompany(prev => ({ ...prev, name: e.target.value }))}
                  className="input w-full"
                  placeholder="Ex: Iron Gym"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slogan</label>
                <input
                  type="text"
                  value={company.slogan}
                  onChange={(e) => setCompany(prev => ({ ...prev, slogan: e.target.value }))}
                  className="input w-full"
                  placeholder="Ex: Força, foco e resultados"
                />
              </div>
            </div>
          </div>

          {/* Cores do Tema */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-lg mb-4">Cores do Layout</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cor Primária</label>
                <div className="flex items-center space-x-3">
                  <div
                    className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer shadow-sm"
                    style={{ backgroundColor: company.primaryColor }}
                    onClick={() => setShowColorPicker(prev => ({ ...prev, primary: !prev.primary }))}
                  />
                  <input
                    type="text"
                    value={company.primaryColor}
                    onChange={(e) => setCompany(prev => ({ ...prev, primaryColor: e.target.value }))}
                    className="input flex-1"
                  />
                </div>
                {showColorPicker.primary && (
                  <div className="mt-2 grid grid-cols-6 gap-1">
                    {['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'].map(color => (
                      <div
                        key={color}
                        className="w-full h-8 rounded cursor-pointer border-2 border-white shadow"
                        style={{ backgroundColor: color }}
                        onClick={() => {
                          setCompany(prev => ({ ...prev, primaryColor: color }));
                          setShowColorPicker(prev => ({ ...prev, primary: false }));
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cor Secundária</label>
                <div className="flex items-center space-x-3">
                  <div
                    className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer shadow-sm"
                    style={{ backgroundColor: company.secondaryColor }}
                    onClick={() => setShowColorPicker(prev => ({ ...prev, secondary: !prev.secondary }))}
                  />
                  <input
                    type="text"
                    value={company.secondaryColor}
                    onChange={(e) => setCompany(prev => ({ ...prev, secondaryColor: e.target.value }))}
                    className="input flex-1"
                  />
                </div>
                {showColorPicker.secondary && (
                  <div className="mt-2 grid grid-cols-6 gap-1">
                    {['#1E40AF', '#059669', '#D97706', '#DC2626', '#7C3AED', '#DB2777'].map(color => (
                      <div
                        key={color}
                        className="w-full h-8 rounded cursor-pointer border-2 border-white shadow"
                        style={{ backgroundColor: color }}
                        onClick={() => {
                          setCompany(prev => ({ ...prev, secondaryColor: color }));
                          setShowColorPicker(prev => ({ ...prev, secondary: false }));
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Coluna 2: Logo, Plano e Idioma */}
        <div className="space-y-6">
          {/* Upload de Logo */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
            <h3 className="font-semibold text-lg mb-4">Logo da Empresa</h3>
            <div className="mb-4">
              <img
                src={company.logoPreview}
                alt="Logo"
                className="w-32 h-32 mx-auto object-contain rounded-lg border-2 border-dashed border-gray-300"
              />
            </div>
            <label className="btn btn-outline cursor-pointer">
              Escolher Logo
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden"
              />
            </label>
            <p className="text-xs text-gray-500 mt-2">PNG, JPG até 2MB</p>
          </div>

          {/* Plano Atual */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-lg mb-4">Plano Atual</h3>
            <div className="space-y-3">
              {plans.map(plan => (
                <label
                  key={plan.id}
                  className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    company.plan === plan.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="plan"
                      value={plan.id}
                      checked={company.plan === plan.id}
                      onChange={(e) => setCompany(prev => ({ ...prev, plan: e.target.value }))}
                      className="radio radio-primary"
                    />
                    <span className="font-medium capitalize">{plan.name}</span>
                  </div>
                  {company.plan === plan.id && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Ativo</span>
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Idioma */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-lg mb-4">Idioma da Plataforma</h3>
            <select
              value={company.language}
              onChange={(e) => setCompany(prev => ({ ...prev, language: e.target.value }))}
              className="select w-full"
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Preview do Tema */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <h3 className="font-semibold text-lg mb-4">Preview do Tema</h3>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-200 rounded-lg border-2 border-dashed" style={{ backgroundImage: company.logoPreview !== '/default-logo.png' ? `url(${company.logoPreview})` : 'none', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }} />
            <div>
              <div className="text-xl font-bold" style={{ color: company.primaryColor }}>
                {company.name || 'Sua Academia'}
              </div>
              <div className="text-sm text-gray-600">{company.slogan || 'Seu slogan aqui'}</div>
            </div>
          </div>
          <div className="mt-4 flex space-x-2">
            <button className="px-4 py-2 rounded-lg text-white text-sm font-medium" style={{ backgroundColor: company.primaryColor }}>
              Botão Primário
            </button>
            <button className="px-4 py-2 rounded-lg text-white text-sm font-medium" style={{ backgroundColor: company.secondaryColor }}>
              Botão Secundário
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanySettings;