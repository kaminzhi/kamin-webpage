'use client';

import React from 'react';

interface TaskbarButtonProps {
  title: string;
  isActive: boolean;
  isOpen: boolean;
  onClick: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const TaskbarButton: React.FC<TaskbarButtonProps> = ({ 
  title, 
  isActive, 
  isOpen, 
  onClick,
  className = '',
  style
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        px-3 py-1.5 md:px-4 md:py-2 rounded-full text-sm md:text-base font-medium
        transition-all duration-200
        ${isOpen 
          ? isActive
            ? 'bg-white text-black hover:bg-opacity-90'
            : 'bg-white bg-opacity-10 text-white hover:bg-opacity-20' 
          : 'bg-white bg-opacity-0 text-white hover:bg-opacity-10'
        }
        relative
        ${className}
      `}
      style={{
        transformOrigin: 'center',
        ...style
      }}
    >
      {title}
    </button>
  );
};

export default TaskbarButton; 