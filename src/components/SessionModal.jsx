import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiX, FiCalendar, FiPlus, FiTrash2, FiDollarSign, FiCheck } = FiIcons;

const SessionModal = ({ student, onClose }) => {
  const { getStudentSessions, updateSessions, markSessionAsPaid } = useData();
  const { userType } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState('January');
  const [selectedDate, setSelectedDate] = useState('');

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const studentSessions = getStudentSessions(student.id);

  const handleAddSession = () => {
    if (!selectedDate) return;

    const currentSessions = studentSessions[selectedMonth] || [];
    const newSessions = [...currentSessions, selectedDate].sort();
    updateSessions(student.id, selectedMonth, newSessions);
    setSelectedDate('');
  };

  const handleRemoveSession = (month, dateToRemove) => {
    const currentSessions = studentSessions[month] || [];
    const newSessions = currentSessions.filter(session => {
      const sessionDate = typeof session === 'string' ? session : session.date;
      return sessionDate !== dateToRemove;
    });
    updateSessions(student.id, month, newSessions);
  };

  const handleMarkAsPaid = (month, date, currentPaidStatus) => {
    markSessionAsPaid(student.id, month, date, !currentPaidStatus);
  };

  const getTotalSessions = () => {
    return Object.values(studentSessions).reduce((total, dates) => total + dates.length, 0);
  };

  const getPaidSessions = () => {
    return Object.values(studentSessions).reduce((total, dates) => {
      return total + dates.filter(session => typeof session === 'object' && session.paid).length;
    }, 0);
  };

  const getUnpaidSessions = () => {
    return getTotalSessions() - getPaidSessions();
  };

  const calculateTotalFee = () => {
    const totalSessions = getTotalSessions();
    const feePerSession = parseFloat(student.feePerSession) || 0;
    return totalSessions * feePerSession;
  };

  const calculatePaidAmount = () => {
    const paidSessions = getPaidSessions();
    const feePerSession = parseFloat(student.feePerSession) || 0;
    return paidSessions * feePerSession;
  };

  const calculateUnpaidAmount = () => {
    const unpaidSessions = getUnpaidSessions();
    const feePerSession = parseFloat(student.feePerSession) || 0;
    return unpaidSessions * feePerSession;
  };

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
              Session Management - {student.studentName}
            </h2>
            <div className="flex gap-6 mt-2 text-sm">
              <span className="text-gray-600">Total Sessions: <strong>{getTotalSessions()}</strong></span>
              <span className="text-green-600">Paid: <strong>{getPaidSessions()}</strong></span>
              <span className="text-red-600">Unpaid: <strong>{getUnpaidSessions()}</strong></span>
              <span className="text-blue-600">Total Fee: <strong>${calculateTotalFee().toFixed(2)}</strong></span>
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
          {/* Payment Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-800">Paid Amount</p>
                  <p className="text-2xl font-bold text-green-900">${calculatePaidAmount().toFixed(2)}</p>
                </div>
                <SafeIcon icon={FiCheck} className="text-2xl text-green-600" />
              </div>
            </div>
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-800">Unpaid Amount</p>
                  <p className="text-2xl font-bold text-red-900">${calculateUnpaidAmount().toFixed(2)}</p>
                </div>
                <SafeIcon icon={FiDollarSign} className="text-2xl text-red-600" />
              </div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-800">Total Amount</p>
                  <p className="text-2xl font-bold text-blue-900">${calculateTotalFee().toFixed(2)}</p>
                </div>
                <SafeIcon icon={FiDollarSign} className="text-2xl text-blue-600" />
              </div>
            </div>
          </div>

          {/* Add Session Form */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Session</h3>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  {months.map(month => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddSession}
                disabled={!selectedDate}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <SafeIcon icon={FiPlus} />
                Add Session
              </motion.button>
            </div>
          </div>

          {/* Sessions by Month */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {months.map(month => {
              const sessions = studentSessions[month] || [];
              return (
                <div key={month} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">{month}</h4>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                      {sessions.length} sessions
                    </span>
                  </div>
                  
                  {sessions.length === 0 ? (
                    <p className="text-gray-500 text-sm">No sessions scheduled</p>
                  ) : (
                    <div className="space-y-2">
                      {sessions.map((session, index) => {
                        const isObject = typeof session === 'object';
                        const sessionDate = isObject ? session.date : session;
                        const isPaid = isObject ? session.paid : false;
                        
                        return (
                          <div
                            key={index}
                            className={`flex items-center justify-between p-2 rounded-lg border ${
                              isPaid 
                                ? 'bg-green-50 border-green-200' 
                                : 'bg-gray-50 border-gray-200'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-700">
                                {new Date(sessionDate).toLocaleDateString()}
                              </span>
                              {isPaid && (
                                <SafeIcon icon={FiCheck} className="text-xs text-green-600" />
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              {userType === 'admin' && (
                                <button
                                  onClick={() => handleMarkAsPaid(month, sessionDate, isPaid)}
                                  className={`p-1 rounded ${
                                    isPaid 
                                      ? 'text-red-600 hover:text-red-800' 
                                      : 'text-green-600 hover:text-green-800'
                                  }`}
                                  title={isPaid ? 'Mark as unpaid' : 'Mark as paid'}
                                >
                                  <SafeIcon icon={FiDollarSign} className="text-xs" />
                                </button>
                              )}
                              <button
                                onClick={() => handleRemoveSession(month, sessionDate)}
                                className="text-red-600 hover:text-red-800 p-1"
                                title="Remove session"
                              >
                                <SafeIcon icon={FiTrash2} className="text-xs" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SessionModal;