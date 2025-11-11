// src/components/LogoUpload.jsx
import React, { useRef, useState } from 'react';
import { useCompanySettings } from '../../../hooks/useCompanySettings';

const LogoUpload = () => {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const { 
    settings, 
    uploadLogo, 
    removeLogo, 
    uploadProgress, 
    isUploading,
    error 
  } = useCompanySettings();

  const handleFileSelect = async (file) => {
    if (!file) return;

    // Validações
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas arquivos de imagem.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 2MB.');
      return;
    }

    try {
      const result = await uploadLogo(file);
      if (result.success) {
      }
    } catch (err) {
      console.error('Erro no upload:', err);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleRemoveLogo = async () => {
    if (window.confirm('Tem certeza que deseja remover a logo?')) {
      try {
        const result = await removeLogo();
        if (result.success) {
        }
      } catch (err) {
        console.error('Erro ao remover logo:', err);
      }
    }
  };

  return (
    <div className="logo-upload-container">
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900">Logo da Empresa</h3>
        <p className="text-sm text-gray-500">
          Faça upload da logo da sua empresa. Formatos suportados: JPG, PNG, SVG. Máximo: 2MB
        </p>
      </div>

      {/* Preview da Logo */}
      {settings?.logo && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Logo atual:</p>
          <div className="flex items-center space-x-4">
            <img
              src={settings.logo}
              alt="Logo da empresa"
              className="w-20 h-20 object-contain border border-gray-300 rounded-lg"
            />
            <button
              type="button"
              onClick={handleRemoveLogo}
              disabled={isUploading}
              className="px-3 py-2 text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
            >
              Remover
            </button>
          </div>
        </div>
      )}

      {/* Área de Upload */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        } ${isUploading ? 'opacity-50' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={isUploading}
        />

        {isUploading ? (
          <div className="space-y-3">
            <div className="w-12 h-12 mx-auto border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
            <div>
              <p className="text-sm font-medium text-gray-700">Fazendo upload...</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">{uploadProgress}%</p>
            </div>
          </div>
        ) : (
          <>
            <div className="mx-auto w-12 h-12 text-gray-400 mb-3">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  Clique para upload
                </button>{' '}
                ou arraste e solte
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG, SVG até 2MB
              </p>
            </div>
          </>
        )}
      </div>

      {/* Mensagem de Erro */}
      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
};

export default LogoUpload;