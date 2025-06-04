
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Menu,
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  Globe,
  Play,
  Pause,
  Square,
  Monitor,
  X,
  Plus
} from 'lucide-react';
import { type Workspace } from '@/services/api/workspace-service';

interface TopNavigationProps {
  currentWorkspace?: Workspace | null;
  onToggleLeftSidebar: () => void;
  onToggleRightSidebar: () => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const TopNavigation: React.FC<TopNavigationProps> = ({
  currentWorkspace,
  onToggleLeftSidebar,
  onToggleRightSidebar,
  activeTab = 'dashboard',
  onTabChange,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationCount, setNotificationCount] = useState(3);
  const [isAIAgentActive, setIsAIAgentActive] = useState(false);

  const tabs = [
    { id: 'webapp', label: 'Web App', icon: Globe },
    { id: 'api-testing', label: 'API Testing', icon: Settings },
    { id: 'dashboard', label: 'Dashboard', icon: Monitor }
  ];

  const handleTabClick = (tabId: string) => {
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <header className="h-16 flex items-center justify-between px-4">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleLeftSidebar}
            className="hover:bg-gray-100"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm"></div>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              TestCraft IDE
            </h1>
          </div>
          
          {/* Breadcrumb */}
          <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
            <span>Workspaces</span>
            {currentWorkspace && (
              <>
                <span>/</span>
                <span className="text-gray-900 font-medium">{currentWorkspace.name}</span>
              </>
            )}
          </div>
        </div>
        
        {/* Center Section - Search */}
        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search tests, objects, or documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
            />
          </div>
        </div>
        
        {/* Right Section */}
        <div className="flex items-center space-x-3">
          {/* Browser Selection */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <Monitor className="h-4 w-4" />
                <span>{currentWorkspace?.settings.defaultBrowser || 'Chrome'}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Chrome</DropdownMenuItem>
              <DropdownMenuItem>Firefox</DropdownMenuItem>
              <DropdownMenuItem>Edge</DropdownMenuItem>
              <DropdownMenuItem>Safari</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Execution Controls */}
          <div className="flex items-center space-x-1">
            <Button size="icon" variant="outline" className="text-green-600 hover:bg-green-50">
              <Play className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="outline" className="text-yellow-600 hover:bg-yellow-50">
              <Pause className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="outline" className="text-red-600 hover:bg-red-50">
              <Square className="h-4 w-4" />
            </Button>
          </div>
          
          {/* AI Agent Status */}
          <Button
            variant={isAIAgentActive ? "default" : "outline"}
            size="sm"
            onClick={() => setIsAIAgentActive(!isAIAgentActive)}
            className={`flex items-center space-x-2 ${
              isAIAgentActive 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                : 'hover:bg-gray-100'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${isAIAgentActive ? 'bg-white animate-pulse' : 'bg-gray-400'}`}></div>
            <span>AI Agent</span>
          </Button>
          
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {notificationCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500">
                    {notificationCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="p-4 border-b">
                <h3 className="font-semibold">Notifications</h3>
              </div>
              <div className="p-2">
                <div className="text-sm text-gray-600 p-2">
                  Test execution completed with 2 failures
                </div>
                <div className="text-sm text-gray-600 p-2">
                  New team member joined: Sarah Johnson
                </div>
                <div className="text-sm text-gray-600 p-2">
                  Object repository updated
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Avatar className="h-8 w-8">
                  <div className="w-full h-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-medium">
                    JD
                  </div>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleRightSidebar}
            className="hover:bg-gray-100"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Chrome-style Tabs */}
      <div className="flex items-center bg-gray-50 border-b border-gray-200 px-4">
        <div className="flex items-center space-x-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <div
                key={tab.id}
                className={`flex items-center space-x-2 px-4 py-2 cursor-pointer border-t-2 transition-all ${
                  isActive
                    ? 'bg-white border-blue-500 text-blue-600'
                    : 'bg-transparent border-transparent text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => handleTabClick(tab.id)}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">{tab.label}</span>
                {isActive && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 hover:bg-gray-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle tab close if needed
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            );
          })}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-400 hover:text-gray-600"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TopNavigation;
