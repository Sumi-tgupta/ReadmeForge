/**
 * Dependency Parser for various language packages and lockfiles
 */

/**
 * Parses package.json contents
 * 
 * @param {string} content - package.json text content
 * @returns {object} Dependencies and scripts
 */
export function parsePackageJson(content) {
  try {
    const data = JSON.parse(content);
    return {
      dependencies: Object.keys(data.dependencies || {}),
      devDependencies: Object.keys(data.devDependencies || {}),
      scripts: data.scripts || {}
    };
  } catch (err) {
    console.error('[DependencyParser] package.json parse error:', err.message);
    return { dependencies: [], devDependencies: [], scripts: {} };
  }
}

/**
 * Parses requirements.txt contents
 * 
 * @param {string} content - requirements.txt text content
 * @returns {Array<string>} List of package names
 */
export function parseRequirementsTxt(content) {
  if (!content) return [];
  const lines = content.split('\n');
  const packages = [];

  for (let line of lines) {
    line = line.trim();
    if (!line || line.startsWith('#') || line.startsWith('-r')) continue;
    
    // Grab text before separators: ==, >=, <=, >, <, ;, @, #, space
    const match = line.match(/^([a-zA-Z0-9_\-\[\]]+)/);
    if (match) {
      packages.push(match[1].toLowerCase());
    }
  }

  return packages;
}

/**
 * Parses pyproject.toml contents (primarily tool.poetry.dependencies)
 * 
 * @param {string} content - pyproject.toml text content
 * @returns {Array<string>} List of package names
 */
export function parsePyprojectToml(content) {
  if (!content) return [];
  const packages = [];
  
  // Basic parsing for TOML blocks
  const depBlockMatch = content.match(/\[tool\.poetry\.(?:dev-)?dependencies\]([\s\S]*?)(?=\n\[|$)/g);
  if (depBlockMatch) {
    for (const block of depBlockMatch) {
      const lines = block.split('\n');
      for (let line of lines) {
        line = line.trim();
        if (!line || line.startsWith('[') || line.startsWith('#')) continue;
        const eqIndex = line.indexOf('=');
        if (eqIndex !== -1) {
          const pkgName = line.substring(0, eqIndex).trim().replace(/"/g, '').replace(/'/g, '');
          if (pkgName !== 'python') {
            packages.push(pkgName.toLowerCase());
          }
        }
      }
    }
  }
  
  return packages;
}

/**
 * Parses go.mod dependencies
 * 
 * @param {string} content - go.mod text content
 * @returns {Array<string>} List of Go import requirements
 */
export function parseGoMod(content) {
  if (!content) return [];
  const packages = [];
  
  // Single line requires: require github.com/gin-gonic/gin v1.7.0
  const singleRequireRegex = /^\s*require\s+([^\s]+)\s+([^\s\n]+)/gm;
  let match;
  while ((match = singleRequireRegex.exec(content)) !== null) {
    packages.push(match[1]);
  }

  // Block requires: require ( ... )
  const blockRequireRegex = /require\s*\(([\s\S]*?)\)/g;
  let blockMatch;
  while ((blockMatch = blockRequireRegex.exec(content)) !== null) {
    const lines = blockMatch[1].split('\n');
    for (let line of lines) {
      line = line.trim();
      if (!line || line.startsWith('//')) continue;
      const parts = line.split(/\s+/);
      if (parts.length > 0 && parts[0]) {
        packages.push(parts[0]);
      }
    }
  }

  return packages;
}

/**
 * Parses Cargo.toml dependencies
 * 
 * @param {string} content - Cargo.toml text content
 * @returns {Array<string>} List of Rust crate names
 */
export function parseCargoToml(content) {
  if (!content) return [];
  const packages = [];
  
  // Match dependencies blocks
  const depBlockMatch = content.match(/\[(?:dev-)?dependencies\]([\s\S]*?)(?=\n\[|$)/g);
  if (depBlockMatch) {
    for (const block of depBlockMatch) {
      const lines = block.split('\n');
      for (let line of lines) {
        line = line.trim();
        if (!line || line.startsWith('[') || line.startsWith('#')) continue;
        const eqIndex = line.indexOf('=');
        if (eqIndex !== -1) {
          const crateName = line.substring(0, eqIndex).trim().replace(/"/g, '').replace(/'/g, '');
          packages.push(crateName);
        }
      }
    }
  }

  return packages;
}

/**
 * Parses composer.json dependencies
 * 
 * @param {string} content - composer.json text content
 * @returns {object} php requirements and require-dev list
 */
export function parseComposerJson(content) {
  try {
    const data = JSON.parse(content);
    return {
      dependencies: Object.keys(data.require || {}).filter(pkg => pkg !== 'php'),
      devDependencies: Object.keys(data['require-dev'] || {})
    };
  } catch (err) {
    console.error('[DependencyParser] composer.json parse error:', err.message);
    return { dependencies: [], devDependencies: [] };
  }
}

/**
 * Parses Gradle build files
 * 
 * @param {string} content - build.gradle text content
 * @returns {Array<string>} List of dependency modules
 */
export function parseBuildGradle(content) {
  if (!content) return [];
  const packages = [];
  
  // implementation 'com.google.gson:gson:2.8.6' or implementation group: '...', name: '...'
  const implementationRegex = /(?:implementation|api|compile|runtimeOnly)\s+['"]([^'"]+)['"]/g;
  let match;
  while ((match = implementationRegex.exec(content)) !== null) {
    packages.push(match[1]);
  }
  
  return packages;
}

/**
 * Parses Maven pom.xml dependency list
 * 
 * @param {string} content - pom.xml text content
 * @returns {Array<string>} List of artifact IDs
 */
export function parsePomXml(content) {
  if (!content) return [];
  const packages = [];
  
  // Simple regex parser for artifactId in dependency tags
  const dependencyRegex = /<dependency>([\s\S]*?)<\/dependency>/g;
  const artifactIdRegex = /<artifactId>([^<]+)<\/artifactId>/;
  
  let depMatch;
  while ((depMatch = dependencyRegex.exec(content)) !== null) {
    const artMatch = artifactIdRegex.exec(depMatch[1]);
    if (artMatch) {
      packages.push(artMatch[1].trim());
    }
  }

  return packages;
}
