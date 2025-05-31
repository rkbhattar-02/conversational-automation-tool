
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { 
  ChevronDown, 
  ChevronRight, 
  Play, 
  Square, 
  Search,
  CheckSquare
} from 'lucide-react';

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
  isOpen?: boolean;
}

interface TestSelectionPanelProps {
  testSets: TestSet[];
  onTestSetsChange: (testSets: TestSet[]) => void;
  onRunSelected?: () => void;
  onClearSelection?: () => void;
}

const TestSelectionPanel: React.FC<TestSelectionPanelProps> = ({
  testSets,
  onTestSetsChange,
  onRunSelected,
  onClearSelection
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleTestSetSelection = (setId: string, checked: boolean) => {
    const updatedSets = testSets.map(set => {
      if (set.id === setId) {
        return {
          ...set,
          selected: checked,
          testCases: set.testCases.map(tc => ({ ...tc, selected: checked }))
        };
      }
      return set;
    });
    onTestSetsChange(updatedSets);
  };

  const handleTestCaseSelection = (setId: string, caseId: string, checked: boolean) => {
    const updatedSets = testSets.map(set => {
      if (set.id === setId) {
        const updatedTestCases = set.testCases.map(tc => 
          tc.id === caseId ? { ...tc, selected: checked } : tc
        );
        const allSelected = updatedTestCases.every(tc => tc.selected);
        
        return {
          ...set,
          selected: allSelected,
          testCases: updatedTestCases
        };
      }
      return set;
    });
    onTestSetsChange(updatedSets);
  };

  const handleTestSetToggle = (setId: string) => {
    const updatedSets = testSets.map(set =>
      set.id === setId ? { ...set, isOpen: !set.isOpen } : set
    );
    onTestSetsChange(updatedSets);
  };

  const getSelectedCount = () => {
    return testSets.reduce((total, set) => {
      return total + set.testCases.filter(tc => tc.selected).length;
    }, 0);
  };

  const filteredTestSets = testSets.map(set => ({
    ...set,
    testCases: set.testCases.filter(tc =>
      tc.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(set => 
    set.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    set.testCases.length > 0
  );

  const selectedCount = getSelectedCount();

  return (
    <Collapsible open={!isCollapsed} onOpenChange={setIsCollapsed}>
      <div className="border-b border-gray-200 pb-2 mb-2">
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-between p-2 h-auto font-medium text-sm"
          >
            <div className="flex items-center space-x-2">
              <span>Test Selection</span>
              {selectedCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {selectedCount}
                </Badge>
              )}
            </div>
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent className="space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search tests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 text-sm"
          />
        </div>

        {/* Action Buttons */}
        {selectedCount > 0 && (
          <div className="flex space-x-2">
            <Button
              size="sm"
              onClick={onRunSelected}
              className="flex-1 text-xs"
            >
              <Play className="h-3 w-3 mr-1" />
              Run ({selectedCount})
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onClearSelection}
              className="text-xs"
            >
              <Square className="h-3 w-3 mr-1" />
              Clear
            </Button>
          </div>
        )}

        {/* Test Sets and Cases */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredTestSets.map(testSet => (
            <div key={testSet.id} className="space-y-1">
              <div className="flex items-center space-x-2 p-1 hover:bg-gray-50 rounded">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 p-0"
                  onClick={() => handleTestSetToggle(testSet.id)}
                >
                  {testSet.isOpen ? 
                    <ChevronDown className="h-3 w-3" /> : 
                    <ChevronRight className="h-3 w-3" />
                  }
                </Button>
                <Checkbox
                  checked={testSet.selected}
                  onCheckedChange={(checked) => handleTestSetSelection(testSet.id, checked as boolean)}
                />
                <span className="font-medium text-sm flex-1">{testSet.name}</span>
                <Badge variant="outline" className="text-xs">
                  {testSet.testCases.filter(tc => tc.selected).length}/{testSet.testCases.length}
                </Badge>
              </div>
              
              {testSet.isOpen && (
                <div className="ml-8 space-y-1">
                  {testSet.testCases.map(testCase => (
                    <div key={testCase.id} className="flex items-center space-x-2 p-1 hover:bg-gray-50 rounded">
                      <Checkbox
                        checked={testCase.selected}
                        onCheckedChange={(checked) => handleTestCaseSelection(testSet.id, testCase.id, checked as boolean)}
                      />
                      <span className="text-sm text-gray-600 flex-1">{testCase.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredTestSets.length === 0 && searchTerm && (
          <div className="text-center py-4 text-gray-500 text-sm">
            No tests found matching "{searchTerm}"
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default TestSelectionPanel;
