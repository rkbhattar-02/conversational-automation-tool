
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wrench, Zap } from 'lucide-react';
import Dashboard from '@/pages/Dashboard';
import WebAppTesting from '@/pages/WebAppTesting';
import { type Workspace } from '@/services/api/workspace-service';

interface TabsManagerProps {
  currentWorkspace?: Workspace | null;
}

const TabsManager: React.FC<TabsManagerProps> = ({ currentWorkspace }) => {
  const location = useLocation();
  
  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('webapp-testing')) return 'webapp';
    if (path.includes('api-testing')) return 'api-testing';
    return 'dashboard';
  };

  const activeTab = getActiveTab();

  const renderTabContent = () => {
    switch (activeTab) {
      case 'webapp':
        return <WebAppTesting currentWorkspace={currentWorkspace} />;

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
