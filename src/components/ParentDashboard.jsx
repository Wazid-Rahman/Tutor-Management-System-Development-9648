import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import Header from './Header';
import ChildProgress from './ChildProgress';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUser, FiCalendar, FiDollarSign, FiBook, FiClock, FiTrendingUp } = FiIcons;

const ParentDashboard = () => {
  const { user } = useAuth();
  const { getMyChildren, getChildProgress, formatCurrency } = useData();
  const [selectedChild, setSelectedChild] = useState(null);

  const myChildren = getMyChildren(user?.username);

  const getTotalStats = () => {
    return myChildren.reduce((totals, child) => {
      const progress = getChildProgress(child.id);
      return {
        totalSessions: totals.totalSessions + progress.totalSessions,
        totalFee: totals.totalFee + progress.totalFee,
        paidAmount: totals.paidAmount + progress.paidAmount,
        unpaidAmount: totals.unpaidAmount + progress.unpaidAmount
      };
    }, { totalSessions: 0, totalFee: 0, paidAmount: 0, unpaidAmount: 0 });
  };

  const stats = getTotalStats();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}
          </h1>
          <p className="text-gray-600">Track your children's tutoring progress and sessions</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">My Children</p>
                <p className="text-3xl font-bold text-gray-900">{myChildren.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <SafeIcon icon={FiUser} className="text-xl text-blue-600" />
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
                <p className="text-sm font-medium text-gray-600">Paid Amount</p>
                <p className="text-3xl font-bold text-emerald-600">{formatCurrency(stats.paidAmount)}</p>
              </div>
              <div className="bg-emerald-100 p-3 rounded-full">
                <SafeIcon icon={FiDollarSign} className="text-xl text-emerald-600" />
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
                <p className="text-sm font-medium text-gray-600">Pending Amount</p>
                <p className="text-3xl font-bold text-red-600">{formatCurrency(stats.unpaidAmount)}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <SafeIcon icon={FiClock} className="text-xl text-red-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Children Overview */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">My Children</h2>
          </div>
          
          {myChildren.length === 0 ? (
            <div className="p-12 text-center">
              <SafeIcon icon={FiUser} className="text-4xl text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No children assigned</h3>
              <p className="text-gray-600">Please contact the administrator to assign your children to your account.</p>
            </div>
          ) : (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myChildren.map((child, index) => {
                  const progress = getChildProgress(child.id);
                  
                  return (
                    <motion.div
                      key={child.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setSelectedChild(child)}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="bg-blue-100 p-3 rounded-full">
                          <SafeIcon icon={FiUser} className="text-xl text-blue-600" />
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          child.status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {child.status}
                        </span>
                      </div>
                      
                      <div className="mb-4">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{child.studentName}</h3>
                        <p className="text-sm text-gray-600">Grade {child.grade} • {child.subject}</p>
                        <p className="text-sm text-gray-600">Tutor: {child.tutor}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Sessions</p>
                          <p className="font-semibold text-gray-900">{progress.totalSessions}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Fee/Session</p>
                          <p className="font-semibold text-gray-900">{formatCurrency(child.feePerSession || 0)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Paid</p>
                          <p className="font-semibold text-green-600">{formatCurrency(progress.paidAmount)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Pending</p>
                          <p className="font-semibold text-red-600">{formatCurrency(progress.unpaidAmount)}</p>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-blue-200">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Progress</span>
                          <span className="text-sm font-medium text-blue-600">
                            {progress.totalSessions > 0 ? 
                              `${Math.round((progress.paidSessions / progress.totalSessions) * 100)}% paid` : 
                              'No sessions yet'
                            }
                          </span>
                        </div>
                        <div className="mt-2 bg-blue-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ 
                              width: progress.totalSessions > 0 ? 
                                `${(progress.paidSessions / progress.totalSessions) * 100}%` : 
                                '0%' 
                            }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Child Progress Modal */}
        {selectedChild && (
          <ChildProgress
            child={selectedChild}
            onClose={() => setSelectedChild(null)}
          />
        )}
      </div>
    </div>
  );
};

export default ParentDashboard;