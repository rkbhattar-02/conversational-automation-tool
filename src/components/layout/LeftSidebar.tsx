
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  Trash2
} from 'lucide-react';

interface LeftSidebarProps {
  isOpen: boolean;
}

interface TreeNode {
  id: string;
  name: string;
  type: 'project' | 'folder' | 'test';
  children?: TreeNode[];
  isExpanded?: boolean;
  status?: 'passed' | 'failed' | 'running' | 'pending';
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ isOpen }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  
  const [treeData, setTreeData] = useState<TreeNode[]>([
    {
      id: '1',
      name: 'E-commerce Project',
      type: 'project',
      isExpanded: true,
      children: [
        {
          id: '2',
          name: 'Authentication Tests',
          type: 'folder',
          isExpanded: true,
          children: [
            { id: '3', name: 'Login Flow', type: 'test', status: 'passed' },
            { id: '4', name: 'Registration Flow', type: 'test', status: 'failed' },
            { id: '5', name: 'Password Reset', type: 'test', status: 'pending' }
          ]
        },
        {
          id: '6',
          name: 'Shopping Cart Tests',
          type: 'folder',
          isExpanded: false,
          children: [
            { id: '7', name: 'Add to Cart', type: 'test', status: 'passed' },
            { id: '8', name: 'Remove from Cart', type: 'test', status: 'running' },
            { id: '9', name: 'Checkout Process', type: 'test', status: 'pending' }
          ]
        }
      ]
    }
  ]);

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
              onClick={() => setSelectedNode(node.id)}
            >
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
              
              <div className="flex items-center flex-1 min-w-0">
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
            <ContextMenuItem>
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
        {treeData.map(node => renderTreeNode(node))}
      </div>
    </div>
  );
};

export default LeftSidebar;
