
import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import TopNavigation from './TopNavigation';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import BottomStatusBar from './BottomStatusBar';
import TabsManager from './TabsManager';
import { type Workspace } from '@/services/api/workspace-service';

interface AppLayoutProps {
  currentWorkspace?: Workspace | null;
}

const AppLayout: React.FC<AppLayoutProps> = ({ currentWorkspace }) => {
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const location = useLocation();

  // Check if we're on a route that should show tabs instead of normal content
  const shouldShowTabs = location.pathname === '/' || location.pathname === '/dashboard';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation */}
      <TopNavigation
        currentWorkspace={currentWorkspace}
        onToggleLeftSidebar={() => setLeftSidebarOpen(!leftSidebarOpen)}
        onToggleRightSidebar={() => setRightSidebarOpen(!rightSidebarOpen)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="w-full">
          {/* Left Sidebar Panel */}
          {leftSidebarOpen && (
            <>
              <ResizablePanel 
                defaultSize={20} 
                minSize={15} 
                maxSize={40}
                className="min-w-[200px]"
              >
                <LeftSidebar 
                  isOpen={leftSidebarOpen} 
                  currentWorkspace={currentWorkspace}
                />
              </ResizablePanel>
              <ResizableHandle withHandle />
            </>
          )}
          
          {/* Main Content Panel */}
          <ResizablePanel defaultSize={leftSidebarOpen && rightSidebarOpen ? 60 : 80}>
            <main className="h-full overflow-y-auto bg-white">
              {shouldShowTabs ? (
                <TabsManager 
                  activeTab={activeTab} 
                  currentWorkspace={currentWorkspace} 
                />
              ) : (
                <Outlet />
              )}
            </main>
          </ResizablePanel>
          
          {/* Right Sidebar Panel */}
          {rightSidebarOpen && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel 
                defaultSize={20} 
                minSize={15} 
                maxSize={40}
                className="min-w-[200px]"
              >
                <RightSidebar 
                  isOpen={rightSidebarOpen}
                  currentWorkspace={currentWorkspace}
                />
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
      
      {/* Bottom Status Bar */}
      <BottomStatusBar currentWorkspace={currentWorkspace} />
    </div>
  );
};

export default AppLayout;
