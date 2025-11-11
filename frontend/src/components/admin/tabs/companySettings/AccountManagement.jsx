// src/components/admin/AccountManagement.jsx
import React, { useState, useEffect } from 'react';
import {
  FaUserPlus,
  FaTrash,
  FaEdit,
  FaEye,
  FaSearch,
  FaFilter,
  FaUser,
  FaUserShield,
  FaCheck,
  FaTimes,
  FaEnvelope,
  FaPhone, 
  FaUsers,
  FaSpinner
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import UserService from '../../../../services/userService';
import CreateUserModal from './CreateUserModal';

const AccountManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [actionStatus, setActionStatus] = useState({ type: '', message: '' });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0
  });

  // Carregar usuários
  const loadUsers = async (page = 1) => {
    try {
      setLoading(true);
      
      const filters = {
        page,
        limit: 10,
        search: searchTerm,
        role: roleFilter !== 'all' ? roleFilter : ''
      };

      const response = await UserService.getUsers(filters);
      
      setUsers(response.users || []);
      setPagination(response.pagination || { current: 1, pages: 1, total: 0 });
      
    } catch (error) {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Carregar usuários quando mudar filtros
  useEffect(() => {
    loadUsers(1);
  }, [searchTerm, roleFilter]);

  // Filtrar usuários localmente por status (já que a API não filtra por status)
  const filteredUsers = users.filter(user => {
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesStatus;
  });

  // Traduzir papel
  const translateRole = (role) => {
    const roles = {
      admin: 'Administrador',
      viewer: 'Visualizador'
    };
    return roles[role] || role;
  };

  // Traduzir status
  const translateStatus = (status) => {
    const statuses = {
      active: 'Ativo',
      inactive: 'Inativo'
    };
    return statuses[status] || status;
  };

  // Obter ícone do papel
  const getRoleIcon = (role) => {
    const icons = {
      admin: FaUserShield,
      viewer: FaEye
    };
    return icons[role] || FaUser;
  };

  // Obter cor do status
  const getStatusColor = (status) => {
    const colors = {
      active: 'green',
      inactive: 'red'
    };
    return colors[status] || 'gray';
  };

  // Criar nova conta
  const handleCreateUser = async (userData) => {
    try {
      const response = await UserService.createUser(userData);
      setIsCreateModalOpen(false);
      loadUsers(); // Recarrega a lista
    } catch (error) {
      // Erro já é tratado no service
    }
  };

  // Deletar conta
  const deleteAccount = async (publicId, userName) => {
    if (!window.confirm(`Tem certeza que deseja excluir a conta de "${userName}"?`)) {
      return;
    }

    try {
      await UserService.deleteUser(publicId);
      loadUsers(); // Recarrega a lista
    } catch (error) {
      // Erro já é tratado no service
    }
  };

  // Alternar status
  const toggleStatus = async (publicId, currentStatus) => {
    try {
      await UserService.toggleUserStatus(publicId);
      loadUsers(); // Recarrega a lista
    } catch (error) {
      // Erro já é tratado no service
    }
  };

  // Formatar data
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-600 mt-4">Carregando usuários...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <FaUsers className="text-blue-600" />
            Gestão de Contas
          </h2>
          <p className="text-gray-600 mt-2">
            Gerencie usuários e permissões do sistema
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all flex items-center space-x-2"
        >
          <FaUserPlus />
          <span>Nova Conta</span>
        </button>
      </div>

      {/* Filtros e Busca */}
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Busca */}
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
            />
          </div>

          {/* Filtro por Papel */}
          <div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
            >
              <option value="all">Todos os papéis</option>
              <option value="admin">Administrador</option>
              <option value="viewer">Visualizador</option>
            </select>
          </div>

          {/* Filtro por Status */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
            >
              <option value="all">Todos os status</option>
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Usuários */}
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <FaUsers className="text-4xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {loading ? 'Carregando...' : 'Nenhum usuário encontrado'}
            </h3>
            <p className="text-gray-600">
              {searchTerm || roleFilter !== 'all' || statusFilter !== 'all'
                ? 'Tente ajustar os filtros de busca.'
                : 'Comece criando o primeiro usuário.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Usuário</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Contato</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Papel</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Criado em</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user, index) => {
                  const RoleIcon = getRoleIcon(user.role);
                  const statusColor = getStatusColor(user.status);
                  
                  return (
                    <motion.tr
                      key={user.publicId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">
                              {translateRole(user.role)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <FaEnvelope className="text-gray-400" />
                            <span>{user.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <RoleIcon className={`text-lg ${
                            user.role === 'admin' ? 'text-red-500' : 'text-blue-500'
                          }`} />
                          <span className="font-medium">{translateRole(user.role)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleStatus(user.publicId, user.status)}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                            statusColor === 'green' 
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                        >
                          {translateStatus(user.status)}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            title="Editar"
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                            onClick={() => {/* Implementar edição */}}
                          >
                            <FaEdit className="text-sm" />
                          </button>
                          <button
                            onClick={() => deleteAccount(user.publicId, user.name)}
                            title="Excluir"
                            className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                          >
                            <FaTrash className="text-sm" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Paginação */}
      {pagination.pages > 1 && (
        <div className="flex justify-center items-center space-x-4">
          <button
            onClick={() => loadUsers(pagination.current - 1)}
            disabled={pagination.current === 1}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          
          <span className="text-sm text-gray-600">
            Página {pagination.current} de {pagination.pages}
          </span>
          
          <button
            onClick={() => loadUsers(pagination.current + 1)}
            disabled={pagination.current === pagination.pages}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Próxima
          </button>
        </div>
      )}

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 text-center">
          <div className="text-2xl font-bold text-gray-900 mb-2">{pagination.total}</div>
          <div className="text-gray-600">Total de Usuários</div>
        </div>
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 text-center">
          <div className="text-2xl font-bold text-gray-900 mb-2">
            {users.filter(u => u.status === 'active').length}
          </div>
          <div className="text-gray-600">Usuários Ativos</div>
        </div>
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 text-center">
          <div className="text-2xl font-bold text-gray-900 mb-2">
            {users.filter(u => u.role === 'viewer').length}
          </div>
          <div className="text-gray-600">Visualizadores</div>
        </div>
      </div>

      {/* Modal de Criar Usuário */}
      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateUser}
      />
    </div>
  );
};

export default AccountManagement;