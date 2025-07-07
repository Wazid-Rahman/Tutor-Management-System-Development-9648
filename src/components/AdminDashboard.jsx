import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import StudentForm from './StudentForm';
import StudentList from './StudentList';
import UserManagement from './UserManagement';
import SubjectManagement from './SubjectManagement';
import Header from './Header';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiUsers, FiBarChart3, FiSettings, FiBook, FiDollarSign } = FiIcons;

const AdminDashboard = () => {
  const { user } = useAuth();
  const { students, users, getTotalSessions, getPaidSessions, formatCurrency } = useData();
  const [activeTab, setActiveTab] = useState('students');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setShowAddForm(true);
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
    setEditingStudent(null);
  };

  const totalSessions = students.reduce((total, student) => total + getTotalSessions(student.id), 0);
  const totalPaidSessions = students.reduce((total, student) => total + getPaidSessions(student.id), 0);
  const totalRevenue = students.reduce((total, student) => {
    const paidSessions = getPaidSessions(student.id);
    const feePerSession = parseFloat(student.feePerSession) || 0;
    return total + (paidSessions * feePerSession);
  }, 0);

  const stats = {
    totalStudents: students.length,
    activeStudents: students.filter(s => s.status === 'Active').length,
    totalSessions: totalSessions,
    paidSessions: totalPaidSessions,
    totalUsers: users.length,
    totalRevenue: totalRevenue,
  };

  const tabs = [
    { id: 'students', label: 'Students', icon: FiUsers },
    { id: 'subjects', label: 'Subjects', icon: FiBook },
    { id: 'users', label: 'User Management', icon: FiSettings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}
          </h1>
          <p className="text-gray-600">Manage your tutoring sessions, subjects, and users</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
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
                <p className="text-sm font-medium text-gray-600">Active Students</p>
                <p className="text-2xl font-bold text-green-600">{stats.activeStudents}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <SafeIcon icon={FiBarChart3} className="text-lg text-green-600" />
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
                <p className="text-sm font-medium text-gray-600">Total Sessions</p>
                <p className="text-2xl font-bold text-purple-600">{stats.totalSessions}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <SafeIcon icon={FiBook} className="text-lg text-purple-600" />
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
                <p className="text-sm font-medium text-gray-600">Paid Sessions</p>
                <p className="text-2xl font-bold text-green-600">{stats.paidSessions}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <SafeIcon icon={FiDollarSign} className="text-lg text-green-600" />
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
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-emerald-600">{formatCurrency(stats.totalRevenue)}</p>
              </div>
              <div className="bg-emerald-100 p-3 rounded-full">
                <SafeIcon icon={FiDollarSign} className="text-lg text-emerald-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-orange-600">{stats.totalUsers}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <SafeIcon icon={FiSettings} className="text-lg text-orange-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <SafeIcon icon={tab.icon} />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-[500px]">
          {activeTab === 'students' && (
            <div>
              {/* Action Button */}
              <div className="mb-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowAddForm(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <SafeIcon icon={FiPlus} />
                  Add New Student
                </motion.button>
              </div>

              {/* Student List */}
              <StudentList onEditStudent={handleEditStudent} />

              {/* Add/Edit Student Modal */}
              {showAddForm && (
                <StudentForm 
                  student={editingStudent}
                  onClose={handleCloseForm}
                />
              )}
            </div>
          )}

          {activeTab === 'subjects' && <SubjectManagement />}
          {activeTab === 'users' && <UserManagement />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;