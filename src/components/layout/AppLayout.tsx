
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import TopNavigation from './TopNavigation';
import LeftSidebar from './LeftSidebar';
import TabsManager from './TabsManager';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { type Workspace } from '@/services/api/workspace-service';

interface AppLayoutProps {
  currentWorkspace?: Workspace | null;
}

const AppLayout: React.FC<AppLayoutProps> = ({ currentWorkspace }) => {
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);

  const toggleLeftSidebar = () => {
    setIsLeftSidebarOpen(!isLeftSidebarOpen);
  };

  const toggleRightSidebar = () => {
    setIsRightSidebarOpen(!isRightSidebarOpen);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <TopNavigation
        currentWorkspace={currentWorkspace}
        onToggleLeftSidebar={toggleLeftSidebar}
        onToggleRightSidebar={toggleRightSidebar}
      />
      
      <div className="flex-1 flex overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="flex-1">
          {isLeftSidebarOpen && (
            <>
              <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
                <LeftSidebar 
                  currentWorkspace={currentWorkspace}
                  isCollapsed={!isLeftSidebarOpen}
                />
              </ResizablePanel>
              <ResizableHandle withHandle />
            </>
          )}
          
          <ResizablePanel defaultSize={isRightSidebarOpen ? 60 : 80}>
            <div className="h-full bg-white">
              <Outlet />
            </div>
          </ResizablePanel>
          
          {isRightSidebarOpen && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
                <TabsManager currentWorkspace={currentWorkspace} />
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default AppLayout;
