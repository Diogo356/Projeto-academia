// src/components/admin/ExerciseForm.constants.js
import { 
  FaRunning, 
  FaDumbbell, 
  FaFire, 
  FaSnowflake, 
  FaUser 
} from 'react-icons/fa';

export const EXERCISE_TYPES = [
  { 
    value: 'cardio', 
    label: 'Cardio', 
    icon: FaRunning, 
    color: 'blue', 
    bg: 'bg-blue-50', 
    border: 'border-blue-500', 
    text: 'text-blue-700', 
    iconColor: 'text-blue-600' 
  },
  { 
    value: 'strength', 
    label: 'Força', 
    icon: FaDumbbell, 
    color: 'red', 
    bg: 'bg-red-50', 
    border: 'border-red-500', 
    text: 'text-red-700', 
    iconColor: 'text-red-600' 
  },
  { 
    value: 'warmup', 
    label: 'Aquecimento', 
    icon: FaFire, 
    color: 'orange', 
    bg: 'bg-orange-50', 
    border: 'border-orange-500', 
    text: 'text-orange-700', 
    iconColor: 'text-orange-600' 
  },
  { 
    value: 'cooldown', 
    label: 'Desaquecimento', 
    icon: FaSnowflake, 
    color: 'purple', 
    bg: 'bg-purple-50', 
    border: 'border-purple-500', 
    text: 'text-purple-700', 
    iconColor: 'text-purple-600' 
  },
  { 
    value: 'flexibility', 
    label: 'Flexibilidade', 
    icon: FaUser, 
    color: 'green', 
    bg: 'bg-green-50', 
    border: 'border-green-500', 
    text: 'text-green-700', 
    iconColor: 'text-green-600' 
  }
];

export const SUPPORTED_FILE_TYPES = {
  image: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'],
  video: ['video/mp4', 'video/quicktime', 'video/webm']
};

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export const DEFAULT_EXERCISE = {
  name: '',
  duration: 0,
  type: 'cardio',
  restTime: 30,
  sets: 1,
  reps: 0,
  weight: 0,
  targetMuscles: [],
  mediaFile: null,
  video: '',
  instructions: ''
};

// Função de validação de arquivo
export const validateFile = (file) => {
  const validTypes = [...SUPPORTED_FILE_TYPES.image, ...SUPPORTED_FILE_TYPES.video];
  
  if (!validTypes.includes(file.type)) {
    throw new Error('Formato não suportado. Use PNG, JPG, GIF, MP4 ou WEBM.');
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error('Arquivo muito grande! Máximo: 50MB');
  }

  if (file.size === 0) {
    throw new Error('Arquivo vazio');
  }

  return true;
};