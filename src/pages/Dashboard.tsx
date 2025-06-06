
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
import TestCaseEditor from '@/pages/TestCaseEditor';

interface DashboardProps {
  currentWorkspace?: Workspace | null;
}

const Dashboard: React.FC<DashboardProps> = ({ currentWorkspace }) => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [selectedExecution, setSelectedExecution] = useState<string | null>(null);
  const [selectedTestCase, setSelectedTestCase] = useState<string | null>(null);

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

  const handleTestCaseSelect = (testCaseId: string) => {
    setSelectedTestCase(testCaseId);
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

  // If a test case is selected, show the test case editor
  if (selectedTestCase) {
    return (
      <TestCaseEditor 
        currentWorkspace={currentWorkspace}
        testCaseId={selectedTestCase}
        onBack={() => setSelectedTestCase(null)}
      />
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Default empty state with message */}
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="text-center space-y-4">
          <FileText className="h-16 w-16 text-gray-400 mx-auto" />
          <h3 className="text-xl font-medium text-gray-900">Select a test case to edit</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Choose a test case from the project explorer on the left to start editing test steps and automation logic.
          </p>
          
          {/* Quick actions to create test cases */}
          <div className="pt-4 space-y-2">
            <Button 
              onClick={() => handleTestCaseSelect('new-test-case')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <FileText className="h-4 w-4 mr-2" />
              Create New Test Case
            </Button>
            
            {/* Show recent test cases if any exist */}
            {files.filter(f => f.name.endsWith('.test.js')).length > 0 && (
              <div className="pt-4">
                <p className="text-sm text-gray-500 mb-2">Recent test cases:</p>
                <div className="space-y-1">
                  {files.filter(f => f.name.endsWith('.test.js')).slice(0, 3).map((file) => (
                    <Button
                      key={file.id}
                      variant="ghost"
                      size="sm"
                      onClick={() => handleTestCaseSelect(file.id)}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      {file.name.replace('.test.js', '')}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
