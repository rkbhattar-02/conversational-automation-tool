
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wrench, Zap } from 'lucide-react';
import Dashboard from '@/pages/Dashboard';
import { type Workspace } from '@/services/api/workspace-service';

interface TabsManagerProps {
  activeTab: string;
  currentWorkspace?: Workspace | null;
}

const TabsManager: React.FC<TabsManagerProps> = ({ activeTab, currentWorkspace }) => {
  const renderTabContent = () => {
    switch (activeTab) {
      case 'webapp':
        return (
          <div className="p-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Wrench className="h-5 w-5 text-blue-600" />
                  <span>Web Application Testing</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Wrench className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Web App Testing Suite</h3>
                  <p className="text-gray-600 mb-4 max-w-md mx-auto">
                    Create, manage, and execute automated tests for your web applications. 
                    Build robust test scenarios with our visual editor.
                  </p>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Coming Soon
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'api-testing':
        return (
          <div className="p-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-purple-600" />
                  <span>API Testing</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">API Testing</h3>
                  <p className="text-gray-600 mb-4 max-w-md mx-auto">
                    Test your REST APIs, GraphQL endpoints, and web services with our comprehensive testing suite.
                  </p>
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                    This feature is coming soon
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'dashboard':
        return <Dashboard currentWorkspace={currentWorkspace} />;

      default:
        return <Dashboard currentWorkspace={currentWorkspace} />;
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      {renderTabContent()}
    </div>
  );
};

export default TabsManager;
