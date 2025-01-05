'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Wifi, Battery, Volume2, VolumeX } from 'lucide-react';
import Clock from './Clock';
import WifiPanel from './WifiPanel';
import VolumePanel from './VolumePanel';
import BatteryPanel from './BatteryPanel';
import { backgroundMusic } from '@/config/music';

interface StatusBarProps {
  allWindowsClosed: boolean;
  onBlogClick: () => void;
}

const StatusBarBatteryIcon = () => (
  <div className="relative">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 電池外殼 */}
      <rect x="2" y="7" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="2"/>
      {/* 電池頭 */}
      <rect x="20" y="10" width="2" height="4" fill="currentColor"/>
      {/* 電量動畫 */}
      <rect 
        x="4" 
        y="9" 
        width="14" 
        height="6" 
        className="fill-green-500 animate-pulse"
      />
      {/* 充電符號 */}
      <path 
        d="M11 14L9 11H13L11 8" 
        stroke="black" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className="animate-bounce"
      />
    </svg>
  </div>
);

const StatusBar: React.FC<StatusBarProps> = ({ allWindowsClosed, onBlogClick }) => {
  const [isWifiPanelOpen, setIsWifiPanelOpen] = useState(false);
  const [isVolumePanelOpen, setIsVolumePanelOpen] = useState(false);
  const [isBatteryPanelOpen, setIsBatteryPanelOpen] = useState(false);
  const [volume, setVolume] = useState(20);
  const [isMuted, setIsMuted] = useState(false);
  const [isAudioLoaded, setIsAudioLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const wifiRef = useRef<HTMLDivElement>(null);
  const volumeRef = useRef<HTMLDivElement>(null);
  const batteryRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentSong] = useState(backgroundMusic);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wifiRef.current && !wifiRef.current.contains(event.target as Node)) {
        setIsWifiPanelOpen(false);
      }
      if (volumeRef.current && !volumeRef.current.contains(event.target as Node)) {
        setIsVolumePanelOpen(false);
      }
      if (batteryRef.current && !batteryRef.current.contains(event.target as Node)) {
        setIsBatteryPanelOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = isLooping;
    }
  }, [isLooping]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const handleCanPlayThrough = () => {
        setIsAudioLoaded(true);
        setDuration(audio.duration);
        // 在音頻加載完成後嘗試自動播放
        audio.play().catch(() => {
          // 如果自動播放失敗，等待用戶交互
          const handleFirstInteraction = () => {
            audio.play().catch(() => {});
            document.removeEventListener('click', handleFirstInteraction);
            document.removeEventListener('keydown', handleFirstInteraction);
            document.removeEventListener('touchstart', handleFirstInteraction);
          };
          document.addEventListener('click', handleFirstInteraction);
          document.addEventListener('keydown', handleFirstInteraction);
          document.addEventListener('touchstart', handleFirstInteraction);
        });
      };

      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);
      const handleEnded = () => {
        if (!isLooping) {
          setIsPlaying(false);
        } else {
          // 如果是循環模式，重新播放
          const currentTime = audio.currentTime;
          audio.play().then(() => {
            if (audioRef.current) {
              audioRef.current.currentTime = currentTime;
            }
          }).catch(() => {});
        }
      };
      const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
      const handleDurationChange = () => setDuration(audio.duration);

      audio.addEventListener('canplaythrough', handleCanPlayThrough);
      audio.addEventListener('play', handlePlay);
      audio.addEventListener('pause', handlePause);
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('durationchange', handleDurationChange);
      audio.load();

      return () => {
        audio.removeEventListener('canplaythrough', handleCanPlayThrough);
        audio.removeEventListener('play', handlePlay);
        audio.removeEventListener('pause', handlePause);
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('durationchange', handleDurationChange);
      };
    }
  }, [isLooping]);

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (newVolume > 0) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const togglePlay = () => {
    if (audioRef.current && isAudioLoaded) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => {
          setIsPlaying(false);
        });
      }
    }
  };

  const handleTimeChange = (newTime: number) => {
    if (audioRef.current && isAudioLoaded) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleLoopToggle = () => {
    if (audioRef.current) {
      const currentTime = audioRef.current.currentTime;
      const wasPlaying = !audioRef.current.paused;
      
      setIsLooping(!isLooping);
      
      // 保持當前播放位置和狀態
      if (wasPlaying && audioRef.current) {
        audioRef.current.play().then(() => {
          if (audioRef.current) {
            audioRef.current.currentTime = currentTime;
          }
        }).catch(() => {});
      }
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 h-12 bg-black bg-opacity-80 backdrop-blur-md z-40 flex items-center px-4">
      <div className="flex-1 flex items-center space-x-4">
        <button 
          onClick={onBlogClick}
          className="inline-flex px-4 py-1 rounded-full bg-white bg-opacity-20 backdrop-blur-sm
                   text-white text-base font-medium 
                   hover:bg-opacity-30 transition-all duration-300
                   hover:scale-105 transform"
        >
          My Blog
        </button>
      </div>
      <div className="flex-1 flex justify-center pointer-events-none">
        <Clock allWindowsClosed={allWindowsClosed} />
      </div>
      <div className="flex-1 flex items-center justify-end space-x-4">
        <div ref={volumeRef}>
          <button 
            onClick={() => setIsVolumePanelOpen(!isVolumePanelOpen)}
            className="p-1.5 rounded-full hover:bg-white hover:bg-opacity-10 transition-colors relative"
          >
            {isMuted || volume === 0 ? (
              <VolumeX size={20} className="text-white" />
            ) : (
              <Volume2 size={20} className="text-white" />
            )}
          </button>
          <VolumePanel 
            isOpen={isVolumePanelOpen}
            volume={volume}
            isMuted={isMuted}
            isPlaying={isPlaying}
            isLooping={isLooping}
            currentTime={currentTime}
            duration={duration}
            currentSong={currentSong}
            onVolumeChange={handleVolumeChange}
            onMuteToggle={toggleMute}
            onPlayToggle={togglePlay}
            onLoopToggle={handleLoopToggle}
            onTimeChange={handleTimeChange}
          />
        </div>
        <div ref={wifiRef}>
          <button 
            onClick={() => setIsWifiPanelOpen(!isWifiPanelOpen)}
            className="p-1.5 rounded-full hover:bg-white hover:bg-opacity-10 transition-colors relative"
          >
            <Wifi size={20} className="text-white" />
          </button>
          <WifiPanel isOpen={isWifiPanelOpen} />
        </div>
        <div ref={batteryRef}>
          <button
            onClick={() => setIsBatteryPanelOpen(!isBatteryPanelOpen)}
            className="p-1.5 rounded-full hover:bg-white hover:bg-opacity-10 transition-colors relative"
          >
            <StatusBarBatteryIcon />
          </button>
          <BatteryPanel isOpen={isBatteryPanelOpen} />
        </div>
      </div>
      <audio
        ref={audioRef}
        src={currentSong.file}
        loop={isLooping}
        preload="auto"
      />
    </div>
  );
};

export default StatusBar; 