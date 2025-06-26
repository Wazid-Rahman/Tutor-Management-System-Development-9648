import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCalendar, FiPlus, FiTrash2, FiUser } = FiIcons;

const SessionManager = ({ students }) => {
  const { getStudentSessions, updateSessions } = useData();
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('January');
  const [selectedDate, setSelectedDate] = useState('');

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleAddSession = () => {
    if (!selectedStudent || !selectedDate) return;
    
    const studentSessions = getStudentSessions(selectedStudent);
    const currentSessions = studentSessions[selectedMonth] || [];
    const newSessions = [...currentSessions, selectedDate].sort();
    
    updateSessions(selectedStudent, selectedMonth, newSessions);
    setSelectedDate('');
  };

  const handleRemoveSession = (studentId, month, dateToRemove) => {
    const studentSessions = getStudentSessions(studentId);
    const currentSessions = studentSessions[month] || [];
    const newSessions = currentSessions.filter(date => date !== dateToRemove);
    
    updateSessions(studentId, month, newSessions);
  };

  if (students.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <SafeIcon icon={FiUser} className="text-4xl text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No students assigned</h3>
        <p className="text-gray-600">You don't have any students assigned to you yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add Session Form */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Session</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Student
            </label>
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="">Select Student</option>
              {students.map(student => (
                <option key={student.id} value={student.id}>
                  {student.studentName}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Month
            </label>
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
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          
          <div className="flex items-end">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddSession}
              disabled={!selectedStudent || !selectedDate}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <SafeIcon icon={FiPlus} />
              Add Session
            </motion.button>
          </div>
        </div>
      </div>

      {/* Student Sessions */}
      <div className="space-y-4">
        {students.map(student => {
          const studentSessions = getStudentSessions(student.id);
          const totalSessions = Object.values(studentSessions).reduce((total, dates) => total + dates.length, 0);
          
          return (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{student.studentName}</h3>
                  <p className="text-sm text-gray-600">
                    Grade {student.grade} • {student.subject} • Total Sessions: {totalSessions}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Fee per Session: ${student.feePerSession || 0}</p>
                  <p className="text-sm font-medium text-green-600">
                    Total Fee: ${((parseFloat(student.feePerSession) || 0) * totalSessions).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {months.map(month => {
                  const sessions = studentSessions[month] || [];
                  return (
                    <div key={month} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-gray-900">{month}</h4>
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                          {sessions.length}
                        </span>
                      </div>
                      
                      {sessions.length === 0 ? (
                        <p className="text-gray-500 text-xs">No sessions</p>
                      ) : (
                        <div className="space-y-1">
                          {sessions.map((date, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between bg-gray-50 px-2 py-1 rounded text-xs"
                            >
                              <span className="text-gray-700">
                                {new Date(date).toLocaleDateString()}
                              </span>
                              <button
                                onClick={() => handleRemoveSession(student.id, month, date)}
                                className="text-red-600 hover:text-red-800"
                                title="Remove session"
                              >
                                <SafeIcon icon={FiTrash2} className="text-xs" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default SessionManager;