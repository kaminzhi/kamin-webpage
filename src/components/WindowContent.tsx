'use client';

import React from 'react';
import { Mail, Github, Linkedin, Instagram, Twitter, Facebook } from 'lucide-react';
import { FaDiscord, FaTelegram } from 'react-icons/fa';
import { iframeConfig } from '@/config/iframe';

interface WindowContentProps {
  type: string;
}

const WindowContent: React.FC<WindowContentProps> = ({ type }) => {
  switch (type) {
    case 'about':
      return (
        <div className="p-4 md:p-6 animate-fadeIn">
          <div className="flex flex-col md:flex-row items-center justify-center md:space-x-6 mb-6">
            <img 
              src="https://avatars.githubusercontent.com/u/72861268?v=4" 
              alt="kamin_zhi avatar" 
              className="w-32 h-32 md:w-64 md:h-64 rounded-full shadow-lg mb-4 md:mb-0" 
            />
            <h2 className="text-xl md:text-2xl font-bold text-black">kamin_zhi (神奇海螺)</h2>
          </div>
          <p className="text-black mb-2 text-center text-xl">
            我是那種什麼都會一點，什麼都不精的人
          </p>
          <p className="text-black mb-7 text-center text-xl italic">
            部落格在左上角
          </p>
          <div className="space-y-6">
            <div className="bg-gray-50 bg-opacity-50 backdrop-blur-sm p-6 rounded-lg hover:shadow-lg transition-shadow">
              <h3 className="font-semibold mb-4 text-lg text-black">掌握的技能✌️</h3>
              <div className="flex flex-wrap gap-3">
                {['React',  'Python', "C++", "C", "JavaScript", "HTML", "CSS", "Git","Linux 部屬","Arduino","硬體拆裝 (這算技能吧?)","Neovim"].map(skill => (
                  <span key={skill} 
                    className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200 transition-colors cursor-pointer">
                    {skill}
                  </span>
                ))}
              </div>
              <div className="my-4" />
              <h3 className="font-semibold mb-4 text-lg text-black">會一點的 (就是有小玩過的🤣)</h3>
              <div className="flex flex-wrap gap-3">
                {['Rust',  'GoLang', "TypeScript", " Verilog", "VB.NET", "Docker" ].map(skill => (
                  <span key={skill} 
                    className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200 transition-colors cursor-pointer">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-gray-50 bg-opacity-50 backdrop-blur-sm p-6 rounded-lg hover:shadow-lg transition-shadow">
              <h3 className="font-semibold mb-4 text-lg text-black">經歷</h3>
              <div className="space-y-4">
                <div className="border-l-2 border-blue-500 pl-4">
                  <h4 className="font-medium text-lg text-black">比賽 ( Damn 我好爛 )</h4>
                  <p className="text-gray-600">2022 - 工科賽電腦修護 優勝</p>
                  <p className="text-gray-600">2023 - 全國專題競賽 佳作</p>
                </div>
                <div className="border-l-2 border-blue-500 pl-4">
                  <h4 className="font-medium text-lg text-black">學校</h4>
                  <p className="text-gray-600">2020 ~ 2023 國立新化高級工業職業學校</p>
                  <p className="text-gray-600">2023 ~ (就學中...) 國立雲林科技大學</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    case 'projects':
      return (
        <div className="p-6 space-y-6 animate-fadeIn">
          {[
            { 
              title: "Minecraft-Server-status", 
              desc: "A Minecraft Server Status Write in Rust", 
              tech: ["Rust"],
              link: "https://github.com/kaminzhi/minecraft-server-status",
              image: "https://www.esports.net/wp-content/uploads/2024/11/minecraft-server-status.webp"
            },
            { 
              title: "kaminzhi.github.io", 
              desc: "My Website", 
              tech: ["Next.js", "TypeScript"],
              link: "https://github.com/kaminzhi/kaminzhi.github.io",
              image: "https://images.ctfassets.net/23aumh6u8s0i/6pjUKboBuFLvCKkE3esaFA/5f2101d6d2add5c615db5e98a553fc44/nextjs.jpeg"
            },
            { 
              title: "Dotfile", 
              desc: "My Dev Config", 
              tech: ["shell", "lua", "tmux", "neovim", "fish"],
              link: "https://github.com/kaminzhi/dotfile",
              image: "https://github.com/kaminzhi/dotfile/raw/main/.images/screenshot.png"
            }
          ].map((project, index) => (
            <a 
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              key={index} 
              className="block group bg-gray-50 bg-opacity-50 backdrop-blur-sm p-6 rounded-lg hover:shadow-xl transition-all cursor-pointer hover:-translate-y-1 duration-300"
            >
              <div className="h-48 rounded-lg mb-4 overflow-hidden">
                {project.image ? (
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      e.currentTarget.parentElement?.classList.add('bg-gradient-to-r', 'from-blue-500', 'to-purple-600');
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 group-hover:opacity-90 transition-all duration-500 group-hover:scale-110" />
                )}
              </div>
              <h3 className="font-semibold mb-2 text-xl text-black">{project.title}</h3>
              <p className="text-gray-600 mb-4">{project.desc}</p>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((tech, i) => (
                  <span key={i} className="px-3 py-1 bg-blue-200 text-gray-700 rounded-full text-sm">
                    {tech}
                  </span>
                ))}
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
    default:
      return null;
  }
};

export default WindowContent; 