
/**
 * LeftSidebar Component
 * 
 * Purpose: Navigation sidebar that displays workspace file structure, navigation menu,
 * and workspace-specific tools. Provides file management and project navigation.
 * 
 * Interaction Rules:
 * - Receives currentWorkspace prop to display workspace-specific content
 * - isCollapsed prop controls the sidebar's visual state (used for future responsive behavior)
 * - Displays workspace files in a hierarchical tree structure
 * - Provides navigation links to different sections of the application
 * - Shows workspace settings and tools relevant to the current project
 * - Integrates with file management operations (create, edit, delete files)
 * 
 * State Management:
 * - Manages expanded/collapsed state of file tree nodes
 * - Tracks selected files and directories
 * - Handles file operation states (loading, error states)
 * 
 * Component Hierarchy:
 * AppLayout → LeftSidebar → [FileTree, NavigationMenu, WorkspaceTools]
 * 
 * File Operations:
 * - Create new files and folders
 * - Rename existing files
 * - Delete files and folders
 * - Navigate file structure
 * 
 * Dependencies:
 * - Uses workspace service for file operations
 * - Integrates with React Router for navigation
 * - Uses shadcn/ui components for consistent styling
 * 
 * Props:
 * - currentWorkspace: Current workspace data including files and settings
 * - isCollapsed: Boolean indicating if sidebar should show in collapsed state
 */

import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  FolderTree,
  File,
  Settings,
  Plus,
  ChevronRight,
  ChevronDown,
  TestTube,
  Globe,
  Database,
  BookOpen,
  Zap
} from 'lucide-react';
import { type Workspace } from '@/services/api/workspace-service';

interface LeftSidebarProps {
  currentWorkspace?: Workspace | null;
  isCollapsed?: boolean;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ currentWorkspace, isCollapsed = false }) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['files', 'test-cases']));

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  // Navigation sections with their respective tools and purposes
  const navigationSections = [
    {
      id: 'explorer',
      title: 'Explorer',
      icon: FolderTree,
      badge: currentWorkspace?.files?.length || 0
    },
    {
      id: 'test-cases',
      title: 'Test Cases', 
      icon: TestTube,
      badge: 'NEW'
    },
    {
      id: 'object-repo',
      title: 'Object Repository',
      icon: Database,
      badge: null
    },
    {
      id: 'documentation',
      title: 'Documentation',
      icon: BookOpen,
      badge: null
    }
  ];

  return (
    <div className="h-full bg-gray-50 border-r border-gray-200 flex flex-col">
      {/* Sidebar Header with Workspace Info */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900 truncate">
            {currentWorkspace?.name || 'No Workspace'}
          </h2>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {currentWorkspace?.description && (
          <p className="text-xs text-gray-600 mt-1 truncate">
            {currentWorkspace.description}
          </p>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {/* Navigation Sections */}
          {navigationSections.map((section) => {
            const Icon = section.icon;
            const isExpanded = expandedFolders.has(section.id);
            
            return (
              <Collapsible 
                key={section.id} 
                open={isExpanded} 
                onOpenChange={() => toggleFolder(section.id)}
              >
                <CollapsibleTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start p-2 h-auto hover:bg-gray-100"
                  >
                    <div className="flex items-center space-x-2 flex-1">
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-gray-500" />
                      )}
                      <Icon className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900 flex-1 text-left">
                        {section.title}
                      </span>
                      {section.badge && (
                        <Badge variant="secondary" className="text-xs">
                          {section.badge}
                        </Badge>
                      )}
                    </div>
                  </Button>
                </CollapsibleTrigger>
                
                <CollapsibleContent className="pl-4">
                  {section.id === 'explorer' && currentWorkspace?.files && (
                    <div className="space-y-1 py-1">
                      {currentWorkspace.files.map((file) => (
                        <Button
                          key={file.id}
                          variant="ghost"
                          className="w-full justify-start p-1 h-auto text-xs hover:bg-gray-100"
                        >
                          <File className="h-3 w-3 text-gray-500 mr-2" />
                          <span className="text-gray-700">{file.name}</span>
                        </Button>
                      ))}
                      {(!currentWorkspace.files || currentWorkspace.files.length === 0) && (
                        <p className="text-xs text-gray-500 py-2 px-2">No files yet</p>
                      )}
                    </div>
                  )}
                  
                  {section.id === 'test-cases' && (
                    <div className="space-y-1 py-1">
                      <Button
                        variant="ghost"
                        className="w-full justify-start p-1 h-auto text-xs hover:bg-gray-100"
                      >
                        <File className="h-3 w-3 text-gray-500 mr-2" />
                        <span className="text-gray-700">login-test.js</span>
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start p-1 h-auto text-xs hover:bg-gray-100"
                      >
                        <File className="h-3 w-3 text-gray-500 mr-2" />
                        <span className="text-gray-700">product-search.js</span>
                      </Button>
                    </div>
                  )}
                  
                  {section.id === 'object-repo' && (
                    <div className="space-y-1 py-1">
                      <p className="text-xs text-gray-500 py-2 px-2">Object repository coming soon</p>
                    </div>
                  )}
                  
                  {section.id === 'documentation' && (
                    <div className="space-y-1 py-1">
                      <p className="text-xs text-gray-500 py-2 px-2">Documentation coming soon</p>
                    </div>
                  )}
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>
      </ScrollArea>

      {/* Sidebar Footer with Workspace Actions */}
      <div className="p-3 border-t border-gray-200">
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full justify-start"
        >
          <Settings className="h-4 w-4 mr-2" />
          Workspace Settings
        </Button>
      </div>
    </div>
  );
};

export default LeftSidebar;
