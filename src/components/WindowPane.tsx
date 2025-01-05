'use client';

import React from 'react';
import { X, Minus, Square, ExternalLink } from 'lucide-react';
import { WindowPaneProps } from '../../types';
import WindowContent from './WindowContent';

const WindowPane: React.FC<WindowPaneProps> = ({
  title,
  type,
  isMinimized,
  onMinimize,
  onMaximize,
  onClose,
  isActive,
  isVisible,
  position,
  isLoaded,
}) => {
  return (
    <div
      className={`
        bg-white bg-opacity-40 backdrop-blur-md rounded-lg shadow-xl overflow-hidden
        fixed 
        md:top-16 md:left-1/2
        top-0 left-0 w-full h-full md:h-auto
        transition-all duration-500 ease-in-out
        ${type === 'blog' ? 'md:w-[95vw]' : 'md:w-full md:max-w-4xl'}
        ${isActive 
          ? 'opacity-100 z-30 md:-translate-x-1/2 md:translate-y-0' 
          : 'opacity-0 z-20 pointer-events-none md:-translate-x-1/2 md:translate-y-[60vh]'}
      `}
      style={{ height: 'calc(100vh - 9rem)' }}
    >
      <div
        className={`
          bg-gray-800 bg-opacity-80 backdrop-blur-sm p-3 flex items-center justify-between
        `}
      >
        <span className="text-white font-medium">{title}</span>
        <div className="flex space-x-2">
          {type === 'blog' && (
            <a
              href="https://blog.kaminzhi.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 hover:bg-gray-700 rounded-full transition-colors flex items-center"
            >
              <ExternalLink size={16} className="text-white" />
            </a>
          )}
          <button onClick={onMinimize} className="p-1 hover:bg-gray-700 rounded-full transition-colors">
            <Minus size={16} className="text-white" />
          </button>
          <button onClick={onMaximize} className="p-1 hover:bg-gray-700 rounded-full transition-colors">
            <Square size={16} className="text-white" />
          </button>
          <button onClick={onClose} className="p-1 hover:bg-gray-700 rounded-full transition-colors">
            <X size={20} className="text-white" />
          </button>
        </div>
      </div>
      <div 
        className="overflow-auto"
        style={{ height: 'calc(100% - 3rem)' }}
      >
        <WindowContent type={type} />
      </div>
    </div>
  );
};

export default WindowPane; 