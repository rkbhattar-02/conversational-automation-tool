
import React, { useEffect } from 'react';
import Editor from '@monaco-editor/react';
import * as monaco from 'monaco-editor';

interface MonacoEditorProps {
  value: string;
  language: string;
  onChange: (value: string | undefined) => void;
  height?: string;
}

const MonacoEditor: React.FC<MonacoEditorProps> = ({ 
  value, 
  language, 
  onChange, 
  height = '100%' 
}) => {
  useEffect(() => {
    // Register custom language for test automation syntax
    monaco.languages.register({ id: 'custom' });
    
    // Define syntax highlighting rules
    monaco.languages.setMonarchTokensProvider('custom', {
      tokenizer: {
        root: [
          // Keywords (Actions) - Blue
          [/\b(Launch|Navigate|Click|Input|Select|Verify|Wait|If|Then|Else|Loop|Call|Screenshot)\b/, 'keyword'],
          
          // Objects - Purple
          [/\b[A-Z][a-zA-Z0-9_]*(?:Field|Button|Link|Image|Text|List|Menu|Dialog|Page|Form)\b/, 'type'],
          
          // Parameters in quotes - Green
          [/"[^"]*"/, 'string'],
          [/'[^']*'/, 'string'],
          
          // Comments
          [/\/\/.*$/, 'comment'],
          [/\/\*/, 'comment', '@comment'],
          
          // Numbers
          [/\d+/, 'number'],
        ],
        
        comment: [
          [/[^\/*]+/, 'comment'],
          [/\*\//, 'comment', '@pop'],
          [/[\/*]/, 'comment']
        ],
      },
    });
    
    // Define custom theme
    monaco.editor.defineTheme('testAutomationTheme', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: '2196F3', fontStyle: 'bold' }, // Blue
        { token: 'type', foreground: '9C27B0', fontStyle: 'bold' },    // Purple
        { token: 'string', foreground: '4CAF50' },                     // Green
        { token: 'comment', foreground: '757575', fontStyle: 'italic' }, // Gray
        { token: 'number', foreground: 'FF9800' },                     // Orange
      ],
      colors: {
        'editor.background': '#ffffff',
        'editor.foreground': '#333333',
        'editorLineNumber.foreground': '#999999',
        'editor.selectionBackground': '#E3F2FD',
        'editor.lineHighlightBackground': '#F5F5F5',
      }
    });
    
    // Set custom theme
    monaco.editor.setTheme('testAutomationTheme');
  }, []);

  const handleEditorDidMount = (editor: any) => {
    // Configure editor options
    editor.updateOptions({
      minimap: { enabled: true },
      lineNumbers: 'on',
      roundedSelection: false,
      scrollBeyondLastLine: false,
      automaticLayout: true,
      fontSize: 14,
      fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
      tabSize: 2,
      insertSpaces: true,
      wordWrap: 'on',
      contextmenu: true,
      mouseWheelZoom: true,
    });
  };

  return (
    <Editor
      height={height}
      language={language}
      value={value}
      onChange={onChange}
      onMount={handleEditorDidMount}
      options={{
        theme: 'testAutomationTheme',
        automaticLayout: true,
        scrollBeyondLastLine: false,
        minimap: { enabled: true },
        fontSize: 14,
        fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
      }}
    />
  );
};

export default MonacoEditor;
