'use client';

import React, { useState, useEffect, useMemo } from 'react';
import StatusBar from './StatusBar';
import WindowPane from './WindowPane';
import TaskbarButton from './TaskbarButton';
import { WindowState } from '../../types';
import Background from './Background';

const HomePage: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [windows, setWindows] = useState<Record<string, WindowState>>({
    about: { isOpen: false, isMinimized: false, isActive: false, isVisible: false, position: 0 },
    projects: { isOpen: false, isMinimized: false, isActive: false, isVisible: false, position: 1 },
    contact: { isOpen: false, isMinimized: false, isActive: false, isVisible: false, position: 1 },
    blog: { isOpen: false, isMinimized: false, isActive: false, isVisible: false, position: 1 },
  });

  // 檢查視窗是否關閉
  const allWindowsClosed = useMemo(() => {
    return Object.values(windows).every(window => !window.isOpen);
  }, [windows]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleWindowClick = (window: string) => {
    setWindows(prev => {
      const newState = { ...prev };
      
      // 如果點擊的是當前活動視窗，則關閉它
      if (newState[window].isActive) {
        newState[window] = {
          ...newState[window],
          isActive: false,
          isVisible: false,
        };

        setTimeout(() => {
          setWindows(current => ({
            ...current,
            [window]: {
              ...current[window],
              isOpen: false,
            }
          }));
        }, 700);

        return newState;
      }

      // 視窗切換
      Object.keys(newState).forEach(key => {
        if (newState[key].isActive) {
          newState[key] = {
            ...newState[key],
            isActive: false,
            isVisible: false,
          };
        }
      });

      return newState;
    });

    if (!windows[window].isActive) {
      const openNewWindow = () => {
        setWindows(current => {
          const nextState = { ...current };
          Object.keys(nextState).forEach(key => {
            if (key !== window) {
              nextState[key] = {
                ...nextState[key],
                isOpen: false,
              };
            }
          });
          nextState[window] = {
            ...nextState[window],
            isOpen: true,
            isActive: false,
            isVisible: false,
            position: 0,
          };
          return nextState;
        });

        setTimeout(() => {
          setWindows(current => ({
            ...current,
            [window]: {
              ...current[window],
              isActive: true,
              isVisible: true,
            }
          }));
        }, 50);
      };

      setTimeout(openNewWindow, 350);
    }
  };

  const handleClose = (window: string) => {
    setWindows(prev => ({
      ...prev,
      [window]: { ...prev[window], position: 1, isActive: false }
    }));

    setTimeout(() => {
      setWindows(prev => ({
        ...prev,
        [window]: { ...prev[window], isVisible: false }
      }));
    }, 300);

    setTimeout(() => {
      setWindows(prev => {
        const newState = {
          ...prev,
          [window]: { ...prev[window], isOpen: false }
        };

        const remainingWindows = Object.entries(newState).filter(([key, win]) => win.isOpen);
        if (remainingWindows.length > 0) {
          const [firstKey] = remainingWindows[0];

          newState[firstKey] = {
            ...newState[firstKey],
            isActive: false,
            isVisible: false,
            position: 0
          };
        }

        return newState;
      });

      requestAnimationFrame(() => {
        setWindows(current => {
          const remainingWindows = Object.entries(current).filter(([key, win]) => win.isOpen);
          if (remainingWindows.length > 0) {
            const [firstKey] = remainingWindows[0];
            return {
              ...current,
              [firstKey]: {
                ...current[firstKey],
                isActive: true,
                isVisible: true,
              }
            };
          }
          return current;
        });
      });
    }, 500);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Background />
      <StatusBar allWindowsClosed={allWindowsClosed} onBlogClick={() => handleWindowClick('blog')} />
      <div className={`h-[calc(100vh-6rem)] mt-14 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        {Object.entries(windows).map(([key, window]) =>
          window.isOpen ? (
            <WindowPane
              key={key}
              title={key.charAt(0).toUpperCase() + key.slice(1)}
              type={key}
              isMinimized={false}
              isActive={window.isActive}
              isVisible={window.isVisible}
              position={window.position}
              onMinimize={() => {}}
              onMaximize={() => {}}
              onClose={() => handleClose(key)}
              isLoaded={isLoaded}
            />
          ) : null
        )}
      </div>
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 inline-flex px-4 py-2 bg-black bg-opacity-80 backdrop-blur-md rounded-full items-center gap-3 z-50">
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