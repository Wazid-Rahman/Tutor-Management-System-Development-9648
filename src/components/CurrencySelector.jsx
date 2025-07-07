import React from 'react';
import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiDollarSign } = FiIcons;

const CurrencySelector = () => {
  const { currency, setCurrency } = useData();

  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' }
  ];

  return (
    <div className="relative">
      <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2">
        <SafeIcon icon={FiDollarSign} className="text-gray-500" />
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="bg-transparent border-none outline-none text-sm font-medium text-gray-700 cursor-pointer"
        >
          {currencies.map(curr => (
            <option key={curr.code} value={curr.code}>
              {curr.symbol} {curr.code}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default CurrencySelector;