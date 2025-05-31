
/**
 * Dashboard Page Component
 * 
 * Purpose: Main dashboard providing overview of test automation activities and workspace metrics
 * 
 * Dependencies:
 * - testExecutionService for execution data and statistics
 * - workspaceService for workspace information
 * - UI components for data visualization
 * - React Query for data fetching and caching
 * 
 * Connected Components:
 * - AppLayout (parent layout)
 * - Various UI cards and charts for data display
 * - Navigation to TestCaseEditor and other features
 * 
 * Features:
 * - Real-time execution statistics
 * - Recent test execution history
 * - Workspace file overview
 * - Quick action buttons
 * - Performance trend visualization
 * - Demo data for new user experience
 */

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Users,
  FileText,
  Play,
  Plus,
  BarChart3,
  FolderOpen,
  Settings
} from 'lucide-react';
import { testExecutionService } from '@/services/api/test-execution-service';
import { type Workspace } from '@/services/api/workspace-service';
import { useNavigate } from 'react-router-dom';

interface DashboardProps {
  currentWorkspace?: Workspace | null;
}

const Dashboard: React.FC<DashboardProps> = ({ currentWorkspace }) => {
  const navigate = useNavigate();

  // Fetch execution summary
  const { data: executionSummary } = useQuery({
    queryKey: ['execution-summary', currentWorkspace?.id],
    queryFn: () => currentWorkspace ? 
      testExecutionService.getExecutionSummary(currentWorkspace.id) : 
      Promise.resolve({
        totalTests: 0,
        passedTests: 0,
        failedTests: 0,
        skippedTests: 0,
        totalDuration: 0,
        successRate: 0,
      }),
    enabled: !!currentWorkspace,
  });

  // Fetch recent executions
  const { data: recentExecutions = [] } = useQuery({
    queryKey: ['recent-executions', currentWorkspace?.id],
    queryFn: () => currentWorkspace ? 
      testExecutionService.getExecutions(currentWorkspace.id, 5) : 
      Promise.resolve([]),
    enabled: !!currentWorkspace,
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'passed':
        return <Badge className="bg-green-100 text-green-800">Passed</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Running</Badge>;
    }
  };

  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  // Show workspace selection message if no workspace is selected
  if (!currentWorkspace) {
    return (
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <FolderOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Workspace Selected</h2>
          <p className="text-gray-600 mb-6">
            Please select or create a workspace to view your test automation dashboard
          </p>
          <Button onClick={() => navigate('/workspaces')}>
            <Plus className="h-4 w-4 mr-2" />
            Manage Workspaces
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Overview of {currentWorkspace.name} test automation activities
          </p>
        </div>
        <div className="flex space-x-3">
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Plus className="h-4 w-4 mr-2" />
            New Test
          </Button>
          <Button variant="outline">
            <Play className="h-4 w-4 mr-2" />
            Run Suite
          </Button>
        </div>
      </div>

      {/* Workspace Info Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FolderOpen className="h-5 w-5 mr-2 text-blue-600" />
            Current Workspace: {currentWorkspace.name}
          </CardTitle>
          <CardDescription>
            {currentWorkspace.description || 'No description provided'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium">Files:</span> {currentWorkspace.files.length}
            </div>
            <div>
              <span className="font-medium">Default Browser:</span> {currentWorkspace.settings.defaultBrowser}
            </div>
            <div>
              <span className="font-medium">Last Modified:</span> {' '}
              {new Intl.DateTimeFormat('en-US', { 
                month: 'short', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }).format(currentWorkspace.lastModified)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{executionSummary?.totalTests || 0}</div>
            <p className="text-xs text-muted-foreground">
              {currentWorkspace.files.length} test files available
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Passed Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {executionSummary?.passedTests || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {executionSummary?.successRate.toFixed(1) || 0}% success rate
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Today</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {executionSummary?.failedTests || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Issues need attention
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Execution Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {executionSummary ? formatDuration(executionSummary.totalDuration) : '0m 0s'}
            </div>
            <p className="text-xs text-muted-foreground">
              Total today
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Executions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Recent Test Executions
            </CardTitle>
            <CardDescription>
              Latest test runs and their results
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentExecutions.length === 0 ? (
              <div className="text-center py-8">
                <Play className="h-8 w-8 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No test executions yet</p>
                <Button variant="outline" onClick={() => navigate('/test-editor')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Test
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentExecutions.map((execution) => (
                  <div
                    key={execution.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(execution.status)}
                      <div>
                        <p className="font-medium text-sm">{execution.testCaseName}</p>
                        <p className="text-xs text-gray-600">
                          Duration: {execution.duration ? formatDuration(execution.duration) : 'N/A'} • {' '}
                          {new Intl.RelativeTimeFormat('en').format(
                            Math.floor((execution.startTime.getTime() - Date.now()) / (1000 * 60)),
                            'minute'
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(execution.status)}
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => navigate('/test-editor')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Test
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Play className="h-4 w-4 mr-2" />
              Run Test Suite
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <BarChart3 className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => navigate('/workspaces')}
            >
              <Settings className="h-4 w-4 mr-2" />
              Workspace Settings
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Performance Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Performance Trends
          </CardTitle>
          <CardDescription>
            Test execution trends over the last 7 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-32 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-600">Chart visualization will be implemented with real execution data</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
