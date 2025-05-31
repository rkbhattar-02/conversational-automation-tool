
/**
 * GraphQL Client Configuration
 * 
 * Purpose: Configures and exports the GraphQL client for communicating with the backend
 * 
 * Dependencies:
 * - @tanstack/react-query for data fetching and caching
 * - Future: graphql-request or Apollo Client for actual GraphQL operations
 * 
 * Connected Components:
 * - All service files that need to make GraphQL queries
 * - React components that use data fetching hooks
 * 
 * Mock Implementation: Currently uses mock data, ready for real GraphQL integration
 */

import { QueryClient } from '@tanstack/react-query';

// GraphQL Client configuration (mock implementation)
export const graphqlClient = {
  query: async (query: string, variables?: any) => {
    // Mock delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 200));
    
    console.log('GraphQL Query:', query, 'Variables:', variables);
    
    // This will be replaced with actual GraphQL client implementation
    throw new Error('Mock GraphQL client - implement actual GraphQL endpoint');
  },
  
  mutate: async (mutation: string, variables?: any) => {
    // Mock delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 100));
    
    console.log('GraphQL Mutation:', mutation, 'Variables:', variables);
    
    // This will be replaced with actual GraphQL mutation implementation
    throw new Error('Mock GraphQL client - implement actual GraphQL endpoint');
  }
};

// Enhanced Query Client with default options
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error) => {
        // Don't retry mock errors
        if (error instanceof Error && error.message.includes('Mock')) {
          return false;
        }
        return failureCount < 3;
      },
    },
    mutations: {
      retry: false,
    },
  },
});
