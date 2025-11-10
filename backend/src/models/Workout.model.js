// models/Workout.model.js
import mongoose from 'mongoose';
import crypto from 'crypto';

const exerciseSchema = new mongoose.Schema({
  publicId: {
    type: String,
    required: true,
    default: () => crypto.randomBytes(12).toString('hex')
  },
  
  name: {
    type: String,
    required: true,
    trim: true
  },
  
  duration: {
    type: Number, // em segundos
    required: true,
    min: 0
  },
  
  type: {
    type: String,
    enum: ['cardio', 'strength', 'warmup', 'cooldown', 'flexibility'],
    default: 'cardio'
  },
  
  targetMuscles: [{
    type: String,
    trim: true
  }],
  
  mediaFile: {
    url: String,
    type: {
      type: String,
      enum: ['image', 'video']
    },
    name: String
  },
  
  instructions: {
    type: String,
    trim: true
  },
  
  restTime: {
    type: Number, // em segundos
    default: 0
  },
  
  sets: {
    type: Number,
    default: 1,
    min: 1
  },
  
  reps: {
    type: Number,
    default: 0,
    min: 0
  },
  
  weight: {
    type: Number, // em kg
    default: 0,
    min: 0
  }
});

const workoutSchema = new mongoose.Schema({
  publicId: {
    type: String,
    unique: true,
    required: true,
    default: () => crypto.randomBytes(16).toString('hex')
  },
  
  companyPublicId: {
    type: String,
    ref: 'Company',
    required: true
  },
  
  createdByPublicId: {
    type: String,
    ref: 'User',
    required: true
  },
  
  // Dados básicos do treino
  name: {
    type: String,
    required: [true, 'Nome do treino é obrigatório'],
    trim: true
  },
  
  description: {
    type: String,
    trim: true
  },
  
  category: {
    type: String,
    enum: ['cardio', 'strength', 'hiit', 'yoga', 'pilates', 'mobility', 'custom'],
    default: 'custom'
  },
  
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'intermediate'
  },
  
  // Array de exercícios
  exercises: [exerciseSchema],
  
  // Calculado automaticamente
  totalDuration: {
    type: Number, // em segundos
    default: 0
  },
  
  // Metadados
  isActive: {
    type: Boolean,
    default: true
  },
  
  isTemplate: {
    type: Boolean,
    default: false
  },
  
  tags: [{
    type: String,
    trim: true
  }]

}, {
  timestamps: true
});

// Índices para performance
workoutSchema.index({ publicId: 1 });
workoutSchema.index({ companyPublicId: 1, createdAt: -1 });
workoutSchema.index({ companyPublicId: 1, category: 1 });
workoutSchema.index({ companyPublicId: 1, isActive: 1 });
workoutSchema.index({ createdByPublicId: 1 });

// Middleware para calcular duração total antes de salvar
workoutSchema.pre('save', function(next) {
  if (this.exercises && this.exercises.length > 0) {
    this.totalDuration = this.exercises.reduce((total, exercise) => {
      return total + (exercise.duration || 0);
    }, 0);
  } else {
    this.totalDuration = 0;
  }
  next();
});

const Workout = mongoose.model('Workout', workoutSchema);
export default Workout;