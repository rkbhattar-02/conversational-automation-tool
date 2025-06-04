
/**
 * Application Layout Component
 * 
 * Purpose: Main layout wrapper providing consistent structure for the application
 * 
 * Dependencies:
 * - React Router for navigation context
 * - Custom layout components (navigation, sidebars, status bar)
 * - Workspace context for current workspace state
 * - react-resizable-panels for resizable layout
 * 
 * Connected Components:
 * - TopNavigation (header with workspace info and actions)
 * - LeftSidebar (workspace files and navigation)
 * - RightSidebar (properties and tools)
 * - BottomStatusBar (status and execution info)
 * - All page components via Outlet
 * 
 * Features:
 * - Responsive sidebar management
 * - Workspace context distribution
 * - Layout state persistence
 * - Keyboard shortcuts for layout controls
 * - Resizable panels for better content viewing
 */

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import TopNavigation from './TopNavigation';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import BottomStatusBar from './BottomStatusBar';
import { type Workspace } from '@/services/api/workspace-service';

interface AppLayoutProps {
  currentWorkspace?: Workspace | null;
}

const AppLayout: React.FC<AppLayoutProps> = ({ currentWorkspace }) => {
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation */}
      <TopNavigation
        currentWorkspace={currentWorkspace}
        onToggleLeftSidebar={() => setLeftSidebarOpen(!leftSidebarOpen)}
        onToggleRightSidebar={() => setRightSidebarOpen(!rightSidebarOpen)}
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
              <Outlet />
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
