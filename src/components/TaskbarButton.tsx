'use client';

import React from 'react';
import { TaskbarButtonProps } from '../../types';

const TaskbarButton : React.FC<TaskbarButtonProps> = ({ title, isActive, onClick, isOpen }) => {
  return (
    <button
      onClick={onClick}
      className={`
        min-w-[100px] px-6 py-2 rounded-full transition-all duration-300 
        flex items-center justify-center
        transform hover:scale-105
        ${isActive ? 'bg-white text-gray-800 shadow-lg scale-105' : 
                    'bg-white bg-opacity-20 text-white hover:bg-opacity-30'}
      `}
    >
      <span className="font-medium">{title}</span>
    </button>
  );
};

export default TaskbarButton; 