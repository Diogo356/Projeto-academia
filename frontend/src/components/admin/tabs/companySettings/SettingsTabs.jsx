// src/components/admin/SettingsTabs.jsx
import React from 'react';
import { FaBuilding, FaUsers } from 'react-icons/fa';
import { motion } from 'framer-motion';

const SettingsTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    {
      id: 'company',
      label: 'Empresa',
      icon: FaBuilding,
    },
    {
      id: 'accounts',
      label: 'Contas',
      icon: FaUsers,
    }
  ];

  return (
    <div className="border-b border-gray-200 mb-8">
      <div className="flex space-x-8">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center space-x-3 px-1 py-4 border-b-2 transition-all duration-200 relative ${
                isActive
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon className="text-lg" />
              <span className="font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SettingsTabs;