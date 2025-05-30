
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import TopNavigation from './TopNavigation';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import BottomStatusBar from './BottomStatusBar';

const AppLayout = () => {
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation */}
      <TopNavigation
        onToggleLeftSidebar={() => setLeftSidebarOpen(!leftSidebarOpen)}
        onToggleRightSidebar={() => setRightSidebarOpen(!rightSidebarOpen)}
      />
      
      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <LeftSidebar isOpen={leftSidebarOpen} />
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-white">
          <Outlet />
        </main>
        
        {/* Right Sidebar */}
        <RightSidebar isOpen={rightSidebarOpen} />
      </div>
      
      {/* Bottom Status Bar */}
      <BottomStatusBar />
    </div>
  );
};

export default AppLayout;
