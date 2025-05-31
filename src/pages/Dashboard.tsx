
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{currentWorkspace.name}</h1>
          <p className="text-gray-600 mt-1">{currentWorkspace.description}</p>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={handleStartExecution}
            disabled={isExecuting || files.length === 0}
            className="bg-green-600 hover:bg-green-700"
          >
            <Play className="h-4 w-4 mr-2" />
            {isExecuting ? 'Running...' : 'Run Tests'}
          </Button>
          <Button variant="outline" disabled={!isExecuting}>
            <Square className="h-4 w-4 mr-2" />
            Stop
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Test Cases</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{files.filter(f => f.name.endsWith('.js')).length}</div>
            <p className="text-xs text-muted-foreground">
              +2 from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.2%</div>
            <p className="text-xs text-muted-foreground">
              +1.2% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Execution</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2h ago</div>
            <p className="text-xs text-muted-foreground">
              15 tests passed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4:32</div>
            <p className="text-xs text-muted-foreground">
              -0:15 from last week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="executions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="executions">Recent Executions</TabsTrigger>
          <TabsTrigger value="files">Test Files</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="executions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Test Execution History</CardTitle>
              <CardDescription>
                Recent test runs and their results
              </CardDescription>
            </CardHeader>
            <CardContent>
              {executionsLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse flex space-x-4">
                      <div className="rounded-full bg-gray-200 h-10 w-10"></div>
                      <div className="flex-1 space-y-2 py-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : executions.length === 0 ? (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No executions yet</h3>
                  <p className="text-gray-600 mb-4">Run your first test to see execution history</p>
                  <Button onClick={handleStartExecution} disabled={files.length === 0}>
                    <Play className="h-4 w-4 mr-2" />
                    Start First Test
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {executions.slice(0, 5).map((execution) => (
                    <div 
                      key={execution.id} 
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedExecution(execution.id)}
                    >
                      <div className="flex items-center space-x-4">
                        {getStatusIcon(execution.status)}
                        <div>
                          <div className="font-medium">Execution #{execution.id.slice(0, 8)}</div>
                          <div className="text-sm text-gray-500">
                            {execution.testCount} tests • {formatDuration(execution.duration)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge 
                          variant={execution.status === 'passed' ? 'default' : 'destructive'}
                          className={getStatusColor(execution.status)}
                        >
                          {execution.status}
                        </Badge>
                        <div className="text-sm text-gray-500">
                          {new Date(execution.startTime).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="files" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Test Files</CardTitle>
              <CardDescription>
                Manage your test automation files
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filesLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse flex space-x-4">
                      <div className="rounded bg-gray-200 h-8 w-8"></div>
                      <div className="flex-1 space-y-2 py-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {files.map((file) => (
                    <div key={file.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                      <FileText className="h-4 w-4 text-blue-500" />
                      <span className="flex-1">{file.name}</span>
                      <span className="text-sm text-gray-500">{file.path}</span>
                    </div>
                  ))}
                  {files.length === 0 && (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No files yet</h3>
                      <p className="text-gray-600">Create your first test file to get started</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Test Success Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Passed</span>
                    <span>94.2%</span>
                  </div>
                  <Progress value={94.2} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Average Execution Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4:32</div>
                <p className="text-sm text-gray-500">Average across all test runs</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
