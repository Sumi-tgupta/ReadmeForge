/**
 * Production-grade custom Logger utility.
 * Supports log levels, environment checks, and beautifully styled outputs in Dev.
 */

const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

const CURRENT_LEVEL = process.env.NODE_ENV === 'production' 
  ? LOG_LEVELS.WARN 
  : LOG_LEVELS.DEBUG;

const colors = {
  debug: '#7C3AED', // Violet
  info: '#3B82F6',  // Blue
  warn: '#F59E0B',  // Amber
  error: '#EF4444', // Red
};

function shouldLog(level) {
  return LOG_LEVELS[level] >= CURRENT_LEVEL;
}

export const logger = {
  debug: (message, ...args) => {
    if (!shouldLog('DEBUG')) return;
    console.log(
      `%c[DEBUG] %c${message}`,
      `color: ${colors.debug}; font-weight: bold;`,
      'color: inherit;',
      ...args
    );
  },

  info: (message, ...args) => {
    if (!shouldLog('INFO')) return;
    console.log(
      `%c[INFO] %c${message}`,
      `color: ${colors.info}; font-weight: bold;`,
      'color: inherit;',
      ...args
    );
  },

  warn: (message, ...args) => {
    if (!shouldLog('WARN')) return;
    console.warn(
      `%c[WARN] %c${message}`,
      `color: ${colors.warn}; font-weight: bold;`,
      'color: inherit;',
      ...args
    );
  },

  error: (message, ...args) => {
    if (!shouldLog('ERROR')) return;
    console.error(
      `%c[ERROR] %c${message}`,
      `color: ${colors.error}; font-weight: bold;`,
      'color: inherit;',
      ...args
    );
  }
};

export default logger;
