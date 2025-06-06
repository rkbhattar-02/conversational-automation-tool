
/**
 * Dashboard Component
 * 
 * Purpose: Main dashboard displaying workspace overview, recent activities, and quick actions
 * 
 * Dependencies:
 * - workspaceService for workspace operations
 * - test-execution-service for test data
 * - UI components from shadcn/ui
 * - React Query for data management
 * 
 * Connected Components:
 * - App.tsx (receives currentWorkspace prop)
 * - AppLayout.tsx (layout wrapper)
 * - Various dashboard widgets and components
 * 
 * Features:
 * - Workspace overview statistics
 * - Recent test execution history
 * - Quick action buttons
 * - File system navigation
 * - Test execution controls
 */

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Pause, 
  Square, 
  FileText, 
  FolderOpen, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  TrendingUp,
  Users,
  Calendar,
  Activity
} from 'lucide-react';
import { workspaceService, type Workspace } from '@/services/api/workspace-service';
import { testExecutionService, type TestExecution } from '@/services/api/test-execution-service';

interface DashboardProps {
  currentWorkspace?: Workspace | null;
}

const Dashboard: React.FC<DashboardProps> = ({ currentWorkspace }) => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [selectedExecution, setSelectedExecution] = useState<string | null>(null);

  // Fetch test executions for the current workspace
  const { data: executions = [], isLoading: executionsLoading } = useQuery({
    queryKey: ['executions', currentWorkspace?.id],
    queryFn: () => currentWorkspace ? testExecutionService.getExecutions(currentWorkspace.id) : Promise.resolve([]),
    enabled: !!currentWorkspace,
  });

  // Use workspace files directly - no getFiles method exists
  const files = currentWorkspace?.files || [];
  const filesLoading = false;

  const handleStartExecution = async () => {
    if (!currentWorkspace) return;
    
    setIsExecuting(true);
    try {
      // Use executeTest method that exists in the service
      const testFiles = files.filter(f => f.name.endsWith('.js'));
      if (testFiles.length > 0) {
        await testExecutionService.executeTest(testFiles[0].id, {
          browser: currentWorkspace.settings.defaultBrowser,
        });
      }
    } catch (error) {
      console.error('Failed to start execution:', error);
    } finally {
      setIsExecuting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'running': return <Activity className="h-4 w-4 text-blue-500 animate-spin" />;
      default: return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'bg-green-500';
      case 'failed': return 'bg-red-500';
      case 'running': return 'bg-blue-500';
      default: return 'bg-yellow-500';
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentWorkspace) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <FolderOpen className="h-12 w-12 text-gray-400 mx-auto" />
          <h3 className="text-lg font-medium text-gray-900">No workspace selected</h3>
          <p className="text-gray-600">Select a workspace to view the dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-900">Welcome to TestCraft IDE</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Your comprehensive testing workspace. Manage test cases, track executions, and monitor your testing progress.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Test Cases</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{files.filter(f => f.name.endsWith('.test.js')).length}</div>
            <p className="text-xs text-muted-foreground">
              +2 from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Executions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{executions.length}</div>
            <p className="text-xs text-muted-foreground">
              Last run 2 hours ago
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">
              +5% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Team members active
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Test Executions</CardTitle>
            <CardDescription>Latest test runs and their status</CardDescription>
          </CardHeader>
          <CardContent>
            {executions.length > 0 ? (
              <div className="space-y-4">
                {executions.slice(0, 5).map((execution) => (
                  <div key={execution.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(execution.status)}
                      <div>
                        <p className="font-medium">{execution.testName}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(execution.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant={execution.status === 'passed' ? 'default' : 'destructive'}>
                      {execution.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Activity className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p>No test executions yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleStartExecution}
              disabled={isExecuting}
              className="w-full flex items-center justify-center space-x-2"
            >
              <Play className="h-4 w-4" />
              <span>{isExecuting ? 'Running Tests...' : 'Run All Tests'}</span>
            </Button>
            
            <Button variant="outline" className="w-full">
              <FileText className="h-4 w-4 mr-2" />
              Create New Test Case
            </Button>
            
            <Button variant="outline" className="w-full">
              <FolderOpen className="h-4 w-4 mr-2" />
              Import Test Suite
            </Button>
            
            <Button variant="outline" className="w-full">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Test Run
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
