import { logger } from '../utils/logger';

/**
 * Analytics abstraction layer.
 * Standardizes event structure for tracking user interactions.
 * Fully prepared for Mixpanel, Plausible, PostHog, or Google Analytics hookups.
 */
export const analytics = {
  /**
   * Track specific page views
   * @param {string} path - URL path
   */
  trackPageView: (path) => {
    logger.debug('[Analytics] Page View:', path);
    // Future integration: window.gtag('config', 'MEASUREMENT_ID', { page_path: path });
  },

  /**
   * Track custom user interaction events
   * @param {string} eventName - Category/Action name
   * @param {object} properties - Additional metadata properties
   */
  trackEvent: (eventName, properties = {}) => {
    const payload = {
      event: eventName,
      properties: {
        ...properties,
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
      }
    };
    
    logger.debug('[Analytics] Event Logged:', payload);
    
    // Future integration:
    // mixpanel.track(eventName, payload.properties);
    // posthog.capture(eventName, payload.properties);
  },

  // PRE-CONFIGURED SAAS ENGAGEMENT TRACKERS
  
  trackBuilderSelected: (builderStyle) => {
    analytics.trackEvent('builder_selected', { style: builderStyle });
  },

  trackRepoAnalyzed: (repoUrl, details = {}) => {
    analytics.trackEvent('repository_analyzed', { repoUrl, ...details });
  },

  trackReadmeGenerated: (type, durationMs, success) => {
    analytics.trackEvent('readme_generated', { type, durationMs, success });
  },

  trackThemeChanged: (theme, vibe) => {
    analytics.trackEvent('theme_changed', { theme, vibe });
  },

  trackProjectSaved: (projectId, isNew) => {
    analytics.trackEvent('project_saved', { projectId, isNew });
  }
};

export default analytics;
