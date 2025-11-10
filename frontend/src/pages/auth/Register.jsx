// src/pages/auth/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../../services/authService';

const Register = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    // Limpa erros
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
    setServerError('');
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Nome da empresa é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setServerError('');

    try {
      const response = await AuthService.register({
        companyName: formData.companyName,
        email: formData.email,
        password: formData.password
      });
      
      if (response.success) {
        // Redirecionar para o admin
        navigate('/admin');
      }
    } catch (error) {
      setServerError(error.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        
        {/* Card de Cadastro */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-white">🏢</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Cadastre sua empresa
            </h1>
            <p className="text-gray-600 mt-2">
              Comece a usar o Workout Pro gratuitamente
            </p>
          </div>

          {/* Erro do servidor */}
          {serverError && (
            <div className="alert alert-error mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{serverError}</span>
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Nome da Empresa */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome da empresa *
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className={`input input-bordered w-full ${errors.companyName ? 'input-error' : ''}`}
                placeholder="Academia Fitness Center"
                disabled={loading}
              />
              {errors.companyName && (
                <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email corporativo *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`input input-bordered w-full ${errors.email ? 'input-error' : ''}`}
                placeholder="contato@empresa.com"
                disabled={loading}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Senha */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`input input-bordered w-full ${errors.password ? 'input-error' : ''}`}
                placeholder="Mínimo 6 caracteres"
                disabled={loading}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirmar Senha */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar senha *
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`input input-bordered w-full ${errors.confirmPassword ? 'input-error' : ''}`}
                placeholder="Digite a senha novamente"
                disabled={loading}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Termos */}
            <label className="flex items-start space-x-3">
              <input 
                type="checkbox" 
                className="checkbox checkbox-sm mt-1" 
                required 
                disabled={loading}
              />
              <span className="text-sm text-gray-600">
                Concordo com os{' '}
                <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                  Termos de Serviço
                </a>{' '}
                e{' '}
                <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                  Política de Privacidade
                </a>
              </span>
            </label>

            {/* Botão de Cadastro */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-success w-full py-3 text-lg font-semibold"
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Criando conta...
                </>
              ) : (
                '🎉 Criar conta gratuita'
              )}
            </button>

          </form>

          {/* Divisor */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-3 text-sm text-gray-500">ou</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Link para Login */}
          <div className="text-center">
            <p className="text-gray-600">
              Já tem uma conta?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                Fazer login
              </Link>
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Teste grátis por 30 dias • Sem necessidade de cartão
          </p>
        </div>

      </div>
    </div>
  );
};

export default Register;