/**
 * Workspace Manager Component
 * 
 * Purpose: Main workspace management interface for creating, selecting, and managing workspaces
 * 
 * Dependencies:
 * - workspaceService for workspace operations
 * - UI components from shadcn/ui
 * - React hooks for state management
 * 
 * Connected Components:
 * - App.tsx (main layout integration)
 * - LeftSidebar (workspace navigation)
 * - Dashboard (workspace overview)
 * 
 * Features:
 * - Workspace creation wizard
 * - Workspace selection and switching
 * - Workspace settings management
 * - Sample data initialization for demo
 */

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Plus, 
  FolderOpen, 
  Settings, 
  Clock, 
  Users, 
  FileText,
  Chrome,
  Globe,
  Monitor,
  Smartphone
} from 'lucide-react';
import { workspaceService, type Workspace } from '@/services/api/workspace-service';
import { useToast } from '@/hooks/use-toast';

interface WorkspaceManagerProps {
  onWorkspaceSelect?: (workspace: Workspace) => void;
  currentWorkspaceId?: string;
}

// Use the same browser type as defined in workspace service - only chrome, firefox, safari
type BrowserType = 'chrome' | 'firefox' | 'safari';

const WorkspaceManager: React.FC<WorkspaceManagerProps> = ({
  onWorkspaceSelect,
  currentWorkspaceId
}) => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newWorkspace, setNewWorkspace] = useState({
    name: '',
    description: '',
    defaultBrowser: 'chrome' as BrowserType,
    executionTimeout: 30000,
  });
  const [creationStep, setCreationStep] = useState(1);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch workspaces
  const { data: workspaces = [], isLoading } = useQuery({
    queryKey: ['workspaces'],
    queryFn: workspaceService.getWorkspaces,
  });

  // Create workspace mutation
  const createWorkspaceMutation = useMutation({
    mutationFn: workspaceService.createWorkspace,
    onSuccess: (workspace) => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      setShowCreateDialog(false);
      setCreationStep(1);
      setNewWorkspace({
        name: '',
        description: '',
        defaultBrowser: 'chrome',
        executionTimeout: 30000,
      });
      onWorkspaceSelect?.(workspace);
      toast({
        title: 'Workspace Created',
        description: `${workspace.name} has been created successfully.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to create workspace. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handleCreateWorkspace = () => {
    if (!newWorkspace.name.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Workspace name is required.',
        variant: 'destructive',
      });
      return;
    }

    createWorkspaceMutation.mutate({
      name: newWorkspace.name,
      description: newWorkspace.description,
      files: [],
      settings: {
        screenshotPath: `/workspace/${newWorkspace.name.toLowerCase().replace(/\s+/g, '-')}/screenshots`,
        logsPath: `/workspace/${newWorkspace.name.toLowerCase().replace(/\s+/g, '-')}/logs`,
        defaultBrowser: newWorkspace.defaultBrowser,
        executionTimeout: newWorkspace.executionTimeout,
      },
    });
  };

  const getBrowserIcon = (browser: string) => {
    switch (browser) {
      case 'chrome': return <Chrome className="h-4 w-4" />;
      case 'firefox': return <Globe className="h-4 w-4" />;
      case 'safari': return <Monitor className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600">Loading workspaces...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Workspaces</h2>
          <p className="text-gray-600 mt-1">Manage your test automation projects</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              New Workspace
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Workspace</DialogTitle>
              <DialogDescription>
                Set up a new test automation workspace with custom configurations
              </DialogDescription>
            </DialogHeader>
            
            <Tabs value={`step-${creationStep}`} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="step-1" disabled={creationStep < 1}>Basic Info</TabsTrigger>
                <TabsTrigger value="step-2" disabled={creationStep < 2}>Configuration</TabsTrigger>
                <TabsTrigger value="step-3" disabled={creationStep < 3}>Review</TabsTrigger>
              </TabsList>
              
              <TabsContent value="step-1" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Workspace Name</Label>
                    <Input
                      id="name"
                      value={newWorkspace.name}
                      onChange={(e) => setNewWorkspace(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter workspace name..."
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={newWorkspace.description}
                      onChange={(e) => setNewWorkspace(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe your test automation project..."
                      className="mt-1"
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={() => setCreationStep(2)} disabled={!newWorkspace.name.trim()}>
                      Next
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="step-2" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label>Default Browser</Label>
                    <Select 
                      value={newWorkspace.defaultBrowser} 
                      onValueChange={(value: BrowserType) => 
                        setNewWorkspace(prev => ({ ...prev, defaultBrowser: value }))
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="chrome">
                          <div className="flex items-center space-x-2">
                            <Chrome className="h-4 w-4" />
                            <span>Google Chrome</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="firefox">
                          <div className="flex items-center space-x-2">
                            <Globe className="h-4 w-4" />
                            <span>Mozilla Firefox</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="safari">
                          <div className="flex items-center space-x-2">
                            <Monitor className="h-4 w-4" />
                            <span>Safari</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="timeout">Execution Timeout (ms)</Label>
                    <Input
                      id="timeout"
                      type="number"
                      value={newWorkspace.executionTimeout}
                      onChange={(e) => setNewWorkspace(prev => ({ 
                        ...prev, 
                        executionTimeout: parseInt(e.target.value) || 30000 
                      }))}
                      className="mt-1"
                    />
                  </div>
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setCreationStep(1)}>
                      Back
                    </Button>
                    <Button onClick={() => setCreationStep(3)}>
                      Next
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="step-3" className="space-y-4">
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <h4 className="font-medium">Workspace Summary</h4>
                    <div className="text-sm space-y-1">
                      <p><strong>Name:</strong> {newWorkspace.name}</p>
                      <p><strong>Description:</strong> {newWorkspace.description || 'No description'}</p>
                      <p><strong>Default Browser:</strong> {newWorkspace.defaultBrowser}</p>
                      <p><strong>Timeout:</strong> {newWorkspace.executionTimeout}ms</p>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setCreationStep(2)}>
                      Back
                    </Button>
                    <Button 
                      onClick={handleCreateWorkspace}
                      disabled={createWorkspaceMutation.isPending}
                    >
                      {createWorkspaceMutation.isPending ? 'Creating...' : 'Create Workspace'}
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

      {/* Workspaces Grid */}
      {workspaces.length === 0 ? (
        <div className="text-center py-12">
          <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No workspaces yet</h3>
          <p className="text-gray-600 mb-4">Create your first workspace to get started with test automation</p>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Workspace
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workspaces.map((workspace) => (
            <Card 
              key={workspace.id} 
              className={`cursor-pointer transition-all hover:shadow-lg ${
                currentWorkspaceId === workspace.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => onWorkspaceSelect?.(workspace)}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="truncate">{workspace.name}</span>
                  <Badge variant={currentWorkspaceId === workspace.id ? 'default' : 'secondary'}>
                    {currentWorkspaceId === workspace.id ? 'Active' : 'Inactive'}
                  </Badge>
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {workspace.description || 'No description provided'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      {getBrowserIcon(workspace.settings.defaultBrowser)}
                      <span className="capitalize">{workspace.settings.defaultBrowser}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>{formatDate(workspace.lastModified)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <FileText className="h-3 w-3" />
                      <span>{workspace.files.length} files</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Settings className="h-3 w-3" />
                      <span>Timeout: {workspace.settings.executionTimeout}ms</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkspaceManager;
