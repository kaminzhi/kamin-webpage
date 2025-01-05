interface NetworkConfig {
  name: string;
  needPassword: boolean;
  signalStrength: number;
  status?: {
    isConnected: boolean;
    ip?: string;
  };
}

export const networksConfig: Record<string, NetworkConfig> = {
  'magic': {
    name: '神奇海螺的網路',
    needPassword: false,
    signalStrength: 3,
    status: {
      isConnected: true,
      ip: '192.168.1.100'
    }
  },
  'death': {
    name: '死給的iPhone',
    needPassword: true,
    signalStrength: 1
  },
  'unknown': {
    name: '未知的網路',
    needPassword: true,
    signalStrength: 2
  }
}; 