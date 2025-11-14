// src/components/admin/ExerciseForm.utils.js
import { validateFile } from './ExerciseForm.constants';
import { useState } from 'react';

// Hook personalizado para gerenciar campos tocados
export const useTouchedFields = () => {
  const [touchedFields, setTouchedFields] = useState({});

  const handleFieldBlur = (field) => {
    setTouchedFields(prev => ({ ...prev, [field]: true }));
  };

  const markAllFieldsAsTouched = (fields) => {
    const newTouchedFields = {};
    fields.forEach(field => {
      newTouchedFields[field] = true;
    });
    setTouchedFields(newTouchedFields);
  };

  const shouldShowError = (field, errors) => {
    return touchedFields[field] && errors[field];
  };

  return {
    touchedFields,
    setTouchedFields,
    handleFieldBlur,
    markAllFieldsAsTouched,
    shouldShowError
  };
};

// Função para anexar mídia
export const handleMediaAttach = (file, fileInputRef, onChange) => {
  try {
    validateFile(file);

    console.log('📁 Anexando arquivo:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    // Criar URL local para preview
    const fileUrl = URL.createObjectURL(file);

    // Atualizar o exercício com o arquivo anexado
    onChange(prev => ({
      ...prev,
      mediaFile: {
        file, // Arquivo original
        url: fileUrl, // URL local para preview
        type: file.type.startsWith('video/') ? 'video' : 'image',
        name: file.name,
        size: file.size
      },
      video: '' // Limpar URL do Cloudinary já que é apenas anexo
    }));

    console.log('✅ Arquivo anexado com sucesso:', file.name);

  } catch (error) {
    console.error('❌ Erro ao anexar arquivo:', error);
    
    // Mensagens de erro específicas
    let errorMessage = 'Erro ao anexar arquivo. ';
    
    if (error.message.includes('Formato não suportado')) {
      errorMessage = error.message;
    } else if (error.message.includes('muito grande')) {
      errorMessage = error.message;
    } else {
      errorMessage += error.message || 'Tente novamente.';
    }
    
    alert(errorMessage);
    
    // Limpar input em caso de erro
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    throw error;
  }
};

// Função para remover mídia
export const removeMedia = (safeExercise, onChange, fileInputRef) => {
  // Revogar URL local para liberar memória
  if (safeExercise.mediaFile?.url) {
    URL.revokeObjectURL(safeExercise.mediaFile.url);
  }
  
  onChange(prev => ({ 
    ...prev, 
    mediaFile: null,
    video: '' // Limpar URL também
  }));
  if (fileInputRef.current) {
    fileInputRef.current.value = '';
  }
};

// Função para lidar com seleção de tipo
export const handleTypeSelect = (type, handleChange) => {
  handleChange('type', type);
  if (type !== 'strength') {
    handleChange('sets', 1);
    handleChange('reps', 0);
    handleChange('weight', 0);
  }
};

// Função para lidar com seleção de músculos
export const handleMuscleSelect = (muscle, onChange) => {
  onChange(prev => ({
    ...prev,
    targetMuscles: prev.targetMuscles.includes(muscle)
      ? prev.targetMuscles.filter(m => m !== muscle)
      : [...prev.targetMuscles, muscle]
  }));
};

// Função para preparar submissão - CORRIGIDA
export const prepareSubmit = (safeExercise, markAllFieldsAsTouched, onSubmit) => {
  // Campos obrigatórios para marcar como touched
  const allFields = ['name', 'duration'];
  if (safeExercise.type === 'strength') {
    allFields.push('reps');
  }
  
  // Usar a função markAllFieldsAsTouched corretamente
  markAllFieldsAsTouched(allFields);

  // Preparar dados para envio (mantém mediaFile para possível upload posterior)
  const exerciseToSubmit = {
    ...safeExercise
  };
  
  return exerciseToSubmit;
};

// Helper para cálculos de duração
export const getDurationInMinutes = (duration) => Math.floor(duration / 60);

// Helper para texto do formulário
export const getFormTexts = (isEditing) => ({
  formTitle: isEditing ? 'Editar Exercício' : 'Novo Exercício',
  submitButtonText: isEditing ? 'Atualizar' : 'Adicionar',
  submitButtonIcon: isEditing ? 'FaSave' : 'FaPlus'
});