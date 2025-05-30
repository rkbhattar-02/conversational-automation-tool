
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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

interface TestStep {
  id: string;
  stepNumber: number;
  action: string;
  object: string;
  parameters: string;
  status?: 'passed' | 'failed' | 'running' | 'pending';
}

const TestCaseEditor = () => {
  const [testCaseName, setTestCaseName] = useState('Login Flow Test');
  const [description, setDescription] = useState('Verify user can login with valid credentials');
  const [viewMode, setViewMode] = useState<'table' | 'code'>('table');
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
    return steps.map(step => {
      const params = step.parameters ? ` ${step.parameters}` : '';
      return `${step.action} ${step.object}${params}`;
    }).join('\n');
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
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          {/* Test Steps Panel */}
          <ResizablePanel defaultSize={70} minSize={50}>
            <div className="h-full flex flex-col">
              {viewMode === 'table' ? (
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
                            <TableCell className="font-mono text-center">
                              {step.stepNumber}
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(step.status)}>
                                {step.status || 'pending'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="w-full justify-between text-blue-600 font-medium">
                                    {step.action}
                                    <ChevronDown className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  {commonActions.map(action => (
                                    <DropdownMenuItem 
                                      key={action}
                                      onClick={() => updateStep(step.id, 'action', action)}
                                    >
                                      {action}
                                    </DropdownMenuItem>
                                  ))}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                            <TableCell>
                              <Input
                                value={step.object}
                                onChange={(e) => updateStep(step.id, 'object', e.target.value)}
                                className="text-purple-600 font-medium border-none bg-transparent focus:bg-white focus:border-gray-300"
                                placeholder="Object name..."
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                value={step.parameters}
                                onChange={(e) => updateStep(step.id, 'parameters', e.target.value)}
                                className="text-green-600 font-mono border-none bg-transparent focus:bg-white focus:border-gray-300"
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
                <h3 className="text-lg font-semibold">Step Properties</h3>
              </div>
              
              <div className="p-4 space-y-4">
                <div>
                  <Label className="text-sm font-medium">Action Type</Label>
                  <p className="text-sm text-gray-600 mt-1">
                    Defines what operation to perform on the target object
                  </p>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Object Reference</Label>
                  <p className="text-sm text-gray-600 mt-1">
                    Reference to an object in the repository or a direct locator
                  </p>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Parameters</Label>
                  <p className="text-sm text-gray-600 mt-1">
                    Additional data required for the action (text input, options, etc.)
                  </p>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="font-medium mb-2">Syntax Guide</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-blue-600 font-mono">Launch</span>
                      <span className="text-gray-600"> - Start browser or application</span>
                    </div>
                    <div>
                      <span className="text-blue-600 font-mono">Navigate</span>
                      <span className="text-gray-600"> - Go to URL</span>
                    </div>
                    <div>
                      <span className="text-blue-600 font-mono">Click</span>
                      <span className="text-gray-600"> - Click on element</span>
                    </div>
                    <div>
                      <span className="text-blue-600 font-mono">Input</span>
                      <span className="text-gray-600"> - Enter text</span>
                    </div>
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
