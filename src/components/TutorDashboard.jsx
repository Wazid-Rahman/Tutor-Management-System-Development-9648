import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import SessionManager from './SessionManager';
import Header from './Header';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUsers, FiCalendar, FiClock } = FiIcons;

const TutorDashboard = () => {
  const { user } = useAuth();
  const { students, getTotalSessions } = useData();
  
  // Filter students assigned to this tutor
  const myStudents = students.filter(student => 
    student.tutor && student.tutor.toLowerCase() === user?.name.toLowerCase()
  );

  const stats = {
    myStudents: myStudents.length,
    totalSessions: myStudents.reduce((total, student) => total + getTotalSessions(student.id), 0),
    activeStudents: myStudents.filter(s => s.status === 'Active').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}
          </h1>
          <p className="text-gray-600">Manage your tutoring sessions</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">My Students</p>
                <p className="text-3xl font-bold text-gray-900">{stats.myStudents}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <SafeIcon icon={FiUsers} className="text-xl text-blue-600" />
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
                <p className="text-sm font-medium text-gray-600">Total Sessions</p>
                <p className="text-3xl font-bold text-green-600">{stats.totalSessions}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <SafeIcon icon={FiCalendar} className="text-xl text-green-600" />
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
                <p className="text-sm font-medium text-gray-600">Active Students</p>
                <p className="text-3xl font-bold text-orange-600">{stats.activeStudents}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <SafeIcon icon={FiClock} className="text-xl text-orange-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Session Manager */}
        <SessionManager students={myStudents} />
      </div>
    </div>
  );
};

export default TutorDashboard;