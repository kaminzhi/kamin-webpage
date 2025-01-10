'use client';

import React, { useState, useEffect } from 'react';
import { Wifi, Lock, AlertCircle, Shield } from 'lucide-react';
import { networksConfig } from '@/config/networks';
import { VPN_CONFIG } from '@/config/vpn';

interface WifiPanelProps {
  isOpen: boolean;
  onVpnConnect?: (connected: boolean) => void;
  currentWindow?: string;
  onWindowChange?: (window: string | null) => void;
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

const WifiPanel: React.FC<WifiPanelProps> = ({ isOpen, onVpnConnect, currentWindow, onWindowChange }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [showDisconnectError, setShowDisconnectError] = useState(false);
  const [showCurrentNetworkOptions, setShowCurrentNetworkOptions] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [showAddNetwork, setShowAddNetwork] = useState(false);
  const [newNetwork, setNewNetwork] = useState({ name: '', password: '' });
  const [networks, setNetworks] = useState<Record<string, NetworkState>>({
    'death': { showPasswordInput: false, password: '', showError: false },
    'unknown': { showPasswordInput: false, password: '', showError: false }
  });
  const [connectionSuccess, setConnectionSuccess] = useState(false);
  const [addNetworkSuccess, setAddNetworkSuccess] = useState(false);
  const [addNetworkError, setAddNetworkError] = useState(false);
  const [isAddNetworkConnecting, setIsAddNetworkConnecting] = useState(false);
  const [vpnStatus, setVpnStatus] = useState<{
    isConnected: boolean;
    username: string;
    remoteIP: string;
    isDisconnecting?: boolean;
  } | null>(null);

  useEffect(() => {
    if (addNetworkError || showDisconnectError) {
      const timer = setTimeout(() => {
        if (addNetworkError) setAddNetworkError(false);
        if (showDisconnectError) setShowDisconnectError(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [addNetworkError, showDisconnectError]);

  useEffect(() => {
    if (vpnStatus?.isDisconnecting) {
      setNewNetwork({ name: '', password: '' });
      
      const timer = setTimeout(() => {
        if (onVpnConnect) {
          onVpnConnect(false);
        }
        if (currentWindow === 'terminal' && onWindowChange) {
          onWindowChange(null);
        }
        setConnectionSuccess(false);
        setAddNetworkSuccess(false);
        setShowAddNetwork(false);
        setVpnStatus(null);

        const event = new CustomEvent('vpn-status-change', {
          detail: { isConnected: false }
        });
        window.dispatchEvent(event);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [vpnStatus?.isDisconnecting, onVpnConnect, currentWindow, onWindowChange]);

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

  useEffect(() => {
    if (connectionSuccess && onVpnConnect) {
      onVpnConnect(true);
    }
  }, [connectionSuccess, onVpnConnect]);

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
      setShowCurrentNetworkOptions(false);
      setShowDisconnectError(true);
    }, 1000);
  };

  const verify = (n: string, p: string) => {
    try {
      const Multiple = (str: string) => {
        let result = str;
        while (result.endsWith('=')) {
          result = atob(result);
        }
        return result;
      };

      const f1 = Multiple('bG9va3NsaWtleQ==');
      const f2 = Multiple('TWFnaWNDb25jaA==');
      const f3 = Multiple('b3Vmb3VuZHRoaXM=');      
      
      return n === f2 && p === f1 + f3 ;
    } catch {
      return false;
    }
  };

  const handleNewNetworkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddNetworkConnecting(true);
    
    setTimeout(() => {
      const success = verify(newNetwork.name, newNetwork.password);
      setIsAddNetworkConnecting(false);
      
      if (!success) {
        setAddNetworkError(true);
        setNewNetwork(prev => ({ ...prev, password: '' }));
      } else {
        setShowAddNetwork(false);
        setNewNetwork({ name: '', password: '' });
        setAddNetworkSuccess(true);
        setConnectionSuccess(true);
        setVpnStatus({
          isConnected: true,
          username: newNetwork.name,
          remoteIP: VPN_CONFIG.remoteIP
        });

        const event = new CustomEvent('vpn-status-change', {
          detail: { isConnected: true }
        });
        window.dispatchEvent(event);
      }
    }, 1500);
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
          <div className="flex items-center space-x-3">
            <div className={`
              flex items-center space-x-2 transition-all duration-300 ease-in-out
              ${connectionSuccess ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
              ${connectionSuccess && !vpnStatus?.isDisconnecting && 'animate-fade-in-up'}
            `}>
              <div className="p-1 bg-purple-500 bg-opacity-20 rounded-lg">
                <Shield size={14} className="text-purple-400" />
              </div>
              <span className="text-white text-sm">VPN 已連線</span>
              <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-white text-sm">連線成功</span>
              <div className="w-2 h-2 rounded-full bg-green-400 animate-[pulse_2s_ease-in-out_infinite]"></div>
            </div>
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
              <div className="mt-3 flex justify-end animate-fade-in-up">
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

          <div className="mt-2 border-t border-white border-opacity-10 pt-2"></div>

          {vpnStatus && (
            <div className={`
              bg-white bg-opacity-10 p-3 rounded-lg -mt-1 
              ${vpnStatus.isDisconnecting 
                ? 'animate-fade-out-down' 
                : 'animate-fade-in-up'
              }
            `}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-1 bg-purple-500 bg-opacity-20 rounded-lg -ml-1">
                    <Shield size={16} className="text-purple-400" />
                  </div>
                  <div className="ml-3">
                    <div className="text-white font-medium">VPN 已連線</div>
                    <div className="flex flex-col text-sm">
                      <span className="text-gray-400">使用者：{vpnStatus.username}</span>
                      <span className="text-gray-400">遠端 IP：{vpnStatus.remoteIP}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (currentWindow === 'terminal' && onWindowChange) {
                      onWindowChange(null);
                    }
                    setVpnStatus(prev => prev ? { ...prev, isDisconnecting: true } : null);
                  }}
                  disabled={vpnStatus.isDisconnecting}
                  className={`
                    px-3 py-1.5 bg-red-500 hover:bg-red-600 
                    text-white text-sm rounded-md transition-all
                    ${vpnStatus.isDisconnecting ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  {vpnStatus.isDisconnecting ? '中斷中...' : '中斷連線'}
                </button>
              </div>
            </div>
          )}

          <div className="mt-4">
            {!vpnStatus?.isConnected && (
              <div className="flex items-center justify-between mb-2">
                <button
                  onClick={() => setShowAddNetwork(!showAddNetwork)}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md 
                    transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <span className="text-sm font-medium">新增 VPN</span>
                </button>
                {addNetworkSuccess && (
                  <div className="flex items-center ml-2">
                    <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></div>
                  </div>
                )}
              </div>
            )}

            <div className={`
              overflow-hidden transition-all duration-300 ease-in-out
              ${showAddNetwork ? 'max-h-[200px] opacity-100 mt-3' : 'max-h-0 opacity-0'}
            `}>
              <form 
                onSubmit={handleNewNetworkSubmit}
                className="space-y-3 bg-black bg-opacity-25 p-3 rounded-lg"
                onClick={e => e.stopPropagation()}
              >
                <div>
                  <input
                    type="text"
                    value={newNetwork.name}
                    onChange={e => setNewNetwork(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="使用者名稱"
                    className="w-full bg-black bg-opacity-50 text-white px-3 py-2 rounded-md 
                      placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500
                      text-sm"
                  />
                </div>
                <div>
                  <input
                    type="password"
                    value={newNetwork.password}
                    onChange={e => setNewNetwork(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="密碼"
                    className="w-full bg-black bg-opacity-50 text-white px-3 py-2 rounded-md 
                      placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500
                      text-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isAddNetworkConnecting || !newNetwork.name}
                  className={`w-full py-2 rounded-md text-sm font-medium transition-all
                    ${isAddNetworkConnecting || !newNetwork.name
                      ? 'bg-blue-500 bg-opacity-50 text-gray-300 cursor-not-allowed' 
                      : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
                >
                  {isAddNetworkConnecting ? '連線中...' : '連線'}
                </button>
                {addNetworkError && (
                  <div className="mt-2 text-red-500 text-sm flex items-center">
                    <AlertCircle size={14} className="mr-1" />
                    連線失敗，請檢查使用者名稱和密碼
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WifiPanel; 