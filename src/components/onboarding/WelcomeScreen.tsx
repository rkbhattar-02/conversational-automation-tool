
/**
 * Welcome Screen Component
 * 
 * Purpose: First-time user onboarding experience with guided tour and demo setup
 * 
 * Dependencies:
 * - UI components from shadcn/ui
 * - Animation utilities for smooth transitions
 * - WorkspaceManager for initial setup
 * 
 * Connected Components:
 * - App.tsx (main entry point)
 * - WorkspaceManager (workspace creation)
 * - Dashboard (post-setup navigation)
 * 
 * Features:
 * - Welcome animation and branding
 * - Feature highlights and benefits
 * - Quick setup wizard
 * - Demo data initialization
 * - Guided tour triggers
 */

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Zap, 
  Shield, 
  Users, 
  BarChart3, 
  Chrome,
  Code,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Rocket
} from 'lucide-react';

interface WelcomeScreenProps {
  onComplete: () => void;
  onCreateDemoWorkspace: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onComplete, onCreateDemoWorkspace }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const [setupProgress, setSetupProgress] = useState(0);

  const features = [
    {
      icon: <Zap className="h-8 w-8 text-yellow-500" />,
      title: 'Lightning Fast',
      description: 'Execute tests with blazing speed using Playwright automation',
      highlight: 'Up to 10x faster than traditional tools'
    },
    {
      icon: <Code className="h-8 w-8 text-blue-500" />,
      title: 'Natural Language',
      description: 'Write tests in plain English with AI-powered NLP processing',
      highlight: 'No coding required'
    },
    {
      icon: <Shield className="h-8 w-8 text-green-500" />,
      title: 'Cross-Platform',
      description: 'Test across Chrome, Firefox, and mobile browsers seamlessly',
      highlight: 'Universal compatibility'
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-purple-500" />,
      title: 'Smart Analytics',
      description: 'Get detailed insights with automated screenshots and logs',
      highlight: 'Advanced reporting'
    }
  ];

  const setupSteps = [
    'Initializing workspace...',
    'Setting up sample test cases...',
    'Configuring object repository...',
    'Preparing demo environment...',
    'Ready to go!'
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleQuickStart = () => {
    setCurrentStep(1);
    simulateSetup();
  };

  const simulateSetup = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setSetupProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          onCreateDemoWorkspace();
          onComplete();
        }, 500);
      }
    }, 800);
  };

  if (currentStep === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
              <Rocket className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle>Setting Up Your Demo</CardTitle>
            <CardDescription>
              We're preparing everything for your first test automation experience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Progress value={setupProgress} className="h-2" />
              <p className="text-sm text-center text-gray-600">
                {setupSteps[Math.floor(setupProgress / 20)] || 'Preparing...'}
              </p>
            </div>
            
            <div className="space-y-2 text-sm">
              {setupSteps.slice(0, Math.floor(setupProgress / 20) + 1).map((step, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-gray-600">{step}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-12">
        <div className={`text-center space-y-8 transition-all duration-1000 ${
          isAnimating ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'
        }`}>
          {/* Logo and Title */}
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                <Play className="h-8 w-8 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  TestCraft IDE
                </h1>
                <p className="text-gray-600">Next-Generation Test Automation</p>
              </div>
            </div>
            
            <div className="max-w-2xl mx-auto space-y-4">
              <h2 className="text-3xl font-bold text-gray-900">
                Welcome to the Future of Testing
              </h2>
              <p className="text-xl text-gray-600">
                Create, execute, and manage test automation with AI-powered natural language processing
              </p>
              <div className="flex items-center justify-center space-x-2">
                <Badge className="bg-green-100 text-green-800">
                  <Sparkles className="h-3 w-3 mr-1" />
                  AI Powered
                </Badge>
                <Badge className="bg-blue-100 text-blue-800">
                  <Chrome className="h-3 w-3 mr-1" />
                  Cross-Browser
                </Badge>
                <Badge className="bg-purple-100 text-purple-800">
                  <Users className="h-3 w-3 mr-1" />
                  Team Ready
                </Badge>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center justify-center space-x-4">
            <Button 
              size="lg" 
              onClick={handleQuickStart}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8"
            >
              <Play className="h-5 w-5 mr-2" />
              Quick Start Demo
            </Button>
            <Button size="lg" variant="outline" onClick={onComplete}>
              <ArrowRight className="h-5 w-5 mr-2" />
              Manual Setup
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className={`mt-20 transition-all duration-1000 delay-300 ${
          isAnimating ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'
        }`}>
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Why Choose TestCraft IDE?
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Built for modern development teams who need reliable, fast, and intelligent test automation
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className={`text-center hover:shadow-lg transition-all duration-300 delay-${index * 100}`}
              >
                <CardHeader>
                  <div className="mx-auto mb-4 p-3 bg-gray-50 rounded-full w-fit">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant="secondary" className="text-xs">
                    {feature.highlight}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Demo Preview */}
        <div className={`mt-20 transition-all duration-1000 delay-500 ${
          isAnimating ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'
        }`}>
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              See It In Action
            </h3>
            <p className="text-gray-600">
              Get started in seconds with our pre-configured demo workspace
            </p>
          </div>
          
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-8">
              <div className="bg-gray-900 rounded-lg p-6 text-green-400 font-mono text-sm">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="ml-4 text-gray-400">TestCraft IDE - Demo Workspace</span>
                </div>
                <div className="space-y-2">
                  <div>{'>'} Launch Browser "Chrome"</div>
                  <div>{'>'} Navigate URL "https://demo-shop.com"</div>
                  <div>{'>'} Click LoginButton</div>
                  <div>{'>'} Input UsernameField "demo@example.com"</div>
                  <div>{'>'} Input PasswordField "password123"</div>
                  <div>{'>'} Click SubmitButton</div>
                  <div className="text-green-300">✓ Test completed successfully in 2.34s</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
