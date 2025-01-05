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
      {isOpen && !isActive && (
        <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
      )}
    </button>
  );
};

export default TaskbarButton; 