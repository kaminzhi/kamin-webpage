'use client';

import React, { useState, useEffect, useCallback, memo } from 'react';

interface ClockProps {
  allWindowsClosed: boolean;
}

interface ClockDisplayProps {
  time: string;
  position: 'top' | 'center';
  allWindowsClosed: boolean;
}

const ClockDisplay = memo(({ time, position, allWindowsClosed }: ClockDisplayProps) => {
  const [showText, setShowText] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [showClock, setShowClock] = useState(false);

  useEffect(() => {
    setMounted(true);
    const clockTimer = setTimeout(() => {
      setInitialLoad(false);
      setShowClock(true);
    }, 2000);

    const textTimer = setTimeout(() => {
      setIsVisible(true);
      if (allWindowsClosed) {
        setShowText(true);
      }
    }, 4000);
    
    return () => {
      clearTimeout(clockTimer);
      clearTimeout(textTimer);
    };
  }, []);

  useEffect(() => {
    if (!initialLoad) {
      if (allWindowsClosed) {
        setIsVisible(true);
        const timer = setTimeout(() => {
          setShowText(true);
        }, 700);
        return () => clearTimeout(timer);
      } else {
        setShowText(false);
        const timer = setTimeout(() => {
          setIsVisible(false);
        }, 700);
        return () => clearTimeout(timer);
      }
    }
  }, [allWindowsClosed, initialLoad]);

  if (!mounted) return null;

  if (position === 'top') {
    return (
      <div 
        className={`
          text-white fixed left-1/2 -translate-x-1/2 top-3 text-lg
          transition-all duration-1000 ease-out
          transform-gpu will-change-transform
          ${initialLoad ? 'opacity-0 translate-y-[-50px]' : 
            allWindowsClosed 
              ? 'opacity-0 translate-y-[-10px] scale-95'
              : 'opacity-100 translate-y-0 scale-100'
          }
        `}
      >
        {time}
      </div>
    );
  }

  return (
    <div
      className={`
        fixed left-1/2 -translate-x-1/2
        ${position === 'center' 
          ? 'top-[50vh] -translate-y-1/2' 
          : 'top-3'
        }
        flex flex-col items-center gap
        whitespace-nowrap
        transition-all duration-1000 ease-out
        transform-gpu will-change-transform
        ${initialLoad ? 'opacity-0 translate-y-[50px]' :
          allWindowsClosed 
            ? 'opacity-100 translate-y-0 scale-100'
            : 'opacity-0 translate-y-10 scale-95'
        }
        max-w-[95vw]
      `}
      style={{ 
        position: 'fixed',
        transform: `translate(-50%, ${position === 'center' ? '-50%' : '0'}) ${
          initialLoad ? 'translateY(50px)' :
          allWindowsClosed ? 'translateY(0)' : 'translateY(10px)'
        }`
      }}
    >
      <div 
        className={`
          text-white
          transition-all duration-1000 ease-out
          font-['Carter_One']
          mb-1
          ${!showClock ? 'opacity-0 scale-90 translate-y-[50px]' :
            allWindowsClosed 
              ? (showText ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-[10px]')
              : 'opacity-0 scale-95 translate-y-[-10px]'
          }
        `}
        style={{
          fontSize: 'clamp(1.5rem, 3vw, 4rem)'
        }}
      >
        Life Sucks, But I'm Still Here
      </div>
      <div 
        className={`
          text-white
          transition-all duration-1000 ease-out
          transform
          font-['Salsa']
          -mt-4
          ${!showClock ? 'opacity-0 translate-y-[50px] scale-90' :
            allWindowsClosed 
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 translate-y-[-20px] scale-95'
          }
        `}
        style={{
          fontSize: 'clamp(7rem, 9vw, 10rem)'
        }}
      >
        {time}
      </div>
    </div>
  );
});

ClockDisplay.displayName = 'ClockDisplay';

const Clock: React.FC<ClockProps> = ({ allWindowsClosed }) => {
  const [time, setTime] = useState<string>('');

  const formatTime = useCallback((date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }, []);

  useEffect(() => {
    const updateTime = () => setTime(formatTime(new Date()));
    
    updateTime(); // 立即更新一次
    const timer = setInterval(updateTime, 1000);
    
    return () => clearInterval(timer);
  }, [formatTime]);

  if (!time) {
    return <div className="text-white text-lg"></div>;
  }

  return (
    <>
      <ClockDisplay time={time} position="top" allWindowsClosed={allWindowsClosed} />
      <ClockDisplay time={time} position="center" allWindowsClosed={allWindowsClosed} />
    </>
  );
};

export default memo(Clock);
