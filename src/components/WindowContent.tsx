'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Github, Linkedin, Instagram, Twitter, Facebook, Music } from 'lucide-react';
import { FaDiscord, FaTelegram } from 'react-icons/fa';
import { iframeConfig } from '@/config/iframe';
import { projects } from '@/config/projects';
import Terminal from './Terminal';

interface WindowContentProps {
  type: string;
  onClose?: () => void;
}

const WindowContent: React.FC<WindowContentProps> = ({ type, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVpnConnected, setIsVpnConnected] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const handleVpnStatusChange = (event: CustomEvent) => {
      const status = event.detail;
      setIsVpnConnected(status.isConnected);
      
      // 当 VPN 断开连接且当前是终端窗口时，关闭窗口
      if (!status.isConnected && type === 'terminal' && onClose) {
        onClose();
      }
    };

    // 监听 VPN 状态变化
    window.addEventListener('vpn-status-change' as any, handleVpnStatusChange as any);

    // 清理函数
    return () => {
      window.removeEventListener('vpn-status-change' as any, handleVpnStatusChange as any);
    };
  }, [type, onClose]);

  useEffect(() => {
    const audio = document.querySelector('audio');
    if (!audio) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    setIsPlaying(!audio.paused);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  switch (type) {
    case 'about':
      return (
        <div className="p-4 md:p-6 animate-fadeIn">
          <div className="flex flex-col md:flex-row items-center justify-center md:space-x-6 mb-6">
            <div className="flex items-center relative mb-6 md:mb-0">
              <div className="relative w-32 h-32 md:w-64 md:h-64">
                <div className="absolute inset-[-4px] md:inset-[-8px] rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-spin-slow" />
                <div className="absolute inset-[-2px] md:inset-[-4px] rounded-full bg-gradient-to-r from-gray-900 to-gray-800 animate-spin-slow">
                  <div className="absolute inset-0 rounded-full opacity-20">
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute inset-0 rounded-full border border-gray-400"
                        style={{
                          transform: `scale(${(i + 1) * 0.1 + 0.2})`,
                        }}
                      />
                    ))}
                  </div>
                </div>
                <div className="absolute inset-[8px] md:inset-[16px] bg-white rounded-full">
                  <img 
                    src="https://avatars.githubusercontent.com/u/72861268?v=4" 
                    alt="kamin_zhi avatar" 
                    className="w-full h-full rounded-full shadow-lg" 
                  />
                </div>
              </div>
              <div className="absolute top-2 right-3 md:top-8 md:right-10">
                <div className={`relative transition-opacity duration-500 ${isPlaying ? 'opacity-100' : 'opacity-0'}`}>
                  <Music className="w-8 h-8 md:w-10 md:h-10 text-blue-500 animate-bounce-slow [animation-duration:2s]" />
                  <Music className="w-6 h-6 md:w-8 md:h-8 text-purple-500 animate-bounce-slow [animation-duration:1.5s] absolute -top-3 -right-3" />
                  <Music className="w-6 h-6 md:w-7 md:h-7 text-pink-500 animate-bounce-slow [animation-duration:1s] absolute -top-3 -left-3" />
                </div>
              </div>
              <div className={`absolute bottom-0 right-0 md:bottom-4 md:right-4 origin-bottom-right transform 
                ${isPlaying ? 'rotate-[-20deg] animate-needle-down' : 'rotate-[-100deg] animate-needle-up'} 
                transition-all duration-700 ease-in-out`}>
                <div className="w-2 h-16 md:h-24 bg-gradient-to-b from-pink-500 to-purple-600 rounded-t-full shadow-lg">
                  <div className="absolute -left-2 top-0 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-md" />
                </div>
              </div>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-black">kamin_zhi (神奇海螺)</h2>
          </div>
          <p className="text-black mb-2 text-center text-xl">
            我是那種什麼都會一點，什麼都不精的人
          </p>
          <p className="text-black mb-7 text-center text-xl italic">
            部落格在左上角
          </p>
          <div className="space-y-6">
            <div className="bg-gray-50 bg-opacity-50 backdrop-blur-sm p-6 rounded-lg 
              hover:shadow-lg transition-all duration-300 ease-in-out
              hover:-translate-y-1 hover:bg-opacity-70
              cursor-pointer
            ">
              <h3 className="font-semibold mb-4 text-lg text-black">掌握的技能✌️</h3>
              <div className="flex flex-wrap gap-3">
                {['React', 'Python', "C++", "C", "JavaScript", "HTML", "CSS", "Git","Linux 部屬","Arduino","硬體拆裝 (這算技能吧?)","Neovim"].map(skill => (
                  <span key={skill} 
                    className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm 
                      hover:bg-blue-200 
                      transition-all duration-300 ease-in-out
                      hover:-translate-y-1 hover:scale-110
                      hover:shadow-md
                      cursor-pointer"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <div className="my-4" />
              <h3 className="font-semibold mb-4 text-lg text-black">會一點的 (就是有小玩過的🤣)</h3>
              <div className="flex flex-wrap gap-3">
                {['Rust',  'GoLang', "TypeScript", " Verilog", "VB.NET", "Docker" ].map(skill => (
                  <span key={skill} 
                    className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm 
                      hover:bg-blue-200 
                      transition-all duration-300 ease-in-out
                      hover:-translate-y-1 hover:scale-110
                      hover:shadow-md
                      cursor-pointer">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-gray-50 bg-opacity-50 backdrop-blur-sm p-6 rounded-lg 
              hover:shadow-lg transition-all duration-300 ease-in-out
              hover:-translate-y-1 hover:bg-opacity-70
              cursor-pointer
            ">
              <h3 className="font-semibold mb-4 text-lg text-black">經歷</h3>
              <div className="space-y-4">
                <div className="border-l-2 border-blue-500 pl-4 
                  transition-all duration-300 ease-in-out
                  hover:border-l-4 hover:pl-6 hover:translate-x-2
                  hover:bg-white hover:bg-opacity-30 hover:rounded-r-lg
                  cursor-pointer group
                ">
                  <h4 className="font-medium text-lg text-black transition-colors group-hover:text-blue-600">
                    比賽 ( Damn 我好爛 )
                  </h4>
                  <p className="text-gray-600 transition-colors group-hover:text-gray-800">
                    2022 - 工科賽電腦修護 優勝
                  </p>
                  <p className="text-gray-600 transition-colors group-hover:text-gray-800">
                    2023 - 全國專題競賽 佳作
                  </p>
                </div>
                <div className="border-l-2 border-blue-500 pl-4 
                  transition-all duration-300 ease-in-out
                  hover:border-l-4 hover:pl-6 hover:translate-x-2
                  hover:bg-white hover:bg-opacity-30 hover:rounded-r-lg
                  cursor-pointer group
                ">
                  <h4 className="font-medium text-lg text-black transition-colors group-hover:text-blue-600">
                    學校
                  </h4>
                  <p className="text-gray-600 transition-colors group-hover:text-gray-800">
                    2020 ~ 2023 國立新化高級工業職業學校
                  </p>
                  <p className="text-gray-600 transition-colors group-hover:text-gray-800">
                    2023 ~ (就學中...) 國立雲林科技大學
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    case 'projects':
      return (
        <div className="p-6 space-y-6 animate-fadeIn">
          {projects.map((project, index) => (
            <a 
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              key={index} 
              className="block group bg-gray-50 bg-opacity-50 backdrop-blur-sm p-6 rounded-lg 
                hover:shadow-xl transition-all cursor-pointer 
                hover:-translate-y-1 duration-300
                active:scale-95 active:shadow-md
                hover:bg-gray-100 hover:bg-opacity-60"
            >
              <div className="relative h-48 rounded-lg mb-4 overflow-hidden">
                {project.image ? (
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 
                      group-hover:scale-110 group-hover:rotate-1"
                    onError={(e) => {
                      e.currentTarget.parentElement?.classList.add('bg-gradient-to-r', 'from-blue-500', 'to-purple-600');
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 
                    group-hover:opacity-90 transition-all duration-500 
                    group-hover:scale-110 group-hover:rotate-1" />
                )}
                <div className="absolute top-4 right-4">
                  <img 
                    src={project.author.avatar}
                    alt={project.author.name}
                    className="w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-gray-200 
                      hover:scale-110 transition-transform duration-200
                      hover:border-blue-400 shadow-md
                      hover:shadow-lg"
                  />
                </div>
              </div>
              <div className="mb-4">
                <h3 className="font-semibold text-xl text-black mb-2">{project.title}</h3>
                <p className="text-gray-600">{project.desc}</p>
              </div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech, i) => (
                    <span key={i} className="px-3 py-1 bg-blue-200 text-gray-700 rounded-full text-sm
                      hover:bg-blue-300 hover:-translate-y-1 hover:scale-105
                      transition-all duration-200 cursor-pointer">
                      {tech}
                    </span>
                  ))}
                </div>
                {project.languages && (
                  <div className="flex flex-col w-full md:w-auto md:items-end">
                    <div className="flex h-2 overflow-hidden rounded-full bg-gray-200 w-full md:w-64">
                      {project.languages.map((lang, i) => (
                        <div
                          key={i}
                          className="h-full transition-all duration-300"
                          style={{
                            width: `${lang.percentage}%`,
                            backgroundColor: lang.color || '#666'
                          }}
                        />
                      ))}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-x-4 text-sm text-gray-600 md:justify-end">
                      {project.languages.map((lang, i) => (
                        <div key={i} className="flex items-center gap-1">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: lang.color || '#666' }}
                          />
                          <span>{lang.name}</span>
                          <span>{lang.percentage.toFixed(1)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </a>
          ))}
        </div>
      );
    case 'contact':
      return (
        <div className="p-6 animate-fadeIn">
          <div className="text-center mb-8">
            <h2 className="text-3xl text-black font-bold mb-4">怎麼找我</h2>
            <p className="text-gray-600 max-w-md mx-auto">
              下面是可以找到我的管道還有一些連結
            </p>
          </div>
          <div className="max-w-md mx-auto space-y-4">
            <a href="mailto:kamin@kaminzhi.com" 
              className="flex items-center p-4 bg-gray-50 bg-opacity-50 backdrop-blur-sm rounded-lg
                hover:bg-gray-100 hover:bg-opacity-60 
                transition-all duration-200
                hover:scale-[1.02] hover:shadow-lg
                active:scale-95"
            >
              <Mail className="mr-4 text-blue-500" />
              <span className="text-black">kamin@kaminzhi.com</span>
            </a>
            <a href="https://github.com/kaminzhi" 
              className="flex items-center p-4 bg-gray-50 bg-opacity-50 backdrop-blur-sm rounded-lg
              hover:bg-gray-100 hover:bg-opacity-60 
              transition-all duration-200
              hover:scale-[1.02] hover:shadow-lg
              active:scale-95"
            >
              <Github className="mr-4 text-gray-700" />
              <span className="text-black">GitHub Profile</span>
            </a>
            <a href="https://t.me/kamin_zhi" 
              className="flex items-center p-4 bg-gray-50 bg-opacity-50 backdrop-blur-sm rounded-lg
                hover:bg-gray-100 hover:bg-opacity-60 
                transition-all duration-200
                hover:scale-[1.02] hover:shadow-lg
                active:scale-95"
            >
              <FaTelegram className="mr-4 text-blue-400 text-2xl" size={24} />
              <span className="text-black">Telegram（kamin_zhi）</span>
            </a>
            <a href="https://www.instagram.com/kamin_zhi/" 
              className="flex items-center p-4 bg-gray-50 bg-opacity-50 backdrop-blur-sm rounded-lg
                hover:bg-gray-100 hover:bg-opacity-60 
                transition-all duration-200
                hover:scale-[1.02] hover:shadow-lg
                active:scale-95"
            >
              <Instagram className="mr-4 text-red-400" />
              <span className="text-black">Instagram（kamin_zhi）</span>
            </a>
            <a href="https://twitter.com/kamin_zhi" 
              className="flex items-center p-4 bg-gray-50 bg-opacity-50 backdrop-blur-sm rounded-lg
                hover:bg-gray-100 hover:bg-opacity-60 
                transition-all duration-200
                hover:scale-[1.02] hover:shadow-lg
                active:scale-95"
            >
              <Twitter className="mr-4 text-blue-600" />
              <span className="text-black">Twitter（kamin_zhi）</span>
            </a>
            <a href="https://discordapp.com/users/kamin_zhi" 
              className="flex items-center p-4 bg-gray-50 bg-opacity-50 backdrop-blur-sm rounded-lg
                hover:bg-gray-100 hover:bg-opacity-60 
                transition-all duration-200
                hover:scale-[1.02] hover:shadow-lg
                active:scale-95"
            >
              <FaDiscord className="mr-4 text-blue-600 text-2xl" size={24} />
              <span className="text-black">Discord（神奇海螺）遊戲好玩</span>
            </a>
            <a href="https://www.facebook.com/kaminzhi1" 
              className="flex items-center p-4 bg-gray-50 bg-opacity-50 backdrop-blur-sm rounded-lg
                hover:bg-gray-100 hover:bg-opacity-60 
                transition-all duration-200
                hover:scale-[1.02] hover:shadow-lg
                active:scale-95"
            >
              <Facebook className="mr-4 text-blue-600" />
              <span className="text-black">Facebook（陳品誌）</span>
            </a>
            <a href="" 
              className="flex items-center p-4 bg-gray-50 bg-opacity-50 backdrop-blur-sm rounded-lg
                hover:bg-gray-100 hover:bg-opacity-60 
                transition-all duration-200
                hover:scale-[1.02] hover:shadow-lg
                active:scale-95"
            >
              <Linkedin className="mr-4 text-blue-600" />
              <del className='text-black'><span className="text-black">LinkedIn Profile (不對我沒有LinkedIn)</span></del>
            </a>
          <p className="text-black text-center mt-4 text-xl">
          沒了就這樣，你在期待甚麼 (◐‿◑)
          </p>
          </div>
        </div>
      );
    case 'blog':
      return (
        <div className="w-full h-full bg-white">
          <iframe
            src={iframeConfig.blog.url}
            className="w-full h-full"
            style={{ 
              border: 'none',
              transform: 'translate3d(0,0,0)',
              backfaceVisibility: 'hidden',
              WebkitFontSmoothing: 'antialiased',
              imageRendering: '-webkit-optimize-contrast',
              width: '100%',
              height: '100%',
              margin: '0',
              padding: '0',
              overflow: 'hidden'
            }}
            loading="eager"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            referrerPolicy="no-referrer"
            scrolling="auto"
          />
        </div>
      );
    case 'terminal':
      return (
        <div className="h-full">
          <Terminal 
            isActive={true} 
            onClose={onClose} 
          />
        </div>
      );
    default:
      return null;
  }
};

export default WindowContent; 