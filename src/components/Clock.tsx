'use client';

import React, { useState, useEffect } from 'react';

interface ClockProps {
  allWindowsClosed: boolean;
}

const Clock: React.FC<ClockProps> = ({ allWindowsClosed }) => {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!time) {
    return <div className="text-white text-lg">--:--</div>;
  }

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <>
      <div 
        className={`
          text-white fixed left-1/2 -translate-x-1/2
          transition-opacity duration-500 ease-in-out
          ${allWindowsClosed 
            ? 'md:opacity-0 top-[calc(50vh+2rem)] text-8xl' 
            : 'opacity-100 top-3 text-lg'
          }
        `}
      >
        {formatTime(time)}
      </div>
      
      <div 
        className={`
          text-white fixed left-1/2
          -translate-x-1/2
          transition-opacity duration-500 ease-in-out
          ${allWindowsClosed ? 'md:opacity-100 opacity-0' : 'opacity-0'}
          text-8xl
          top-[calc(50vh+2rem)]
          hidden md:block
        `}
      >
        {formatTime(time)}
      </div>
    </>
  );
};

export default Clock;
