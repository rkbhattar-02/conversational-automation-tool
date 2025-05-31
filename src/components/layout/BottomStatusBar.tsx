
/**
 * Bottom Status Bar Component
 * 
 * Purpose: Displays real-time status information, execution progress, and system notifications
 * 
 * Dependencies:
 * - workspaceService for workspace data
 * - test-execution-service for execution status
 * - UI components from shadcn/ui
 * - React hooks for state management
 * 
 * Connected Components:
 * - AppLayout.tsx (layout integration)
 * - Dashboard.tsx (execution status updates)
 * - TestCaseEditor.tsx (editor status display)
 * 
 * Features:
 * - Real-time execution progress
 * - Workspace status indicators
 * - System notifications and alerts
 * - Performance metrics display
 * - Quick action buttons
 */

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Square, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Activity,
  Wifi,
  WifiOff,
  AlertTriangle
} from 'lucide-react';
import { type Workspace } from '@/services/api/workspace-service';

interface BottomStatusBarProps {
  currentWorkspace?: Workspace | null;
}

const BottomStatusBar: React.FC<BottomStatusBarProps> = ({ currentWorkspace }) => {
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected'>('connected');
  const [executionProgress, setExecutionProgress] = useState(0);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionTime, setExecutionTime] = useState(0);

  // Simulate execution progress
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isExecuting) {
      interval = setInterval(() => {
        setExecutionTime(prev => prev + 1);
        setExecutionProgress(prev => {
          const newProgress = prev + Math.random() * 10;
          if (newProgress >= 100) {
            setIsExecuting(false);
            return 100;
          }
          return newProgress;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isExecuting]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getConnectionIcon = () => {
    return connectionStatus === 'connected' ? (
      <Wifi className="h-4 w-4 text-green-500" />
    ) : (
      <WifiOff className="h-4 w-4 text-red-500" />
    );
  };

  return (
    <div className="h-8 bg-gray-100 border-t border-gray-200 flex items-center justify-between px-4 text-sm">
      {/* Left Section - Workspace Info */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          {getConnectionIcon()}
          <span className="text-gray-600">
            {connectionStatus === 'connected' ? 'Connected' : 'Disconnected'}
          </span>
        </div>
        
        {currentWorkspace && (
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              {currentWorkspace.name}
            </Badge>
            <span className="text-gray-500">
              {currentWorkspace.files.length} files
            </span>
          </div>
        )}
      </div>

      {/* Center Section - Execution Status */}
      <div className="flex items-center space-x-4">
        {isExecuting ? (
          <>
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-blue-500 animate-spin" />
              <span className="text-blue-600 font-medium">Running tests...</span>
            </div>
            <Progress value={executionProgress} className="w-32 h-2" />
            <span className="text-gray-600">{Math.round(executionProgress)}%</span>
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3 text-gray-500" />
              <span className="text-gray-600">{formatTime(executionTime)}</span>
            </div>
          </>
        ) : (
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-gray-600">Ready</span>
          </div>
        )}
      </div>

      {/* Right Section - Quick Actions */}
      <div className="flex items-center space-x-2">
        <span className="text-gray-500 text-xs">
          {currentWorkspace?.settings.defaultBrowser || 'chrome'}
        </span>
        
        <div className="flex items-center space-x-1">
          <span className="text-gray-500 text-xs">Timeout:</span>
          <span className="text-gray-600 text-xs">
            {currentWorkspace?.settings.executionTimeout || 30000}ms
          </span>
        </div>

        {/* Status indicators */}
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 rounded-full bg-green-500" title="All systems operational" />
        </div>
      </div>
    </div>
  );
};

export default BottomStatusBar;
