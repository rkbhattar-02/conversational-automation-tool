
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Database,
  Search,
  ChevronDown,
  ChevronRight,
  Settings,
  FileText,
  Activity,
  Brain
} from 'lucide-react';

interface RightSidebarProps {
  isOpen: boolean;
}

const RightSidebar: React.FC<RightSidebarProps> = ({ isOpen }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [objectsExpanded, setObjectsExpanded] = useState(true);
  const [dataExpanded, setDataExpanded] = useState(false);

  if (!isOpen) {
    return (
      <div className="w-12 border-l border-gray-200 bg-gray-50 flex flex-col items-center py-4">
        <Button variant="ghost" size="icon" className="mb-2">
          <Database className="h-5 w-5" />
        </Button>
      </div>
    );
  }

  return (
    <div className="w-80 border-l border-gray-200 bg-gray-50">
      <Tabs defaultValue="objects" className="h-full flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="objects" className="text-xs">
              <Database className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="properties" className="text-xs">
              <Settings className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="logs" className="text-xs">
              <FileText className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="ai" className="text-xs">
              <Brain className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="objects" className="h-full p-4 mt-0">
            <div className="space-y-4 h-full flex flex-col">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Object Repository</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search objects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-8 text-sm"
                  />
                </div>
              </div>

              <div className="flex-1 space-y-2 overflow-y-auto">
                <Collapsible open={objectsExpanded} onOpenChange={setObjectsExpanded}>
                  <CollapsibleTrigger className="flex items-center w-full p-2 hover:bg-gray-100 rounded-md">
                    {objectsExpanded ? (
                      <ChevronDown className="h-4 w-4 mr-2" />
                    ) : (
                      <ChevronRight className="h-4 w-4 mr-2" />
                    )}
                    <span className="text-sm font-medium">Login Page Objects</span>
                    <Badge variant="secondary" className="ml-auto">12</Badge>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="ml-6 space-y-1">
                    <div className="p-2 text-sm hover:bg-gray-100 rounded cursor-pointer">
                      UsernameField
                    </div>
                    <div className="p-2 text-sm hover:bg-gray-100 rounded cursor-pointer">
                      PasswordField
                    </div>
                    <div className="p-2 text-sm hover:bg-gray-100 rounded cursor-pointer">
                      LoginButton
                    </div>
                    <div className="p-2 text-sm hover:bg-gray-100 rounded cursor-pointer">
                      ForgotPasswordLink
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                <Collapsible open={dataExpanded} onOpenChange={setDataExpanded}>
                  <CollapsibleTrigger className="flex items-center w-full p-2 hover:bg-gray-100 rounded-md">
                    {dataExpanded ? (
                      <ChevronDown className="h-4 w-4 mr-2" />
                    ) : (
                      <ChevronRight className="h-4 w-4 mr-2" />
                    )}
                    <span className="text-sm font-medium">Shopping Cart Objects</span>
                    <Badge variant="secondary" className="ml-auto">8</Badge>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="ml-6 space-y-1">
                    <div className="p-2 text-sm hover:bg-gray-100 rounded cursor-pointer">
                      AddToCartButton
                    </div>
                    <div className="p-2 text-sm hover:bg-gray-100 rounded cursor-pointer">
                      CartIcon
                    </div>
                    <div className="p-2 text-sm hover:bg-gray-100 rounded cursor-pointer">
                      CartItemsList
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="properties" className="h-full p-4 mt-0">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Properties</h3>
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-white rounded border">
                  <div className="font-medium mb-2">Selected Element</div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span>LoginButton</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span>Button</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Locator:</span>
                      <span className="text-xs font-mono">#login-btn</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="logs" className="h-full p-4 mt-0">
            <div className="space-y-4 h-full flex flex-col">
              <h3 className="font-semibold text-gray-900">Execution Logs</h3>
              <div className="flex-1 bg-black text-green-400 p-3 rounded font-mono text-xs overflow-y-auto">
                <div>[12:34:56] Starting test execution...</div>
                <div>[12:34:57] Launching Chrome browser</div>
                <div>[12:34:58] Navigating to login page</div>
                <div>[12:34:59] Element found: UsernameField</div>
                <div>[12:35:00] Entering username: test@example.com</div>
                <div>[12:35:01] Element found: PasswordField</div>
                <div>[12:35:02] Entering password: ********</div>
                <div>[12:35:03] Clicking LoginButton</div>
                <div className="text-red-400">[12:35:04] Error: Element not found</div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ai" className="h-full p-4 mt-0">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">AI Suggestions</h3>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                  <div className="flex items-center space-x-2 mb-2">
                    <Brain className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">Smart Locator</span>
                  </div>
                  <p className="text-sm text-blue-800">
                    Consider using data-testid for more stable element identification
                  </p>
                </div>
                
                <div className="p-3 bg-green-50 border border-green-200 rounded">
                  <div className="flex items-center space-x-2 mb-2">
                    <Activity className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-900">Performance</span>
                  </div>
                  <p className="text-sm text-green-800">
                    Add explicit wait before clicking the submit button
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default RightSidebar;
