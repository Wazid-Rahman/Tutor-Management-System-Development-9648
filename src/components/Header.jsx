import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import CurrencySelector from './CurrencySelector';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiLogOut, FiUser } = FiIcons;

const Header = () => {
  const { user, userType, logout } = useAuth();
  const { currency } = useData();

  const getUserTypeLabel = () => {
    switch (userType) {
      case 'admin': return 'Admin';
      case 'tutor': return 'Tutor';
      case 'parent': return 'Parent';
      default: return 'User';
    }
  };

  const getUserTypeColor = () => {
    switch (userType) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'tutor': return 'bg-blue-100 text-blue-800';
      case 'parent': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">
              DGTutor
            </h1>
            <span className={`ml-3 px-2 py-1 text-xs font-medium rounded-full ${getUserTypeColor()}`}>
              {getUserTypeLabel()}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Currency Selector - Only show for admin */}
            {userType === 'admin' && <CurrencySelector />}

            <div className="flex items-center gap-2 text-gray-700">
              <SafeIcon icon={FiUser} className="text-lg" />
              <span className="font-medium">{user?.name}</span>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <SafeIcon icon={FiLogOut} />
              <span>Logout</span>
            </motion.button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;