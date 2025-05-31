
/**
 * Workspace Service
 * 
 * Purpose: Handles all workspace-related operations including creation, management, and file operations
 * 
 * Dependencies:
 * - Mock data from data/sample-workspace.ts
 * - GraphQL client for future backend integration
 * 
 * Connected Components:
 * - WorkspaceManager component
 * - LeftSidebar for workspace navigation
 * - Dashboard for workspace overview
 * 
 * Features:
 * - Workspace CRUD operations
 * - File system management
 * - Project structure handling
 */

export interface WorkspaceFile {
  id: string;
  name: string;
  type: 'file' | 'folder';
  path: string;
  content?: string;
  children?: WorkspaceFile[];
  lastModified: Date;
  size?: number;
}

export interface Workspace {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  lastModified: Date;
  files: WorkspaceFile[];
  settings: {
    screenshotPath: string;
    logsPath: string;
    defaultBrowser: 'chrome' | 'firefox' | 'safari';
    executionTimeout: number;
  };
}

// Mock workspace data - will be replaced with actual API calls
const mockWorkspaces: Workspace[] = [
  {
    id: 'ws-1',
    name: 'E-commerce Testing Suite',
    description: 'Comprehensive test suite for online shopping platform',
    createdAt: new Date('2024-01-15'),
    lastModified: new Date('2024-01-31'),
    settings: {
      screenshotPath: '/workspace/e-commerce/screenshots',
      logsPath: '/workspace/e-commerce/logs',
      defaultBrowser: 'chrome',
      executionTimeout: 30000,
    },
    files: [
      {
        id: 'f-1',
        name: 'test-cases',
        type: 'folder',
        path: '/test-cases',
        lastModified: new Date('2024-01-31'),
        children: [
          {
            id: 'f-2',
            name: 'login-tests.js',
            type: 'file',
            path: '/test-cases/login-tests.js',
            content: 'describe("Login Tests", () => {\n  test("Valid login", async () => {\n    // Test implementation\n  });\n});',
            lastModified: new Date('2024-01-31'),
            size: 256,
          },
          {
            id: 'f-3',
            name: 'checkout-tests.js',
            type: 'file',
            path: '/test-cases/checkout-tests.js',
            content: 'describe("Checkout Tests", () => {\n  test("Complete purchase", async () => {\n    // Test implementation\n  });\n});',
            lastModified: new Date('2024-01-30'),
            size: 312,
          },
        ],
      },
      {
        id: 'f-4',
        name: 'object-repository',
        type: 'folder',
        path: '/object-repository',
        lastModified: new Date('2024-01-29'),
        children: [
          {
            id: 'f-5',
            name: 'login-page.json',
            type: 'file',
            path: '/object-repository/login-page.json',
            content: '{\n  "usernameField": "input[name=\\"username\\"]",\n  "passwordField": "input[name=\\"password\\"]",\n  "loginButton": "button[type=\\"submit\\"]"\n}',
            lastModified: new Date('2024-01-29'),
            size: 156,
          },
        ],
      },
    ],
  },
];

export const workspaceService = {
  // Get all workspaces
  getWorkspaces: async (): Promise<Workspace[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockWorkspaces;
  },

  // Get workspace by ID
  getWorkspace: async (id: string): Promise<Workspace | null> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockWorkspaces.find(ws => ws.id === id) || null;
  },

  // Create new workspace
  createWorkspace: async (workspace: Omit<Workspace, 'id' | 'createdAt' | 'lastModified'>): Promise<Workspace> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newWorkspace: Workspace = {
      ...workspace,
      id: `ws-${Date.now()}`,
      createdAt: new Date(),
      lastModified: new Date(),
    };
    
    mockWorkspaces.push(newWorkspace);
    return newWorkspace;
  },

  // Update workspace
  updateWorkspace: async (id: string, updates: Partial<Workspace>): Promise<Workspace | null> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = mockWorkspaces.findIndex(ws => ws.id === id);
    if (index === -1) return null;
    
    mockWorkspaces[index] = {
      ...mockWorkspaces[index],
      ...updates,
      lastModified: new Date(),
    };
    
    return mockWorkspaces[index];
  },

  // Delete workspace
  deleteWorkspace: async (id: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = mockWorkspaces.findIndex(ws => ws.id === id);
    if (index === -1) return false;
    
    mockWorkspaces.splice(index, 1);
    return true;
  },

  // File operations
  createFile: async (workspaceId: string, file: Omit<WorkspaceFile, 'id' | 'lastModified'>): Promise<WorkspaceFile | null> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const workspace = mockWorkspaces.find(ws => ws.id === workspaceId);
    if (!workspace) return null;
    
    const newFile: WorkspaceFile = {
      ...file,
      id: `f-${Date.now()}`,
      lastModified: new Date(),
    };
    
    // Add file to workspace (simplified - in real implementation, handle nested paths)
    workspace.files.push(newFile);
    workspace.lastModified = new Date();
    
    return newFile;
  },

  // Get file content
  getFileContent: async (workspaceId: string, filePath: string): Promise<string | null> => {
    await new Promise(resolve => setTimeout(resolve, 150));
    
    const workspace = mockWorkspaces.find(ws => ws.id === workspaceId);
    if (!workspace) return null;
    
    // Simplified file finding - in real implementation, traverse nested structure
    const findFile = (files: WorkspaceFile[]): WorkspaceFile | null => {
      for (const file of files) {
        if (file.path === filePath) return file;
        if (file.children) {
          const found = findFile(file.children);
          if (found) return found;
        }
      }
      return null;
    };
    
    const file = findFile(workspace.files);
    return file?.content || null;
  },

  // Save file content
  saveFileContent: async (workspaceId: string, filePath: string, content: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    const workspace = mockWorkspaces.find(ws => ws.id === workspaceId);
    if (!workspace) return false;
    
    // Update file content (simplified implementation)
    const updateFile = (files: WorkspaceFile[]): boolean => {
      for (const file of files) {
        if (file.path === filePath) {
          file.content = content;
          file.lastModified = new Date();
          return true;
        }
        if (file.children && updateFile(file.children)) {
          return true;
        }
      }
      return false;
    };
    
    const updated = updateFile(workspace.files);
    if (updated) {
      workspace.lastModified = new Date();
    }
    
    return updated;
  },
};
