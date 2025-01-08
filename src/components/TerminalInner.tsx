'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import 'xterm/css/xterm.css';

interface TerminalProps {
  isActive: boolean;
}

const TerminalInner: React.FC<TerminalProps> = ({ isActive }) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!terminalRef.current || xtermRef.current) return;

    try {
      console.log('Initializing terminal...');
      const term = new XTerm({
        cursorBlink: true,
        fontSize: 14,
        fontFamily: 'Menlo, Monaco, "Courier New", monospace',
        theme: {
          background: '#ffffff',
          foreground: '#333333',
          cursor: '#505050',
          black: '#000000',
          red: '#cd3131',
          green: '#0D9C6F',
          yellow: '#e5e510',
          blue: '#2472c8',
          magenta: '#bc3fbc',
          cyan: '#11a8cd',
          white: '#e5e5e5',
          brightBlack: '#666666',
          brightRed: '#f14c4c',
          brightGreen: '#15B384',
          brightYellow: '#f5f543',
          brightBlue: '#3b8eea',
          brightMagenta: '#d670d6',
          brightCyan: '#29b8db',
          brightWhite: '#ffffff',
          selectionBackground: '#d0d0d0',
          selectionForeground: '#1e1e1e'
        },
        rows: 24,
        cols: 80,
        convertEol: true,
        scrollback: 1000,
        allowTransparency: true
      });

      const style = document.createElement('style');
      style.textContent = `
        .terminal-container .xterm-screen canvas {
          opacity: 0.1ˊ6 !important;
        }
        .terminal-container .xterm-viewport {
          background-color: transparent !important;
        }
        .terminal-container {
          background-color: rgba(255, 255, 255, 0.05) !important;
        }
      `;
      document.head.appendChild(style);

      console.log('Loading addons...');
      const fitAddon = new FitAddon();
      term.loadAddon(fitAddon);
      term.loadAddon(new WebLinksAddon());

      console.log('Opening terminal...');
      term.open(terminalRef.current);
      
      console.log('Fitting terminal...');
      setTimeout(() => {
        try {
          fitAddon.fit();
          console.log('Terminal fitted');
          
          console.log('Writing welcome message...');
          term.write('\x1b[1;34m# Welcome to Kamin\'s Terminal\x1b[0m\r\n\n');
          term.write('\x1b[1;32m$ \x1b[0m');
          setInitialized(true);
        } catch (fitError) {
          console.error('Fit error:', fitError);
          setError('Failed to fit terminal');
        }
      }, 100);

      term.onKey(({ key, domEvent }) => {
        if (domEvent.keyCode === 13) {
          term.write('\r\n\x1b[1;32m$ \x1b[0m');
        } else {
          term.write(key);
        }
      });

      xtermRef.current = term;

      const handleResize = () => {
        if (fitAddon) {
          try {
            fitAddon.fit();
          } catch (resizeError) {
            console.error('Resize error:', resizeError);
          }
        }
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        term.dispose();
        document.head.removeChild(style);
      };
    } catch (err) {
      console.error('Terminal initialization error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  }, []);

  useEffect(() => {
    if (isActive && xtermRef.current) {
      xtermRef.current.focus();
    }
  }, [isActive]);

  if (error) {
    return (
      <div className="h-full w-full p-4 bg-red-100 text-red-600 rounded-lg">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col bg-white bg-opacity-10">
      {!initialized && (
        <div className="p-4 text-gray-700">Initializing terminal...</div>
      )}
      <div 
        ref={terminalRef} 
        className="flex-1 w-full terminal-container" 
        style={{ 
          backgroundColor: 'transparent',
          minHeight: '300px'
        }}
      />
    </div>
  );
};

export default TerminalInner; 