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
    return <div className="text-white text-lg"></div>;
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
          text-white fixed left-1/2 -translate-x-1/2 top-3 text-lg
          transition-opacity duration-500 ease-in-out
          ${allWindowsClosed ? 'opacity-0' : 'opacity-100'}
        `}
      >
        {formatTime(time)}
      </div>
      
      <div 
        className={`
          text-white fixed left-1/2 -translate-x-1/2
          top-[calc(42vh+2rem)] text-8xl
          transition-opacity duration-500 ease-in-out
          ${allWindowsClosed ? 'opacity-100' : 'opacity-0'}
        `}
      >
        {formatTime(time)}
      </div>
    </>
  );
};

export default Clock;
