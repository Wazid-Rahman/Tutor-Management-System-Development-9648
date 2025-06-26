import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';
import SessionModal from './SessionModal';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiEdit, FiTrash2, FiCalendar, FiUser, FiBook, FiDollarSign } = FiIcons;

const StudentList = ({ onEditStudent }) => {
  const { students, deleteStudent, getTotalSessions } = useData();
  const [sessionModalStudent, setSessionModalStudent] = useState(null);

  const handleDeleteStudent = (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      deleteStudent(id);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Trial': return 'bg-yellow-100 text-yellow-800';
      case 'Idle': return 'bg-gray-100 text-gray-800';
      case 'Hold': return 'bg-orange-100 text-orange-800';
      case 'Finished': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateTotalFee = (student) => {
    const totalSessions = getTotalSessions(student.id);
    const feePerSession = parseFloat(student.feePerSession) || 0;
    return totalSessions * feePerSession;
  };

  if (students.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <SafeIcon icon={FiUser} className="text-4xl text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No students yet</h3>
        <p className="text-gray-600">Add your first student to get started.</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Students</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Academic
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sessions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fees
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student, index) => (
                <motion.tr
                  key={student.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {student.studentName}
                      </div>
                      <div className="text-sm text-gray-500">
                        Parent: {student.parentName}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">
                        Grade {student.grade}
                      </div>
                      <div className="text-sm text-gray-500">
                        {student.subject}
                      </div>
                      <div className="text-sm text-gray-500">
                        Tutor: {student.tutor}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(student.status)}`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      Total: {getTotalSessions(student.id)}
                    </div>
                    <button
                      onClick={() => setSessionModalStudent(student)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View Details
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">
                        ${student.feePerSession || 0}/session
                      </div>
                      <div className="text-sm font-medium text-green-600">
                        Total: ${calculateTotalFee(student).toFixed(2)}
                      </div>
                      {student.lastPaid && (
                        <div className="text-xs text-gray-500">
                          Last paid: {new Date(student.lastPaid).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSessionModalStudent(student)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="Manage Sessions"
                      >
                        <SafeIcon icon={FiCalendar} />
                      </button>
                      <button
                        onClick={() => onEditStudent(student)}
                        className="text-indigo-600 hover:text-indigo-800 p-1"
                        title="Edit Student"
                      >
                        <SafeIcon icon={FiEdit} />
                      </button>
                      <button
                        onClick={() => handleDeleteStudent(student.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Delete Student"
                      >
                        <SafeIcon icon={FiTrash2} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {sessionModalStudent && (
        <SessionModal
          student={sessionModalStudent}
          onClose={() => setSessionModalStudent(null)}
        />
      )}
    </>
  );
};

export default StudentList;