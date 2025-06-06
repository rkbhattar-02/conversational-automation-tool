/**
 * Main Application Component
 * 
 * Purpose: Root application component that handles routing, global state, and layout management
 * 
 * Dependencies:
 * - React Router for navigation
 * - TanStack Query for data fetching
 * - shadcn/ui components for consistent UI
 * - Custom services for backend integration
 * 
 * Connected Components:
 * - All page components (Dashboard, TestCaseEditor, etc.)
 * - Layout components (AppLayout, WelcomeScreen)
 * - Service providers (QueryClient, Toaster)
 * 
 * Features:
 * - Route management and navigation
 * - Global state management
 * - Onboarding flow for new users
 * - Demo workspace initialization
 * - Error boundaries and loading states
 */

import React, { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AppLayout from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import TestCaseEditor from "./pages/TestCaseEditor";
import WebAppTesting from "./pages/WebAppTesting";
import NotFound from "./pages/NotFound";
import WelcomeScreen from "./components/onboarding/WelcomeScreen";
import WorkspaceManager from "./components/workspace/WorkspaceManager";
import { queryClient } from "./services/api/graphql-client";
import { workspaceService, type Workspace } from "./services/api/workspace-service";

const App = () => {
  const [showWelcome, setShowWelcome] = useState(false);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Check if this is a first-time user
  useEffect(() => {
    const checkFirstTimeUser = async () => {
      try {
        const workspaces = await workspaceService.getWorkspaces();
        if (workspaces.length === 0) {
          setShowWelcome(true);
        } else {
          // Set the first workspace as current if none is selected
          setCurrentWorkspace(workspaces[0]);
        }
      } catch (error) {
        console.error('Error checking workspaces:', error);
        // Show welcome screen on error as fallback
        setShowWelcome(true);
      } finally {
        setIsInitialized(true);
      }
    };

    checkFirstTimeUser();
  }, []);

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
  };

  const handleCreateDemoWorkspace = async () => {
    try {
      // Create demo workspace with sample data
      const demoWorkspace = await workspaceService.createWorkspace({
        name: 'Demo E-commerce Suite',
        description: 'Sample test automation project for online shopping platform',
        files: [],
        settings: {
          screenshotPath: '/workspace/demo-ecommerce/screenshots',
          logsPath: '/workspace/demo-ecommerce/logs',
          defaultBrowser: 'chrome',
          executionTimeout: 30000,
        },
      });

      // Add sample files to the demo workspace
      await workspaceService.createFile(demoWorkspace.id, {
        name: 'login-test.js',
        type: 'file',
        path: '/test-cases/login-test.js',
        content: `// Demo Login Test Case
describe("User Login", () => {
  test("Valid user can login successfully", async () => {
    await page.goto("https://demo-shop.com");
    await page.click("#login-button");
    await page.fill("#username", "demo@example.com");
    await page.fill("#password", "password123");
    await page.click("#submit-login");
    await expect(page.locator("#user-menu")).toBeVisible();
  });
});`,
      });

      await workspaceService.createFile(demoWorkspace.id, {
        name: 'product-search.js',
        type: 'file',
        path: '/test-cases/product-search.js',
        content: `// Demo Product Search Test Case
describe("Product Search", () => {
  test("User can search for products", async () => {
    await page.goto("https://demo-shop.com");
    await page.fill("#search-input", "laptop");
    await page.click("#search-button");
    await expect(page.locator(".product-card")).toHaveCount(5);
  });
});`,
      });

      setCurrentWorkspace(demoWorkspace);
    } catch (error) {
      console.error('Error creating demo workspace:', error);
    }
  };

  const handleWorkspaceSelect = (workspace: Workspace) => {
    setCurrentWorkspace(workspace);
  };

  // Show loading screen while initializing
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600">Initializing TestCraft IDE...</p>
        </div>
      </div>
    );
  }

  // Show welcome screen for first-time users
  if (showWelcome) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <WelcomeScreen 
            onComplete={handleWelcomeComplete}
            onCreateDemoWorkspace={handleCreateDemoWorkspace}
          />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Authentication Routes */}
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            
            {/* Workspace Selection */}
            <Route 
              path="/workspaces" 
              element={
                <div className="min-h-screen bg-gray-50 p-6">
                  <WorkspaceManager 
                    onWorkspaceSelect={handleWorkspaceSelect}
                    currentWorkspaceId={currentWorkspace?.id}
                  />
                </div>
              } 
            />
            
            {/* Main Application Routes */}
            <Route path="/" element={<AppLayout currentWorkspace={currentWorkspace} />}>
              <Route index element={<Dashboard currentWorkspace={currentWorkspace} />} />
              <Route 
                path="test-editor" 
                element={<TestCaseEditor currentWorkspace={currentWorkspace} />} 
              />
              <Route 
                path="webapp-testing" 
                element={<WebAppTesting currentWorkspace={currentWorkspace} />} 
              />
            </Route>
            
            {/* Redirect to workspace selection if no workspace is selected */}
            <Route 
              path="*" 
              element={
                currentWorkspace ? <NotFound /> : <Navigate to="/workspaces" replace />
              } 
            />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
