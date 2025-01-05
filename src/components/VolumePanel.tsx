'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Music, Play, Pause, Repeat } from 'lucide-react';

interface VolumePanelProps {
  isOpen: boolean;
  volume: number;
  isMuted: boolean;
  isPlaying: boolean;
  isLooping: boolean;
  currentTime: number;
  duration: number;
  currentSong: {
    name: string;
    artist: string;
    file: string;
  };
  onVolumeChange: (volume: number) => void;
  onMuteToggle: () => void;
  onPlayToggle: () => void;
  onLoopToggle: () => void;
  onTimeChange: (time: number) => void;
}

const VolumePanel: React.FC<VolumePanelProps> = ({
  isOpen,
  volume,
  isMuted,
  isPlaying,
  isLooping,
  currentTime,
  duration,
  currentSong,
  onVolumeChange,
  onMuteToggle,
  onPlayToggle,
  onLoopToggle,
  onTimeChange,
}) => {
  const [shouldScrollTitle, setShouldScrollTitle] = useState(false);
  const [shouldScrollArtist, setShouldScrollArtist] = useState(false);
  const titleRef = useRef<HTMLDivElement>(null);
  const artistRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (titleRef.current) {
      setShouldScrollTitle(titleRef.current.scrollWidth > titleRef.current.clientWidth);
    }
    if (artistRef.current) {
      setShouldScrollArtist(artistRef.current.scrollWidth > artistRef.current.clientWidth);
    }
  }, [currentSong]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSliderDrag = (
    e: React.MouseEvent | MouseEvent,
    callback: (value: number) => void,
    maxValue: number
  ) => {
    const slider = e.currentTarget as HTMLDivElement;
    const rect = slider.getBoundingClientRect();
    
    const updateValue = (clientX: number) => {
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const percentage = x / rect.width;
      callback(percentage * maxValue);
    };

    const handleMouseMove = (e: MouseEvent) => {
      updateValue(e.clientX);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    updateValue(e.clientX);
  };

  return (
    <div 
      className={`absolute top-full mt-2 w-[95vw] md:w-[420px] right-0 -translate-x-2 md:-translate-x-2
        bg-black bg-opacity-80 backdrop-blur-md rounded-lg p-4 md:p-6 shadow-xl transform 
        transition-all duration-300 origin-top-right z-50
        ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}
    >
      <div className="space-y-4 md:space-y-5">
        <div className="flex items-center justify-between space-x-2 md:space-x-4">
          <div className="flex items-center space-x-2 md:space-x-4 min-w-0 flex-1">
            <div className="p-2 md:p-3 bg-white bg-opacity-10 rounded-lg flex-shrink-0">
              <Music size={20} className="text-white md:hidden" />
              <Music size={24} className="text-white hidden md:block" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-white text-sm md:text-base font-medium flex items-center space-x-2 md:space-x-4 overflow-hidden">
                <div className="overflow-hidden relative flex-1 group">
                  <div 
                    ref={titleRef}
                    className={`whitespace-nowrap ${shouldScrollTitle ? 'group-hover:animate-marquee hover:animate-none animate-reset' : ''}`}
                  >
                    {currentSong.name}
                  </div>
                </div>
                <span className="text-xs md:text-sm text-gray-400 whitespace-nowrap flex-shrink-0 pl-2">
                  • {isPlaying ? '正在播放' : '已暫停'}
                </span>
              </div>
              <div className="text-gray-400 text-xs md:text-sm overflow-hidden relative group">
                <div 
                  ref={artistRef}
                  className={`whitespace-nowrap ${shouldScrollArtist ? 'group-hover:animate-marquee hover:animate-none animate-reset' : ''}`}
                >
                  {currentSong.artist}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-1 md:space-x-2 flex-shrink-0">
            <button
              onClick={onPlayToggle}
              className="p-2 md:p-3 rounded-full hover:bg-white hover:bg-opacity-10 transition-colors"
            >
              {isPlaying ? (
                <>
                  <Pause size={20} className="text-white md:hidden" />
                  <Pause size={24} className="text-white hidden md:block" />
                </>
              ) : (
                <>
                  <Play size={20} className="text-white md:hidden" />
                  <Play size={24} className="text-white hidden md:block" />
                </>
              )}
            </button>
            <button
              onClick={onLoopToggle}
              className={`p-2 md:p-3 rounded-full transition-colors ${
                isLooping 
                  ? 'bg-white bg-opacity-20 text-white' 
                  : 'hover:bg-white hover:bg-opacity-10 text-gray-400'
              }`}
            >
              <Repeat size={20} className="md:hidden" />
              <Repeat size={24} className="hidden md:block" />
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <div 
            className="relative w-full h-1.5 bg-white bg-opacity-20 rounded-full cursor-pointer group"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const percentage = x / rect.width;
              onTimeChange(percentage * duration);
            }}
            onMouseDown={(e) => handleSliderDrag(e, onTimeChange, duration)}
          >
            <div
              className="absolute top-0 left-0 h-full bg-white rounded-full group-hover:bg-blue-400 transition-colors"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ left: `${(currentTime / duration) * 100}%`, transform: 'translate(-50%, -50%)' }}
            />
          </div>
          <div className="flex justify-between text-sm text-gray-400">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex items-center space-x-3 pt-2 border-t border-white border-opacity-10">
          <button
            onClick={onMuteToggle}
            className="p-3 rounded-full hover:bg-white hover:bg-opacity-10 transition-colors"
          >
            {isMuted || volume === 0 ? (
              <VolumeX size={24} className="text-white" />
            ) : (
              <Volume2 size={24} className="text-white" />
            )}
          </button>
          <div 
            className="relative flex-1 h-1.5 bg-white bg-opacity-20 rounded-full cursor-pointer group"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const percentage = x / rect.width;
              onVolumeChange(Math.round(percentage * 100));
            }}
            onMouseDown={(e) => handleSliderDrag(e, (value) => onVolumeChange(Math.round(value)), 100)}
          >
            <div
              className="absolute top-0 left-0 h-full bg-white rounded-full group-hover:bg-blue-400 transition-colors"
              style={{ width: `${isMuted ? 0 : volume}%` }}
            />
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ left: `${isMuted ? 0 : volume}%`, transform: 'translate(-50%, -50%)' }}
            />
          </div>
          <span className="text-white text-sm min-w-[3ch]">{isMuted ? 0 : volume}%</span>
        </div>
      </div>
    </div>
  );
};

export default VolumePanel; 