import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import UserForm from './UserForm';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiEdit, FiTrash2, FiUser, FiShield, FiUsers, FiCopy, FiEye, FiEyeOff, FiAlertCircle } = FiIcons;

const UserManagement = () => {
  const { user } = useAuth();
  const { users, deleteUser } = useData();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showPasswords, setShowPasswords] = useState({});
  const [error, setError] = useState('');

  const handleEditUser = (userToEdit) => {
    setError('');
    setEditingUser(userToEdit);
    setShowAddForm(true);
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
    setEditingUser(null);
  };

  const handleDeleteUser = async (userId) => {
    if (userId === user.id) {
      alert("You cannot delete your own account!");
      return;
    }

    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        setError('');
        await deleteUser(userId);
      } catch (error) {
        setError(error.message || 'Failed to delete user');
      }
    }
  };

  const handleCopyCredentials = (userItem) => {
    const credentials = `Username: ${userItem.username}\nPassword: ${userItem.password || 'Not visible'}`;
    navigator.clipboard.writeText(credentials)
      .then(() => {
        alert('Credentials copied to clipboard!');
      })
      .catch(() => {
        alert('Failed to copy credentials');
      });
  };

  const togglePasswordVisibility = (userId) => {
    setShowPasswords(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'tutor': return 'bg-blue-100 text-blue-800';
      case 'parent': return 'bg-green-100 text-green-800';
      case 'viewer': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return FiShield;
      case 'tutor': return FiUser;
      case 'parent': return FiUser;
      case 'viewer': return FiUsers;
      default: return FiUser;
    }
  };

  const stats = {
    totalUsers: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    tutors: users.filter(u => u.role === 'tutor').length,
    parents: users.filter(u => u.role === 'parent').length,
    viewers: users.filter(u => u.role === 'viewer').length,
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <SafeIcon icon={FiUsers} className="text-lg text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Admins</p>
              <p className="text-2xl font-bold text-red-600">{stats.admins}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <SafeIcon icon={FiShield} className="text-lg text-red-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tutors</p>
              <p className="text-2xl font-bold text-blue-600">{stats.tutors}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <SafeIcon icon={FiUser} className="text-lg text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Parents</p>
              <p className="text-2xl font-bold text-green-600">{stats.parents}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <SafeIcon icon={FiUser} className="text-lg text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Viewers</p>
              <p className="text-2xl font-bold text-gray-600">{stats.viewers}</p>
            </div>
            <div className="bg-gray-100 p-3 rounded-full">
              <SafeIcon icon={FiUsers} className="text-lg text-gray-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Action Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setError('');
            setEditingUser(null);
            setShowAddForm(true);
          }}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <SafeIcon icon={FiPlus} />
          Add New User
        </motion.button>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-start gap-2"
        >
          <SafeIcon icon={FiAlertCircle} className="mt-0.5 flex-shrink-0" />
          <div>{error}</div>
        </motion.div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Credentials
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((userItem, index) => (
                <motion.tr
                  key={userItem.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="bg-gray-100 p-2 rounded-full mr-3">
                        <SafeIcon icon={getRoleIcon(userItem.role)} className="text-lg text-gray-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {userItem.name}
                          {userItem.id === user.id && (
                            <span className="ml-2 text-xs text-blue-600">(You)</span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          @{userItem.username}
                        </div>
                        {userItem.email && (
                          <div className="text-sm text-gray-500">
                            {userItem.email}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">Username:</span>
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">{userItem.username}</code>
                      </div>
                      {userItem.password_hash && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">Password:</span>
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {showPasswords[userItem.id] ? userItem.password_hash : '••••••••'}
                          </code>
                          <button
                            onClick={() => togglePasswordVisibility(userItem.id)}
                            className="text-gray-400 hover:text-gray-600 p-1"
                            title={showPasswords[userItem.id] ? 'Hide password' : 'Show password'}
                          >
                            <SafeIcon icon={showPasswords[userItem.id] ? FiEyeOff : FiEye} className="text-xs" />
                          </button>
                        </div>
                      )}
                      <button
                        onClick={() => handleCopyCredentials({...userItem, password: showPasswords[userItem.id] ? userItem.password_hash : null})}
                        className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
                        title="Copy credentials"
                      >
                        <SafeIcon icon={FiCopy} className="text-xs" />
                        Copy
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(userItem.role)}`}>
                      {userItem.role?.charAt(0).toUpperCase() + userItem.role?.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${userItem.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {userItem.status?.charAt(0).toUpperCase() + userItem.status?.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {userItem.created_at ? new Date(userItem.created_at).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditUser(userItem)}
                        className="text-indigo-600 hover:text-indigo-800 p-1"
                        title="Edit User"
                      >
                        <SafeIcon icon={FiEdit} />
                      </button>
                      {userItem.id !== user.id && (
                        <button
                          onClick={() => handleDeleteUser(userItem.id)}
                          className="text-red-600 hover:text-red-800 p-1"
                          title="Delete User"
                        >
                          <SafeIcon icon={FiTrash2} />
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit User Modal */}
      {showAddForm && (
        <UserForm user={editingUser} onClose={handleCloseForm} />
      )}
    </div>
  );
};

export default UserManagement;