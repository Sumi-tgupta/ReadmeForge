import { FRAMEWORKS } from './constants.js';

/**
 * Detects frameworks present in the repository.
 * Match criteria: specific configuration files, dependencies, or code patterns.
 * 
 * @param {object} importantFiles - Matched files from treeScanner
 * @param {Array<string>} dependencies - Extracted dependencies list
 * @param {object} fileContents - Dictionary containing raw text of loaded config files
 * @returns {Array<string>} List of matched frameworks
 */
export function detectFrameworks(importantFiles, dependencies = [], fileContents = {}) {
  const detected = new Set();
  const depSet = new Set(dependencies.map(d => d.toLowerCase()));

  for (const [fwId, fwConfig] of Object.entries(FRAMEWORKS)) {
    // 1. Match by file existence (e.g., next.config.js)
    if (fwConfig.files) {
      const fileExists = fwConfig.files.some(file => {
        // Handle glob matching if required, e.g. *.csproj
        if (file.includes('*')) {
          const suffix = file.replace('*', '').toLowerCase();
          return Object.keys(importantFiles).some(impFile => impFile.endsWith(suffix));
        }
        return !!importantFiles[file.toLowerCase()];
      });
      
      if (fileExists) {
        detected.add(fwConfig.name);
        continue;
      }
    }

    // 2. Match by package dependency
    if (fwConfig.dependencies) {
      const depMatch = fwConfig.dependencies.some(dep => depSet.has(dep.toLowerCase()));
      if (depMatch) {
        detected.add(fwConfig.name);
        continue;
      }
    }

    // 3. Match by file content pattern (e.g. imports inside go.mod or requirements.txt)
    if (fwConfig.patterns) {
      let patternMatch = false;
      for (const [filename, content] of Object.entries(fileContents)) {
        if (!content) continue;
        
        // Match checking: if current file matches names associated with framework or if it's a generic config file
        const filenameLower = filename.toLowerCase();
        const matchesFilename = (fwConfig.files && fwConfig.files.some(f => filenameLower.includes(f.toLowerCase()))) || 
                                ['go.mod', 'cargo.toml', 'requirements.txt', 'gemfile', 'pipfile'].some(f => filenameLower.includes(f));
                                
        if (matchesFilename) {
          patternMatch = fwConfig.patterns.some(regex => regex.test(content));
          if (patternMatch) break;
        }
      }
      
      if (patternMatch) {
        detected.add(fwConfig.name);
      }
    }
  }

  return Array.from(detected);
}
