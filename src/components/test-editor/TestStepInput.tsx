
import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import SuggestionPopover from './SuggestionPopover';

interface TestStepInputProps {
  stepNumber: number;
  value: string;
  onChange: (value: string) => void;
  onEnter: () => void;
  onBackspace: () => void;
  onFocus?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}

const TestStepInput: React.FC<TestStepInputProps> = ({
  stepNumber,
  value,
  onChange,
  onEnter,
  onBackspace,
  onFocus,
  placeholder = "Type a test step...",
  autoFocus = false
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionType, setSuggestionType] = useState<'action' | 'object'>('action');
  const [searchTerm, setSearchTerm] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle Ctrl+Space for suggestions
    if (e.ctrlKey && e.code === 'Space') {
      e.preventDefault();
      triggerSuggestions();
      return;
    }

    // Don't handle other keys if suggestions are open
    if (showSuggestions) {
      return;
    }

    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        onEnter();
        break;
      case 'Backspace':
        if (value === '') {
          e.preventDefault();
          onBackspace();
        }
        break;
      case 'Tab':
        e.preventDefault();
        // Focus next step (handled by parent)
        break;
    }
  };

  const triggerSuggestions = () => {
    if (!inputRef.current) return;

    const cursorPos = inputRef.current.selectionStart || 0;
    const textBeforeCursor = value.substring(0, cursorPos);
    const words = textBeforeCursor.split(' ');
    const currentWord = words[words.length - 1];
    
    // Determine suggestion type based on context
    if (words.length === 1) {
      // First word - likely an action
      setSuggestionType('action');
      setSearchTerm(currentWord);
    } else {
      // Subsequent words - likely an object
      setSuggestionType('object');
      setSearchTerm(currentWord);
    }
    
    setCursorPosition(cursorPos);
    setShowSuggestions(true);
  };

  const handleSuggestionSelect = (suggestion: string) => {
    if (!inputRef.current) return;

    const cursorPos = cursorPosition;
    const textBeforeCursor = value.substring(0, cursorPos);
    const textAfterCursor = value.substring(cursorPos);
    const words = textBeforeCursor.split(' ');
    
    // Replace the current word with the suggestion
    words[words.length - 1] = suggestion;
    const newTextBefore = words.join(' ');
    const newValue = newTextBefore + textAfterCursor;
    
    onChange(newValue);
    setShowSuggestions(false);
    
    // Set cursor position after the inserted suggestion
    setTimeout(() => {
      if (inputRef.current) {
        const newCursorPos = newTextBefore.length;
        inputRef.current.setSelectionRange(newCursorPos, newCursorPos);
        inputRef.current.focus();
      }
    }, 0);
  };

  return (
    <div className="flex items-center space-x-3 group">
      {/* Step Number */}
      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium flex-shrink-0">
        {stepNumber}
      </div>
      
      {/* Step Input */}
      <div className="flex-1">
        <SuggestionPopover
          isOpen={showSuggestions}
          onOpenChange={setShowSuggestions}
          onSelect={handleSuggestionSelect}
          searchTerm={searchTerm}
          suggestionType={suggestionType}
        >
          <Input
            ref={inputRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={onFocus}
            placeholder={placeholder}
            className="font-mono text-sm border-gray-200 focus:border-blue-500 transition-colors"
          />
        </SuggestionPopover>
      </div>
      
      {/* Hint */}
      <div className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        Ctrl+Space for suggestions
      </div>
    </div>
  );
};

export default TestStepInput;
