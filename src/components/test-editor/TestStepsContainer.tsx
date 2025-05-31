
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import TestStepInput from './TestStepInput';

interface TestStep {
  id: string;
  content: string;
}

interface TestStepsContainerProps {
  steps: TestStep[];
  onStepsChange: (steps: TestStep[]) => void;
}

const TestStepsContainer: React.FC<TestStepsContainerProps> = ({
  steps,
  onStepsChange
}) => {
  const [focusedStepId, setFocusedStepId] = useState<string | null>(null);

  const addStep = (afterIndex?: number) => {
    const newStep: TestStep = {
      id: `step-${Date.now()}`,
      content: ''
    };
    
    const newSteps = [...steps];
    const insertIndex = afterIndex !== undefined ? afterIndex + 1 : steps.length;
    newSteps.splice(insertIndex, 0, newStep);
    
    onStepsChange(newSteps);
    setFocusedStepId(newStep.id);
  };

  const removeStep = (stepId: string) => {
    const stepIndex = steps.findIndex(s => s.id === stepId);
    if (stepIndex === -1) return;
    
    const newSteps = steps.filter(s => s.id !== stepId);
    onStepsChange(newSteps);
    
    // Focus previous step if available, otherwise next step
    if (newSteps.length > 0) {
      const focusIndex = Math.max(0, stepIndex - 1);
      if (newSteps[focusIndex]) {
        setFocusedStepId(newSteps[focusIndex].id);
      }
    }
  };

  const updateStep = (stepId: string, content: string) => {
    const newSteps = steps.map(step =>
      step.id === stepId ? { ...step, content } : step
    );
    onStepsChange(newSteps);
  };

  const handleStepEnter = (stepId: string) => {
    const stepIndex = steps.findIndex(s => s.id === stepId);
    addStep(stepIndex);
  };

  const handleStepBackspace = (stepId: string) => {
    const step = steps.find(s => s.id === stepId);
    if (step && step.content === '') {
      removeStep(stepId);
    }
  };

  // Ensure we have at least one step
  if (steps.length === 0) {
    React.useEffect(() => {
      addStep();
    }, []);
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Test Steps</h3>
        <Button 
          onClick={() => addStep()} 
          size="sm" 
          className="flex items-center space-x-1"
        >
          <Plus className="h-4 w-4" />
          <span>Add Step</span>
        </Button>
      </div>
      
      {/* Steps List */}
      <div className="flex-1 overflow-auto p-4 space-y-3">
        {steps.map((step, index) => (
          <div key={step.id} className="relative group">
            <TestStepInput
              stepNumber={index + 1}
              value={step.content}
              onChange={(content) => updateStep(step.id, content)}
              onEnter={() => handleStepEnter(step.id)}
              onBackspace={() => handleStepBackspace(step.id)}
              onFocus={() => setFocusedStepId(step.id)}
              autoFocus={focusedStepId === step.id}
            />
            
            {/* Delete Button */}
            {steps.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:bg-red-100"
                onClick={() => removeStep(step.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
      
      {/* Footer with Add Step Button */}
      <div className="p-4 border-t border-gray-100">
        <Button
          variant="outline"
          onClick={() => addStep()}
          className="w-full flex items-center justify-center space-x-2 text-gray-600 hover:text-blue-600 hover:border-blue-300"
        >
          <Plus className="h-4 w-4" />
          <span>Add Step</span>
        </Button>
      </div>
      
      {/* Keyboard Shortcuts Help */}
      <div className="px-4 pb-4">
        <div className="text-xs text-gray-500 space-y-1">
          <div>• <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Enter</kbd> - Add new step</div>
          <div>• <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Backspace</kbd> - Delete empty step</div>
          <div>• <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Ctrl + Space</kbd> - Show suggestions</div>
        </div>
      </div>
    </div>
  );
};

export default TestStepsContainer;
