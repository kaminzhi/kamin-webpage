'use client';

import React, { useState, useEffect } from 'react';
import { X, ExternalLink } from 'lucide-react';
import { WindowPaneProps } from '../../types';
import WindowContent from './WindowContent';
import { iframeConfig } from '../config/iframe';

const WindowPane: React.FC<WindowPaneProps> = ({
  title,
  type,
  onClose,
  isActive,
  isLoaded,
}) => {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const calculateSize = () => {
      if (type === 'blog' || type === 'terminal') {
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        let width = vw;
        let height = vh - 144;

        if (vw >= 768) {
          if (vw >= 1536) { // 2xl
            width = Math.floor(vw * 0.82);
          } else if (vw >= 1280) { // xl
            width = Math.floor(vw * 0.86);
          } else if (vw >= 1024) { // lg
            width = Math.floor(vw * 0.90);
          } else {
            width = Math.floor(vw * 0.94);
          }
          height = vh - 144;
        }
        
        width = width - (width % 2);
        height = height - (height % 2);

        setWindowSize({ width, height });
      }
    };

    calculateSize();
    window.addEventListener('resize', calculateSize);
    return () => window.removeEventListener('resize', calculateSize);
  }, [type]);

  return (
    <div
      data-window-type={type}
      className={`
        bg-white bg-opacity-40 backdrop-blur-md rounded-lg shadow-xl overflow-hidden
        fixed 
        ${type === 'blog' || type === 'terminal'
          ? 'md:top-14 md:left-1/2 top-14 left-0'
          : 'md:top-14 md:left-1/2 top-14 left-0'
        }
        transition-all duration-500 ease-in-out
        ${type === 'blog' || type === 'terminal' ? '' : 'w-full md:max-w-4xl'}
        ${isActive 
          ? 'opacity-100 z-30 md:-translate-x-1/2 translate-y-0' 
          : 'opacity-0 z-20 pointer-events-none md:-translate-x-1/2 translate-y-[60vh]'}
        mb-24
        ${type === 'blog' || type === 'terminal' ? '' : 'h-[calc(100vh-8rem)] md:h-[calc(100vh-9rem)]'}
      `}
      style={type === 'blog' || type === 'terminal' && windowSize.width > 0 ? {
        width: `${windowSize.width}px`,
        height: `${windowSize.height}px`
      } : {
        width: type === 'blog' || type === 'terminal' ? '100%' : undefined
      }}
    >
      <div className="bg-gray-800 bg-opacity-80 backdrop-blur-sm p-3 flex items-center justify-between sticky top-0 z-10">
        <span className="text-white font-medium">{title}</span>
        <div className="flex space-x-2">
          {type === 'blog' && (
            <a
              href={iframeConfig.blog.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 hover:bg-gray-700 rounded-full transition-all duration-200 hover:scale-110"
            >
              <ExternalLink size={16} className="text-white" />
            </a>
          )}
          <button onClick={onClose} className="p-1 hover:bg-gray-700 rounded-full transition-all duration-200 hover:scale-110">
            <X size={20} className="text-white" />
          </button>
        </div>
      </div>
      <div className="overflow-auto overscroll-contain h-[calc(100%-3rem)] window-content">
        <WindowContent type={type} onClose={onClose} />
      </div>
    </div>
  );
};

export default WindowPane;