
import React from 'react';
import { Label } from '@/components/ui/label';

const TestPropertiesPanel: React.FC = () => {
  return (
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
            <div><kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Tab</kbd> - Navigate steps</div>
            <div><kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Ctrl+Space</kbd> - Suggestions</div>
            <div><kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">↑↓</kbd> - Navigate suggestions</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPropertiesPanel;
