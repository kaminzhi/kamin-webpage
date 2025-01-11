'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Wifi, Battery, Volume2, VolumeX } from 'lucide-react';
import Clock from './Clock';
import WifiPanel from './WifiPanel';
import VolumePanel from './VolumePanel';
import BatteryPanel from './BatteryPanel';
import { playlist, defaultSong } from '@/config/music';
import TaskbarButton from '@/components/TaskbarButton';
import { iframeConfig } from '@/config/iframe';

interface StatusBarProps {
  allWindowsClosed: boolean;
  onBlogClick: () => void;
  currentWindow?: string;
  isBlogOpen: boolean;
  onVpnConnect?: (connected: boolean) => void;
  onWindowChange?: (window: string | null) => void;
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

const StatusBar: React.FC<StatusBarProps> = ({ 
  allWindowsClosed, 
  onBlogClick, 
  currentWindow,
  isBlogOpen,
  onVpnConnect,
  onWindowChange
}) => {
  const [isWifiPanelOpen, setIsWifiPanelOpen] = useState(false);
  const [isVolumePanelOpen, setIsVolumePanelOpen] = useState(false);
  const [isBatteryPanelOpen, setIsBatteryPanelOpen] = useState(false);
  const [volume, setVolume] = useState(10);
  const [isMuted, setIsMuted] = useState(false);
  const [isAudioLoaded, setIsAudioLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const wifiRef = useRef<HTMLDivElement>(null);
  const volumeRef = useRef<HTMLDivElement>(null);
  const batteryRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentSong, setCurrentSong] = useState(defaultSong);
  const [repeatMode, setRepeatMode] = useState<'none' | 'single' | 'playlist'>('single');
  const [localPlaylist, setLocalPlaylist] = useState(playlist);

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
        audio.play().catch(() => {
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
  }, [repeatMode, currentSong]);

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (newVolume > 0) {
      setIsMuted(false);
    }
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.volume = !isMuted ? 0 : volume / 100;
    }
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
      
      setRepeatMode(current => {
        switch (current) {
          case 'none':
            return 'single';
          case 'single':
            return 'playlist';
          case 'playlist':
            return 'none';
        }
      });
      
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

  const handleSongChange = (song: typeof defaultSong) => {
    setCurrentSong(song);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setIsPlaying(true);
      audioRef.current.play();
    }
  };

  const handleEnded = () => {
    if (repeatMode === 'single') {
      // 單曲循環
      if (audioRef.current) {
        const currentTime = audioRef.current.currentTime;
        audioRef.current.play().then(() => {
          if (audioRef.current) {
            audioRef.current.currentTime = 0;
          }
        }).catch(() => {});
      }
    } else if (repeatMode === 'playlist') {
      // 歌單循環
      const currentIndex = playlist.findIndex(song => song.file === currentSong.file);
      const nextIndex = (currentIndex + 1) % playlist.length;
      const currentTime = audioRef.current?.currentTime || 0;
      handleSongChange(playlist[nextIndex]);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
      }
    } else {
      // 不循環
      setIsPlaying(false);
    }
  };

  const handlePlaylistChange = (newPlaylist: typeof playlist) => {
    setLocalPlaylist(newPlaylist);
  };

  return (
    <div className={`
      fixed top-0 left-0 right-0 h-12 
      bg-black bg-opacity-80 backdrop-blur-md
      flex items-center justify-between px-4 
      z-40
      transition-all duration-500
      ${allWindowsClosed ? 'translate-y-0' : ''}
    `}>
      <div className="flex items-center space-x-2">
        <TaskbarButton
          title={iframeConfig.blog.title}
          isActive={currentWindow === 'blog'}
          isOpen={isBlogOpen}
          onClick={onBlogClick}
        />
        <Clock allWindowsClosed={allWindowsClosed} />
      </div>
      <div className="flex items-center space-x-4">
        <div ref={volumeRef}>
          <button 
            onClick={() => setIsVolumePanelOpen(!isVolumePanelOpen)}
            className="p-1 md:p-1.5 rounded-full hover:bg-white hover:bg-opacity-10 transition-colors relative"
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
            repeatMode={repeatMode}
            currentTime={currentTime}
            duration={duration}
            currentSong={currentSong}
            playlist={localPlaylist}
            onVolumeChange={handleVolumeChange}
            onMuteToggle={toggleMute}
            onPlayToggle={togglePlay}
            onLoopToggle={handleLoopToggle}
            onTimeChange={handleTimeChange}
            onSongChange={handleSongChange}
            onPlaylistChange={handlePlaylistChange}
          />
        </div>
        <div ref={wifiRef}>
          <button 
            onClick={() => setIsWifiPanelOpen(!isWifiPanelOpen)}
            className="p-1 md:p-1.5 rounded-full hover:bg-white hover:bg-opacity-10 transition-colors relative"
          >
            <Wifi size={20} className="text-white" />
          </button>
          <WifiPanel 
            isOpen={isWifiPanelOpen} 
            onVpnConnect={onVpnConnect} 
            currentWindow={currentWindow}
            onWindowChange={onWindowChange}
          />
        </div>
        <div ref={batteryRef}>
          <button
            onClick={() => setIsBatteryPanelOpen(!isBatteryPanelOpen)}
            className="p-1 md:p-1.5 rounded-full hover:bg-white hover:bg-opacity-10 transition-colors relative"
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