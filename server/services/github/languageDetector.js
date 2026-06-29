import { LANGUAGES } from './constants.js';

/**
 * Detects languages present in the repository tree and matches them with primary language stats.
 * 
 * @param {object} extensionCounts - Extension counts from treeScanner
 * @param {string} apiPrimaryLanguage - Primary language reported by the GitHub API
 * @returns {Array<string>} List of sorted languages detected (primary first)
 */
export function detectLanguages(extensionCounts, apiPrimaryLanguage) {
  if (!extensionCounts) {
    return apiPrimaryLanguage ? [apiPrimaryLanguage] : [];
  }

  const detectedMap = new Map();

  // Aggregate extension hits into languages
  for (const [ext, count] of Object.entries(extensionCounts)) {
    for (const [langId, langConfig] of Object.entries(LANGUAGES)) {
      if (langConfig.ext.includes(ext)) {
        const currentCount = detectedMap.get(langConfig.name) || 0;
        detectedMap.set(langConfig.name, currentCount + count);
      }
    }
  }

  // Sort detected languages by file count
  const sortedDetected = Array.from(detectedMap.entries())
    .sort((a, b) => b[1] - a[1])
    .map(entry => entry[0]);

  // Ensure the GitHub API primary language is placed at the front if detected
  if (apiPrimaryLanguage) {
    const apiLangName = apiPrimaryLanguage.trim();
    const index = sortedDetected.indexOf(apiLangName);
    if (index > 0) {
      // Remove it and place it at index 0
      sortedDetected.splice(index, 1);
      sortedDetected.unshift(apiLangName);
    } else if (index === -1) {
      // Not in list, insert at top
      sortedDetected.unshift(apiLangName);
    }
  }

  return sortedDetected;
}
