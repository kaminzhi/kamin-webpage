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

  useEffect(() => {
    if (allWindowsClosed) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setShowText(true);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setShowText(false);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [allWindowsClosed]);

  if (position === 'top') {
    return (
      <div 
        className={`
          text-white fixed left-1/2 -translate-x-1/2 top-3 text-lg
          transition-opacity duration-500 ease-in-out
          ${allWindowsClosed ? 'opacity-0' : 'opacity-100'}
        `}
      >
        {time}
      </div>
    );
  }

  if (!isVisible && !allWindowsClosed) return null;

  return (
    <div
      className={`
        fixed left-1/2 -translate-x-1/2
        top-1/2 -translate-y-1/2 md:top-[calc(42vh+2rem)]
        flex flex-col items-center gap-8
        whitespace-nowrap
      `}
    >
      <div 
        className={`
          text-white text-2xl md:text-3xl lg:text-4xl
          ${allWindowsClosed 
            ? (showText ? 'animate-[clock-fade-in_0.5s_ease-out_forwards]' : 'opacity-0')
            : 'animate-[clock-fade-out_0.5s_ease-out_forwards]'
          }
        `}
      >
        Life Sucks, But I'm Still Here
      </div>
      <div 
        className={`
          text-white text-7xl md:text-8xl lg:text-9xl
          ${allWindowsClosed 
            ? 'animate-[clock-fade-in_0.5s_ease-out_forwards]'
            : 'animate-[clock-fade-out_0.5s_ease-out_forwards]'
          }
        `}
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
