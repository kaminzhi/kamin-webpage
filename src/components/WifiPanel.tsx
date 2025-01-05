'use client';

import React, { useState, useEffect } from 'react';
import { Wifi, Lock, AlertCircle } from 'lucide-react';
import { networksConfig } from '@/config/networks';

interface WifiPanelProps {
  isOpen: boolean;
}

interface NetworkState {
  showPasswordInput: boolean;
  password: string;
  showError: boolean;
}

const NetworkItem: React.FC<{
  networkKey: string;
  networkState: NetworkState;
  isConnecting: boolean;
  onNetworkClick: (e: React.MouseEvent) => void;
  onConnect?: (e: React.FormEvent) => void;
  onPasswordChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ networkKey, networkState, isConnecting, onNetworkClick, onConnect, onPasswordChange }) => {
  const network = networksConfig[networkKey];
  const isActive = networkState.showPasswordInput;

  return (
    <div 
      className={`bg-white ${network.status?.isConnected ? 'bg-opacity-10' : 'bg-opacity-5'} p-3 rounded-lg cursor-pointer hover:bg-opacity-10 transition-all`}
      onClick={onNetworkClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Wifi size={20} className={isActive || network.status?.isConnected ? "text-white" : "text-gray-400"} />
          <div>
            <div className={isActive || network.status?.isConnected ? "text-white font-medium" : "text-gray-400"}>{network.name}</div>
            {network.status?.isConnected ? (
              <div className="flex items-center space-x-2">
                <span className="text-gray-400 text-sm">{network.status.ip}</span>
                <span className="text-green-400">•</span>
                <span className="text-green-400 text-sm">已連線</span>
              </div>
            ) : (
              <div className={isActive ? "text-gray-300 text-sm" : "text-gray-500 text-sm"}>
                {network.needPassword ? '需要密碼' : '開放網路'}
              </div>
            )}
          </div>
        </div>
        <SignalBars strength={network.signalStrength} isActive={isActive || network.status?.isConnected} />
      </div>

      {networkState.showPasswordInput && network.needPassword && (
        <form 
          onSubmit={onConnect} 
          className="mt-3 space-y-3"
          onClick={e => e.stopPropagation()}
        >
          <div>
            <input
              type="password"
              value={networkState.password}
              onChange={onPasswordChange}
              placeholder="請輸入密碼"
              className="w-full bg-black bg-opacity-50 text-white px-3 py-2 rounded-md 
                       placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {networkState.showError && (
              <div className="text-red-500 text-sm mt-1 flex items-center">
                <Lock size={14} className="mr-1" />
                密碼錯誤，請重試
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={isConnecting}
            className={`w-full py-2 rounded-md text-sm font-medium transition-all
              ${isConnecting 
                ? 'bg-blue-500 bg-opacity-50 text-gray-300' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
          >
            {isConnecting ? '連線中...' : '連線'}
          </button>
        </form>
      )}
    </div>
  );
};

const SignalBars = ({ strength, isActive = false }: { strength: number, isActive?: boolean }) => {
  const bars = [
    { height: 'h-4', opacity: strength >= 1 },
    { height: 'h-6', opacity: strength >= 2 },
    { height: 'h-8', opacity: strength >= 3 }
  ];

  return (
    <div className="flex items-center space-x-1">
      {bars.map((bar, index) => (
        <div
          key={index}
          className={`w-1 ${bar.height} rounded-full transition-all duration-200
            ${isActive 
              ? bar.opacity ? 'bg-white' : 'bg-white opacity-30'
              : bar.opacity ? 'bg-gray-400' : 'bg-gray-400 opacity-30'}`
          }
        />
      ))}
    </div>
  );
};

const WifiPanel: React.FC<WifiPanelProps> = ({ isOpen }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [showDisconnectError, setShowDisconnectError] = useState(false);
  const [showCurrentNetworkOptions, setShowCurrentNetworkOptions] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [networks, setNetworks] = useState<Record<string, NetworkState>>({
    'death': { showPasswordInput: false, password: '', showError: false },
    'unknown': { showPasswordInput: false, password: '', showError: false }
  });

  useEffect(() => {
    if (!isOpen) {
      setShowCurrentNetworkOptions(false);
      setNetworks(prev => {
        const newState = { ...prev };
        Object.keys(newState).forEach(key => {
          newState[key] = {
            ...newState[key],
            showPasswordInput: false,
            password: '',
            showError: false
          };
        });
        return newState;
      });
    }
  }, [isOpen]);

  const handleConnect = (network: string) => (e: React.FormEvent) => {
    e.preventDefault();
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setNetworks(prev => ({
        ...prev,
        [network]: { ...prev[network], showError: true }
      }));
    }, 1500);
  };

  const handleNetworkClick = (network: string) => (e: React.MouseEvent) => {
    if (!networks[network].showPasswordInput) {
      setNetworks(prev => {
        const newState = { ...prev };
        Object.keys(newState).forEach(key => {
          if (key !== network) {
            newState[key] = {
              ...newState[key],
              showPasswordInput: false,
              password: '',
              showError: false
            };
          }
        });
        newState[network] = {
          ...newState[network],
          showPasswordInput: true
        };
        return newState;
      });
      setShowCurrentNetworkOptions(false);
    } else {
      if (
        e.target instanceof HTMLElement &&
        (e.target.tagName.toLowerCase() === 'input' ||
        e.target.tagName.toLowerCase() === 'button' ||
        e.target.closest('form'))
      ) {
        return;
      }
      
      setNetworks(prev => ({
        ...prev,
        [network]: {
          ...prev[network],
          showPasswordInput: false,
          password: '',
          showError: false
        }
      }));
    }
  };

  const handlePasswordChange = (network: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setNetworks(prev => ({
      ...prev,
      [network]: {
        ...prev[network],
        password: e.target.value
      }
    }));
  };

  const handleDisconnect = () => {
    setIsDisconnecting(true);
    setTimeout(() => {
      setIsDisconnecting(false);
      setShowDisconnectError(true);
      setTimeout(() => setShowDisconnectError(false), 3000);
    }, 1000);
  };

  return (
    <div 
      className={`
        absolute top-14 right-4 w-80
        bg-black bg-opacity-80 backdrop-blur-md rounded-lg shadow-xl
        transition-all duration-300 transform origin-top-right
        ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}
      `}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-white font-medium">Wi-Fi</span>
          <div className="flex items-center space-x-2">
            <span className="text-white text-sm">連線成功</span>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
        </div>
        
        <div className="space-y-3">
          <div 
            className="bg-white bg-opacity-10 p-3 rounded-lg cursor-pointer hover:bg-opacity-20 transition-all"
            onClick={() => {
              setShowCurrentNetworkOptions(!showCurrentNetworkOptions);
              setNetworks(prev => {
                const newState = { ...prev };
                Object.keys(newState).forEach(key => {
                  newState[key] = {
                    ...newState[key],
                    showPasswordInput: false,
                    password: '',
                    showError: false
                  };
                });
                return newState;
              });
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Wifi size={20} className="text-white" />
                <div>
                  <div className="text-white font-medium">{networksConfig.magic.name}</div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400 text-sm">{networksConfig.magic.status?.ip}</span>
                    <span className="text-green-400">•</span>
                    <span className="text-green-400 text-sm">已連線</span>
                  </div>
                </div>
              </div>
              <SignalBars strength={networksConfig.magic.signalStrength} isActive={true} />
            </div>
            {showCurrentNetworkOptions && (
              <div className="mt-3 flex justify-end">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDisconnect();
                  }}
                  disabled={isDisconnecting}
                  className={`
                    px-4 py-1.5 rounded-md text-sm font-medium transition-all
                    ${isDisconnecting 
                      ? 'bg-red-500 bg-opacity-50 text-gray-300' 
                      : 'bg-red-500 hover:bg-red-600 text-white'}
                  `}
                >
                  {isDisconnecting ? '斷開中...' : '斷開連線'}
                </button>
              </div>
            )}
            {showDisconnectError && (
              <div className="mt-2 text-red-500 text-sm flex items-center">
                <AlertCircle size={14} className="mr-1" />
                未知的錯誤，請稍後再試
              </div>
            )}
          </div>

          {Object.entries(networks).map(([networkKey, networkState]) => (
            <NetworkItem
              key={networkKey}
              networkKey={networkKey}
              networkState={networkState}
              isConnecting={isConnecting}
              onNetworkClick={handleNetworkClick(networkKey)}
              onConnect={handleConnect(networkKey)}
              onPasswordChange={handlePasswordChange(networkKey)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WifiPanel; 