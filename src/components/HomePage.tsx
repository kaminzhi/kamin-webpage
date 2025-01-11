'use client';

import React, { useState, useEffect, useMemo } from 'react';
import StatusBar from './StatusBar';
import WindowPane from './WindowPane';
import TaskbarButton from '@/components/TaskbarButton';
import { WindowState } from '../../types';
import Background from './Background';
import { viewConfig } from '@/config/view';
import { Music } from 'lucide-react';

const HomePage: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVpnConnected, setIsVpnConnected] = useState(false);
  const [windows, setWindows] = useState<Record<string, WindowState>>({
    about: { isOpen: false, isActive: false },
    projects: { isOpen: false, isActive: false },
    contact: { isOpen: false, isActive: false },
    blog: { isOpen: false, isActive: false },
    terminal: { isOpen: false, isActive: false },
  });
  const [showBlogHint, setShowBlogHint] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isHintVisible, setIsHintVisible] = useState(true);
  const [hintAnimationDone, setHintAnimationDone] = useState(false);
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);
  const [initialWidth, setInitialWidth] = useState<number>(0);
  const [finalWidth, setFinalWidth] = useState<number>(0);
  const [showMusicTip, setShowMusicTip] = useState(false);

  // 檢查視窗是否關閉
  const allWindowsClosed = useMemo(() => {
    return Object.values(windows).every(window => !window.isOpen);
  }, [windows]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

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
    }, 4000);  // 3秒後顯示

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (containerRef) {
      const updateWidths = () => {
        requestAnimationFrame(() => {
          const buttons = containerRef.querySelectorAll('button');
          let totalWidth = 0;
          buttons.forEach(button => {
            if (!button.classList.contains('animate-slide-up-fade')) {
              totalWidth += button.offsetWidth;
            }
          });
          
          const buttonGap = 8; // 0.5rem = 8px
          const containerPadding = 20; // px-3 = 0.75rem * 2 = 24px
          const containerLeftPadding = 8; // pl-2 = 0.5rem = 8px
          const isMobileView = window.innerWidth < 768;
          const terminalButtonWidth = isMobileView ? 82 : 96;
          
          const baseWidth = totalWidth + ((buttons.length - 1) * buttonGap) + containerPadding + containerLeftPadding;
          setInitialWidth(baseWidth);
          
          setFinalWidth(baseWidth + terminalButtonWidth);
        });
      };
      
      updateWidths();
      window.addEventListener('resize', updateWidths);
      return () => window.removeEventListener('resize', updateWidths);
    }
  }, [containerRef, isVpnConnected]);

  useEffect(() => {
    setIsLoaded(true);
    const timer = setTimeout(() => {
      setShowMusicTip(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleWindowClick = (window: string) => {
    setWindows(prev => {
      const newState = { ...prev };
      
      if (newState[window].isActive) {
        newState[window] = {
          ...newState[window],
          isActive: false,
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

      Object.keys(newState).forEach(key => {
        if (newState[key].isActive) {
          newState[key] = {
            ...newState[key],
            isActive: false,
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
          };
          return nextState;
        });

        setTimeout(() => {
          setWindows(current => ({
            ...current,
            [window]: {
              ...current[window],
              isActive: true,
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
      [window]: { ...prev[window], isActive: false }
    }));

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
      <StatusBar 
        allWindowsClosed={allWindowsClosed} 
        onBlogClick={() => handleWindowClick('blog')} 
        currentWindow={Object.entries(windows).find(([_, win]) => win.isActive)?.[0]}
        isBlogOpen={windows.blog.isOpen}
        onVpnConnect={setIsVpnConnected}
      />
      {showBlogHint && (
        <div className={`
          absolute top-14 
          flex flex-col items-center text-white 
          z-20
          ${isHintVisible ? 'animate-hint-fade-in opacity-100' : 'animate-hint-fade-out opacity-0'} 
          transition-all duration-500
          ${isMobile ? 'left-[-0.3rem]' : 'left-2'}
        `}
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
              {viewConfig.tip}
            </span>
          </div>
        </div>
      )}
      {showMusicTip && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 animate-music-tip w-[90%] sm:w-auto">
          <div className="bg-black bg-opacity-80 backdrop-blur-md rounded-lg px-4 py-3 text-white shadow-lg">
            <div className="flex items-center gap-2 whitespace-nowrap">
              <Music className="w-5 h-5 text-blue-400 flex-shrink-0" />
              <span className="text-sm">此網頁包含音樂，可在右上角音量圖示控制</span>
            </div>
          </div>
        </div>
      )}
      <div className={`h-[calc(100vh-6rem)] mt-14 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        {Object.entries(windows).map(([key, window]) =>
          window.isOpen ? (
            <WindowPane
              key={key}
              title={key.charAt(0).toUpperCase() + key.slice(1)}
              type={key}
              isActive={window.isActive}
              onClose={() => handleClose(key)}
              isLoaded={isLoaded}
            />
          ) : null
        )}
      </div>
      <div 
        ref={setContainerRef}
        className={`
          fixed bottom-4 left-1/2
          inline-flex pl-3 pr-2 py-2 
          bg-black bg-opacity-80 backdrop-blur-md rounded-full 
          items-center z-50 
          transition-all duration-500
          ${isVpnConnected !== undefined ? (isVpnConnected ? 'animate-container-expand' : 'animate-container-shrink delay-[1000ms]') : ''}
        `}
        style={{
          transform: 'translateX(-50%)',
          width: `${isVpnConnected ? finalWidth : initialWidth}px`,
          '--terminal-width': isMobile ? '82px' : '96px'
        } as React.CSSProperties}
      >
        <div className="flex items-center pl-2 relative transition-all duration-300">
          {Object.entries(windows)
            .filter(([key]) => key !== 'blog')
            .sort(([keyA], [keyB]) => {
              if (keyA === 'terminal') return 1;
              if (keyB === 'terminal') return -1;
              return 0;
            })
            .map(([key, window]) => (
              <TaskbarButton
                key={key}
                title={key.charAt(0).toUpperCase() + key.slice(1)}
                isActive={window.isActive}
                isOpen={window.isOpen}
                onClick={() => handleWindowClick(key)}
                className={`
                  ${key === 'terminal' 
                    ? `${isVpnConnected !== undefined ? (isVpnConnected ? 'animate-slide-up-fade' : 'animate-slide-up-fade-reverse') : ''} ${!isVpnConnected ? 'invisible' : ''}`
                    : `mr-2 transition-all duration-300`
                  }
                `}
                style={
                  key === 'terminal'
                    ? {
                        width: isVpnConnected ? undefined : 0,
                        padding: isVpnConnected ? undefined : 0,
                        margin: isVpnConnected ? undefined : 0,
                        opacity: isVpnConnected ? undefined : 0
                      }
                    : undefined
                }
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage; 