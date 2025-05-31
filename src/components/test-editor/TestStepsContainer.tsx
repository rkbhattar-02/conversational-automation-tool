
import React, { useState, useCallback } from 'react';
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

  const addStep = useCallback((afterIndex?: number) => {
    const newStep: TestStep = {
      id: `step-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      content: ''
    };
    
    const newSteps = [...steps];
    const insertIndex = afterIndex !== undefined ? afterIndex + 1 : steps.length;
    newSteps.splice(insertIndex, 0, newStep);
    
    onStepsChange(newSteps);
    setFocusedStepId(newStep.id);
  }, [steps, onStepsChange]);

  const removeStep = useCallback((stepId: string) => {
    const stepIndex = steps.findIndex(s => s.id === stepId);
    if (stepIndex === -1) return;
    
    // Prevent deletion of the last step
    if (steps.length === 1) return;
    
    const newSteps = steps.filter(s => s.id !== stepId);
    onStepsChange(newSteps);
    
    // Focus previous step if available, otherwise next step
    if (newSteps.length > 0) {
      const focusIndex = Math.max(0, stepIndex - 1);
      if (newSteps[focusIndex]) {
        setFocusedStepId(newSteps[focusIndex].id);
      }
    }
  }, [steps, onStepsChange]);

  const updateStep = useCallback((stepId: string, content: string) => {
    const newSteps = steps.map(step =>
      step.id === stepId ? { ...step, content } : step
    );
    onStepsChange(newSteps);
  }, [steps, onStepsChange]);

  const handleStepEnter = useCallback((stepId: string) => {
    const stepIndex = steps.findIndex(s => s.id === stepId);
    addStep(stepIndex);
  }, [steps, addStep]);

  const handleStepBackspace = useCallback((stepId: string) => {
    const step = steps.find(s => s.id === stepId);
    if (step && step.content === '') {
      removeStep(stepId);
    }
  }, [steps, removeStep]);

  const handleStepTab = useCallback((stepId: string, direction: 'forward' | 'backward') => {
    const currentIndex = steps.findIndex(s => s.id === stepId);
    if (currentIndex === -1) return;

    let targetIndex;
    if (direction === 'forward') {
      targetIndex = currentIndex + 1;
      // If at last step, create new step
      if (targetIndex >= steps.length) {
        addStep(currentIndex);
        return;
      }
    } else {
      targetIndex = currentIndex - 1;
      if (targetIndex < 0) return;
    }

    if (steps[targetIndex]) {
      setFocusedStepId(steps[targetIndex].id);
    }
  }, [steps, addStep]);

  // Ensure we have at least one step
  React.useEffect(() => {
    if (steps.length === 0) {
      addStep();
    }
  }, [steps.length, addStep]);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Test Steps</h3>
        <Button 
          onClick={() => addStep()} 
          size="sm" 
          className="flex items-center space-x-1 hover:scale-105 transition-transform"
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
              onTab={(direction) => handleStepTab(step.id, direction)}
              onFocus={() => setFocusedStepId(step.id)}
              autoFocus={focusedStepId === step.id}
              isLastStep={index === steps.length - 1}
            />
            
            {/* Delete Button - only show if more than one step */}
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
          className="w-full flex items-center justify-center space-x-2 text-gray-600 hover:text-blue-600 hover:border-blue-300 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Step</span>
        </Button>
      </div>
      
      {/* Enhanced Keyboard Shortcuts Help */}
      <div className="px-4 pb-4">
        <div className="text-xs text-gray-500 space-y-1">
          <div>• <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Enter</kbd> - Add new step</div>
          <div>• <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Backspace</kbd> - Delete empty step</div>
          <div>• <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Tab</kbd> - Navigate between steps</div>
          <div>• <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Ctrl + Space</kbd> - Show suggestions</div>
        </div>
      </div>
    </div>
  );
};

export default TestStepsContainer;
