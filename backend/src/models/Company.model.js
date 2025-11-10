// models/Company.model.js
import mongoose from 'mongoose';
import crypto from 'crypto';

const companySchema = new mongoose.Schema({
  publicId: {
    type: String,
    unique: true,
    required: true,
    default: () => crypto.randomBytes(16).toString('hex')
  },
  
  name: {
    type: String,
    required: [true, 'Nome da empresa é obrigatório'],
    trim: true
  },
  
  email: {
    type: String,
    required: [true, 'Email é obrigatório'],
    unique: true,
    lowercase: true
  },
  
  password: {
    type: String,
    required: [true, 'Senha é obrigatória']
  },

  settings: {
    maxUsers: { type: Number, default: 5 },
    theme: { type: String, default: 'corporate' },
    language: { type: String, default: 'pt-BR' }
  },

  // Plano e Faturamento
  plan: {
    type: String,
    enum: ['free', 'pro', 'enterprise'],
    default: 'free'
  },

  billing: {
    status: { type: String, enum: ['active', 'pending', 'canceled'], default: 'active' },
    nextBillingDate: Date
  },

  status: {
    type: String,
    enum: ['active', 'suspended', 'canceled'],
    default: 'active'
  }

}, {
  timestamps: true
});

// Índices para performance
companySchema.index({ publicId: 1 });
companySchema.index({ email: 1 });
companySchema.index({ status: 1 });

const Company = mongoose.model('Company', companySchema);
export default Company;