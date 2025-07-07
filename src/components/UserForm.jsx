import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiX, FiSave, FiEye, FiEyeOff } = FiIcons;

const UserForm = ({ user, onClose }) => {
  const { addUser, updateUser } = useData();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    role: 'tutor',
    status: 'active',
    permissions: {
      canViewStudents: true,
      canEditStudents: false,
      canDeleteStudents: false,
      canManageSessions: true,
      canViewReports: false,
      canManageUsers: false,
    }
  });

  const roles = [
    { value: 'admin', label: 'Administrator', description: 'Full system access' },
    { value: 'tutor', label: 'Tutor', description: 'Manage assigned students and sessions' },
    { value: 'parent', label: 'Parent', description: 'View children\'s progress and sessions' },
    { value: 'viewer', label: 'Viewer', description: 'Read-only access' }
  ];

  const statuses = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ];

  useEffect(() => {
    if (user) {
      setFormData({
        ...user,
        password: '', // Don't show existing password
        permissions: user.permissions || formData.permissions
      });
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = {
      ...formData,
      permissions: getPermissionsByRole(formData.role, formData.permissions)
    };

    if (user) {
      // Don't update password if it's empty
      if (!userData.password) {
        delete userData.password;
      }
      updateUser(user.id, userData);
    } else {
      addUser(userData);
    }
    onClose();
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('permissions.')) {
      const permissionKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        permissions: {
          ...prev.permissions,
          [permissionKey]: checked
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    setFormData(prev => ({
      ...prev,
      role: newRole,
      permissions: getPermissionsByRole(newRole)
    }));
  };

  const getPermissionsByRole = (role, customPermissions = null) => {
    const defaultPermissions = {
      admin: {
        canViewStudents: true,
        canEditStudents: true,
        canDeleteStudents: true,
        canManageSessions: true,
        canViewReports: true,
        canManageUsers: true,
      },
      tutor: {
        canViewStudents: true,
        canEditStudents: false,
        canDeleteStudents: false,
        canManageSessions: true,
        canViewReports: false,
        canManageUsers: false,
      },
      parent: {
        canViewStudents: true,
        canEditStudents: false,
        canDeleteStudents: false,
        canManageSessions: false,
        canViewReports: true,
        canManageUsers: false,
      },
      viewer: {
        canViewStudents: true,
        canEditStudents: false,
        canDeleteStudents: false,
        canManageSessions: false,
        canViewReports: false,
        canManageUsers: false,
      }
    };

    return customPermissions || defaultPermissions[role] || defaultPermissions.viewer;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {user ? 'Edit User' : 'Add New User'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <SafeIcon icon={FiX} className="text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username *
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password {!user && '*'}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  required={!user}
                  placeholder={user ? 'Leave empty to keep current password' : ''}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <SafeIcon icon={showPassword ? FiEyeOff : FiEye} />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role *
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleRoleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                required
              >
                {roles.map(role => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                {roles.find(r => r.value === formData.role)?.description}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                required
              >
                {statuses.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Permissions */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Permissions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="permissions.canViewStudents"
                  checked={formData.permissions.canViewStudents}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">
                  View Students
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="permissions.canEditStudents"
                  checked={formData.permissions.canEditStudents}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Edit Students
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="permissions.canDeleteStudents"
                  checked={formData.permissions.canDeleteStudents}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Delete Students
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="permissions.canManageSessions"
                  checked={formData.permissions.canManageSessions}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Manage Sessions
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="permissions.canViewReports"
                  checked={formData.permissions.canViewReports}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">
                  View Reports
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="permissions.canManageUsers"
                  checked={formData.permissions.canManageUsers}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Manage Users
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <SafeIcon icon={FiSave} />
              {user ? 'Update User' : 'Create User'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default UserForm;