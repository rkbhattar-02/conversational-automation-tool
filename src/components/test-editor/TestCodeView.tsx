
import React from 'react';
import MonacoEditor from '../../pages/components/MonacoEditor';

interface TestCodeViewProps {
  code: string;
  onChange: (code: string) => void;
}

const TestCodeView: React.FC<TestCodeViewProps> = ({
  code,
  onChange
}) => {
  return (
    <div className="flex-1 bg-white">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold">Code View</h3>
      </div>
      <div className="h-full">
        <MonacoEditor
          value={code}
          language="custom"
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default TestCodeView;
