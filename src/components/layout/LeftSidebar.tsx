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
 * - Inline editing for renaming folders and files
 * - Resizable sidebar for better content viewing
 */

import React, { useState, useRef, useEffect } from 'react';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
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
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [showCreateFolderDialog, setShowCreateFolderDialog] = useState(false);
  const [showCreateTestCaseDialog, setShowCreateTestCaseDialog] = useState(false);
  const [showCreateProjectDialog, setShowCreateProjectDialog] = useState(false);
  const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] = useState(false);
  const [showDeleteTestCasesDialog, setShowDeleteTestCasesDialog] = useState(false);
  const [showDeleteProjectDialog, setShowDeleteProjectDialog] = useState(false);
  const [showNoTestCasesSelectedDialog, setShowNoTestCasesSelectedDialog] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newTestCaseName, setNewTestCaseName] = useState('');
  const [newProjectName, setNewProjectName] = useState('');
  const [parentFolderId, setParentFolderId] = useState<string | null>(null);
  const [folderToDelete, setFolderToDelete] = useState<string | null>(null);
  const [currentFolderForTestDeletion, setCurrentFolderForTestDeletion] = useState<string | null>(null);
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const editInputRef = useRef<HTMLInputElement>(null);
  
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

  // Focus input when editing starts
  useEffect(() => {
    if (editingNodeId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingNodeId]);

  const startEditing = (nodeId: string, currentName: string) => {
    setEditingNodeId(nodeId);
    setEditingValue(currentName);
  };

  const cancelEditing = () => {
    setEditingNodeId(null);
    setEditingValue('');
  };

  const saveEditing = () => {
    if (!editingNodeId || !editingValue.trim()) {
      cancelEditing();
      return;
    }

    setTreeData(prevData => {
      const updateNodeName = (nodes: TreeNode[]): TreeNode[] => {
        return nodes.map(node => {
          if (node.id === editingNodeId) {
            return { ...node, name: editingValue.trim() };
          }
          if (node.children) {
            return { ...node, children: updateNodeName(node.children) };
          }
          return node;
        });
      };
      return updateNodeName(prevData);
    });

    cancelEditing();
  };

  const handleEditKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveEditing();
    } else if (e.key === 'Escape') {
      cancelEditing();
    }
  };

  const getSelectedTestCasesInFolder = (folderId: string): TreeNode[] => {
    const selectedTestCases: TreeNode[] = [];
    
    const findFolder = (nodes: TreeNode[]): TreeNode | null => {
      for (const node of nodes) {
        if (node.id === folderId) {
          return node;
        }
        if (node.children) {
          const found = findFolder(node.children);
          if (found) return found;
        }
      }
      return null;
    };
    
    const folder = findFolder(treeData);
    if (folder && folder.children) {
      folder.children.forEach(child => {
        if (child.type === 'test' && child.selected) {
          selectedTestCases.push(child);
        }
      });
    }
    
    return selectedTestCases;
  };

  const getSelectedFolders = (nodes: TreeNode[]): TreeNode[] => {
    const selected: TreeNode[] = [];
    
    const traverse = (nodeList: TreeNode[]) => {
      nodeList.forEach(node => {
        if (node.selected && node.type === 'folder') {
          selected.push(node);
        }
        if (node.children) {
          traverse(node.children);
        }
      });
    };
    
    traverse(nodes);
    return selected;
  };

  const getSelectedProjects = (nodes: TreeNode[]): TreeNode[] => {
    return nodes.filter(node => node.selected && node.type === 'project');
  };

  const createNewFolder = () => {
    if (!newFolderName.trim()) return;
    
    const newFolder: TreeNode = {
      id: `folder-${Date.now()}`,
      name: newFolderName,
      type: 'folder',
      isExpanded: false,
      selected: false,
      children: []
    };
    
    setTreeData(prevData => {
      const addFolderToParent = (nodes: TreeNode[]): TreeNode[] => {
        return nodes.map(node => {
          if (node.id === parentFolderId) {
            return {
              ...node,
              children: [...(node.children || []), newFolder]
            };
          }
          if (node.children) {
            return {
              ...node,
              children: addFolderToParent(node.children)
            };
          }
          return node;
        });
      };
      
      return addFolderToParent(prevData);
    });
    
    setNewFolderName('');
    setShowCreateFolderDialog(false);
    setParentFolderId(null);
  };

  const createNewTestCase = () => {
    if (!newTestCaseName.trim()) return;
    
    const newTestCase: TreeNode = {
      id: `test-${Date.now()}`,
      name: newTestCaseName,
      type: 'test',
      status: 'pending',
      route: '/test-editor',
      selected: false
    };
    
    setTreeData(prevData => {
      const addTestCaseToParent = (nodes: TreeNode[]): TreeNode[] => {
        return nodes.map(node => {
          if (node.id === parentFolderId) {
            return {
              ...node,
              children: [...(node.children || []), newTestCase]
            };
          }
          if (node.children) {
            return {
              ...node,
              children: addTestCaseToParent(node.children)
            };
          }
          return node;
        });
      };
      
      return addTestCaseToParent(prevData);
    });
    
    setNewTestCaseName('');
    setShowCreateTestCaseDialog(false);
    setParentFolderId(null);
  };

  const createNewProject = () => {
    if (!newProjectName.trim()) return;
    
    const newProject: TreeNode = {
      id: `project-${Date.now()}`,
      name: newProjectName,
      type: 'project',
      isExpanded: true,
      selected: false,
      children: []
    };
    
    setTreeData(prevData => [...prevData, newProject]);
    
    setNewProjectName('');
    setShowCreateProjectDialog(false);
    
    toast({
      title: "Project created",
      description: `Successfully created project "${newProjectName}"`,
    });
  };

  const deleteFolder = () => {
    if (!folderToDelete) return;
    
    setTreeData(prevData => {
      const removeFolderById = (nodes: TreeNode[]): TreeNode[] => {
        return nodes.filter(node => {
          if (node.id === folderToDelete) {
            return false; // Remove this folder
          }
          if (node.children) {
            node.children = removeFolderById(node.children);
          }
          return true;
        });
      };
      
      return removeFolderById(prevData);
    });
    
    setShowDeleteConfirmDialog(false);
    setFolderToDelete(null);
  };

  const deleteSelectedTestCasesInFolder = () => {
    if (!currentFolderForTestDeletion) return;
    
    const selectedTestCases = getSelectedTestCasesInFolder(currentFolderForTestDeletion);
    
    setTreeData(prevData => {
      const removeTestCasesFromFolder = (nodes: TreeNode[]): TreeNode[] => {
        return nodes.map(node => {
          if (node.id === currentFolderForTestDeletion && node.children) {
            return {
              ...node,
              children: node.children.filter(child => {
                if (child.type === 'test' && selectedTestCases.some(selected => selected.id === child.id)) {
                  return false; // Remove this test case
                }
                return true;
              })
            };
          }
          if (node.children) {
            return {
              ...node,
              children: removeTestCasesFromFolder(node.children)
            };
          }
          return node;
        });
      };
      
      return removeTestCasesFromFolder(prevData);
    });
    
    setShowDeleteTestCasesDialog(false);
    setCurrentFolderForTestDeletion(null);
    
    toast({
      title: "Test cases deleted",
      description: `Successfully deleted ${selectedTestCases.length} test case${selectedTestCases.length > 1 ? 's' : ''}`,
    });
  };

  const deleteSelectedProjects = () => {
    const selectedProjects = getSelectedProjects(treeData);
    
    if (selectedProjects.length === 0) return;
    
    setTreeData(prevData => {
      return prevData.filter(node => {
        // Don't remove if it's not a selected project
        return !(node.type === 'project' && selectedProjects.some(selected => selected.id === node.id));
      });
    });
    
    setShowDeleteProjectDialog(false);
    
    toast({
      title: "Projects deleted",
      description: `Successfully deleted ${selectedProjects.length} project${selectedProjects.length > 1 ? 's' : ''}`,
    });
  };

  const deleteSelectedFolders = () => {
    const selectedFolders = getSelectedFolders(treeData);
    
    if (selectedFolders.length === 0) return;
    
    setTreeData(prevData => {
      const removeFoldersById = (nodes: TreeNode[]): TreeNode[] => {
        return nodes.filter(node => {
          // Don't remove if it's not a selected folder
          if (node.type === 'folder' && selectedFolders.some(selected => selected.id === node.id)) {
            return false; // Remove this folder
          }
          if (node.children) {
            node.children = removeFoldersById(node.children);
          }
          return true;
        });
      };
      
      return removeFoldersById(prevData);
    });
    
    setShowDeleteConfirmDialog(false);
  };

  const handleCreateFolder = (parentId: string) => {
    setParentFolderId(parentId);
    setShowCreateFolderDialog(true);
  };

  const handleCreateTestCase = (parentId: string) => {
    setParentFolderId(parentId);
    setShowCreateTestCaseDialog(true);
  };

  const handleCreateProject = () => {
    setShowCreateProjectDialog(true);
  };

  const handleDeleteSelectedFolders = () => {
    const selectedFolders = getSelectedFolders(treeData);
    
    if (selectedFolders.length === 0) {
      // No folders selected, show a message or do nothing
      console.log('No folders selected for deletion');
      return;
    }
    
    setShowDeleteConfirmDialog(true);
  };

  const handleDeleteTestCasesInFolder = (folderId: string) => {
    const selectedTestCases = getSelectedTestCasesInFolder(folderId);
    
    if (selectedTestCases.length === 0) {
      setShowNoTestCasesSelectedDialog(true);
      return;
    }
    
    setCurrentFolderForTestDeletion(folderId);
    setShowDeleteTestCasesDialog(true);
  };

  const handleDeleteSelectedProjects = () => {
    const selectedProjects = getSelectedProjects(treeData);
    
    if (selectedProjects.length === 0) {
      toast({
        title: "No projects selected",
        description: "Please select a project before attempting to delete.",
      });
      return;
    }
    
    setShowDeleteProjectDialog(true);
  };

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
    if (node.route && node.type === 'test') {
      // Navigate to webapp testing with the test case
      navigate('/webapp-testing', { state: { testCaseId: node.id, testCaseName: node.name } });
    }
  };

  const handleEditTest = (node: TreeNode) => {
    navigate('/webapp-testing', { state: { testCaseId: node.id, testCaseName: node.name } });
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

  const CustomCheckbox: React.FC<{ 
    checked?: boolean; 
    indeterminate?: boolean; 
    onChange: (checked: boolean) => void;
    onClick: (e: React.MouseEvent) => void;
  }> = ({ checked, indeterminate, onChange, onClick }) => {
    const checkboxRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (checkboxRef.current) {
        checkboxRef.current.indeterminate = !!indeterminate;
      }
    }, [indeterminate]);

    return (
      <div className="relative">
        <input
          ref={checkboxRef}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          onClick={onClick}
          className="sr-only"
        />
        <Checkbox
          checked={checked}
          onCheckedChange={onChange}
          onClick={onClick}
          className="mr-3 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
        />
      </div>
    );
  };

  const renderTreeNode = (node: TreeNode, level: number = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isSelected = selectedNode === node.id;
    const isEditing = editingNodeId === node.id;

    return (
      <div key={node.id} className="select-none">
        <ContextMenu>
          <ContextMenuTrigger>
            <div
              className={`flex items-center py-1.5 px-2 rounded-md cursor-pointer transition-all duration-200 group ${
                isSelected ? 'bg-blue-50 text-blue-900 border border-blue-200' : 'hover:bg-gray-50'
              }`}
              style={{ paddingLeft: `${level * 16 + 8}px` }}
            >
              {/* Integrated Checkbox with Icon Container */}
              <div className="flex items-center mr-2">
                <CustomCheckbox
                  checked={node.selected}
                  indeterminate={node.indeterminate}
                  onChange={(checked) => handleCheckboxChange(node.id, checked as boolean)}
                  onClick={(e) => e.stopPropagation()}
                />
                
                {/* Expand/Collapse Button */}
                {hasChildren && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 p-0 mr-1 opacity-70 group-hover:opacity-100 transition-opacity"
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
                
                {/* Icon with enhanced styling */}
                <div className="flex items-center justify-center w-5 h-5 mr-2">
                  {node.type === 'project' && (
                    <Folder className="h-4 w-4 text-blue-600 group-hover:text-blue-700 transition-colors" />
                  )}
                  {node.type === 'folder' && (
                    node.isExpanded ? 
                      <FolderOpen className="h-4 w-4 text-amber-600 group-hover:text-amber-700 transition-colors" /> :
                      <Folder className="h-4 w-4 text-amber-600 group-hover:text-amber-700 transition-colors" />
                  )}
                  {node.type === 'test' && (
                    <File className="h-4 w-4 text-gray-600 group-hover:text-gray-700 transition-colors" />
                  )}
                </div>
              </div>
              
              {/* Node Content */}
              <div 
                className="flex items-center flex-1 min-w-0"
                onClick={() => !isEditing && handleNodeClick(node)}
              >
                {isEditing ? (
                  <Input
                    ref={editInputRef}
                    value={editingValue}
                    onChange={(e) => setEditingValue(e.target.value)}
                    onKeyDown={handleEditKeyPress}
                    onBlur={saveEditing}
                    className="h-6 text-sm py-0 px-1 border-blue-500"
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <span 
                    className="truncate text-sm font-medium group-hover:text-gray-900 transition-colors cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      startEditing(node.id, node.name);
                    }}
                  >
                    {node.name}
                  </span>
                )}
                
                {/* Status indicator */}
                {node.status && !isEditing && (
                  <div className="ml-auto flex items-center">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getStatusColor(node.status)} bg-opacity-10`}>
                      {getStatusIcon(node.status)}
                    </span>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              {!isEditing && (
                <div className="flex items-center ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {/* Edit button for renaming */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 p-0 mr-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      startEditing(node.id, node.name);
                    }}
                    title="Rename"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  
                  {/* Add button - different behavior for project vs folders */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 p-0 mr-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (node.type === 'project') {
                        handleCreateFolder(node.id);
                      } else if (node.type === 'folder') {
                        handleCreateTestCase(node.id);
                      }
                    }}
                    title={node.type === 'project' ? "Create New Folder" : "Create New Test Case"}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                  
                  {/* Delete button - different behavior for project vs folders */}
                  {(node.type === 'project' || node.type === 'folder') && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (node.type === 'project') {
                          handleDeleteSelectedFolders();
                        } else if (node.type === 'folder') {
                          handleDeleteTestCasesInFolder(node.id);
                        }
                      }}
                      title={node.type === 'project' ? "Delete Selected Folders" : "Delete Selected Test Cases"}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              )}
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
            <ContextMenuItem onClick={() => startEditing(node.id, node.name)}>
              <FileEdit className="mr-2 h-4 w-4" />
              Rename
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
    <div className="min-w-[200px] max-w-[600px] w-80 border-r border-gray-200 bg-gray-50 flex flex-col resize-x overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-gray-900">Project Explorer</h2>
            <div className="flex space-x-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6"
                onClick={handleCreateProject}
                title="Create New Project"
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6"
                onClick={handleDeleteSelectedProjects}
                title="Delete Selected Projects"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex space-x-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6"
              onClick={() => navigate('/webapp-testing')}
              title="Open Web App Testing"
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
        {treeData.length > 0 ? (
          treeData.map(node => renderTreeNode(node))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Folder className="h-8 w-8 mx-auto mb-2" />
            <p className="text-sm">No projects found</p>
            <p className="text-xs mt-1">Click the + button to create a new project</p>
          </div>
        )}
      </div>

      {/* Create Project Dialog */}
      <Dialog open={showCreateProjectDialog} onOpenChange={setShowCreateProjectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Enter a name for the new project. This will create a new independent project structure.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Project name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  createNewProject();
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateProjectDialog(false)}>
              Cancel
            </Button>
            <Button onClick={createNewProject} disabled={!newProjectName.trim()}>
              Create Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Projects Confirmation Dialog */}
      <AlertDialog open={showDeleteProjectDialog} onOpenChange={setShowDeleteProjectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Selected Projects</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete all the test folders and test cases within the selected projects. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteProjectDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={deleteSelectedProjects} className="bg-red-600 hover:bg-red-700">
              Yes, Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Create Folder Dialog */}
      <Dialog open={showCreateFolderDialog} onOpenChange={setShowCreateFolderDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
            <DialogDescription>
              Enter a name for the new folder. It will be added to the selected folder.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  createNewFolder();
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateFolderDialog(false)}>
              Cancel
            </Button>
            <Button onClick={createNewFolder} disabled={!newFolderName.trim()}>
              Create Folder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Test Case Dialog */}
      <Dialog open={showCreateTestCaseDialog} onOpenChange={setShowCreateTestCaseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Test Case</DialogTitle>
            <DialogDescription>
              Enter a name for the new test case. It will be added to the selected folder.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Test case name"
              value={newTestCaseName}
              onChange={(e) => setNewTestCaseName(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  createNewTestCase();
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateTestCaseDialog(false)}>
              Cancel
            </Button>
            <Button onClick={createNewTestCase} disabled={!newTestCaseName.trim()}>
              Create Test Case
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Folders Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirmDialog} onOpenChange={setShowDeleteConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Selected Folders</AlertDialogTitle>
            <AlertDialogDescription>
              Deleting these folders will delete all the test cases and test steps within them. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteConfirmDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={deleteSelectedFolders} className="bg-red-600 hover:bg-red-700">
              Yes, Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Test Cases Confirmation Dialog */}
      <AlertDialog open={showDeleteTestCasesDialog} onOpenChange={setShowDeleteTestCasesDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Selected Test Cases</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete the selected test cases and all their test steps. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteTestCasesDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={deleteSelectedTestCasesInFolder} className="bg-red-600 hover:bg-red-700">
              Yes, Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* No Test Cases Selected Dialog */}
      <AlertDialog open={showNoTestCasesSelectedDialog} onOpenChange={setShowNoTestCasesSelectedDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>No Test Cases Selected</AlertDialogTitle>
            <AlertDialogDescription>
              Please select a test case before attempting to delete.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowNoTestCasesSelectedDialog(false)}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default LeftSidebar;
