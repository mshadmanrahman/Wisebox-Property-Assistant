
import React from 'react';
import { DocStatus } from '../types';

interface StatusBarProps {
  status: DocStatus;
}

const statusConfig = {
  [DocStatus.RED]: {
    bgColor: 'bg-red-500',
    textColor: 'text-white',
    label: 'Action Required: Mandatory documents are missing.',
  },
  [DocStatus.YELLOW]: {
    bgColor: 'bg-yellow-400',
    textColor: 'text-gray-800',
    label: 'In Progress: Mandatory documents uploaded, optional pending.',
  },
  [DocStatus.GREEN]: {
    bgColor: 'bg-green-500',
    textColor: 'text-white',
    label: 'Complete: All documents are uploaded and accounted for.',
  },
  [DocStatus.UNKNOWN]: {
    bgColor: 'bg-gray-400',
    textColor: 'text-white',
    label: 'Welcome! Let\'s get started on your property profile.',
  },
};

const StatusBar: React.FC<StatusBarProps> = ({ status }) => {
  const { bgColor, textColor, label } = statusConfig[status];

  return (
    <div className={`p-3 rounded-t-lg text-center font-semibold transition-colors duration-300 ${bgColor} ${textColor}`}>
      <p>{label}</p>
    </div>
  );
};

export default StatusBar;
