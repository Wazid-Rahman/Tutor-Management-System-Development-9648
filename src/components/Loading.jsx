import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiLoader } = FiIcons;

const Loading = ({ message = 'Loading...' }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl p-8 text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="inline-block mb-4"
        >
          <SafeIcon icon={FiLoader} className="text-4xl text-blue-600" />
        </motion.div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">DGTutor</h2>
        <p className="text-gray-600">{message}</p>
      </motion.div>
    </div>
  );
};

export default Loading;