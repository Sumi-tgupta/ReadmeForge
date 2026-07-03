/**
 * Feature Flags Configuration for README Forge.
 * Allows toggling future, experimental, or specific client features.
 */
export const featureFlags = {
  // Core builders
  conversationBuilder: true,
  projectBuilder: true,
  profileBuilder: true,
  
  // Experimental / Future tools
  portfolioGenerator: false,
  resumeGenerator: false,
  apiDocsGenerator: false,
  wikiGenerator: false,
  changelogGenerator: false,
  releaseNotesGenerator: false,
  licenseGenerator: false,
  
  // Advanced features
  experimentalAI: false,
  analyticsDashboard: true,
  pluginSystem: false,
  teamCollaboration: false,
  billingPortal: false,
  organizationAccounts: false,
  
  // Development helpers
  debugLogs: process.env.NODE_ENV !== 'production',
  offlineAuthMock: true,
};

export default featureFlags;
