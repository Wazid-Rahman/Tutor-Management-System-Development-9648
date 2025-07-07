import React from 'react';
import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiX, FiCalendar, FiDollarSign, FiCheck, FiClock, FiUser, FiBook } = FiIcons;

const ChildProgress = ({ child, onClose }) => {
  const { getStudentSessions, getChildProgress, formatCurrency } = useData();

  const studentSessions = getStudentSessions(child.id);
  const progress = getChildProgress(child.id);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {child.studentName}'s Progress
            </h2>
            <div className="flex gap-6 mt-2 text-sm">
              <span className="text-gray-600">Grade: <strong>{child.grade}</strong></span>
              <span className="text-gray-600">Subject: <strong>{child.subject}</strong></span>
              <span className="text-gray-600">Tutor: <strong>{child.tutor}</strong></span>
              <span className={`font-medium ${child.status === 'Active' ? 'text-green-600' : 'text-gray-600'}`}>
                Status: <strong>{child.status}</strong>
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <SafeIcon icon={FiX} className="text-xl" />
          </button>
        </div>

        <div className="p-6">
          {/* Progress Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-800">Total Sessions</p>
                  <p className="text-2xl font-bold text-blue-900">{progress.totalSessions}</p>
                </div>
                <SafeIcon icon={FiCalendar} className="text-2xl text-blue-600" />
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-800">Paid Sessions</p>
                  <p className="text-2xl font-bold text-green-900">{progress.paidSessions}</p>
                </div>
                <SafeIcon icon={FiCheck} className="text-2xl text-green-600" />
              </div>
            </div>
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-800">Pending Sessions</p>
                  <p className="text-2xl font-bold text-red-900">{progress.unpaidSessions}</p>
                </div>
                <SafeIcon icon={FiClock} className="text-2xl text-red-600" />
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-800">Fee/Session</p>
                  <p className="text-2xl font-bold text-purple-900">{formatCurrency(child.feePerSession || 0)}</p>
                </div>
                <SafeIcon icon={FiDollarSign} className="text-2xl text-purple-600" />
              </div>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-emerald-800">Amount Paid</p>
                  <p className="text-2xl font-bold text-emerald-900">{formatCurrency(progress.paidAmount)}</p>
                </div>
                <SafeIcon icon={FiCheck} className="text-2xl text-emerald-600" />
              </div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-800">Amount Pending</p>
                  <p className="text-2xl font-bold text-orange-900">{formatCurrency(progress.unpaidAmount)}</p>
                </div>
                <SafeIcon icon={FiClock} className="text-2xl text-orange-600" />
              </div>
            </div>
            <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-indigo-800">Total Amount</p>
                  <p className="text-2xl font-bold text-indigo-900">{formatCurrency(progress.totalFee)}</p>
                </div>
                <SafeIcon icon={FiDollarSign} className="text-2xl text-indigo-600" />
              </div>
            </div>
          </div>

          {/* Payment Progress Bar */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium text-gray-900">Payment Progress</h3>
              <span className="text-sm font-medium text-gray-600">
                {progress.totalSessions > 0 ? 
                  `${Math.round((progress.paidSessions / progress.totalSessions) * 100)}% Complete` : 
                  'No sessions yet'
                }
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500"
                style={{ 
                  width: progress.totalSessions > 0 ? 
                    `${(progress.paidSessions / progress.totalSessions) * 100}%` : 
                    '0%' 
                }}
              />
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>Paid: {progress.paidSessions}</span>
              <span>Pending: {progress.unpaidSessions}</span>
              <span>Total: {progress.totalSessions}</span>
            </div>
          </div>

          {/* Sessions by Month */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Session History</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {months.map(month => {
                const sessions = studentSessions[month] || [];
                const paidCount = sessions.filter(s => typeof s === 'object' && s.paid).length;
                const unpaidCount = sessions.length - paidCount;
                
                return (
                  <div key={month} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">{month}</h4>
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                        {sessions.length}
                      </span>
                    </div>
                    
                    {sessions.length === 0 ? (
                      <p className="text-gray-500 text-sm">No sessions</p>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-green-600">Paid: {paidCount}</span>
                          <span className="text-red-600">Pending: {unpaidCount}</span>
                        </div>
                        <div className="space-y-1">
                          {sessions.slice(0, 3).map((session, index) => {
                            const isObject = typeof session === 'object';
                            const sessionDate = isObject ? session.date : session;
                            const isPaid = isObject ? session.paid : false;
                            
                            return (
                              <div
                                key={index}
                                className={`flex items-center justify-between p-2 rounded text-xs ${
                                  isPaid ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-700'
                                }`}
                              >
                                <span>{new Date(sessionDate).toLocaleDateString()}</span>
                                {isPaid && <SafeIcon icon={FiCheck} className="text-green-600" />}
                              </div>
                            );
                          })}
                          {sessions.length > 3 && (
                            <p className="text-xs text-gray-500 text-center">+{sessions.length - 3} more</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          {child.lastPaid && (
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <h3 className="text-lg font-medium text-green-800 mb-2">Recent Payment</h3>
              <p className="text-sm text-green-700">
                Last payment made on: <strong>{new Date(child.lastPaid).toLocaleDateString()}</strong>
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ChildProgress;