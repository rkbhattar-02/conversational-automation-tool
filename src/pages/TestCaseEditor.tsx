
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowLeft,
  Save,
  Plus,
  FileText
} from 'lucide-react';
import { type Workspace } from '@/services/api/workspace-service';

interface TestCaseEditorProps {
  currentWorkspace?: Workspace | null;
  testCaseId?: string;
  testCaseName?: string;
  onBack?: () => void;
}

interface TestStep {
  id: string;
  content: string;
}

// Store test case data separately for each test case
const testCaseData: Record<string, { name: string; steps: TestStep[] }> = {};

const TestCaseEditor: React.FC<TestCaseEditorProps> = ({ 
  currentWorkspace, 
  testCaseId,
  testCaseName: initialTestCaseName = 'New Test Case',
  onBack 
}) => {
  const [testCaseName, setTestCaseName] = useState(initialTestCaseName);
  const [steps, setSteps] = useState<TestStep[]>([
    { id: 'step-1', content: '' }
  ]);
  const [focusedStepId, setFocusedStepId] = useState<string>('step-1');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>();
  const stepRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Load test case data when testCaseId changes
  useEffect(() => {
    if (testCaseId) {
      const savedData = testCaseData[testCaseId];
      if (savedData) {
        setTestCaseName(savedData.name);
        setSteps(savedData.steps);
        if (savedData.steps.length > 0) {
          setFocusedStepId(savedData.steps[0].id);
        }
      } else {
        // Initialize new test case with default values
        setTestCaseName(initialTestCaseName);
        const defaultSteps = [{ id: `step-${Date.now()}`, content: '' }];
        setSteps(defaultSteps);
        setFocusedStepId(defaultSteps[0].id);
        testCaseData[testCaseId] = {
          name: initialTestCaseName,
          steps: defaultSteps
        };
      }
      setHasUnsavedChanges(false);
    }
  }, [testCaseId, initialTestCaseName]);

  // Update test case name when prop changes (but don't override saved data)
  useEffect(() => {
    if (!testCaseId || !testCaseData[testCaseId]) {
      setTestCaseName(initialTestCaseName);
    }
  }, [initialTestCaseName, testCaseId]);

  // Save to local storage whenever data changes
  useEffect(() => {
    if (testCaseId && (testCaseName || steps.length > 0)) {
      testCaseData[testCaseId] = {
        name: testCaseName,
        steps: steps
      };
    }
  }, [testCaseId, testCaseName, steps]);

  // Auto-save functionality
  useEffect(() => {
    if (hasUnsavedChanges) {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
      
      autoSaveTimeoutRef.current = setTimeout(() => {
        handleAutoSave();
      }, 5000);
    }

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [hasUnsavedChanges, steps]);

  // Focus management
  useEffect(() => {
    if (focusedStepId && stepRefs.current[focusedStepId]) {
      stepRefs.current[focusedStepId]?.focus();
    }
  }, [focusedStepId]);

  const handleAutoSave = async () => {
    setIsSaving(true);
    try {
      // Simulate auto-save
      await new Promise(resolve => setTimeout(resolve, 500));
      setHasUnsavedChanges(false);
      console.log('Auto-saved test case:', { testCaseId, testCaseName, steps });
    } catch (error) {
      console.error('Auto-save failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleManualSave = async () => {
    setIsSaving(true);
    try {
      // Simulate manual save
      await new Promise(resolve => setTimeout(resolve, 800));
      setHasUnsavedChanges(false);
      console.log('Manually saved test case:', { testCaseId, testCaseName, steps });
    } catch (error) {
      console.error('Manual save failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const updateStep = (stepId: string, content: string) => {
    setSteps(prevSteps => 
      prevSteps.map(step =>
        step.id === stepId ? { ...step, content } : step
      )
    );
    setHasUnsavedChanges(true);
  };

  const addStep = (afterStepId?: string) => {
    const newStepId = `step-${Date.now()}`;
    const newStep: TestStep = {
      id: newStepId,
      content: ''
    };

    if (afterStepId) {
      const stepIndex = steps.findIndex(step => step.id === afterStepId);
      const newSteps = [...steps];
      newSteps.splice(stepIndex + 1, 0, newStep);
      setSteps(newSteps);
    } else {
      setSteps(prevSteps => [...prevSteps, newStep]);
    }

    setFocusedStepId(newStepId);
    setHasUnsavedChanges(true);
  };

  const removeStep = (stepId: string) => {
    if (steps.length === 1) return; // Don't remove the last step

    const stepIndex = steps.findIndex(step => step.id === stepId);
    const newSteps = steps.filter(step => step.id !== stepId);
    setSteps(newSteps);

    // Focus previous step or next step
    if (newSteps.length > 0) {
      const focusIndex = Math.max(0, stepIndex - 1);
      setFocusedStepId(newSteps[focusIndex].id);
    }

    setHasUnsavedChanges(true);
  };

  const handleKeyDown = (stepId: string, event: React.KeyboardEvent<HTMLInputElement>) => {
    const stepIndex = steps.findIndex(step => step.id === stepId);
    const isLastStep = stepIndex === steps.length - 1;
    const currentStep = steps[stepIndex];

    switch (event.key) {
      case 'Enter':
        event.preventDefault();
        // Only create new step if this is the last step
        if (isLastStep) {
          addStep(stepId);
        }
        break;

      case 'Backspace':
        // If the step is empty and it's not the only step, remove it
        if (currentStep.content === '' && steps.length > 1) {
          event.preventDefault();
          removeStep(stepId);
        }
        break;

      case 'ArrowUp':
        event.preventDefault();
        if (stepIndex > 0) {
          setFocusedStepId(steps[stepIndex - 1].id);
        }
        break;

      case 'ArrowDown':
        event.preventDefault();
        if (stepIndex < steps.length - 1) {
          setFocusedStepId(steps[stepIndex + 1].id);
        }
        break;
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {onBack && (
              <Button variant="ghost" size="icon" onClick={onBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <Input
                value={testCaseName}
                onChange={(e) => {
                  setTestCaseName(e.target.value);
                  setHasUnsavedChanges(true);
                }}
                className="text-lg font-semibold border-none bg-transparent p-0 h-auto focus:ring-0"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {hasUnsavedChanges && (
              <span className="text-sm text-amber-600">Unsaved changes</span>
            )}
            {isSaving && (
              <span className="text-sm text-blue-600">Saving...</span>
            )}
            <Button 
              onClick={handleManualSave}
              disabled={isSaving}
              size="sm"
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </div>

      {/* Test Steps Editor */}
      <div className="flex-1 overflow-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Test Steps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium flex-shrink-0">
                  {index + 1}
                </div>
                <Input
                  ref={(el) => {
                    stepRefs.current[step.id] = el;
                  }}
                  value={step.content}
                  onChange={(e) => updateStep(step.id, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(step.id, e)}
                  onFocus={() => setFocusedStepId(step.id)}
                  placeholder="Enter test step..."
                  className="flex-1 font-mono text-sm"
                />
              </div>
            ))}
            
            {/* Add Step Button */}
            <div className="flex justify-center pt-4">
              <Button
                variant="outline"
                onClick={() => addStep()}
                className="flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Step</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Keyboard Shortcuts:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <kbd className="px-1 py-0.5 bg-blue-200 rounded text-xs">Enter</kbd> - Add new step (only at the last step)</li>
            <li>• <kbd className="px-1 py-0.5 bg-blue-200 rounded text-xs">Backspace</kbd> - Delete empty step</li>
            <li>• <kbd className="px-1 py-0.5 bg-blue-200 rounded text-xs">↑/↓</kbd> - Navigate between steps</li>
            <li>• Auto-save occurs after 5 seconds of inactivity</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TestCaseEditor;
