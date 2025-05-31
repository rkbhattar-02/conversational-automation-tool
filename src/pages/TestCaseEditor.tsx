import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  ResizablePanelGroup, 
  ResizablePanel, 
  ResizableHandle 
} from '@/components/ui/resizable';
import {
  Plus,
  Trash2,
  Copy,
  Play,
  Save,
  ChevronDown,
  FileText,
  Code
} from 'lucide-react';
import MonacoEditor from './components/MonacoEditor';
import TestStepsContainer from '@/components/test-editor/TestStepsContainer';
import { type Workspace } from '@/services/api/workspace-service';

interface TestCaseEditorProps {
  currentWorkspace?: Workspace | null;
}

interface TestStep {
  id: string;
  stepNumber: number;
  action: string;
  object: string;
  parameters: string;
  status?: 'passed' | 'failed' | 'running' | 'pending';
  selected?: boolean;
}

interface TestCase {
  id: string;
  name: string;
  selected?: boolean;
}

interface TestSet {
  id: string;
  name: string;
  selected?: boolean;
  testCases: TestCase[];
}

const TestCaseEditor: React.FC<TestCaseEditorProps> = ({ currentWorkspace }) => {
  const [testCaseName, setTestCaseName] = useState('Login Flow Test');
  const [description, setDescription] = useState('Verify user can login with valid credentials');
  const [viewMode, setViewMode] = useState<'enhanced' | 'table' | 'code'>('enhanced');
  const [selectedSteps, setSelectedSteps] = useState<string[]>([]);
  
  // Enhanced test steps for the new interface
  const [enhancedSteps, setEnhancedSteps] = useState<{id: string, content: string}[]>([
    { id: 'step-1', content: 'launch chrome' },
    { id: 'step-2', content: 'navigate "https://app.example.com/login"' },
    { id: 'step-3', content: 'type emailInput "testuser@example.com"' },
    { id: 'step-4', content: 'type passwordInput "password123"' },
    { id: 'step-5', content: 'click loginButton' },
    { id: 'step-6', content: 'waitFor userProfile' },
    { id: 'step-7', content: 'assert userProfile visible' }
  ]);
  
  const [testSets, setTestSets] = useState<TestSet[]>([
    {
      id: 'set1',
      name: 'Authentication Tests',
      selected: false,
      testCases: [
        { id: 'tc1', name: 'Login Flow Test', selected: false },
        { id: 'tc2', name: 'Registration Flow', selected: false },
        { id: 'tc3', name: 'Password Reset', selected: false }
      ]
    },
    {
      id: 'set2',
      name: 'Shopping Cart Tests',
      selected: false,
      testCases: [
        { id: 'tc4', name: 'Add to Cart', selected: false },
        { id: 'tc5', name: 'Remove from Cart', selected: false },
        { id: 'tc6', name: 'Checkout Process', selected: false }
      ]
    }
  ]);

  const [steps, setSteps] = useState<TestStep[]>([
    {
      id: '1',
      stepNumber: 1,
      action: 'Launch',
      object: 'Browser',
      parameters: '"Chrome"',
      status: 'passed'
    },
    {
      id: '2',
      stepNumber: 2,
      action: 'Navigate',
      object: 'URL',
      parameters: '"https://app.example.com/login"',
      status: 'passed'
    },
    {
      id: '3',
      stepNumber: 3,
      action: 'Input',
      object: 'UsernameField',
      parameters: '"testuser@example.com"',
      status: 'failed'
    },
    {
      id: '4',
      stepNumber: 4,
      action: 'Input',
      object: 'PasswordField',
      parameters: '"password123"',
      status: 'pending'
    },
    {
      id: '5',
      stepNumber: 5,
      action: 'Click',
      object: 'LoginButton',
      parameters: '',
      status: 'pending'
    }
  ]);

  const handleTestSetSelection = (setId: string, checked: boolean) => {
    setTestSets(prev => prev.map(set => {
      if (set.id === setId) {
        return {
          ...set,
          selected: checked,
          testCases: set.testCases.map(tc => ({ ...tc, selected: checked }))
        };
      }
      return set;
    }));
  };

  const handleTestCaseSelection = (setId: string, caseId: string, checked: boolean) => {
    setTestSets(prev => prev.map(set => {
      if (set.id === setId) {
        const updatedTestCases = set.testCases.map(tc => 
          tc.id === caseId ? { ...tc, selected: checked } : tc
        );
        const allSelected = updatedTestCases.every(tc => tc.selected);
        const noneSelected = updatedTestCases.every(tc => !tc.selected);
        
        return {
          ...set,
          selected: allSelected,
          testCases: updatedTestCases
        };
      }
      return set;
    }));
  };

  const handleStepSelection = (stepId: string, checked: boolean) => {
    if (checked) {
      setSelectedSteps(prev => [...prev, stepId]);
    } else {
      setSelectedSteps(prev => prev.filter(id => id !== stepId));
    }
  };

  const addStep = () => {
    const newStep: TestStep = {
      id: Date.now().toString(),
      stepNumber: steps.length + 1,
      action: 'Click',
      object: '',
      parameters: '',
      status: 'pending'
    };
    setSteps([...steps, newStep]);
  };

  const deleteStep = (id: string) => {
    const updatedSteps = steps.filter(step => step.id !== id);
    // Renumber steps
    const renumberedSteps = updatedSteps.map((step, index) => ({
      ...step,
      stepNumber: index + 1
    }));
    setSteps(renumberedSteps);
  };

  const updateStep = (id: string, field: keyof TestStep, value: string) => {
    setSteps(steps.map(step => 
      step.id === id ? { ...step, [field]: value } : step
    ));
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'passed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'running': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const generateCodeFromSteps = () => {
    return enhancedSteps.map(step => step.content).filter(content => content.trim()).join('\n');
  };

  const commonActions = [
    'Launch', 'Navigate', 'Click', 'Input', 'Select', 'Verify', 'Wait', 
    'If', 'Then', 'Else', 'Loop', 'Call', 'Screenshot'
  ];

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1 max-w-2xl">
            <Label htmlFor="testCaseName" className="text-sm font-medium">
              Test Case Name
            </Label>
            <Input
              id="testCaseName"
              value={testCaseName}
              onChange={(e) => setTestCaseName(e.target.value)}
              className="mt-1 text-lg font-semibold"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <Button
                variant={viewMode === 'enhanced' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('enhanced')}
                className="flex items-center space-x-1"
              >
                <FileText className="h-4 w-4" />
                <span>Enhanced</span>
              </Button>
              <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('table')}
                className="flex items-center space-x-1"
              >
                <FileText className="h-4 w-4" />
                <span>Table</span>
              </Button>
              <Button
                variant={viewMode === 'code' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('code')}
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
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1"
            placeholder="Enter test case description..."
          />
        </div>

        {/* Test Sets and Cases Selection */}
        <div className="mt-4">
          <Label className="text-sm font-medium mb-2 block">Test Selection</Label>
          <div className="space-y-3 max-h-32 overflow-y-auto border rounded-md p-3 bg-gray-50">
            {testSets.map(testSet => (
              <div key={testSet.id} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={testSet.selected}
                    onCheckedChange={(checked) => handleTestSetSelection(testSet.id, checked as boolean)}
                  />
                  <span className="font-medium text-sm">{testSet.name}</span>
                </div>
                <div className="ml-6 space-y-1">
                  {testSet.testCases.map(testCase => (
                    <div key={testCase.id} className="flex items-center space-x-2">
                      <Checkbox
                        checked={testCase.selected}
                        onCheckedChange={(checked) => handleTestCaseSelection(testSet.id, testCase.id, checked as boolean)}
                      />
                      <span className="text-sm text-gray-600">{testCase.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          {/* Test Steps Panel */}
          <ResizablePanel defaultSize={70} minSize={50}>
            <div className="h-full flex flex-col">
              {viewMode === 'enhanced' ? (
                <TestStepsContainer
                  steps={enhancedSteps}
                  onStepsChange={setEnhancedSteps}
                />
              ) : viewMode === 'table' ? (
                <div className="flex-1 overflow-hidden bg-white">
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Test Steps</h3>
                    <Button onClick={addStep} size="sm" className="flex items-center space-x-1">
                      <Plus className="h-4 w-4" />
                      <span>Add Step</span>
                    </Button>
                  </div>
                  
                  <div className="overflow-auto h-full pb-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">Select</TableHead>
                          <TableHead className="w-16">#</TableHead>
                          <TableHead className="w-32">Status</TableHead>
                          <TableHead className="w-40">Action</TableHead>
                          <TableHead className="w-48">Object</TableHead>
                          <TableHead>Parameters</TableHead>
                          <TableHead className="w-24">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {steps.map((step, index) => (
                          <TableRow 
                            key={step.id} 
                            className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50 transition-colors`}
                          >
                            <TableCell>
                              <Checkbox
                                checked={selectedSteps.includes(step.id)}
                                onCheckedChange={(checked) => handleStepSelection(step.id, checked as boolean)}
                              />
                            </TableCell>
                            <TableCell className="font-mono text-center">
                              {step.stepNumber}
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(step.status)}>
                                {step.status || 'pending'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Input
                                value={step.action}
                                onChange={(e) => updateStep(step.id, 'action', e.target.value)}
                                className="text-blue-600 font-medium"
                                placeholder="Action..."
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                value={step.object}
                                onChange={(e) => updateStep(step.id, 'object', e.target.value)}
                                className="text-purple-600 font-medium"
                                placeholder="Object name..."
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                value={step.parameters}
                                onChange={(e) => updateStep(step.id, 'parameters', e.target.value)}
                                className="text-green-600 font-mono"
                                placeholder="Parameters..."
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 hover:bg-blue-100"
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => deleteStep(step.id)}
                                  className="h-8 w-8 hover:bg-red-100 text-red-600"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ) : (
                <div className="flex-1 bg-white">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold">Code View</h3>
                  </div>
                  <div className="h-full">
                    <MonacoEditor
                      value={generateCodeFromSteps()}
                      language="custom"
                      onChange={() => {}}
                    />
                  </div>
                </div>
              )}
            </div>
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          {/* Properties Panel */}
          <ResizablePanel defaultSize={30} minSize={25}>
            <div className="h-full bg-white border-l border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold">Smart Assistance Guide</h3>
              </div>
              
              <div className="p-4 space-y-4">
                <div>
                  <Label className="text-sm font-medium">Enhanced Editor Features</Label>
                  <p className="text-sm text-gray-600 mt-1">
                    Press <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Ctrl + Space</kbd> for smart suggestions
                  </p>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Common Actions</Label>
                  <div className="mt-2 space-y-1 text-sm">
                    <div><span className="text-blue-600 font-mono">click</span> - Click on element</div>
                    <div><span className="text-blue-600 font-mono">type</span> - Enter text into field</div>
                    <div><span className="text-blue-600 font-mono">navigate</span> - Go to URL</div>
                    <div><span className="text-blue-600 font-mono">assert</span> - Verify condition</div>
                    <div><span className="text-blue-600 font-mono">waitFor</span> - Wait for element</div>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Page Objects</Label>
                  <div className="mt-2 space-y-1 text-sm">
                    <div><span className="text-purple-600 font-mono">loginButton</span></div>
                    <div><span className="text-purple-600 font-mono">emailInput</span></div>
                    <div><span className="text-purple-600 font-mono">passwordInput</span></div>
                    <div><span className="text-purple-600 font-mono">submitButton</span></div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="font-medium mb-2">Keyboard Shortcuts</h4>
                  <div className="space-y-2 text-sm">
                    <div><kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Enter</kbd> - New step</div>
                    <div><kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Backspace</kbd> - Delete empty step</div>
                    <div><kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Ctrl+Space</kbd> - Suggestions</div>
                    <div><kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">↑↓</kbd> - Navigate suggestions</div>
                  </div>
                </div>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default TestCaseEditor;
