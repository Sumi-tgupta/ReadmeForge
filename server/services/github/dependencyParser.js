/**
 * Dependency Parser for various language packages and lockfiles
 */
import toml from '@iarna/toml';

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
  try {
    const data = toml.parse(content);
    const deps = data.tool?.poetry?.dependencies || {};
    const devDeps = data.tool?.poetry?.['dev-dependencies'] || data.tool?.poetry?.group?.dev?.dependencies || {};
    
    const packages = [
      ...Object.keys(deps),
      ...Object.keys(devDeps)
    ].map(pkg => pkg.toLowerCase()).filter(pkg => pkg !== 'python');
    
    return packages;
  } catch (err) {
    console.error('[DependencyParser] pyproject.toml parse error:', err.message);
    return [];
  }
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
  try {
    const data = toml.parse(content);
    const deps = data.dependencies || {};
    const devDeps = data['dev-dependencies'] || {};
    
    return [
      ...Object.keys(deps),
      ...Object.keys(devDeps)
    ];
  } catch (err) {
    console.error('[DependencyParser] Cargo.toml parse error:', err.message);
    return [];
  }
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
