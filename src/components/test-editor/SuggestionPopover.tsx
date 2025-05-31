
import React, { useState, useEffect } from 'react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { TEST_ACTIONS, PAGE_OBJECTS, getActionSuggestions, getObjectSuggestions, type TestAction } from './ActionLibrary';

interface SuggestionPopoverProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (suggestion: string) => void;
  searchTerm: string;
  suggestionType: 'action' | 'object';
  children: React.ReactNode;
}

const SuggestionPopover: React.FC<SuggestionPopoverProps> = ({
  isOpen,
  onOpenChange,
  onSelect,
  searchTerm,
  suggestionType,
  children
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [suggestions, setSuggestions] = useState<(TestAction | string)[]>([]);

  useEffect(() => {
    if (suggestionType === 'action') {
      setSuggestions(getActionSuggestions(searchTerm));
    } else {
      setSuggestions(getObjectSuggestions(searchTerm));
    }
    setSelectedIndex(0);
  }, [searchTerm, suggestionType]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (suggestions[selectedIndex]) {
          const suggestion = suggestions[selectedIndex];
          const value = typeof suggestion === 'string' ? suggestion : suggestion.syntax;
          onSelect(value);
          onOpenChange(false);
        }
        break;
      case 'Escape':
        e.preventDefault();
        onOpenChange(false);
        break;
    }
  };

  const renderActionItem = (action: TestAction, index: number) => (
    <CommandItem
      key={action.name}
      value={action.name}
      onSelect={() => {
        onSelect(action.syntax);
        onOpenChange(false);
      }}
      className={`cursor-pointer ${index === selectedIndex ? 'bg-accent' : ''}`}
    >
      <div className="flex flex-col w-full">
        <div className="flex items-center justify-between">
          <span className="font-mono text-blue-600 font-medium">{action.name}</span>
          <Badge variant="outline" className="text-xs">
            {action.category}
          </Badge>
        </div>
        <span className="text-sm text-gray-600">{action.description}</span>
        <span className="text-xs font-mono text-green-600 mt-1">{action.syntax}</span>
      </div>
    </CommandItem>
  );

  const renderObjectItem = (object: string, index: number) => (
    <CommandItem
      key={object}
      value={object}
      onSelect={() => {
        onSelect(object);
        onOpenChange(false);
      }}
      className={`cursor-pointer ${index === selectedIndex ? 'bg-accent' : ''}`}
    >
      <div className="flex items-center justify-between w-full">
        <span className="font-mono text-purple-600 font-medium">{object}</span>
        <Badge variant="outline" className="text-xs">
          {object.includes('Button') ? 'button' : 
           object.includes('Input') || object.includes('Field') ? 'input' :
           object.includes('Link') ? 'link' :
           object.includes('Menu') ? 'menu' : 'element'}
        </Badge>
      </div>
    </CommandItem>
  );

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent 
        className="w-96 p-0" 
        side="bottom" 
        align="start"
        onKeyDown={handleKeyDown}
      >
        <Command>
          <CommandInput 
            placeholder={`Search ${suggestionType}s...`}
            value={searchTerm}
            readOnly
          />
          <CommandList className="max-h-64">
            <CommandEmpty>
              No {suggestionType}s found.
            </CommandEmpty>
            <CommandGroup heading={suggestionType === 'action' ? 'Actions' : 'Page Objects'}>
              {suggestions.map((suggestion, index) => 
                typeof suggestion === 'string' 
                  ? renderObjectItem(suggestion, index)
                  : renderActionItem(suggestion, index)
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SuggestionPopover;
