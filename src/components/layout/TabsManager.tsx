
/**
 * TabsManager Component
 * 
 * Purpose: Right sidebar component that manages tabbed interfaces for additional tools,
 * documentation, AI assistance, and workspace utilities. Provides context-sensitive
 * tools based on current workspace and user activity.
 * 
 * Interaction Rules:
 * - Receives currentWorkspace prop to show workspace-specific tools and information
 * - Manages multiple tab states (AI Assistant, Documentation, Tools, etc.)
 * - Provides contextual help and AI assistance based on current page/activity
 * - Shows workspace-specific tools and utilities
 * - Integrates with AI agent for intelligent assistance
 * - Displays real-time information about test execution and workspace status
 * 
 * Tab Categories:
 * 1. AI Assistant - Intelligent help and code generation
 * 2. Documentation - Context-sensitive help and guides
 * 3. Tools - Workspace utilities and quick actions
 * 4. Inspector - Element inspection and object repository tools
 * 5. Console - Logs, output, and debugging information
 * 
 * State Management:
 * - activeTab: Currently selected tab in the sidebar
 * - AI conversation history and context
 * - Tool configurations and preferences
 * - Real-time data from workspace operations
 * 
 * Component Hierarchy:
 * AppLayout → TabsManager → [AIAssistant, Documentation, Tools, Inspector, Console]
 * 
 * Integration Points:
 * - AI service for intelligent assistance
 * - Workspace service for tools and utilities
 * - Test execution service for real-time feedback
 * - Documentation service for contextual help
 * 
 * Dependencies:
 * - Uses shadcn/ui Tabs component for tab management
 * - Integrates with AI service for assistance features
 * - Uses workspace context for relevant tools and information
 * 
 * Props:
 * - currentWorkspace: Current workspace data for context-sensitive features
 */

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Bot,
  BookOpen,
  Wrench,
  Search,
  Terminal,
  Send,
  Lightbulb,
  FileText,
  Settings,
  Play,
  AlertCircle
} from 'lucide-react';
import { type Workspace } from '@/services/api/workspace-service';

interface TabsManagerProps {
  currentWorkspace?: Workspace | null;
}

const TabsManager: React.FC<TabsManagerProps> = ({ currentWorkspace }) => {
  const [activeTab, setActiveTab] = useState('ai');
  const [aiMessage, setAiMessage] = useState('');
  const [conversationHistory, setConversationHistory] = useState<Array<{
    type: 'user' | 'ai';
    message: string;
    timestamp: Date;
  }>>([]);

  // Handle AI message sending
  const handleSendMessage = () => {
    if (!aiMessage.trim()) return;
    
    const newMessage = {
      type: 'user' as const,
      message: aiMessage,
      timestamp: new Date()
    };
    
    setConversationHistory(prev => [...prev, newMessage]);
    setAiMessage('');
    
    // Simulate AI response (in real app, this would call AI service)
    setTimeout(() => {
      const aiResponse = {
        type: 'ai' as const,
        message: `I understand you want help with: "${aiMessage}". How can I assist you with your test automation?`,
        timestamp: new Date()
      };
      setConversationHistory(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const tabConfig = [
    {
      id: 'ai',
      label: 'AI Assistant',
      icon: Bot,
      badge: conversationHistory.length > 0 ? 'Active' : null
    },
    {
      id: 'docs',
      label: 'Documentation',
      icon: BookOpen,
      badge: null
    },
    {
      id: 'tools',
      label: 'Tools',
      icon: Wrench,
      badge: 'Beta'
    },
    {
      id: 'inspector',
      label: 'Inspector',
      icon: Search,
      badge: null
    },
    {
      id: 'console',
      label: 'Console',
      icon: Terminal,
      badge: '3'
    }
  ];

  return (
    <div className="h-full bg-white border-l border-gray-200 flex flex-col">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        {/* Tab Headers */}
        <div className="border-b border-gray-200 p-2">
          <TabsList className="grid grid-cols-5 w-full h-auto">
            {tabConfig.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger 
                  key={tab.id} 
                  value={tab.id}
                  className="flex flex-col items-center p-2 text-xs relative"
                >
                  <Icon className="h-4 w-4 mb-1" />
                  <span className="hidden lg:block">{tab.label}</span>
                  {tab.badge && (
                    <Badge variant="secondary" className="absolute -top-1 -right-1 text-xs h-4 px-1">
                      {tab.badge}
                    </Badge>
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-hidden">
          {/* AI Assistant Tab */}
          <TabsContent value="ai" className="h-full flex flex-col m-0">
            <div className="p-3 border-b border-gray-200">
              <h3 className="font-semibold text-sm flex items-center">
                <Bot className="h-4 w-4 mr-2 text-blue-600" />
                AI Assistant
              </h3>
              <p className="text-xs text-gray-600 mt-1">
                Get help with test automation and code generation
              </p>
            </div>
            
            <ScrollArea className="flex-1 p-3">
              <div className="space-y-3">
                {/* Quick Actions */}
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                    <Lightbulb className="h-3 w-3 mr-2" />
                    Generate test case
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                    <FileText className="h-3 w-3 mr-2" />
                    Explain this code
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                    <Settings className="h-3 w-3 mr-2" />
                    Optimize tests
                  </Button>
                </div>
                
                <Separator />
                
                {/* Conversation History */}
                <div className="space-y-2">
                  {conversationHistory.map((entry, index) => (
                    <div 
                      key={index}
                      className={`p-2 rounded text-xs ${
                        entry.type === 'user' 
                          ? 'bg-blue-50 text-blue-900 ml-4' 
                          : 'bg-gray-50 text-gray-900 mr-4'
                      }`}
                    >
                      {entry.message}
                    </div>
                  ))}
                </div>
              </div>
            </ScrollArea>
            
            {/* Message Input */}
            <div className="p-3 border-t border-gray-200">
              <div className="flex space-x-2">
                <Input
                  placeholder="Ask AI for help..."
                  value={aiMessage}
                  onChange={(e) => setAiMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="text-xs"
                />
                <Button size="icon" onClick={handleSendMessage} className="h-8 w-8">
                  <Send className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Documentation Tab */}
          <TabsContent value="docs" className="h-full m-0">
            <div className="p-3 border-b border-gray-200">
              <h3 className="font-semibold text-sm flex items-center">
                <BookOpen className="h-4 w-4 mr-2 text-green-600" />
                Documentation
              </h3>
            </div>
            <ScrollArea className="flex-1 p-3">
              <div className="space-y-3 text-xs">
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Getting Started</h4>
                  <Button variant="ghost" className="w-full justify-start p-2 h-auto">
                    <span>Quick Start Guide</span>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start p-2 h-auto">
                    <span>Writing Your First Test</span>
                  </Button>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">API Reference</h4>
                  <Button variant="ghost" className="w-full justify-start p-2 h-auto">
                    <span>Test Commands</span>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start p-2 h-auto">
                    <span>Object Repository</span>
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Tools Tab */}
          <TabsContent value="tools" className="h-full m-0">
            <div className="p-3 border-b border-gray-200">
              <h3 className="font-semibold text-sm flex items-center">
                <Wrench className="h-4 w-4 mr-2 text-orange-600" />
                Tools
              </h3>
            </div>
            <ScrollArea className="flex-1 p-3">
              <div className="space-y-3 text-xs">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Play className="h-3 w-3 mr-2" />
                  Run All Tests
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Settings className="h-3 w-3 mr-2" />
                  Test Configuration
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <FileText className="h-3 w-3 mr-2" />
                  Generate Report
                </Button>
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Inspector Tab */}
          <TabsContent value="inspector" className="h-full m-0">
            <div className="p-3 border-b border-gray-200">
              <h3 className="font-semibold text-sm flex items-center">
                <Search className="h-4 w-4 mr-2 text-purple-600" />
                Inspector
              </h3>
            </div>
            <ScrollArea className="flex-1 p-3">
              <div className="text-xs text-gray-600 text-center py-8">
                <Search className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p>Element inspector coming soon</p>
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Console Tab */}
          <TabsContent value="console" className="h-full m-0">
            <div className="p-3 border-b border-gray-200">
              <h3 className="font-semibold text-sm flex items-center">
                <Terminal className="h-4 w-4 mr-2 text-gray-600" />
                Console
              </h3>
            </div>
            <ScrollArea className="flex-1 p-3">
              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-3 w-3 text-red-500 mt-0.5" />
                  <span className="text-red-600">Error: Test case 'login-test' failed</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="h-3 w-3 bg-green-500 rounded-full mt-0.5"></div>
                  <span className="text-green-600">Success: Test case 'product-search' passed</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="h-3 w-3 bg-blue-500 rounded-full mt-0.5"></div>
                  <span className="text-blue-600">Info: Starting test execution...</span>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default TabsManager;
