'use client';

import React from 'react';
import { X } from 'lucide-react';
import { iframeConfig } from '@/config/iframe';

interface BlogWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

const BlogWindow: React.FC<BlogWindowProps> = ({ isOpen, onClose }) => {
  return (
    <div 
      onClick={onClose}
      className={`
        fixed inset-0 z-30 bg-black bg-opacity-50 backdrop-blur-sm
        transition-opacity duration-300
        ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `}
    >
      <div 
        onClick={e => e.stopPropagation()}
        className={`
          absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          w-[94vw] md:w-[90vw] lg:w-[86vw] xl:w-[82vw] 2xl:w-[78vw]
          h-[85vh] md:h-[82vh] lg:h-[80vh]
          bg-white rounded-lg shadow-2xl
          transition-all duration-300 transform
          ${isOpen ? 'scale-100' : 'scale-95'}
        `}
      >
        <div className="absolute top-2 right-2 z-10 flex items-center space-x-4">
          <span className="text-gray-800 font-medium">{iframeConfig.blog.title}</span>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
          >
            <X size={24} className="text-gray-800" />
          </button>
        </div>
        <iframe
          src={iframeConfig.blog.url}
          title={iframeConfig.blog.title}
          className="w-full h-full rounded-lg"
          style={{ 
            border: 'none',
            width: '100%',
            height: '100%',
            margin: '0',
            padding: '0',
            overflow: 'hidden'
          }}
          loading="eager"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          referrerPolicy="no-referrer"
          scrolling="auto"
        />
      </div>
    </div>
  );
};

export default BlogWindow; 