
# TestCraft IDE - Project Structure Documentation

## Overview
This document outlines the complete file structure and organization of the TestCraft IDE React frontend application. The project follows modern React best practices with TypeScript, component-based architecture, and service-oriented design.

## Root Directory Structure

```
testcraft-ide/
├── public/                          # Static assets
│   ├── favicon.ico                  # Application icon
│   ├── placeholder.svg              # Default placeholder images
│   └── robots.txt                   # Search engine directives
├── src/                             # Source code directory
│   ├── components/                  # Reusable UI components
│   ├── pages/                       # Page-level components
│   ├── services/                    # API and business logic services
│   ├── hooks/                       # Custom React hooks
│   ├── lib/                         # Utility libraries
│   ├── App.tsx                      # Main application component
│   ├── main.tsx                     # Application entry point
│   ├── index.css                    # Global styles
│   └── vite-env.d.ts               # Vite type definitions
├── package.json                     # Project dependencies and scripts
├── tsconfig.json                    # TypeScript configuration
├── tailwind.config.ts              # Tailwind CSS configuration
├── vite.config.ts                  # Vite build configuration
└── README.md                       # Project documentation
```

## Detailed Source Structure

### `/src/components/` - Reusable Components

```
components/
├── layout/                          # Layout-related components
│   ├── AppLayout.tsx               # Main application layout wrapper
│   ├── TopNavigation.tsx           # Header navigation bar
│   ├── LeftSidebar.tsx             # Workspace and file navigation
│   ├── RightSidebar.tsx            # Properties and tools panel
│   └── BottomStatusBar.tsx         # Status and execution information
├── workspace/                       # Workspace management components
│   ├── WorkspaceManager.tsx        # Workspace CRUD operations
│   ├── FileExplorer.tsx            # File system navigation
│   ├── WorkspaceSettings.tsx       # Workspace configuration
│   └── FileEditor.tsx              # Code/text file editing
├── onboarding/                      # First-time user experience
│   ├── WelcomeScreen.tsx           # Welcome and feature introduction
│   ├── SetupWizard.tsx             # Initial setup guidance
│   └── GuidedTour.tsx              # Interactive feature tour
├── test-execution/                  # Test execution components
│   ├── ExecutionMonitor.tsx        # Real-time execution tracking
│   ├── ExecutionResults.tsx        # Test results display
│   ├── ExecutionHistory.tsx        # Historical execution data
│   └── ExecutionControls.tsx       # Start/stop/configure execution
└── ui/                             # shadcn/ui component library
    ├── button.tsx                  # Button component
    ├── card.tsx                    # Card container component
    ├── input.tsx                   # Input field component
    ├── dialog.tsx                  # Modal dialog component
    └── [50+ other UI components]   # Complete shadcn/ui library
```

### `/src/pages/` - Page Components

```
pages/
├── auth/                           # Authentication pages
│   ├── Login.tsx                   # User login page
│   └── Register.tsx                # User registration page
├── components/                     # Page-specific components
│   └── MonacoEditor.tsx           # Code editor integration
├── Dashboard.tsx                   # Main dashboard page
├── TestCaseEditor.tsx             # Test case creation/editing
├── NotFound.tsx                   # 404 error page
└── Index.tsx                      # Landing page (unused)
```

### `/src/services/` - Business Logic and API Integration

```
services/
├── api/                           # API service layer
│   ├── graphql-client.ts          # GraphQL client configuration
│   ├── workspace-service.ts       # Workspace CRUD operations
│   ├── test-execution-service.ts  # Test execution management
│   ├── file-service.ts            # File system operations
│   ├── object-repository-service.ts # UI object management
│   └── integration-service.ts     # Git/Jenkins integrations
├── mock/                          # Mock data for development
│   ├── sample-workspaces.ts       # Demo workspace data
│   ├── sample-executions.ts       # Demo execution history
│   └── sample-test-cases.ts       # Demo test cases
└── utils/                         # Service utilities
    ├── api-utils.ts               # API helper functions
    ├── validation.ts              # Data validation
    └── error-handling.ts          # Error management
```

### `/src/hooks/` - Custom React Hooks

```
hooks/
├── use-toast.ts                   # Toast notification hook
├── use-mobile.tsx                 # Mobile device detection
├── use-workspace.ts               # Workspace state management
├── use-execution.ts               # Test execution state
└── use-file-system.ts             # File operations hook
```

### `/src/lib/` - Utility Libraries

```
lib/
├── utils.ts                       # General utility functions
├── constants.ts                   # Application constants
├── types.ts                       # TypeScript type definitions
└── validation-schemas.ts          # Zod validation schemas
```

## Component Architecture Patterns

### 1. Layout Components
- **Purpose**: Provide consistent application structure
- **Pattern**: Container components that manage layout state
- **Dependencies**: UI components, routing context
- **File naming**: `[ComponentName]Layout.tsx` or `[Area]Navigation.tsx`

### 2. Feature Components
- **Purpose**: Implement specific business functionality
- **Pattern**: Smart components with business logic
- **Dependencies**: Services, hooks, UI components
- **File naming**: `[FeatureName]Manager.tsx` or `[Feature][Action].tsx`

### 3. UI Components
- **Purpose**: Reusable interface elements
- **Pattern**: Pure components with minimal logic
- **Dependencies**: Radix UI primitives, Tailwind CSS
- **File naming**: `[component-name].tsx` (lowercase with hyphens)

### 4. Service Layer
- **Purpose**: Business logic and API integration
- **Pattern**: Service objects with async methods
- **Dependencies**: GraphQL client, data validation
- **File naming**: `[domain]-service.ts`

## Data Flow Architecture

```
User Interaction
       ↓
React Component
       ↓
Custom Hook (if needed)
       ↓
Service Layer
       ↓
GraphQL Client / API
       ↓
Backend (Future: Python FastAPI)
       ↓
Response Processing
       ↓
React Query Cache
       ↓
Component Re-render
```

## File Naming Conventions

### Components
- **React Components**: PascalCase (e.g., `WorkspaceManager.tsx`)
- **UI Components**: lowercase-with-hyphens (e.g., `button.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useWorkspace.ts`)

### Services
- **Service Files**: kebab-case with suffix (e.g., `workspace-service.ts`)
- **Types/Interfaces**: PascalCase (e.g., `Workspace`, `TestExecution`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `DEFAULT_TIMEOUT`)

### Folders
- **All folders**: lowercase with hyphens (e.g., `test-execution/`)
- **Feature folders**: noun-based (e.g., `workspace/`, `auth/`)

## Import Organization

### Import Order (Top to Bottom)
1. React and React-related imports
2. Third-party library imports
3. Internal service imports
4. Internal component imports
5. Type-only imports (using `type` keyword)
6. Relative imports

### Example Import Block
```typescript
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { workspaceService } from '@/services/api/workspace-service';
import { WorkspaceSettings } from '@/components/workspace/WorkspaceSettings';
import type { Workspace } from '@/services/api/workspace-service';
```

## Development Workflow

### 1. Component Creation
1. Create component file in appropriate directory
2. Add comprehensive JSDoc header comment
3. Import required dependencies
4. Implement component with TypeScript
5. Export as default

### 2. Service Integration
1. Define TypeScript interfaces
2. Create service methods with mock implementation
3. Add React Query integration
4. Connect to components via custom hooks

### 3. Testing Strategy
- **Unit Tests**: Individual component testing
- **Integration Tests**: Service and component interaction
- **E2E Tests**: Full user workflow testing
- **Mock Services**: Use mock data for development

## Build and Deployment

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run type-check   # TypeScript type checking
```

### Production
- **Build Output**: `/dist` directory
- **Static Assets**: Bundled and optimized
- **Code Splitting**: Automatic route-based splitting
- **Type Safety**: Full TypeScript compilation

## Documentation Standards

### Component Documentation
Every component file must include:
1. **File Purpose**: What the component does
2. **Dependencies**: What it relies on
3. **Connected Components**: What it integrates with
4. **Features**: Key functionality provided

### Example Component Header
```typescript
/**
 * [Component Name] Component
 * 
 * Purpose: [Brief description of what this component does]
 * 
 * Dependencies:
 * - [List of key dependencies]
 * 
 * Connected Components:
 * - [Components this integrates with]
 * 
 * Features:
 * - [List of key features]
 */
```

This structure ensures maintainability, scalability, and clear separation of concerns throughout the TestCraft IDE application.
```
