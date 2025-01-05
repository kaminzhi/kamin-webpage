import React from 'react';
import { Battery, Clock } from 'lucide-react';

interface BatteryPanelProps {
  isOpen: boolean;
}

const BatteryIcon = () => (
  <div className="relative">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
        className="fill-green-400 animate-pulse"
      />
      {/* 充電符號 */}
      <path 
        d="M11 14L9 11H13L11 8" 
        stroke="white" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className="animate-bounce"
      />
    </svg>
  </div>
);

const BatteryPanel: React.FC<BatteryPanelProps> = ({ isOpen }) => {
  // 從環境變量獲取部署時間
  const deploymentTime = process.env.DEPLOYMENT_TIME 
    ? new Date(process.env.DEPLOYMENT_TIME).getTime()
    : new Date().getTime(); // 如果沒有環境變量，使用當前時間
    
  const now = Date.now();
  const uptimeInMinutes = Math.floor((now - deploymentTime) / 1000 / 60);
  
  const days = Math.floor(uptimeInMinutes / (24 * 60));
  const hours = Math.floor((uptimeInMinutes % (24 * 60)) / 60);
  const minutes = uptimeInMinutes % 60;

  const deploymentDate = new Date(deploymentTime);
  const formattedDeploymentDate = `${deploymentDate.getFullYear()}/${deploymentDate.getMonth() + 1}/${deploymentDate.getDate()} ${deploymentDate.getHours().toString().padStart(2, '0')}:${deploymentDate.getMinutes().toString().padStart(2, '0')}`;

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
          <span className="text-white font-medium">電池</span>
          <div className="flex items-center space-x-2">
            <span className="text-white text-sm">充電中</span>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white bg-opacity-10 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className="text-white">
                  <BatteryIcon />
                </div>
                <div>
                  <div className="text-white font-medium">電池狀態</div>
                  <div className="text-gray-400 text-sm">充電中 - 99%</div>
                </div>
              </div>
              <div className="text-red-500 text-sm">不良</div>
            </div>
            <div className="w-full h-1.5 bg-white bg-opacity-20 rounded-full mt-3">
              <div className="h-full w-[99%] bg-green-400 rounded-full"></div>
            </div>
          </div>

          <div className="bg-white bg-opacity-10 p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <Clock size={24} className="text-white" />
              <div>
                <div className="text-white font-medium">系統運行時間</div>
                <div className="text-gray-400 text-sm flex flex-col gap-1">
                  <div>部署於 {formattedDeploymentDate}</div>
                  <div>已運行 {days}天 {hours}小時 {minutes}分鐘</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatteryPanel; 