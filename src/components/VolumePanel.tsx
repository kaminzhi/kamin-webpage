'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Music, Play, Pause, Repeat, ListRestart, GripVertical, ChevronUp, ChevronDown, ExternalLink } from 'lucide-react';
import { playlist, defaultCover } from '@/config/music';
import Image from 'next/image';

interface Song {
  name: string;
  artist: string;
  file: string;
  link?: string;
  cover?: string;
  artistLink?: string;
}

interface VolumePanelProps {
  isOpen: boolean;
  volume: number;
  isMuted: boolean;
  isPlaying: boolean;
  repeatMode: 'none' | 'single' | 'playlist';
  currentTime: number;
  duration: number;
  currentSong: Song;
  playlist: Song[];
  onVolumeChange: (volume: number) => void;
  onMuteToggle: () => void;
  onPlayToggle: () => void;
  onLoopToggle: () => void;
  onTimeChange: (time: number) => void;
  onSongChange: (song: Song) => void;
  onPlaylistChange?: (newPlaylist: Song[]) => void;
}

const VolumePanel: React.FC<VolumePanelProps> = ({
  isOpen,
  volume,
  isMuted,
  isPlaying,
  repeatMode,
  currentTime,
  duration,
  currentSong,
  playlist = [],
  onVolumeChange,
  onMuteToggle,
  onPlayToggle,
  onLoopToggle,
  onTimeChange,
  onSongChange,
  onPlaylistChange,
}) => {
  const [shouldScrollTitle, setShouldScrollTitle] = useState(false);
  const [shouldScrollArtist, setShouldScrollArtist] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);
  const titleRef = useRef<HTMLDivElement>(null);
  const artistRef = useRef<HTMLDivElement>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  useEffect(() => {
    const checkMobileDevice = () => {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ||
        (navigator.maxTouchPoints !== undefined && navigator.maxTouchPoints > 2);
      setIsMobileDevice(!!isMobile);
    };
    
    checkMobileDevice();
    window.addEventListener('resize', checkMobileDevice);
    return () => window.removeEventListener('resize', checkMobileDevice);
  }, []);

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

  const handleTouchDrag = (
    e: React.TouchEvent,
    callback: (value: number) => void,
    maxValue: number
  ) => {
    e.preventDefault();
    const slider = e.currentTarget as HTMLDivElement;
    const rect = slider.getBoundingClientRect();
    
    const updateValue = (clientX: number) => {
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const percentage = x / rect.width;
      callback(percentage * maxValue);
    };

    const handleTouchMove = (e: TouchEvent) => {
      updateValue(e.touches[0].clientX);
    };

    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
    updateValue(e.touches[0].clientX);
  };

  // 找到當前歌曲在播放列表中的索引
  const currentIndex = playlist.findIndex(song => song.file === currentSong.file);

  const getRepeatIcon = () => {
    switch (repeatMode) {
      case 'single':
        return <Repeat size={24} className="hidden md:block" />;
      case 'playlist':
        return <ListRestart size={24} className="hidden md:block" />;
      default:
        return <Repeat size={24} className="text-gray-400 hidden md:block" />;
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || !onPlaylistChange) return;

    const newPlaylist = [...playlist];
    const [movedItem] = newPlaylist.splice(draggedIndex, 1);
    newPlaylist.splice(index, 0, movedItem);
    
    onPlaylistChange(newPlaylist);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleMoveItem = (fromIndex: number, toIndex: number) => {
    if (!onPlaylistChange) return;
    const newPlaylist = [...playlist];
    const [movedItem] = newPlaylist.splice(fromIndex, 1);
    newPlaylist.splice(toIndex, 0, movedItem);
    onPlaylistChange(newPlaylist);
  };

  return (
    <div 
      className={`absolute top-full mt-2 w-[95vw] md:w-[420px] right-0 -translate-x-2 md:-translate-x-2
        bg-black bg-opacity-80 backdrop-blur-md rounded-lg p-4 md:p-6 shadow-xl transform 
        transition-all duration-300 origin-top-right z-50
        ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}
    >
      <div className={`space-y-2 ${isPlaylistOpen ? 'md:space-y-5' : ''}`}>
        <div className="flex items-center justify-between space-x-2 md:space-x-4">
          <div className="flex items-center space-x-2 md:space-x-4 min-w-0 flex-1">
            <button 
              className={`
                min-w-0 flex-1 text-left group p-2 md:p-3 rounded-lg
                transition-all duration-300 ease-out transform
                bg-white bg-opacity-10 hover:bg-opacity-20
                hover:scale-[1.01] active:scale-[0.99]
                flex items-center space-x-3
                ${isPlaylistOpen ? 'bg-opacity-20' : ''}
              `}
              onClick={() => setIsPlaylistOpen(!isPlaylistOpen)}
            >
              <div className="relative w-12 h-12 flex-shrink-0 rounded-md overflow-hidden group/cover">
                {currentSong.cover ? (
                  <a
                    href={currentSong.artistLink || currentSong.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="block w-full h-full relative group-hover/cover:opacity-80 transition-opacity"
                  >
                    <Image
                      src={currentSong.cover}
                      alt={currentSong.name}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `<div class="w-full h-full bg-white bg-opacity-5 flex items-center justify-center">
                            <svg class="text-gray-400" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                              <path d="M9 18V5l12-2v13"></path>
                              <circle cx="6" cy="18" r="3"></circle>
                              <circle cx="21" cy="16" r="3"></circle>
                            </svg>
                          </div>`;
                        }
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover/cover:bg-opacity-40 transition-all">
                      <ExternalLink size={16} className="text-white opacity-0 group-hover/cover:opacity-100 transition-opacity transform scale-90 group-hover/cover:scale-100" />
                    </div>
                  </a>
                ) : (
                  <div className="w-full h-full bg-white bg-opacity-5 flex items-center justify-center">
                    <Music size={24} className="text-gray-400" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-white text-sm md:text-base font-medium flex items-center space-x-2 md:space-x-4 overflow-hidden">
                  <div className="overflow-hidden relative flex-1">
                    <div 
                      ref={titleRef}
                      className={`whitespace-nowrap hover:animate-none ${shouldScrollTitle ? 'animate-marquee' : ''}`}
                    >
                      <span className="inline-block">{currentSong.name}</span>
                      {shouldScrollTitle && (
                        <>
                          <span className="inline-block mx-4 opacity-0">-</span>
                          <span className="inline-block">{currentSong.name}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <span className="text-xs md:text-sm text-gray-400 whitespace-nowrap flex-shrink-0 pl-2">
                    • {isPlaying ? '正在播放' : '已暫停'}
                  </span>
                </div>
                <div className="text-gray-400 text-xs md:text-sm overflow-hidden relative">
                  <div 
                    ref={artistRef}
                    className={`whitespace-nowrap hover:animate-none ${shouldScrollArtist ? 'animate-marquee' : ''}`}
                  >
                    <span className="inline-block">{currentSong.artist}</span>
                    {shouldScrollArtist && (
                      <>
                        <span className="inline-block mx-4 opacity-0">-</span>
                        <span className="inline-block">{currentSong.artist}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </button>
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
              className="p-2 md:p-3 rounded-full transition-colors relative"
            >
              {/* Container for background and icons */}
              <div className={`
                absolute inset-0 rounded-full transition-colors
                ${repeatMode !== 'none'
                  ? 'bg-white bg-opacity-20' 
                  : 'hover:bg-white hover:bg-opacity-10'
                }
              `} />

              {/* Icons container */}
              <div className={`
                relative z-[1]
                ${repeatMode !== 'none' ? 'text-white' : 'text-gray-400'}
              `}>
                {/* Mobile icons with animation */}
                <div className="md:hidden">
                  <div className={`
                    absolute inset-0 transition-all duration-300 transform
                    ${repeatMode === 'none' ? 'opacity-100 scale-100' : 'opacity-0 scale-75 rotate-90'}
                  `}>
                    <Repeat size={20} className="text-gray-400" />
                  </div>
                  <div className={`
                    absolute inset-0 transition-all duration-300 transform
                    ${repeatMode === 'single' ? 'opacity-100 scale-100' : 'opacity-0 scale-75 rotate-90'}
                  `}>
                    <Repeat size={20} />
                  </div>
                  <div className={`
                    absolute inset-0 transition-all duration-300 transform
                    ${repeatMode === 'playlist' ? 'opacity-100 scale-100' : 'opacity-0 scale-75 rotate-90'}
                  `}>
                    <ListRestart size={20} />
                  </div>
                  {/* Placeholder to maintain button size */}
                  <div className="opacity-0">
                    <Repeat size={20} />
                  </div>
                </div>

                {/* Desktop icons with animation */}
                <div className="hidden md:block">
                  <div className={`
                    absolute inset-0 transition-all duration-300 transform
                    ${repeatMode === 'none' ? 'opacity-100 scale-100' : 'opacity-0 scale-75 rotate-90'}
                  `}>
                    <Repeat size={24} className="text-gray-400" />
                  </div>
                  <div className={`
                    absolute inset-0 transition-all duration-300 transform
                    ${repeatMode === 'single' ? 'opacity-100 scale-100' : 'opacity-0 scale-75 rotate-90'}
                  `}>
                    <Repeat size={24} />
                  </div>
                  <div className={`
                    absolute inset-0 transition-all duration-300 transform
                    ${repeatMode === 'playlist' ? 'opacity-100 scale-100' : 'opacity-0 scale-75 rotate-90'}
                  `}>
                    <ListRestart size={24} />
                  </div>
                  {/* Placeholder to maintain button size */}
                  <div className="opacity-0">
                    <Repeat size={24} />
                  </div>
                </div>
              </div>

              {/* Mode indicator */}
              <div 
                className={`
                  absolute -top-1.5 -right-1.5 
                  transition-all duration-300 ease-out
                  ${repeatMode !== 'none' 
                    ? 'scale-100 opacity-100 translate-y-0' 
                    : 'scale-50 opacity-0 translate-y-2'
                  }
                `}
              >
                <span 
                  className={`
                    text-[10px] font-bold 
                    bg-white text-black rounded-full w-4 h-4 
                    flex items-center justify-center
                    transform transition-all duration-300
                    z-[2]
                    ${repeatMode === 'playlist' && 'animate-mode-rotate'}
                  `}
                >
                  {repeatMode === 'single' ? '1' : 'A'}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Playlist Section */}
        <div 
          className={`overflow-hidden transition-all duration-300 ease-out
            ${isPlaylistOpen ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}`}
        >
          <div className="space-y-2 pt-2 border-t border-white border-opacity-10">
            <div className="text-white text-sm font-medium mb-2">
              播放清單 ({currentIndex + 1}/{playlist.length})
            </div>
            <div className="space-y-1 max-h-[250px] overflow-y-auto custom-scrollbar pr-2">
              <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                  width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                  background: rgba(255, 255, 255, 0.1);
                  border-radius: 2px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                  background: rgba(255, 255, 255, 0.3);
                  border-radius: 2px;
                  transition: all 0.3s ease;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                  background: rgba(255, 255, 255, 0.5);
                }
              `}</style>
              {playlist.map((song, index) => (
                <div
                  key={index}
                  data-index={index}
                  className="group relative"
                >
                  <div className={`
                    flex items-center
                    rounded-lg transition-all duration-300 ease-out
                    transform
                    ${currentSong.file === song.file
                      ? 'bg-white bg-opacity-20'
                      : 'hover:bg-white hover:bg-opacity-10'
                    }
                  `}>
                    <button
                      className={`
                        flex-1 text-left p-2
                        transition-all duration-300 ease-out
                        ${currentSong.file === song.file
                          ? 'text-white'
                          : 'text-gray-400'
                        }
                      `}
                      onClick={() => onSongChange(song)}
                    >
                      <div className="font-medium truncate flex items-center">
                        <span className="mr-2 flex-shrink-0">{index + 1}.</span>
                        <span className="truncate">{song.name}</span>
                      </div>
                      <div className="text-xs opacity-70 truncate pl-6">
                        {song.artist}
                      </div>
                    </button>
                    <div className="flex items-center pr-2 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 space-x-0.5">
                      {song.link && (
                        <a
                          href={song.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`
                            p-1.5 rounded-lg transition-all duration-300 transform
                            hover:bg-white hover:bg-opacity-10 hover:scale-110 active:scale-95
                            hover:text-white text-gray-400
                          `}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isPlaying) {
                              onPlayToggle();
                            }
                          }}
                        >
                          <ExternalLink 
                            size={16} 
                            className="transition-colors duration-300" 
                          />
                        </a>
                      )}
                      <button
                        className={`p-1.5 rounded-lg transition-all duration-300 transform
                          ${index === 0 
                            ? 'opacity-50 cursor-not-allowed text-gray-600' 
                            : 'hover:bg-white hover:bg-opacity-10 hover:scale-110 active:scale-95 hover:text-white text-gray-400'
                          }`}
                        onClick={() => {
                          if (index > 0) {
                            const targetIndex = index - 1;
                            const element = document.querySelector(`[data-index="${targetIndex}"]`);
                            element?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                            handleMoveItem(index, targetIndex);
                          }
                        }}
                        disabled={index === 0}
                      >
                        <ChevronUp 
                          size={16} 
                          className="transition-colors duration-300"
                        />
                      </button>
                      <button
                        className={`p-1.5 rounded-lg transition-all duration-300 transform
                          ${index === playlist.length - 1 
                            ? 'opacity-50 cursor-not-allowed text-gray-600' 
                            : 'hover:bg-white hover:bg-opacity-10 hover:scale-110 active:scale-95 hover:text-white text-gray-400'
                          }`}
                        onClick={() => {
                          if (index < playlist.length - 1) {
                            const targetIndex = index + 1;
                            const element = document.querySelector(`[data-index="${targetIndex}"]`);
                            element?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                            handleMoveItem(index, targetIndex);
                          }
                        }}
                        disabled={index === playlist.length - 1}
                      >
                        <ChevronDown 
                          size={16} 
                          className="transition-colors duration-300"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div 
            className="relative w-full h-1.5 bg-white bg-opacity-20 rounded-full cursor-pointer group
              touch-pan-x py-2"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const percentage = x / rect.width;
              onTimeChange(percentage * duration);
            }}
            onMouseDown={(e) => handleSliderDrag(e, onTimeChange, duration)}
            onTouchStart={(e) => handleTouchDrag(e, onTimeChange, duration)}
          >
            <div
              className="absolute top-0 left-0 h-full bg-white rounded-full group-hover:bg-blue-400 transition-colors"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg 
                opacity-0 group-hover:opacity-100 transition-opacity
                touch-none
                [@media(hover:none)]:opacity-100"
              style={{ left: `${(currentTime / duration) * 100}%`, transform: 'translate(-50%, -50%)' }}
            />
          </div>
          <div className="flex justify-between text-sm text-gray-400">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex flex-col space-y-2">
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
              className="relative flex-1 h-1.5 bg-white bg-opacity-20 rounded-full cursor-pointer group
                touch-pan-x py-2"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const percentage = x / rect.width;
                onVolumeChange(Math.round(percentage * 100));
              }}
              onMouseDown={(e) => handleSliderDrag(e, (value) => onVolumeChange(Math.round(value)), 100)}
              onTouchStart={(e) => handleTouchDrag(e, (value) => onVolumeChange(Math.round(value)), 100)}
            >
              <div
                className="absolute top-0 left-0 h-full bg-white rounded-full group-hover:bg-blue-400 transition-colors"
                style={{ width: `${isMuted ? 0 : volume}%` }}
              />
              <div 
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg 
                  opacity-0 group-hover:opacity-100 transition-opacity
                  touch-none
                  [@media(hover:none)]:opacity-100"
                style={{ left: `${isMuted ? 0 : volume}%`, transform: 'translate(-50%, -50%)' }}
              />
            </div>
            <span className="text-white text-sm min-w-[3ch]">{isMuted ? 0 : volume}%</span>
          </div>
          {isMobileDevice && (
            <div className="text-gray-400 text-xs text-center pt-1">
              手機瀏覽器可能無法控制音樂音量，請使用裝置音量鍵調整
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VolumePanel; 