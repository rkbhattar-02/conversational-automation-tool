
import React, { useState } from 'react';
import { 
  ResizablePanelGroup, 
  ResizablePanel, 
  ResizableHandle 
} from '@/components/ui/resizable';
import TestCaseHeader from '@/components/test-editor/TestCaseHeader';
import TestStepsContainer from '@/components/test-editor/TestStepsContainer';
import TestTableView from '@/components/test-editor/TestTableView';
import TestCodeView from '@/components/test-editor/TestCodeView';
import TestPropertiesPanel from '@/components/test-editor/TestPropertiesPanel';
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

  const generateCodeFromSteps = () => {
    return enhancedSteps.map(step => step.content).filter(content => content.trim()).join('\n');
  };

  const handleCodeChange = (code: string) => {
    const lines = code.split('\n').filter(line => line.trim());
    const newSteps = lines.map((line, index) => ({
      id: `step-${index + 1}`,
      content: line.trim()
    }));
    setEnhancedSteps(newSteps);
  };

  const renderMainContent = () => {
    switch (viewMode) {
      case 'enhanced':
        return (
          <TestStepsContainer
            steps={enhancedSteps}
            onStepsChange={setEnhancedSteps}
          />
        );
      case 'table':
        return (
          <TestTableView
            steps={steps}
            selectedSteps={selectedSteps}
            onStepSelection={handleStepSelection}
            onAddStep={addStep}
            onDeleteStep={deleteStep}
            onUpdateStep={updateStep}
          />
        );
      case 'code':
        return (
          <TestCodeView
            code={generateCodeFromSteps()}
            onChange={handleCodeChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <TestCaseHeader
        testCaseName={testCaseName}
        description={description}
        viewMode={viewMode}
        onTestCaseNameChange={setTestCaseName}
        onDescriptionChange={setDescription}
        onViewModeChange={setViewMode}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          {/* Test Steps Panel */}
          <ResizablePanel defaultSize={70} minSize={50}>
            <div className="h-full flex flex-col">
              {renderMainContent()}
            </div>
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          {/* Properties Panel */}
          <ResizablePanel defaultSize={30} minSize={25}>
            <TestPropertiesPanel />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default TestCaseEditor;
