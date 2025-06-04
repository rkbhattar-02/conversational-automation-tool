
/**
 * Left Sidebar Component
 * 
 * Purpose: Project explorer showing workspace files, test cases, and navigation tree
 * 
 * Dependencies:
 * - React Router for navigation
 * - shadcn/ui components for consistent UI
 * - Workspace service for file management
 * - Context menus for file operations
 * 
 * Connected Components:
 * - AppLayout (parent container)
 * - TestCaseEditor (navigation target)
 * - WorkspaceManager (workspace context)
 * 
 * Features:
 * - Hierarchical file tree navigation
 * - Test case status indicators
 * - Context menu operations (run, edit, delete)
 * - Search functionality for tests
 * - Collapsible folder structure
 * - Quick action buttons
 * - Hierarchical checkbox selection
 */

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  File,
  Search,
  Plus,
  MoreHorizontal,
  Play,
  Edit,
  Copy,
  Trash2,
  FileEdit
} from 'lucide-react';
import { type Workspace } from '@/services/api/workspace-service';

interface LeftSidebarProps {
  isOpen: boolean;
  currentWorkspace?: Workspace | null;
}

interface TreeNode {
  id: string;
  name: string;
  type: 'project' | 'folder' | 'test';
  children?: TreeNode[];
  isExpanded?: boolean;
  status?: 'passed' | 'failed' | 'running' | 'pending';
  route?: string;
  selected?: boolean;
  indeterminate?: boolean;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ isOpen, currentWorkspace }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  
  const [treeData, setTreeData] = useState<TreeNode[]>([
    {
      id: '1',
      name: currentWorkspace?.name || 'Demo Workspace',
      type: 'project',
      isExpanded: true,
      selected: false,
      children: [
        {
          id: '2',
          name: 'Authentication Tests',
          type: 'folder',
          isExpanded: true,
          selected: false,
          children: [
            { id: '3', name: 'Login Flow', type: 'test', status: 'passed', route: '/test-editor', selected: false },
            { id: '4', name: 'Registration Flow', type: 'test', status: 'failed', route: '/test-editor', selected: false },
            { id: '5', name: 'Password Reset', type: 'test', status: 'pending', route: '/test-editor', selected: false }
          ]
        },
        {
          id: '6',
          name: 'Shopping Cart Tests',
          type: 'folder',
          isExpanded: false,
          selected: false,
          children: [
            { id: '7', name: 'Add to Cart', type: 'test', status: 'passed', route: '/test-editor', selected: false },
            { id: '8', name: 'Remove from Cart', type: 'test', status: 'running', route: '/test-editor', selected: false },
            { id: '9', name: 'Checkout Process', type: 'test', status: 'pending', route: '/test-editor', selected: false }
          ]
        }
      ]
    }
  ]);

  const updateNodeSelection = (nodes: TreeNode[], nodeId: string, selected: boolean): TreeNode[] => {
    return nodes.map(node => {
      if (node.id === nodeId) {
        const updatedNode = { ...node, selected };
        
        // If node has children, update all children
        if (updatedNode.children) {
          updatedNode.children = updateAllChildren(updatedNode.children, selected);
        }
        
        return updatedNode;
      }
      
      if (node.children) {
        const updatedChildren = updateNodeSelection(node.children, nodeId, selected);
        const updatedNode = { ...node, children: updatedChildren };
        
        // Update parent state based on children
        updateParentState(updatedNode);
        
        return updatedNode;
      }
      
      return node;
    });
  };

  const updateAllChildren = (children: TreeNode[], selected: boolean): TreeNode[] => {
    return children.map(child => ({
      ...child,
      selected,
      indeterminate: false,
      children: child.children ? updateAllChildren(child.children, selected) : child.children
    }));
  };

  const updateParentState = (node: TreeNode) => {
    if (!node.children) return;
    
    const selectedChildren = node.children.filter(child => child.selected);
    const indeterminateChildren = node.children.filter(child => child.indeterminate);
    
    if (selectedChildren.length === node.children.length) {
      node.selected = true;
      node.indeterminate = false;
    } else if (selectedChildren.length > 0 || indeterminateChildren.length > 0) {
      node.selected = false;
      node.indeterminate = true;
    } else {
      node.selected = false;
      node.indeterminate = false;
    }
  };

  const handleCheckboxChange = (nodeId: string, checked: boolean) => {
    setTreeData(prevData => updateNodeSelection(prevData, nodeId, checked));
  };

  const toggleExpanded = (nodeId: string) => {
    const updateNode = (nodes: TreeNode[]): TreeNode[] => {
      return nodes.map(node => {
        if (node.id === nodeId) {
          return { ...node, isExpanded: !node.isExpanded };
        }
        if (node.children) {
          return { ...node, children: updateNode(node.children) };
        }
        return node;
      });
    };
    setTreeData(updateNode(treeData));
  };

  const handleNodeClick = (node: TreeNode) => {
    setSelectedNode(node.id);
    if (node.route) {
      navigate(node.route);
    }
  };

  const handleEditTest = (node: TreeNode) => {
    navigate('/test-editor');
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'passed': return 'text-green-600';
      case 'failed': return 'text-red-600';
      case 'running': return 'text-blue-600';
      case 'pending': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'passed': return '✓';
      case 'failed': return '✕';
      case 'running': return '●';
      case 'pending': return '○';
      default: return '';
    }
  };

  const renderTreeNode = (node: TreeNode, level: number = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isSelected = selectedNode === node.id;

    return (
      <div key={node.id} className="select-none">
        <ContextMenu>
          <ContextMenuTrigger>
            <div
              className={`flex items-center py-1 px-2 rounded-md cursor-pointer transition-colors ${
                isSelected ? 'bg-blue-100 text-blue-900' : 'hover:bg-gray-100'
              }`}
              style={{ paddingLeft: `${level * 16 + 8}px` }}
            >
              {/* Checkbox */}
              <Checkbox
                checked={node.selected}
                ref={(ref) => {
                  if (ref && node.indeterminate) {
                    ref.indeterminate = true;
                  }
                }}
                onCheckedChange={(checked) => handleCheckboxChange(node.id, checked as boolean)}
                className="mr-2"
                onClick={(e) => e.stopPropagation()}
              />

              {hasChildren && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 mr-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleExpanded(node.id);
                  }}
                >
                  {node.isExpanded ? (
                    <ChevronDown className="h-3 w-3" />
                  ) : (
                    <ChevronRight className="h-3 w-3" />
                  )}
                </Button>
              )}
              
              <div 
                className="flex items-center flex-1 min-w-0"
                onClick={() => handleNodeClick(node)}
              >
                {node.type === 'project' && <Folder className="h-4 w-4 mr-2 text-blue-600" />}
                {node.type === 'folder' && (
                  node.isExpanded ? 
                    <FolderOpen className="h-4 w-4 mr-2 text-yellow-600" /> :
                    <Folder className="h-4 w-4 mr-2 text-yellow-600" />
                )}
                {node.type === 'test' && <File className="h-4 w-4 mr-2 text-gray-600" />}
                
                <span className="truncate text-sm">{node.name}</span>
                
                {node.status && (
                  <span className={`ml-auto text-xs ${getStatusColor(node.status)}`}>
                    {getStatusIcon(node.status)}
                  </span>
                )}
              </div>
            </div>
          </ContextMenuTrigger>
          
          <ContextMenuContent>
            <ContextMenuItem>
              <Play className="mr-2 h-4 w-4" />
              Run Test
            </ContextMenuItem>
            <ContextMenuItem onClick={() => handleEditTest(node)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </ContextMenuItem>
            <ContextMenuItem>
              <Copy className="mr-2 h-4 w-4" />
              Duplicate
            </ContextMenuItem>
            <ContextMenuItem className="text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
        
        {hasChildren && node.isExpanded && (
          <div className="transition-all duration-200 ease-in-out">
            {node.children?.map(child => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (!isOpen) {
    return (
      <div className="w-12 border-r border-gray-200 bg-gray-50 flex flex-col items-center py-4">
        <Button variant="ghost" size="icon" className="mb-2">
          <Folder className="h-5 w-5" />
        </Button>
      </div>
    );
  }

  return (
    <div className="w-80 border-r border-gray-200 bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-900">Project Explorer</h2>
          <div className="flex space-x-1">
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Plus className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6"
              onClick={() => navigate('/test-editor')}
              title="Open Test Editor"
            >
              <FileEdit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search tests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-8 text-sm"
          />
        </div>
      </div>
      
      {/* Tree View */}
      <div className="flex-1 overflow-y-auto p-2">
        {currentWorkspace ? (
          treeData.map(node => renderTreeNode(node))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Folder className="h-8 w-8 mx-auto mb-2" />
            <p className="text-sm">No workspace selected</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeftSidebar;
