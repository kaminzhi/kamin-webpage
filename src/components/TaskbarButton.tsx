'use client';

import React from 'react';
import { TaskbarButtonProps } from '../../types';

const TaskbarButton: React.FC<TaskbarButtonProps> = ({ title, isActive, isOpen, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`
        relative px-3 md:px-4 py-1.5 rounded-full transition-all
        text-sm md:text-base whitespace-nowrap
        ${isActive 
          ? 'bg-white text-black' 
          : 'text-white hover:bg-white hover:bg-opacity-10'}
      `}
    >
      {title}
    </button>
  );
};

export default TaskbarButton; 