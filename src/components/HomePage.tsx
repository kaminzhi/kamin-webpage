'use client';

import React, { useState, useEffect, useMemo } from 'react';
import StatusBar from './StatusBar';
import WindowPane from './WindowPane';
import TaskbarButton from './TaskbarButton';
import { WindowState } from '../../types';
import Background from './Background';

const HomePage: React.FC = () => {
  const [windows, setWindows] = useState<Record<string, WindowState>>({
    about: { isOpen: false, isActive: false },
    projects: { isOpen: false, isActive: false },
    contact: { isOpen: false, isActive: false },
    blog: { isOpen: false, isActive: false },
  });
  const [showBlogHint, setShowBlogHint] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isHintVisible, setIsHintVisible] = useState(true);
  const [hintAnimationDone, setHintAnimationDone] = useState(false);

  const allWindowsClosed = useMemo(() => {
    return Object.values(windows).every(window => !window.isOpen);
  }, [windows]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const anyWindowOpen = Object.values(windows).some(window => 
      window.isOpen || window.isActive
    );
    
    if (anyWindowOpen) {
      setHintAnimationDone(false);
      const timer = setTimeout(() => {
        setIsHintVisible(false);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setIsHintVisible(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [windows]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBlogHint(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleWindowClick = (window: string) => {
    setWindows(prev => {
      const newState = { ...prev };
      
      if (newState[window].isActive) {
        newState[window].isActive = false;
        setTimeout(() => {
          setWindows(current => ({
            ...current,
            [window]: { isOpen: false, isActive: false }
          }));
        }, 700);
        return newState;
      }

      Object.keys(newState).forEach(key => {
        if (newState[key].isActive) {
          newState[key].isActive = false;
        }
      });

      return newState;
    });

    if (!windows[window].isActive) {
      setTimeout(() => {
        setWindows(current => {
          const nextState = { ...current };
          Object.keys(nextState).forEach(key => {
            nextState[key] = {
              isOpen: key === window,
              isActive: false
            };
          });
          
          setTimeout(() => {
            setWindows(current => ({
              ...current,
              [window]: { isOpen: true, isActive: true }
            }));
          }, 50);
          
          return nextState;
        });
      }, 350);
    }
  };

  const handleClose = (window: string) => {
    setWindows(prev => ({
      ...prev,
      [window]: { ...prev[window], isActive: false }
    }));

    setTimeout(() => {
      setWindows(prev => {
        const newState = {
          ...prev,
          [window]: { isOpen: false, isActive: false }
        };

        const nextWindow = Object.entries(newState)
          .find(([key, win]) => win.isOpen)?.[0];

        if (nextWindow) {
          newState[nextWindow].isActive = true;
        }

        return newState;
      });
    }, 500);
  };

  return (
    <div className="min-h-screen relative overflow-hidden animate-fadeIn">
      <Background />
      <StatusBar 
        allWindowsClosed={allWindowsClosed} 
        onBlogClick={() => handleWindowClick('blog')} 
        currentWindow={Object.entries(windows).find(([_, win]) => win.isActive)?.[0]}
        isBlogOpen={windows.blog.isOpen}
      />
      {showBlogHint && (
        <div className={`absolute top-14 flex flex-col items-center text-white z-50
          ${isHintVisible ? 'animate-hint-fade-in opacity-100' : 'animate-hint-fade-out opacity-0'} 
          transition-all duration-500
          ${isMobile ? 'left-[-0.3rem]' : 'left-2'}`}
          onAnimationEnd={(e) => {
            if (e.animationName.includes('hint-fade-in')) {
              setHintAnimationDone(true);
            }
          }}>
          <div className={`flex flex-col items-center ${hintAnimationDone ? 'animate-hint-bounce' : ''}`}>
            <svg 
              className="w-6 h-6"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
            <span className="text-sm font-medium px-2 py-1 rounded mt-1">
              View my blog
            </span>
          </div>
        </div>
      )}
      <div className="h-[calc(100vh-6rem)] mt-14">
        {Object.entries(windows).map(([key, window]) =>
          window.isOpen ? (
            <WindowPane
              key={key}
              title={key.charAt(0).toUpperCase() + key.slice(1)}
              type={key}
              isActive={window.isActive}
              onClose={() => handleClose(key)}
            />
          ) : null
        )}
      </div>
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 inline-flex px-2 md:px-4 py-2 bg-black bg-opacity-80 backdrop-blur-md rounded-full items-center gap-1 md:gap-3 z-50 max-w-[95vw] overflow-x-auto">
        {Object.entries(windows)
          .filter(([key]) => key !== 'blog')
          .map(([key, window]) => (
            <TaskbarButton
              key={key}
              title={key.charAt(0).toUpperCase() + key.slice(1)}
              isActive={window.isActive}
              isOpen={window.isOpen}
              onClick={() => handleWindowClick(key)}
            />
          ))}
      </div>
    </div>
  );
};

export default HomePage; 