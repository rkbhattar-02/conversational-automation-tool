
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Plus, Trash2, Copy } from 'lucide-react';

interface TestStep {
  id: string;
  stepNumber: number;
  action: string;
  object: string;
  parameters: string;
  status?: 'passed' | 'failed' | 'running' | 'pending';
  selected?: boolean;
}

interface TestTableViewProps {
  steps: TestStep[];
  selectedSteps: string[];
  onStepSelection: (stepId: string, checked: boolean) => void;
  onAddStep: () => void;
  onDeleteStep: (id: string) => void;
  onUpdateStep: (id: string, field: keyof TestStep, value: string) => void;
}

const TestTableView: React.FC<TestTableViewProps> = ({
  steps,
  selectedSteps,
  onStepSelection,
  onAddStep,
  onDeleteStep,
  onUpdateStep
}) => {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'passed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'running': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex-1 overflow-hidden bg-white">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Test Steps</h3>
        <Button onClick={onAddStep} size="sm" className="flex items-center space-x-1">
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
                    onCheckedChange={(checked) => onStepSelection(step.id, checked as boolean)}
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
                    onChange={(e) => onUpdateStep(step.id, 'action', e.target.value)}
                    className="text-blue-600 font-medium"
                    placeholder="Action..."
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={step.object}
                    onChange={(e) => onUpdateStep(step.id, 'object', e.target.value)}
                    className="text-purple-600 font-medium"
                    placeholder="Object name..."
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={step.parameters}
                    onChange={(e) => onUpdateStep(step.id, 'parameters', e.target.value)}
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
                      onClick={() => onDeleteStep(step.id)}
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
  );
};

export default TestTableView;
