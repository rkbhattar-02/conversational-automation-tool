
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, Play, FileText, Code } from 'lucide-react';

interface TestCaseHeaderProps {
  testCaseName: string;
  description: string;
  viewMode: 'enhanced' | 'table' | 'code';
  onTestCaseNameChange: (name: string) => void;
  onDescriptionChange: (description: string) => void;
  onViewModeChange: (mode: 'enhanced' | 'table' | 'code') => void;
}

const TestCaseHeader: React.FC<TestCaseHeaderProps> = ({
  testCaseName,
  description,
  viewMode,
  onTestCaseNameChange,
  onDescriptionChange,
  onViewModeChange
}) => {
  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1 max-w-2xl">
          <Label htmlFor="testCaseName" className="text-sm font-medium">
            Test Case Name
          </Label>
          <Input
            id="testCaseName"
            value={testCaseName}
            onChange={(e) => onTestCaseNameChange(e.target.value)}
            className="mt-1 text-lg font-semibold"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <Button
              variant={viewMode === 'enhanced' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('enhanced')}
              className="flex items-center space-x-1"
            >
              <FileText className="h-4 w-4" />
              <span>Enhanced</span>
            </Button>
            <Button
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('table')}
              className="flex items-center space-x-1"
            >
              <FileText className="h-4 w-4" />
              <span>Table</span>
            </Button>
            <Button
              variant={viewMode === 'code' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('code')}
              className="flex items-center space-x-1"
            >
              <Code className="h-4 w-4" />
              <span>Code</span>
            </Button>
          </div>
          
          <Button variant="outline" size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button size="sm" className="bg-green-600 hover:bg-green-700">
            <Play className="h-4 w-4 mr-2" />
            Run Test
          </Button>
        </div>
      </div>
      
      <div>
        <Label htmlFor="description" className="text-sm font-medium">
          Description
        </Label>
        <Input
          id="description"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          className="mt-1"
          placeholder="Enter test case description..."
        />
      </div>
    </div>
  );
};

export default TestCaseHeader;
