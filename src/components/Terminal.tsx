'use client';

import React, { useEffect, useRef } from 'react';
import type { Terminal as Xterm } from 'xterm';
import type { FitAddon } from 'xterm-addon-fit';
import type { WebLinksAddon } from 'xterm-addon-web-links';
import { VPN_CONFIG } from '@/config/vpn';

interface TerminalProps {
  isActive: boolean;
  onClose?: () => void;
}

const Terminal: React.FC<TerminalProps> = ({ isActive, onClose }) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<Xterm | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!terminalRef.current) return;

    const initTerminal = async () => {
      const { Terminal } = await import('xterm');
      const { FitAddon } = await import('xterm-addon-fit');
      const { WebLinksAddon } = await import('xterm-addon-web-links');
      // @ts-ignore
      await import('xterm/css/xterm.css');

      const term = new Terminal({
        cursorBlink: true,
        cursorStyle: 'block',
        theme: {
          background: 'rgba(255, 255, 255, 0)',
          foreground: '#000000',
          cursor: '#000000',
          cursorAccent: '#ffffff',
          selectionBackground: '#33467C',
          black: '#000000',
          red: '#cc0000',
          green: '#006600',
          yellow: '#999900',
          blue: '#0066cc',
          magenta: '#993399',
          cyan: '#009999',
          white: '#333333',
          brightBlack: '#666666',
          brightRed: '#cc0000',
          brightGreen: '#006600',
          brightYellow: '#999900',
          brightBlue: '#0066cc',
          brightMagenta: '#993399',
          brightCyan: '#009999',
          brightWhite: '#000000'
        },
        fontSize: 16,
        fontWeight: 'normal',
        fontFamily: 'Menlo, Monaco, "Courier New", monospace',
        letterSpacing: 0,
        lineHeight: 1.2
      });

      // 添加插件
      const fitAddon = new FitAddon();
      term.loadAddon(fitAddon);
      term.loadAddon(new WebLinksAddon());

      // 打開終端
      if (terminalRef.current) {
        term.open(terminalRef.current);
        fitAddon.fit();

        // 添加自定义滚动条样式
        const style = document.createElement('style');
        style.textContent = `
          .xterm-viewport::-webkit-scrollbar {
            width: 8px;
          }
          .xterm-viewport::-webkit-scrollbar-track {
            background: transparent;
          }
          .xterm-viewport::-webkit-scrollbar-thumb {
            background-color: rgba(0, 0, 0, 0.2);
            border-radius: 4px;
          }
          .xterm-viewport::-webkit-scrollbar-thumb:hover {
            background-color: rgba(0, 0, 0, 0.3);
          }
        `;
        document.head.appendChild(style);
      }

      xtermRef.current = term;
      fitAddonRef.current = fitAddon;

      interface FileSystemItem {
        type: 'file' | 'dir';
        content: string | { [key: string]: FileSystemItem };
        mode: number;
      }

      interface FileSystem {
        [key: string]: FileSystemItem;
      }

      const fileSystem: FileSystem = {
        '/': {
          type: 'dir',
          mode: 0o755,
          content: {
            'bin': { type: 'dir', content: {}, mode: 0o755 },
            'etc': { type: 'dir', content: {}, mode: 0o755 },
            'usr': { type: 'dir', content: {}, mode: 0o755 },
            'var': { type: 'dir', content: {}, mode: 0o755 },
            'home': {
              type: 'dir',
              mode: 0o755,
              content: {
                'MGconch': {
                  type: 'dir',
                  mode: 0o755,
                  content: {
                    'Documents': { type: 'dir', content: {}, mode: 0o755 },
                    'Downloads': { type: 'dir', content: {}, mode: 0o755 },
                    'projects': {
                      type: 'dir',
                      mode: 0o755,
                      content: {
                        'website': {
                          type: 'dir',
                          mode: 0o755,
                          content: {
                            'index.html': { type: 'file', content: `<!DOCTYPE html>\n<html>\n  <head>\n    <title>Web Project</title>\n  </head>\n  <body>\n    <h1>Hello World</h1>\n  </body>\n</html>`, mode: 0o644 }
                          }
                        },
                        'hello-py':{
                          type: 'dir',
                          mode: 0o755,
                          content: {
                            'main.py': { type: 'file', content: 'import os\n\ndef main():\n    print("Hello, World!")\n\nif __name__ == "__main__":\n    main()', mode: 0o644 }
                          }
                        }
                      }
                    },
                    '.bashrc': { type: 'file', content: '# bash configuration', mode: 0o644 },
                    'readme.md': { type: 'file', content: 'Welcome to the terminal!', mode: 0o644 },
                    
                  }
                }
              }
            }
          }
        }
      };

      let currentPath = ['/home/MGconch'];
      let currentLine = '';
      let vimMode = ''; // 'normal', 'insert', 'command'
      let vimContent: string[] = [];
      let vimCurrentFile = '';
      let vimCursorPos = { row: 0, col: 0 };
      let vimCommandBuffer = '';
      let commandHistory: string[] = [];
      let historyIndex = -1;
      let savedCurrentLine = '';
      let isPinging = false;
      let pingTimer: NodeJS.Timeout | null = null;

      function getFullPath() {
        return currentPath.join('/').replace('//', '/').replace('/home/MGconch', '~');
      }

      function getCurrentDir(): { [key: string]: FileSystemItem } {
        let current: any = fileSystem;
        const parts = currentPath[0].split('/').filter(Boolean);
        for (const part of parts) {
          if (current[part]?.type === 'dir') {
            current = current[part].content;
          } else if (current['/']?.content[part]?.type === 'dir') {
            current = current['/'].content[part].content;
          }
        }
        return current || {};
      }

      function getPermissionString(mode: number): string {
        const permissions = ['---', '--x', '-w-', '-wx', 'r--', 'r-x', 'rw-', 'rwx'];
        const userPerm = (mode >> 6) & 0o7;
        const groupPerm = (mode >> 3) & 0o7;
        const otherPerm = mode & 0o7;
        return `${permissions[userPerm]}${permissions[groupPerm]}${permissions[otherPerm]}`;
      }

      function handleCommand(cmd: string, term: any) {
        const args = cmd.split(' ');
        const command = args[0];

        // command history
        if (cmd.trim() !== '') {
          commandHistory.push(cmd);
          historyIndex = commandHistory.length;
        }

        switch (command) {
          case 'exit':
            term.writeln('logout');
            if (onClose) {
              onClose();
            }
            break;

          case 'ping':
            if (!args[1]) {
              term.writeln('ping: usage error: Destination address required');
              break;
            }

            let host = args[1];
            let isInfinite = false;

            // check -t
            if (args[1] === '-t') {
              if (!args[2]) {
                term.writeln('ping: usage error: Destination address required');
                break;
              }
              isInfinite = true;
              host = args[2];
            }

            // IP 地址格式验证 (IPv4)
            const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
            // 域名格式验证
            const domainRegex = /^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

            if (!ipRegex.test(host) && !domainRegex.test(host)) {
              term.writeln('ping: invalid address format');
              term.writeln('Usage: ping [-t] <ip_address/domain>');
              term.writeln('Examples:');
              term.writeln('  ping 192.168.1.1');
              term.writeln('  ping example.com');
              term.writeln('  ping -t example.com');
              break;
            }

            const count = isInfinite ? Infinity : 4;
            isPinging = true;
            term.write(`PING ${host} (127.0.0.1) 56(84) bytes of data.\r\n`);
            
            let pingCount = 0;
            let totalTime = 0;
            let minTime = Infinity;
            let maxTime = 0;
            let startTime = Date.now();
            let times: number[] = [];
            
            const doPing = () => {
              const time = Math.floor(Math.random() * 15 + 10);
              times.push(time);
              totalTime += time;
              minTime = Math.min(minTime, time);
              maxTime = Math.max(maxTime, time);
              
              term.write(`64 bytes from ${host} (127.0.0.1): icmp_seq=${pingCount + 1} ttl=64 time=${time.toFixed(3)} ms\r\n`);
              pingCount++;
              
              if (pingCount >= count) {
                if (!isInfinite) {
                  const avgTime = (totalTime / count).toFixed(3);
                  const elapsedTime = Date.now() - startTime;
                  
                  const mean = totalTime / count;
                  const variance = times.reduce((acc, t) => acc + Math.pow(t - mean, 2), 0) / count;
                  const mdev = Math.sqrt(variance).toFixed(3);
                  
                  term.write('\r\n');
                  term.write(`--- ${host} ping statistics ---\r\n`);
                  term.write(`${count} packets transmitted, ${count} received, 0% packet loss, time ${elapsedTime}ms\r\n`);
                  term.write(`rtt min/avg/max/mdev = ${minTime.toFixed(3)}/${avgTime}/${maxTime.toFixed(3)}/${mdev} ms\r\n`);
                  isPinging = false;
                  pingTimer = null;
                  term.write('\r\n');
                  writePrompt(term);
                } else {
                  const nextPingTime = 1000;
                  const clearPromptInterval = 50;
                  const clearPromptCount = nextPingTime / clearPromptInterval;
                  let currentClearCount = 0;
                  
                  const clearPromptTimer = setInterval(() => {
                    term.write('\x1B[2K\r');
                    currentClearCount++;
                    if (currentClearCount >= clearPromptCount) {
                      clearInterval(clearPromptTimer);
                    }
                  }, clearPromptInterval);
                  
                  pingTimer = setTimeout(() => {
                    clearInterval(clearPromptTimer);
                    term.write('\x1B[2K\r');
                    doPing();
                  }, nextPingTime);
                }
              } else {
                const nextPingTime = 1000;
                const clearPromptInterval = 50;
                const clearPromptCount = nextPingTime / clearPromptInterval;
                let currentClearCount = 0;
                
                const clearPromptTimer = setInterval(() => {
                  term.write('\x1B[2K\r');
                  currentClearCount++;
                  if (currentClearCount >= clearPromptCount) {
                    clearInterval(clearPromptTimer);
                  }
                }, clearPromptInterval);
                
                pingTimer = setTimeout(() => {
                  clearInterval(clearPromptTimer);
                  term.write('\x1B[2K\r');
                  doPing();
                }, nextPingTime);
              }
            };
            
            term.write('\x1B[2K\r');
            doPing();
            return;

          case 'ls':
          case 'll':
          case 'ls-l':
            const dir = getCurrentDir();
            if (args.includes('-al') || args.includes('-l') || command === 'll' || command === 'ls-l') {
              term.writeln('total ' + Object.keys(dir).length);
              Object.entries(dir).forEach(([name, item]: [string, any]) => {
                const type = item.type === 'dir' ? 'd' : '-';
                const perms = getPermissionString(item.mode || 0o644); // default 644
                const date = new Date().toLocaleString('en-US', { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' });
                term.writeln(`${type}${perms} 1 user group 4096 ${date} \x1b[${item.type === 'dir' ? '1;34' : '0;37'}m${name}\x1b[0m`);
              });
            } else {
              Object.entries(dir).forEach(([name, item]: [string, any]) => {
                term.write(`\x1b[${item.type === 'dir' ? '1;34' : '0;37'}m${name}\x1b[0m  `);
              });
              term.write('\r\n');
            }
            break;

          case 'cd':
            const target = args[1] || '/home/MGconch';
            if (target === '..') {
              const parts = currentPath[0].split('/').filter(Boolean);
              if (parts.length > 2) {
                parts.pop();
                currentPath[0] = '/' + parts.join('/');
              }
            } else if (target.startsWith('/')) {
              const normalizedPath = target.replace(/\/+/g, '/').replace(/\/$/, '');
              if (normalizedPath.startsWith('/home/MGconch') || normalizedPath === '/home/MGconch') {
                currentPath[0] = normalizedPath;
              } else {
                term.writeln('Permission denied');
              }
            } else {
              const normalizedTarget = target.replace(/\/+/g, '/').replace(/\/$/, '');
              const targetParts = normalizedTarget.split('/').filter(Boolean);
              let currentDir = getCurrentDir();
              let validPath = true;
              let newPath = currentPath[0];

              for (const part of targetParts) {
                if (part === '..') {
                  const parts = newPath.split('/').filter(Boolean);
                  if (parts.length > 2) {
                    parts.pop();
                    newPath = '/' + parts.join('/');
                    const tempDir = getCurrentDir();
                    if (typeof tempDir === 'object') {
                      currentDir = tempDir;
                    } else {
                      validPath = false;
                      break;
                    }
                  } else {
                    validPath = false;
                    break;
                  }
                } else if (currentDir[part]?.type === 'dir') {
                  newPath = newPath + '/' + part;
                  const nextDir = currentDir[part].content;
                  if (typeof nextDir === 'object') {
                    currentDir = nextDir;
                  } else {
                    validPath = false;
                    break;
                  }
                } else {
                  validPath = false;
                  break;
                }
              }

              if (validPath && newPath.startsWith('/home/MGconch')) {
                currentPath[0] = newPath.replace(/\/+/g, '/');
              } else {
                term.writeln(`cd: ${target}: No such directory`);
              }
            }
            break;

          case 'cat':
            const filename = args[1];
            const dir2 = getCurrentDir();
            if (dir2[filename]?.type === 'file') {
              term.writeln(dir2[filename].content);
            } else {
              term.writeln(`cat: ${filename}: No such file`);
            }
            break;

          case 'vim':
            const vimFilename = args[1];
            if (!vimFilename) {
              term.writeln('vim: missing file operand');
              break;
            }

            const pathParts = vimFilename.split('/');
            const actualFilename = pathParts.pop() || '';
            const filePath = pathParts.join('/');

            const originalPath = currentPath[0];

            if (filePath) {
              const normalizedPath = filePath.replace(/\/+/g, '/').replace(/\/$/, '');
              const targetParts = normalizedPath.split('/').filter(Boolean);
              let currentDir = getCurrentDir();
              let validPath = true;
              let newPath = currentPath[0];

              for (const part of targetParts) {
                if (part === '..') {
                  const parts = newPath.split('/').filter(Boolean);
                  if (parts.length > 2) {
                    parts.pop();
                    newPath = '/' + parts.join('/');
                    const tempDir = getCurrentDir();
                    if (typeof tempDir === 'object') {
                      currentDir = tempDir;
                    } else {
                      validPath = false;
                      break;
                    }
                  } else {
                    validPath = false;
                    break;
                  }
                } else if (currentDir[part]?.type === 'dir') {
                  newPath = newPath + '/' + part;
                  const nextDir = currentDir[part].content;
                  if (typeof nextDir === 'object') {
                    currentDir = nextDir;
                  } else {
                    validPath = false;
                    break;
                  }
                } else {
                  validPath = false;
                  break;
                }
              }

              if (!validPath) {
                term.writeln(`vim: cannot access '${vimFilename}': No such file or directory`);
                break;
              }

              currentPath[0] = newPath.replace(/\/+/g, '/');
            }
            
            const vimDir = getCurrentDir();
            vimCurrentFile = vimFilename;
            vimMode = 'normal';
            term.write('\x1B[2J\x1B[H'); //clear screen
            
            // if file exists, load content
            if (vimDir[actualFilename] && vimDir[actualFilename].type === 'file') {
              vimContent = (vimDir[actualFilename].content as string).split('\n');
            } else {
              vimContent = [''];
            }
            
            displayVimContent(term);
            currentPath[0] = originalPath;
            break;

          case 'ip':
            if (args[1] === 'addr') {
              term.writeln('1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536');
              term.writeln('    inet 127.0.0.1/8 scope host lo');
              term.writeln('2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500');
              term.writeln('    inet 192.168.1.100/24 brd 192.168.1.255 scope global eth0');
              term.writeln(`3: ${VPN_CONFIG.interface}: <POINTOPOINT,MULTICAST,NOARP,UP,LOWER_UP> mtu ${VPN_CONFIG.mtu}`);
              term.writeln(`    inet ${VPN_CONFIG.remoteIP}${VPN_CONFIG.subnet} scope global ${VPN_CONFIG.interface}`);
            }
            break;

          case 'neofetch':
            term.writeln('\x1b[1;34m       _______      \x1b[0m');
            term.writeln('\x1b[1;34m    __/ _____ \\     \x1b[0mOS: K-conch OS');
            term.writeln('\x1b[1;34m   / / /     \\ \\    \x1b[0mKernel: 0.1.0-lts');
            term.writeln('\x1b[1;34m  / / /       \\ \\   \x1b[0mShell: Kish 1.0.1');
            term.writeln('\x1b[1;34m | | |         | |  \x1b[0mTerminal: xterm-256color');
            term.writeln('\x1b[1;34m | | |         | |  \x1b[0mTimezone: Asia/Taipei');
            term.writeln('\x1b[1;34m  \\ \\ \\       / /   \x1b[0mMemory: 64GB RAM (20G used)');
            term.writeln('\x1b[1;34m   \\ \\ \\_____/ /    \x1b[0mDisk: 450G/1000G (45%)');
            term.writeln('\x1b[1;34m    \\/_______\\/     \x1b[0m');
            break;

          case 'touch':
            const touchFilename = args[1];
            if (!touchFilename) {
              term.writeln('touch: missing file operand');
              break;
            }
            const touchDir = getCurrentDir();
            if (touchDir[touchFilename]) {
              break;
            }
            touchDir[touchFilename] = { type: 'file', content: '', mode: 0o644 };
            break;

          case 'pwd':
            term.writeln(getFullPath().replace('~', '/home/MGconch'));
            break;

          case 'whoami':
            term.writeln('MGconch');
            break;

          case 'mkdir':
            const dirName = args[1];
            if (!dirName) {
              term.writeln('mkdir: missing operand');
              term.writeln('Try \'mkdir <directory>\'');
              break;
            }
            const currentDir = getCurrentDir();
            if (currentDir[dirName]) {
              term.writeln(`mkdir: cannot create directory '${dirName}': File exists`);
              break;
            }
            currentDir[dirName] = { type: 'dir', content: {}, mode: 0o755 }; // default 755
            break;

          case 'cp':
            if (args.length < 3) {
              term.writeln('cp: missing file operand');
              term.writeln('Try \'cp [-r] <source> <destination>\'');
              break;
            }
            
            let isRecursive = false;
            let srcPath = args[1];
            let destPath = args[2];
            
            if (args[1] === '-r' || args[1] === '-R') {
              if (args.length < 4) {
                term.writeln('cp: missing destination file operand after \'' + args[2] + '\'');
                break;
              }
              isRecursive = true;
              srcPath = args[2];
              destPath = args[3];
            }

            const cpCurrentDir = getCurrentDir();
            if (!cpCurrentDir[srcPath]) {
              term.writeln(`cp: cannot stat '${srcPath}': No such file or directory`);
              break;
            }

            if (!isRecursive && cpCurrentDir[srcPath].type === 'dir') {
              term.writeln(`cp: omitting directory '${srcPath}'`);
              break;
            }

            const deepCopy = (item: FileSystemItem): FileSystemItem => {
              if (item.type === 'file') {
                return { type: 'file', content: item.content, mode: item.mode };
              } else {
                const newContent: { [key: string]: FileSystemItem } = {};
                Object.entries(item.content as { [key: string]: FileSystemItem }).forEach(([key, value]) => {
                  newContent[key] = deepCopy(value);
                });
                return { type: 'dir', content: newContent, mode: item.mode };
              }
            };

            cpCurrentDir[destPath] = deepCopy(cpCurrentDir[srcPath]);
            break;

          case 'rm':
            if (args.length < 2) {
              term.writeln('rm: missing operand');
              term.writeln('Try \'rm [-rf] <file/directory>\'');
              break;
            }

            let force = false;
            let recursive = false;
            let rmTarget = args[1];
            
            if (args[1].startsWith('-')) {
              const options = args[1].substring(1);
              force = options.includes('f');
              recursive = options.includes('r') || options.includes('R');
              rmTarget = args[2];
              if (!rmTarget) {
                term.writeln('rm: missing operand');
                break;
              }
            }

            const rmCurrentDir = getCurrentDir();
            if (!rmCurrentDir[rmTarget]) {
              if (!force) {
                term.writeln(`rm: cannot remove '${rmTarget}': No such file or directory`);
              }
              break;
            }

            if (rmCurrentDir[rmTarget].type === 'dir' && !recursive) {
              term.writeln(`rm: cannot remove '${rmTarget}': Is a directory`);
              break;
            }

            delete rmCurrentDir[rmTarget];
            break;

          case 'mv':
            if (args.length < 3) {
              term.writeln('mv: missing destination file operand');
              term.writeln('Try \'mv <source> <destination>\'');
              break;
            }

            const mvCurrentDir = getCurrentDir();
            const source = args[1];
            const dest = args[2];

            if (!mvCurrentDir[source]) {
              term.writeln(`mv: cannot stat '${source}': No such file or directory`);
              break;
            }

            mvCurrentDir[dest] = mvCurrentDir[source];
            delete mvCurrentDir[source];
            break;

          case 'chmod':
            if (args.length < 3) {
              term.writeln('chmod: missing operand');
              term.writeln('Try \'chmod <mode> <file>\'');
              break;
            }
            
            const mode = args[1];
            const targetFile = args[2];
            const chmodDir = getCurrentDir();

            if (!chmodDir[targetFile]) {
              term.writeln(`chmod: cannot access '${targetFile}': No such file or directory`);
              break;
            }

            const modeNum = parseInt(mode, 8);
            if (isNaN(modeNum) || modeNum < 0 || modeNum > 0o777) {
              term.writeln(`chmod: invalid mode: '${mode}'`);
              break;
            }

            chmodDir[targetFile].mode = modeNum;
            break;

          case 'tree':
            const printTree = (dir: { [key: string]: FileSystemItem }, prefix: string = '', isLast: boolean = true) => {
              const entries = Object.entries(dir);
              entries.forEach(([name, item], index) => {
                const isLastItem = index === entries.length - 1;
                const newPrefix = prefix + (isLast ? '    ' : '│   ');
                const marker = isLastItem ? '└── ' : '├── ';
                
                const colorCode = item.type === 'dir' ? '\x1b[1;34m' : '\x1b[0;37m';
                term.write(prefix + marker + colorCode + name + '\x1b[0m\r\n');
                
                if (item.type === 'dir') {
                  printTree(item.content as { [key: string]: FileSystemItem }, newPrefix, isLastItem);
                }
              });
            };

            const treeDir = getCurrentDir();
            term.writeln('.');
            printTree(treeDir);
            break;

          case 'datetime':
            const now = new Date();
            const dateOptions: Intl.DateTimeFormatOptions = { 
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              timeZoneName: 'short'
            };
            term.writeln('\x1b[1;36m' + now.toLocaleDateString('en-US', dateOptions) + '\x1b[0m');
            break;

          case 'help':
            term.writeln('\x1b[1;34m=== File Operations ===\x1b[0m');
            term.writeln('\x1b[1;36mls, ll, ls-l\x1b[0m    List directory contents');
            term.writeln('\x1b[1;36mcd\x1b[0m <dir>        Change directory');
            term.writeln('\x1b[1;36mcat\x1b[0m <file>      Show file contents');
            term.writeln('\x1b[1;36mvim\x1b[0m <file>      Edit file (simulated)');
            term.writeln('\x1b[1;36mtree\x1b[0m            Display directory structure as a tree');
            term.writeln('\x1b[1;36mpwd\x1b[0m             Print working directory');
            term.write('\r\n');

            term.writeln('\x1b[1;34m=== File Management ===\x1b[0m');
            term.writeln('\x1b[1;36mtouch\x1b[0m <file>    Create an empty file');
            term.writeln('\x1b[1;36mmkdir\x1b[0m <dir>     Create a directory');
            term.writeln('\x1b[1;36mcp\x1b[0m <src> <dst>  Copy files or directories');
            term.writeln('\x1b[1;36mrm\x1b[0m <file/dir>   Remove files or directories');
            term.writeln('\x1b[1;36mmv\x1b[0m <src> <dst>  Move files or directories');
            term.writeln('\x1b[1;36mchmod\x1b[0m <mode>    Change file mode bits');
            term.write('\r\n');

            term.writeln('\x1b[1;34m=== System Information ===\x1b[0m');
            term.writeln('\x1b[1;36mdatetime\x1b[0m        Display current date and time');
            term.writeln('\x1b[1;36mip addr\x1b[0m         Show network addresses');
            term.writeln('\x1b[1;36mneofetch\x1b[0m        System information');
            term.writeln('\x1b[1;36mwhoami\x1b[0m          Print current user name');
            term.write('\r\n');

            term.writeln('\x1b[1;34m=== Network Tools ===\x1b[0m');
            term.writeln('\x1b[1;36mping\x1b[0m [-t] <host> Send ICMP ECHO_REQUEST to network hosts');
            term.write('\r\n');

            term.writeln('\x1b[1;34m=== Utilities ===\x1b[0m');
            term.writeln('\x1b[1;36mdecode\x1b[0m <string>  Decode base64 string');
            term.writeln('\x1b[1;36mclear\x1b[0m           Clear the terminal screen');
            term.write('\r\n');

            term.writeln('\x1b[1;34m=== Terminal Control ===\x1b[0m');
            term.writeln('\x1b[1;36mexit\x1b[0m            Exit the terminal');
            term.writeln('\x1b[1;36mhelp\x1b[0m            Show this help message');
            term.write('\r\n');

            term.writeln('\x1b[1;34m=== Keyboard Shortcuts ===\x1b[0m');
            term.writeln('\x1b[1;36mCtrl+C\x1b[0m          Interrupt current command');
            term.writeln('\x1b[1;36mCtrl+L\x1b[0m          Clear the screen');
            term.writeln('\x1b[1;36mTab\x1b[0m             Auto-complete commands and paths');
            term.writeln('\x1b[1;36m↑/↓\x1b[0m             Navigate command history');
            break;

          case 'decode':
            if (!args[1]) {
              term.writeln('decode: missing base64 string');
              term.writeln('Usage: decode <base64_string>');
              break;
            }
            try {
              const decoded = atob(args[1]);
              term.writeln('\x1b[1;32mDecoded: ' + decoded + '\x1b[0m');
            } catch (e) {
              term.writeln('decode: invalid base64 string');
            }
            break;

          case 'clear':
            term.write('\x1B[2J\x1B[H'); // clear screen and move cursor to top
            break;

          case '':
            if (vimMode) {
              displayVimContent(term);
            }
            break;

          default:
            if (vimMode) {
              handleVimInput(command, term);
            } else {
              term.writeln(`Command not found: ${command}`);
            }
        }
      }

      function writePrompt(term: any) {
        if (vimMode) return;
        const cwd = getFullPath();
        

        const now = new Date();
        const time = now.toLocaleTimeString('en-US', { 
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });

        term.write('\x1b[38;5;239m╭─\x1b[0m');
        term.write('\x1b[38;5;239m[\x1b[0m');
        term.write('\x1b[1;37m' + time + '\x1b[0m');
        term.write('\x1b[38;5;239m]\x1b[0m');
        term.write(' \x1b[1;32mMGconch\x1b[0m');
        term.write('\x1b[38;5;239m@\x1b[0m');
        term.write('\x1b[1;32mk-conch\x1b[0m');
        term.write(' \x1b[1;34m' + cwd + '\x1b[0m');
        term.write('\r\n');
        
        term.write('\x1b[38;5;239m╰─\x1b[0m');
        term.write('\x1b[1;32m❯\x1b[0m ');
      }

      function getPromptLength() {
        return 2; // 只計算最後一行的 "❯ " 的長度
      }

      function getCompletions(input: string): string[] {
        const args = input.split(' ');
        const lastArg = args[args.length - 1];
        
        if (!lastArg) return [];

        // command list
        const commands = [
          'ls', 'll', 'ls-l', 'cd', 'cat', 'vim', 'tree', 'datetime',
          'ip', 'neofetch', 'touch', 'pwd', 'whoami', 'mkdir', 'cp',
          'rm', 'mv', 'chmod', 'exit', 'ping', 'help', 'clear'
        ];

        if (args.length === 1) {
          return commands.filter(cmd => 
            cmd.toLowerCase().startsWith(lastArg.toLowerCase())
          );
        }

        const parts = lastArg.split('/');
        const currentPart = parts[parts.length - 1];
        const parentPath = parts.slice(0, -1).join('/');

        let currentDir = getCurrentDir();
        if (parentPath) {
          const pathParts = parentPath.split('/').filter(Boolean);
          for (const part of pathParts) {
            if (part === '..') {
              const cwdParts = currentPath[0].split('/').filter(Boolean);
              if (cwdParts.length > 2) {
                cwdParts.pop();
                const newPath = '/' + cwdParts.join('/');
                currentPath[0] = newPath;
                const tempDir = getCurrentDir();
                if (typeof tempDir === 'object') {
                  currentDir = tempDir;
                } else {
                  return [];
                }
              }
            } else if (currentDir[part]?.type === 'dir') {
              const nextDir = currentDir[part].content;
              if (typeof nextDir === 'object') {
                currentDir = nextDir;
              } else {
                return [];
              }
            } else {
              return [];
            }
          }
        }

        const items = Object.entries(currentDir)
          .filter(([name, item]) => name.toLowerCase().startsWith(currentPart.toLowerCase()))
          .map(([name, item]) => {
            const fullPath = parentPath ? `${parentPath}/${name}` : name;
            return item.type === 'dir' ? `${fullPath}/` : fullPath;
          });

        return items;
      }

      function displayVimContent(term: any) {
        term.write('\x1B[2J\x1B[H'); // clear screen

        const lineNumWidth = String(vimContent.length + 1).length;

        vimContent.forEach((line, index) => {
          term.write('\x1B[K'); // clear current line
          if (vimMode === 'normal' || vimMode === 'insert' || vimMode === 'command') {
            const lineNum = String(index + 1).padStart(lineNumWidth);
            term.write(`\x1B[90m${lineNum} \x1B[0m`); // gray line number

            if (index === vimCursorPos.row) {
              const beforeCursor = line.slice(0, vimCursorPos.col);
              const atCursor = line[vimCursorPos.col] || ' ';
              const afterCursor = line.slice(vimCursorPos.col + 1);

              term.write(beforeCursor);
              if (vimMode === 'normal') {
                term.write(`\x1B[7m${atCursor}\x1B[0m`); // reverse display current character
                term.write(afterCursor);
              } else {
                term.write(line.slice(vimCursorPos.col));
              }
            } else {
              term.write(line || '~');
            }
            term.write('\r\n');
          }
        });

        if (vimContent.length === 0) {
          const lineNum = '1'.padStart(lineNumWidth);
          term.write(`\x1B[90m${lineNum} \x1B[0m~\r\n`);
        }

        for (let i = vimContent.length; i < term.rows - 2; i++) {
          const lineNum = ' '.repeat(lineNumWidth);
          term.write(`\x1B[90m${lineNum} \x1B[0m~\r\n`);
        }

        // display bottom status bar (two lines)
        // first line display file name
        term.write(`\x1B[${term.rows - 2};0H\x1B[K`); // move to last second line and clear
        term.write('\x1B[7m'); // reverse color
        const statusText = `  ${vimCurrentFile}${vimMode === 'insert' ? ' [+]' : ''}  `;
        const padding = ' '.repeat(term.cols - statusText.length);
        term.write(statusText + padding);
        term.write('\x1B[0m'); // restore color

        // second line display mode and position information
        term.write(`\x1B[${term.rows - 1};0H\x1B[K`); // move to last line and clear
        if (vimMode === 'command') {
          term.write(':' + vimCommandBuffer);
        } else {
          const modeText = vimMode === 'insert' ? 'INSERT' : 'NORMAL';
          const position = `${vimCursorPos.row + 1},${vimCursorPos.col + 1}`;
          term.write(`\x1B[1;7m ${modeText} \x1B[0m`); // reverse display mode
          const padding = ' '.repeat(term.cols - modeText.length - position.length - 4);
          term.write(padding + position); // right align display cursor position
        }

        // move cursor to correct position
        if (vimMode === 'command') {
          term.write(`\x1B[${term.rows - 1};${vimCommandBuffer.length + 2}H`);
          term.write('\x1B[4 q'); // set cursor style to underline
        } else if (vimMode === 'insert') {
          term.write(`\x1B[${vimCursorPos.row + 1};${vimCursorPos.col + lineNumWidth + 2}H`);
          term.write('\x1B[6 q'); // set cursor style to vertical line
        } else {
          term.write(`\x1B[${vimCursorPos.row + 1};${vimCursorPos.col + lineNumWidth + 2}H`);
          term.write('\x1B[2 q'); // set cursor style to block
        }
      }

      function handleVimInput(input: string, term: any) {
        if (vimMode === 'normal') {
          // set block cursor
          term.write('\x1B[2 q');
          
          switch (input) {
            case 'i':
              vimMode = 'insert';
              term.write('\x1B[5 q'); // set flashing vertical line cursor
              // when entering insert mode, the cursor should be on the character
              const line = vimContent[vimCursorPos.row] || '';
              if (vimCursorPos.col >= line.length) {
                vimCursorPos.col = Math.max(0, line.length - 1);
              }
              break;
            case ':':
              vimMode = 'command';
              term.write('\x1B[3 q'); // set flashing underline cursor
              vimCommandBuffer = '';
              break;
            case 'x':
              // delete current character
              const currentLine = vimContent[vimCursorPos.row] || '';
              vimContent[vimCursorPos.row] = currentLine.slice(0, vimCursorPos.col) + currentLine.slice(vimCursorPos.col + 1);
              // if the cursor is at the end of the line, move left one character
              if (vimCursorPos.col >= vimContent[vimCursorPos.row].length) {
                vimCursorPos.col = Math.max(0, vimContent[vimCursorPos.row].length - 1);
              }
              break;
            case 'ArrowLeft':
            case 'h':
              // move cursor left
              if (vimCursorPos.col > 0) {
                vimCursorPos.col--;
              }
              break;
            case 'ArrowRight':
            case 'l':
              // move cursor right
              const lineR = vimContent[vimCursorPos.row] || '';
              if (vimCursorPos.col < lineR.length - 1) {
                vimCursorPos.col++;
              }
              break;
            case 'ArrowDown':
            case 'j':
              // move cursor down
              if (vimCursorPos.row < vimContent.length - 1) {
                vimCursorPos.row++;
                const nextLine = vimContent[vimCursorPos.row] || '';
                vimCursorPos.col = Math.min(vimCursorPos.col, Math.max(0, nextLine.length - 1));
              }
              break;
            case 'ArrowUp':
            case 'k':
              // move cursor up
              if (vimCursorPos.row > 0) {
                vimCursorPos.row--;
                const prevLine = vimContent[vimCursorPos.row] || '';
                vimCursorPos.col = Math.min(vimCursorPos.col, Math.max(0, prevLine.length - 1));
              }
              break;
            case 'escape':
              break;
          }
        } else if (vimMode === 'insert') {
          if (input === 'escape') {
            vimMode = 'normal';
            // ensure cursor is not after the last character of the line
            const line = vimContent[vimCursorPos.row] || '';
            if (vimCursorPos.col > 0) {
              vimCursorPos.col = Math.min(vimCursorPos.col, Math.max(0, line.length - 1));
            }
          } else if (input === 'Enter') {
            // insert new line after current line
            const currentLine = vimContent[vimCursorPos.row] || '';
            const beforeCursor = currentLine.slice(0, vimCursorPos.col);
            const afterCursor = currentLine.slice(vimCursorPos.col);
            vimContent[vimCursorPos.row] = beforeCursor;
            vimContent.splice(vimCursorPos.row + 1, 0, afterCursor);
            vimCursorPos.row++;
            vimCursorPos.col = 0;
          } else if (input === 'Backspace') {
            // handle backspace key
            if (vimCursorPos.col > 0) {
              // delete in the middle of the line
              vimContent[vimCursorPos.row] = currentLine.slice(0, vimCursorPos.col - 1) + currentLine.slice(vimCursorPos.col);
              vimCursorPos.col--;
            } else if (vimCursorPos.row > 0) {
              // delete at the beginning of the line, merge with the previous line
              const previousLine = vimContent[vimCursorPos.row - 1];
              vimContent[vimCursorPos.row - 1] = previousLine + currentLine;
              vimContent.splice(vimCursorPos.row, 1);
              vimCursorPos.row--;
              vimCursorPos.col = previousLine.length;
            }
            return;
          } else if (input === 'ArrowLeft') {
            if (vimCursorPos.col > 0) {
              vimCursorPos.col--;
            }
          } else if (input === 'ArrowRight') {
            const line = vimContent[vimCursorPos.row] || '';
            if (vimCursorPos.col < line.length) {
              vimCursorPos.col++;
            }
          } else if (input === 'ArrowUp') {
            if (vimCursorPos.row > 0) {
              vimCursorPos.row--;
              const prevLine = vimContent[vimCursorPos.row] || '';
              vimCursorPos.col = Math.min(vimCursorPos.col, prevLine.length);
            }
          } else if (input === 'ArrowDown') {
            if (vimCursorPos.row < vimContent.length - 1) {
              vimCursorPos.row++;
              const nextLine = vimContent[vimCursorPos.row] || '';
              vimCursorPos.col = Math.min(vimCursorPos.col, nextLine.length);
            }
          } else if (input.length === 1) {
            // insert normal character
            const currentLine = vimContent[vimCursorPos.row] || '';
            vimContent[vimCursorPos.row] = currentLine.slice(0, vimCursorPos.col) + input + currentLine.slice(vimCursorPos.col);
            vimCursorPos.col++;
          }
        } else if (vimMode === 'command') {
          if (input === 'escape') {
            vimMode = 'normal';
            vimCommandBuffer = '';
          } else if (input === 'Enter') {
            // execute command
            if (vimCommandBuffer === 'q') {
              vimMode = '';
              term.write('\x1B[2J\x1B[H'); // clear screen
              term.write('\r\n');
              writePrompt(term);
              return;
            } else if (vimCommandBuffer === 'w') {
              const vimDir = getCurrentDir();
              vimDir[vimCurrentFile] = {
                type: 'file',
                content: vimContent.join('\n'),
                mode: 0o644  // add default file permissions
              };
            }
            vimMode = 'normal';
            vimCommandBuffer = '';
          } else if (input === 'Backspace') {
            vimCommandBuffer = vimCommandBuffer.slice(0, -1);
          } else if (input.length === 1) {
            vimCommandBuffer += input;
          }
        }
        
        displayVimContent(term);
      }

      // display welcome message
      term.write('\x1B[?7l'); // 禁用自动换行
      term.writeln('Looks like you found my secret place!');
      term.writeln('It is recommended to use PC to view this terminal');
      term.writeln('Type \x1b[1;32mhelp\x1b[0m for available commands.');
      term.writeln('');
      term.write('\x1B[?7h'); // 重新启用自动换行
      writePrompt(term);
      term.write('\x1B[?25h'); // show cursor

      let cursorPosition = 0;

      // set default cursor style
      term.write('\x1B[2 q'); // set to block cursor

      term.onKey(({ key, domEvent }) => {
        const printable = !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey;

        // if ping is executing, disable direction key processing
        if (isPinging && (domEvent.keyCode >= 37 && domEvent.keyCode <= 40)) {
          return;
        }

        // handle Ctrl+C
        if (domEvent.ctrlKey && domEvent.key === 'c') {
          term.write('^C');
          term.write('\r\n');
          // reset all states
          currentLine = '';
          cursorPosition = 0;
          vimMode = '';
          vimContent = [];
          vimCurrentFile = '';
          vimCommandBuffer = '';
          isPinging = false;
          if (pingTimer) {
            clearTimeout(pingTimer);
            pingTimer = null;
          }
          term.write('\x1B[2 q');
          writePrompt(term);
          return;
        }

        // handle up and down key history
        if (!vimMode && domEvent.keyCode === 38) { // Up Arrow
          if (historyIndex === commandHistory.length) {
            savedCurrentLine = currentLine;
          }
          if (historyIndex > 0) {
            historyIndex--;
            currentLine = commandHistory[historyIndex];
            cursorPosition = currentLine.length;
            term.write('\x1b[1F');
            term.write('\x1b[2K');
            term.write('\r');
            term.write('\x1b[1B');
            term.write('\x1b[2K');
            term.write('\r');
            term.write('\x1b[1F');
            writePrompt(term);
            term.write(currentLine);
          }
          return;
        } else if (!vimMode && domEvent.keyCode === 40) { // Down Arrow
          if (historyIndex < commandHistory.length) {
            historyIndex++;
            currentLine = historyIndex === commandHistory.length ? savedCurrentLine : commandHistory[historyIndex];
            cursorPosition = currentLine.length;
            term.write('\x1b[1F');
            term.write('\x1b[2K');
            term.write('\r');
            term.write('\x1b[1B');
            term.write('\x1b[2K');
            term.write('\r');
            term.write('\x1b[1F');
            writePrompt(term);
            term.write(currentLine);
          }
          return;
        }

        // handle Vim mode
        if (vimMode) {
          if (domEvent.keyCode === 27) { // ESC
            handleVimInput('escape', term);
            return;
          } else if (domEvent.keyCode === 13) { // Enter
            handleVimInput('Enter', term);
            return;
          } else if (domEvent.keyCode === 8) { // Backspace
            handleVimInput('Backspace', term);
            return;
          } else if (domEvent.keyCode === 37) { // Left Arrow
            handleVimInput('ArrowLeft', term);
            return;
          } else if (domEvent.keyCode === 39) { // Right Arrow
            handleVimInput('ArrowRight', term);
            return;
          } else if (domEvent.keyCode === 38) { // Up Arrow
            handleVimInput('ArrowUp', term);
            return;
          } else if (domEvent.keyCode === 40) { // Down Arrow
            handleVimInput('ArrowDown', term);
            return;
          }
          handleVimInput(key, term);
          return;
        }

        // handle Tab
        if (domEvent.keyCode === 9) { // Tab
          domEvent.preventDefault();
          const completions = getCompletions(currentLine);
          if (completions.length === 1) {
            const args = currentLine.split(' ');
            const lastArg = args[args.length - 1];
            const completion = completions[0].slice(lastArg.length);
            currentLine += completion;
            cursorPosition += completion.length;
            term.write(completion);
          } else if (completions.length > 1) {
            term.write('\r\n');
            completions.forEach(item => {
              const dir = getCurrentDir();
              const isDir = dir[item]?.type === 'dir';
              term.write(`\x1b[${isDir ? '1;34' : '0;37'}m${item}\x1b[0m  `);
            });
            term.write('\r\n');
            writePrompt(term);
            term.write(currentLine);
          }
          return;
        }

        // handle backspace key
        if (domEvent.keyCode === 8) { // Backspace
          if (currentLine.length > 0 && cursorPosition > 0) {
            currentLine = currentLine.slice(0, cursorPosition - 1) + currentLine.slice(cursorPosition);
            cursorPosition--;
            term.write('\b');
            term.write(currentLine.slice(cursorPosition));
            term.write(' ');
            term.write('\b'.repeat(currentLine.length - cursorPosition + 1));
          }
          return;
        }

        // handle left and right key movement
        if (domEvent.keyCode === 37) { // Left Arrow
          if (cursorPosition > 0) {
            cursorPosition--;
            term.write('\x1b[D');
          }
          return;
        } else if (domEvent.keyCode === 39) { // Right Arrow
          if (cursorPosition < currentLine.length) {
            cursorPosition++;
            term.write('\x1b[C');
          }
          return;
        }

        // handle printable characters
        if (printable && key.length === 1) {
          currentLine = currentLine.slice(0, cursorPosition) + key + currentLine.slice(cursorPosition);
          cursorPosition++;
          term.write(key);
          if (cursorPosition < currentLine.length) {
            term.write(currentLine.slice(cursorPosition)); // 寫入後面的內容
            term.write('\b'.repeat(currentLine.length - cursorPosition)); // 移回光標
          }
        }

        // handle Enter key
        if (domEvent.keyCode === 13) { // Enter
          term.write('\r\n');
          handleCommand(currentLine.trim(), term);
          if (!vimMode) {
            writePrompt(term);
          }
          currentLine = '';
          cursorPosition = 0;
          return;
        }

        // handle Ctrl+L (clear screen)
        if (domEvent.ctrlKey && domEvent.key === 'l') {
          term.write('\x1B[2J\x1B[H'); // clear screen and move cursor to top
          writePrompt(term);
          term.write(currentLine);
          term.write(`\x1B[${cursorPosition + getPromptLength() + 1}G`);
          return;
        }
      });

      // clean up
      return () => {
        term.dispose();
      };
    };

    initTerminal();
  }, []);

  // handle window size change
  useEffect(() => {
    const handleResize = () => {
      if (fitAddonRef.current) {
        fitAddonRef.current.fit();
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    if (terminalRef.current) {
      resizeObserver.observe(terminalRef.current);
    }

    window.addEventListener('resize', handleResize);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className={`h-full w-full overflow-hidden ${isActive ? '' : 'hidden'}`}>
      <div ref={terminalRef} className="h-[calc(100%-2rem)] w-full flex-1" style={{ padding: '0.5rem' }} />
    </div>
  );
};

export default Terminal; 