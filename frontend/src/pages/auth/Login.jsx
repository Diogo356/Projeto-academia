// src/pages/auth/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../../services/authService';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    }

    if (Object.keys(newErrors).length > 0) {
      setError(Object.values(newErrors)[0]);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const result = await AuthService.login({
        email: formData.email,
        password: formData.password
      });
      
      if (result.success) {
        navigate('/admin');
      }
    } catch (error) {
      setError(error.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-white">🏋️‍♂️</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Acesse sua conta
            </h1>
            <p className="text-gray-600 mt-2">
              Entre no painel administrativo da sua empresa
            </p>
          </div>

          {error && (
            <div className="alert alert-error mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email corporativo
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input input-bordered w-full"
                placeholder="empresa@exemplo.com"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input input-bordered w-full"
                placeholder="Sua senha"
                required
                disabled={loading}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="checkbox checkbox-sm" disabled={loading} />
                <span className="ml-2 text-sm text-gray-600">Lembrar-me</span>
              </label>
              
              <button type="button" className="text-sm text-blue-600 hover:text-blue-700 font-medium" disabled={loading}>
                Esqueci minha senha
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full py-3 text-lg font-semibold"
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Entrando...
                </>
              ) : (
                '🚀 Entrar no sistema'
              )}
            </button>

          </form>

          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-3 text-sm text-gray-500">ou</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          <div className="text-center">
            <p className="text-gray-600">
              Não tem uma conta?{' '}
              <Link to="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
                Cadastre sua empresa
              </Link>
            </p>
          </div>

        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            © 2024 Workout Pro. Todos os direitos reservados.
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;