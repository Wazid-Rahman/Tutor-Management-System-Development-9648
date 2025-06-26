import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiEdit, FiTrash2, FiBook, FiSave, FiX } = FiIcons;

const SubjectManagement = () => {
  const { subjects, addSubject, deleteSubject, updateSubject, students } = useData();
  const [newSubject, setNewSubject] = useState('');
  const [editingSubject, setEditingSubject] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddSubject = (e) => {
    e.preventDefault();
    if (newSubject.trim() && !subjects.includes(newSubject.trim())) {
      addSubject(newSubject.trim());
      setNewSubject('');
      setShowAddForm(false);
    }
  };

  const handleEditSubject = (subject) => {
    setEditingSubject(subject);
    setEditValue(subject);
  };

  const handleUpdateSubject = () => {
    if (editValue.trim() && editValue !== editingSubject) {
      updateSubject(editingSubject, editValue.trim());
    }
    setEditingSubject(null);
    setEditValue('');
  };

  const handleDeleteSubject = (subject) => {
    const studentsWithSubject = students.filter(s => s.subject === subject);
    
    if (studentsWithSubject.length > 0) {
      const studentNames = studentsWithSubject.map(s => s.studentName).join(', ');
      alert(`Cannot delete "${subject}" because it's assigned to: ${studentNames}`);
      return;
    }

    if (window.confirm(`Are you sure you want to delete "${subject}"?`)) {
      deleteSubject(subject);
    }
  };

  const getSubjectStats = (subject) => {
    return students.filter(s => s.subject === subject).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Subject Management</h2>
          <p className="text-gray-600">Manage available subjects for tutoring sessions</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <SafeIcon icon={FiPlus} />
          Add Subject
        </motion.button>
      </div>

      {/* Add Subject Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Add New Subject</h3>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <SafeIcon icon={FiX} />
            </button>
          </div>
          <form onSubmit={handleAddSubject} className="flex gap-4">
            <input
              type="text"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              placeholder="Enter subject name"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              required
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <SafeIcon icon={FiSave} />
              Add
            </motion.button>
          </form>
        </motion.div>
      )}

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject, index) => (
          <motion.div
            key={subject}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <SafeIcon icon={FiBook} className="text-xl text-blue-600" />
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEditSubject(subject)}
                  className="text-indigo-600 hover:text-indigo-800 p-1"
                  title="Edit Subject"
                >
                  <SafeIcon icon={FiEdit} />
                </button>
                <button
                  onClick={() => handleDeleteSubject(subject)}
                  className="text-red-600 hover:text-red-800 p-1"
                  title="Delete Subject"
                >
                  <SafeIcon icon={FiTrash2} />
                </button>
              </div>
            </div>

            {editingSubject === subject ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  onKeyPress={(e) => e.key === 'Enter' && handleUpdateSubject()}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleUpdateSubject}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingSubject(null)}
                    className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">{subject}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {getSubjectStats(subject)} students
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    getSubjectStats(subject) > 0 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {getSubjectStats(subject) > 0 ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {subjects.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <SafeIcon icon={FiBook} className="text-4xl text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No subjects available</h3>
          <p className="text-gray-600 mb-6">Add your first subject to get started with tutoring sessions.</p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
          >
            <SafeIcon icon={FiPlus} />
            Add First Subject
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default SubjectManagement;