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
          {formatTime(time)}
        </div>
      </div>
    </>
  );
};

export default Clock;
