// models/User.model.js - VERSÃO FINAL CORRIGIDA
import mongoose from 'mongoose';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
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
  
  name: {
    type: String,
    required: true,
    trim: true
  },
  
  email: {
    type: String,
    required: true,
    lowercase: true
  },
  
  password: {
    type: String,
    required: true
  },

  // GARANTA QUE É SEMPRE ARRAY
  refreshTokens: {
    type: [{
      token: {
        type: String,
        required: true
      },
      deviceInfo: {
        userAgent: String,
        ip: String,
        lastUsed: Date
      },
      expiresAt: {
        type: Date,
        required: true
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    default: [] // <--- ESSA LINHA É CRÍTICA!
  },

  role: {
    type: String,
    enum: ['super_admin', 'admin', 'manager', 'trainer', 'viewer'],
    default: 'viewer'
  },

  permissions: {
    canManageUsers: { type: Boolean, default: false },
    canManageWorkouts: { type: Boolean, default: false },
    canManageCompany: { type: Boolean, default: false },
    canViewAnalytics: { type: Boolean, default: false },
    canManageBilling: { type: Boolean, default: false }
  },

  isLocked: { type: Boolean, default: false },
  loginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date },
  lastLogin: { type: Date }

}, {
  timestamps: true
});

// ===================== MÉTODOS =====================

// Adicionar refresh token
userSchema.methods.addRefreshToken = async function(token, deviceInfo = {}) {
  // GARANTE QUE É ARRAY
  if (!Array.isArray(this.refreshTokens)) {
    this.refreshTokens = [];
  }

  this.refreshTokens.push({
    token,
    deviceInfo: {
      userAgent: deviceInfo.userAgent || 'unknown',
      ip: deviceInfo.ip || 'unknown',
      lastUsed: new Date()
    },
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
    createdAt: new Date()
  });

  // Limita a 5 sessões
  if (this.refreshTokens.length > 5) {
    this.refreshTokens = this.refreshTokens.slice(-5);
  }

  return this.save();
};

// Limpar tokens expirados
userSchema.methods.cleanExpiredTokens = async function() {
  if (!Array.isArray(this.refreshTokens)) {
    this.refreshTokens = [];
    return this;
  }

  const now = new Date();
  this.refreshTokens = this.refreshTokens.filter(token => 
    token.expiresAt > now
  );

  return this.save();
};

// Resetar tentativas de login
userSchema.methods.resetLoginAttempts = async function() {
  this.loginAttempts = 0;
  this.lockUntil = null;
  this.isLocked = false;
  return this.save();
};

export default mongoose.model('User', userSchema);