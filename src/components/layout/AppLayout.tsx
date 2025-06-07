
/**
 * AppLayout Component
 * 
 * Purpose: Main layout wrapper that provides the core application structure with sidebar navigation,
 * top navigation, and content area. Manages workspace context and layout state.
 * 
 * Interaction Rules:
 * - Receives currentWorkspace prop from App.tsx and passes it down to child components
 * - Manages left and right sidebar visibility state (collapsed/expanded)
 * - Provides ResizablePanelGroup for adjustable layout panels
 * - Renders TopNavigation with workspace context and sidebar toggle handlers
 * - Uses React Router's Outlet to render page content based on current route
 * - Conditionally renders right sidebar (TabsManager) based on isRightSidebarOpen state
 * 
 * State Management:
 * - isLeftSidebarOpen: Controls visibility of left navigation sidebar
 * - isRightSidebarOpen: Controls visibility of right sidebar with tabs
 * 
 * Component Hierarchy:
 * App.tsx → AppLayout → [TopNavigation, LeftSidebar, Outlet, TabsManager]
 * 
 * Dependencies:
 * - Uses ResizablePanelGroup for adjustable layout
 * - Integrates with React Router for nested routing
 * - Manages workspace context throughout the layout
 * 
 * Props:
 * - currentWorkspace: Workspace object containing project data and settings
 */

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
      {/* Top Navigation Bar - Fixed header with workspace context */}
      <TopNavigation
        currentWorkspace={currentWorkspace}
        onToggleLeftSidebar={toggleLeftSidebar}
        onToggleRightSidebar={toggleRightSidebar}
      />
      
      {/* Main Content Area with Resizable Panels */}
      <div className="flex-1 flex overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="flex-1">
          {/* Left Sidebar Panel - Collapsible file explorer and navigation */}
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
          
          {/* Main Content Panel - Router outlet for page content */}
          <ResizablePanel defaultSize={isRightSidebarOpen ? 60 : 80}>
            <div className="h-full bg-white">
              <Outlet />
            </div>
          </ResizablePanel>
          
          {/* Right Sidebar Panel - Optional tabs manager */}
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
