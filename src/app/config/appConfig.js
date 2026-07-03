/**
 * Centralized application configuration.
 * Avoids magic strings and numbers across components and backend boundaries.
 */
export const appConfig = {
  appName: 'README Forge',
  version: '1.0.0-rc1',
  author: 'Sumi-tgupta/ReadmeForge Team',
  
  // Navigation & Routing Configurations
  routes: {
    home: '/',
    profileBuilder: '/profile-builder',
    profileBuilderChat: '/profile-builder/chat',
    projectBuilder: '/project-builder',
    projectBuilderChat: '/project-builder/chat',
    dashboard: '/dashboard',
    myProjects: '/my-projects',
    settings: '/settings',
    notFound: '/not-found',
  },

  // API Gateways
  api: {
    baseUrl: '/api',
    auth: {
      login: '/api/auth/login',
      logout: '/api/auth/logout',
      status: '/api/auth/status',
      me: '/api/auth/me',
    },
    generate: {
      profile: '/api/generate',
      project: '/api/generate/project',
    },
    projects: '/api/projects',
  },

  // System limits
  limits: {
    maxRepoScanDepth: 5,
    maxTokenLength: 8192,
    maxProjectsLimit: 50,
  },

  // Layout Themes & Fonts
  themes: ['light', 'dark', 'system'],
  vibes: ['minimal', 'bold', 'github'],
  fontSizes: ['sm', 'md', 'lg'],
  
  // Available AI models mapped to backend fallback chains
  models: {
    primary: 'gemini-2.5-flash-lite',
    fallback: 'gemini-2.5-flash',
    ultimate: 'gemini-3.5-flash',
  }
};

export default appConfig;
