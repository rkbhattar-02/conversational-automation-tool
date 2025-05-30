
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  CheckCircle,
  XCircle,
  Clock,
  Activity,
  Wifi,
  WifiOff,
  Globe
} from 'lucide-react';

const BottomStatusBar = () => {
  const connectionStatus = 'connected';
  const currentBrowser = 'Chrome 118.0';
  const executionStats = {
    passed: 12,
    failed: 2,
    running: 1,
    total: 15
  };

  return (
    <div className="h-8 bg-gray-800 text-gray-200 flex items-center justify-between px-4 text-xs">
      {/* Left Section - Execution Status */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Activity className="h-3 w-3" />
          <span>Tests:</span>
          <Badge variant="secondary" className="bg-green-600 text-white h-5 text-xs">
            {executionStats.passed} Passed
          </Badge>
          <Badge variant="secondary" className="bg-red-600 text-white h-5 text-xs">
            {executionStats.failed} Failed
          </Badge>
          <Badge variant="secondary" className="bg-blue-600 text-white h-5 text-xs">
            {executionStats.running} Running
          </Badge>
        </div>
        
        <div className="flex items-center space-x-2">
          <Clock className="h-3 w-3" />
          <span>Duration: 02:34</span>
        </div>
      </div>
      
      {/* Center Section - Current Action */}
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <span>Ready - Waiting for test execution</span>
      </div>
      
      {/* Right Section - System Status */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Globe className="h-3 w-3" />
          <span>{currentBrowser}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          {connectionStatus === 'connected' ? (
            <>
              <Wifi className="h-3 w-3 text-green-400" />
              <span className="text-green-400">Connected</span>
            </>
          ) : (
            <>
              <WifiOff className="h-3 w-3 text-red-400" />
              <span className="text-red-400">Disconnected</span>
            </>
          )}
        </div>
        
        <Button variant="ghost" size="sm" className="h-6 text-xs text-gray-400 hover:text-white">
          View Details
        </Button>
      </div>
    </div>
  );
};

export default BottomStatusBar;
