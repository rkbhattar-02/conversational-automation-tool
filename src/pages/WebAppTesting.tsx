
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  FileText,
  FolderOpen
} from 'lucide-react';
import { type Workspace } from '@/services/api/workspace-service';
import TestCaseEditor from '@/pages/TestCaseEditor';

interface WebAppTestingProps {
  currentWorkspace?: Workspace | null;
}

const WebAppTesting: React.FC<WebAppTestingProps> = ({ currentWorkspace }) => {
  const location = useLocation();
  const [selectedTestCase, setSelectedTestCase] = useState<string | null>(null);
  const [selectedTestCaseName, setSelectedTestCaseName] = useState<string | null>(null);

  // Check if we navigated here with test case data
  useEffect(() => {
    if (location.state && location.state.testCaseId) {
      setSelectedTestCase(location.state.testCaseId);
      setSelectedTestCaseName(location.state.testCaseName || 'Test Case');
    }
  }, [location.state]);

  const handleTestCaseSelect = (testCaseId: string) => {
    setSelectedTestCase(testCaseId);
    setSelectedTestCaseName('New Test Case');
  };

  if (!currentWorkspace) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <FolderOpen className="h-12 w-12 text-gray-400 mx-auto" />
          <h3 className="text-lg font-medium text-gray-900">No workspace selected</h3>
          <p className="text-gray-600">Select a workspace to start web app testing</p>
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
        testCaseName={selectedTestCaseName || 'Test Case'}
        onBack={() => {
          setSelectedTestCase(null);
          setSelectedTestCaseName(null);
        }}
      />
    );
  }

  // Get test files from workspace
  const files = currentWorkspace?.files || [];

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

export default WebAppTesting;
