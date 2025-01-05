'use client';

import React from 'react';
import Image from 'next/image';

const Background: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10">
      <Image
        src="/background.gif"
        alt="Anime background"
        fill
        className="object-cover"
        priority
        unoptimized
      />
      <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-[2px]" />
    </div>
  );
};

export default Background; 