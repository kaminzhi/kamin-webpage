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

  return (
    <div
      className={`
        fixed left-1/2 -translate-x-1/2
        top-[35vh] md:top-[calc(42vh+2rem)]
        flex flex-col items-center gap-4
        transition-opacity duration-500 ease-in-out
        ${allWindowsClosed ? 'opacity-100' : 'opacity-0'}
        whitespace-nowrap
      `}
    >
      <div className="text-white text-2xl md:text-3xl lg:text-4xl">
        Life Sucks, But I'm Still Here
      </div>
      <div className="text-white text-7xl md:text-8xl lg:text-9xl">
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
