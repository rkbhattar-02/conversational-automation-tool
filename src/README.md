
# TestCraft IDE - Source Code Documentation

## Project Overview
TestCraft IDE is a comprehensive web application testing platform built with React, TypeScript, and modern UI components. This document outlines all interaction rules, component relationships, and project structure.

## Core Architecture

### Main Application Structure
- **Entry Point**: `src/main.tsx` - React application bootstrap
- **Root Component**: `src/App.tsx` - Main application logic, routing, and workspace management
- **Layout System**: `src/components/layout/` - Application shell components

## Layout System Interaction Rules

### AppLayout (`src/components/layout/AppLayout.tsx`)
**Purpose**: Main application shell that manages the overall layout structure

**Interaction Rules**:
- Manages left and right sidebar visibility states
- Handles resizable panels using `ResizablePanelGroup`
- Conditionally renders TabsManager vs Outlet based on route
- Passes `currentWorkspace` to all child components

**Key Props**:
- `currentWorkspace`: Current workspace object
- Controls sidebar states via `leftSidebarOpen` and `rightSidebarOpen`

**Child Components**:
- `TopNavigation` - Header navigation
- `LeftSidebar` - Project explorer and workspace management
- `RightSidebar` - Additional tools and information
- `TabsManager` - Tab-based content management
- `BottomStatusBar` - Status information

### TopNavigation (`src/components/layout/TopNavigation.tsx`)
**Purpose**: Header navigation with workspace controls, search, and user management

**Interaction Rules**:
- Provides workspace breadcrumb navigation
- Manages browser selection for testing
- Controls test execution (play, pause, stop)
- Handles AI Agent activation state
- Manages notification system
- Provides user menu and settings access

**Tab Management**:
- Chrome-style tabs for different testing modes
- Active tab detection based on current route
- Tab switching triggers navigation

**Key Features**:
- Search functionality across tests and documentation
- Execution controls with visual feedback
- Notification dropdown with count badge
- User avatar and profile menu

### TabsManager (`src/components/layout/TabsManager.tsx`)
**Purpose**: Content management system that renders different views based on active tab

**Interaction Rules**:
- Determines active tab based on current route
- Renders appropriate component for each tab type
- Passes `currentWorkspace` to all rendered components

**Tab Types**:
- `dashboard` - Renders Dashboard component
- `webapp` - Renders WebAppTesting component  
- `api-testing` - Renders placeholder for API testing (coming soon)

**Route Mapping**:
- `/` or `/dashboard` → Dashboard
- `/webapp-testing` → WebAppTesting
- `/api-testing` → API Testing placeholder

## Page Components

### Dashboard (`src/pages/Dashboard.tsx`)
**Purpose**: Main workspace overview and project statistics

**Props**: `currentWorkspace?: Workspace | null`

### WebAppTesting (`src/pages/WebAppTesting.tsx`)
**Purpose**: Web application testing interface

**Interaction Rules**:
- Shows empty state when no workspace selected
- Displays test case selection interface
- Can launch TestCaseEditor for specific test cases
- Handles navigation state from other components

**Key Features**:
- Test case creation and management
- Recent test cases display
- Integration with TestCaseEditor

### TestCaseEditor (`src/pages/TestCaseEditor.tsx`)
**Purpose**: Detailed test case editing interface

**Props**:
- `currentWorkspace?: Workspace | null`
- `testCaseId?: string`
- `testCaseName?: string`
- `onBack?: () => void`

## Services and API Integration

### Workspace Service (`src/services/api/workspace-service.ts`)
**Purpose**: Handles all workspace-related API operations

**Key Functions**:
- `getWorkspaces()` - Fetch all workspaces
- `createWorkspace(data)` - Create new workspace
- `createFile(workspaceId, data)` - Add files to workspace

### GraphQL Client (`src/services/api/graphql-client.ts`)
**Purpose**: Configured TanStack Query client for API communication

## Component Interaction Patterns

### Workspace Management Flow
1. **App.tsx** checks for existing workspaces on initialization
2. If no workspaces exist, shows **WelcomeScreen**
3. User can create demo workspace or navigate to workspace selection
4. Selected workspace is passed down through component hierarchy
5. All major components receive `currentWorkspace` prop

### Navigation Flow
1. **TopNavigation** handles tab clicks
2. Tab clicks trigger route navigation
3. **AppLayout** detects route changes
4. **TabsManager** renders appropriate component based on route
5. Component receives `currentWorkspace` and renders content

### Test Case Editing Flow
1. **WebAppTesting** displays available test cases
2. User selects test case or creates new one
3. **TestCaseEditor** is rendered with test case details
4. Editor provides `onBack` callback to return to test list

## Routing Structure

### Main Routes (defined in App.tsx)
- `/` - AppLayout with Dashboard
- `/dashboard` - AppLayout with Dashboard
- `/webapp-testing` - AppLayout with WebAppTesting
- `/api-testing` - AppLayout with API Testing placeholder
- `/test-editor` - AppLayout with TestCaseEditor
- `/workspaces` - WorkspaceManager (standalone)
- `/auth/login` - Login page
- `/auth/register` - Register page

### Route Protection
- Redirects to `/workspaces` if no workspace is selected
- Shows 404 for unknown routes when workspace exists

## State Management

### Global State (App.tsx)
- `showWelcome` - Controls onboarding flow
- `currentWorkspace` - Currently selected workspace
- `isInitialized` - Application initialization status

### Component State Examples
- **TopNavigation**: Search query, notification count, AI agent status
- **AppLayout**: Sidebar visibility states
- **WebAppTesting**: Selected test case details

## UI Component Library

### Shadcn/UI Components Used
- `Button`, `Input`, `Avatar`, `Badge` - Basic UI elements
- `Tabs`, `TabsContent`, `TabsList`, `TabsTrigger` - Tab navigation
- `DropdownMenu` - Context menus and dropdowns
- `Card`, `CardContent`, `CardHeader` - Content containers
- `ResizablePanelGroup`, `ResizablePanel` - Layout management

### Icons (Lucide React)
- Navigation: `Menu`, `Search`, `Bell`
- Actions: `Play`, `Pause`, `Square`, `Plus`
- Content: `Globe`, `Monitor`, `FileText`
- User: `User`, `Settings`, `LogOut`

## Styling and Design System

### Tailwind CSS Classes
- Layout: `flex`, `grid`, `space-x-*`, `space-y-*`
- Colors: Semantic color tokens (avoid direct colors)
- Responsive: `md:*`, `lg:*` breakpoint prefixes
- Animations: `hover:*`, `transition-*`, `animate-*`

### Design Patterns
- Gradient branding: `bg-gradient-to-r from-blue-600 to-purple-600`
- Card layouts for content sections
- Consistent spacing using Tailwind spacing scale
- Hover states for interactive elements

## File Structure Summary

```
src/
├── components/
│   ├── layout/
│   │   ├── AppLayout.tsx           # Main layout shell
│   │   ├── TopNavigation.tsx       # Header navigation
│   │   ├── TabsManager.tsx         # Tab content management
│   │   ├── LeftSidebar.tsx         # Project explorer
│   │   ├── RightSidebar.tsx        # Additional tools
│   │   └── BottomStatusBar.tsx     # Status information
│   ├── onboarding/
│   │   └── WelcomeScreen.tsx       # First-time user flow
│   ├── workspace/
│   │   └── WorkspaceManager.tsx    # Workspace selection
│   └── ui/                         # Shadcn/UI components
├── pages/
│   ├── Dashboard.tsx               # Main workspace view
│   ├── WebAppTesting.tsx           # Web testing interface
│   ├── TestCaseEditor.tsx          # Test case editing
│   ├── NotFound.tsx                # 404 error page
│   └── auth/
│       ├── Login.tsx               # Authentication
│       └── Register.tsx            # User registration
├── services/
│   └── api/
│       ├── workspace-service.ts    # Workspace API calls
│       ├── graphql-client.ts       # Query client setup
│       └── test-execution-service.ts # Test execution API
├── hooks/                          # Custom React hooks
├── lib/                           # Utility functions
└── App.tsx                        # Root application component
```

## Key Interaction Rules Summary

1. **Workspace Context**: All major components receive `currentWorkspace` prop
2. **Route-Based Rendering**: TabsManager renders components based on current route
3. **Sidebar Management**: AppLayout controls sidebar visibility and resizing
4. **Navigation Flow**: TopNavigation → Route Change → TabsManager → Component Rendering
5. **State Lifting**: Important state is managed at App.tsx level and passed down
6. **Component Communication**: Parent-child prop passing, callback functions for user actions
7. **Error Boundaries**: Graceful fallbacks for missing workspace or navigation errors

## Development Guidelines

- **Component Size**: Keep components focused and under 200 lines when possible
- **Props Interface**: Always define TypeScript interfaces for component props
- **State Management**: Use React hooks for local state, lift state up when needed
- **Styling**: Use Tailwind CSS classes, follow design system tokens
- **Icons**: Use Lucide React icons consistently
- **Error Handling**: Provide meaningful error states and loading indicators

This documentation serves as a comprehensive reference for understanding the TestCraft IDE codebase structure and interaction patterns.
