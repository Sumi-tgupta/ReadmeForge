import { getRecursiveTree, getFileContent } from './githubClient.js';
import { scanTree } from './treeScanner.js';
import { 
  parsePackageJson, 
  parseRequirementsTxt, 
  parsePyprojectToml, 
  parseGoMod, 
  parseCargoToml, 
  parseComposerJson,
  parseBuildGradle,
  parsePomXml
} from './dependencyParser.js';
import { detectLanguages } from './languageDetector.js';
import { detectFrameworks } from './frameworkDetector.js';
import { detectStack } from './stackDetector.js';
import { detectFeatures } from './featureDetector.js';
import { extractCommands } from './commandExtractor.js';
import { detectArchitecture } from './architectureDetector.js';
import { buildIntelligenceSummary } from './summaryBuilder.js';

/**
 * Analyzes repository structure, configurations, and stack details
 * 
 * @param {string} owner - Repo owner
 * @param {string} repo - Repo name
 * @param {object} metadata - Core GitHub repository metadata
 * @returns {Promise<object>} Unified Repository Intelligence JSON payload
 */
export async function analyzeRepository(owner, repo, metadata) {
  const branch = metadata.default_branch || 'main';
  console.log(`[Analyzer] Analyzing tree for "${owner}/${repo}" on branch "${branch}"`);

  // 1. Fetch recursive tree
  const treeData = await getRecursiveTree(owner, repo, branch);
  
  // 2. Scan and filter tree structure
  const treeScannerResult = scanTree(treeData.tree);
  const { importantFiles = {}, stats = {} } = treeScannerResult;

  // 3. Resolve key configuration files and parse dependencies
  let dependencies = [];
  let devDependencies = [];
  let packageJsonData = {};
  const loadedFileContents = {};

  // Node dependencies (check package.json)
  if (importantFiles['package.json']) {
    const pkgPath = importantFiles['package.json'][0]; // use root level or first package.json
    console.log(`[Analyzer] Loading package descriptor: "${pkgPath}"`);
    const content = await getFileContent(owner, repo, pkgPath, branch);
    if (content) {
      loadedFileContents[pkgPath] = content;
      packageJsonData = parsePackageJson(content);
      dependencies = [...dependencies, ...packageJsonData.dependencies];
      devDependencies = [...devDependencies, ...packageJsonData.devDependencies];
    }
  }

  // Python dependencies (check requirements.txt)
  if (importantFiles['requirements.txt']) {
    const reqPath = importantFiles['requirements.txt'][0];
    console.log(`[Analyzer] Loading Python dependencies: "${reqPath}"`);
    const content = await getFileContent(owner, repo, reqPath, branch);
    if (content) {
      loadedFileContents[reqPath] = content;
      const parsed = parseRequirementsTxt(content);
      dependencies = [...dependencies, ...parsed];
    }
  }

  // Python dependencies (poetry/pyproject.toml)
  if (importantFiles['pyproject.toml']) {
    const pyProjPath = importantFiles['pyproject.toml'][0];
    console.log(`[Analyzer] Loading pyproject.toml: "${pyProjPath}"`);
    const content = await getFileContent(owner, repo, pyProjPath, branch);
    if (content) {
      loadedFileContents[pyProjPath] = content;
      const parsed = parsePyprojectToml(content);
      dependencies = [...dependencies, ...parsed];
    }
  }

  // Go dependencies (go.mod)
  if (importantFiles['go.mod']) {
    const goModPath = importantFiles['go.mod'][0];
    console.log(`[Analyzer] Loading Go imports: "${goModPath}"`);
    const content = await getFileContent(owner, repo, goModPath, branch);
    if (content) {
      loadedFileContents[goModPath] = content;
      const parsed = parseGoMod(content);
      dependencies = [...dependencies, ...parsed];
    }
  }

  // Rust dependencies (Cargo.toml)
  if (importantFiles['cargo.toml']) {
    const cargoPath = importantFiles['cargo.toml'][0];
    console.log(`[Analyzer] Loading Cargo config: "${cargoPath}"`);
    const content = await getFileContent(owner, repo, cargoPath, branch);
    if (content) {
      loadedFileContents[cargoPath] = content;
      const parsed = parseCargoToml(content);
      dependencies = [...dependencies, ...parsed];
    }
  }

  // PHP dependencies (composer.json)
  if (importantFiles['composer.json']) {
    const composerPath = importantFiles['composer.json'][0];
    console.log(`[Analyzer] Loading PHP dependencies: "${composerPath}"`);
    const content = await getFileContent(owner, repo, composerPath, branch);
    if (content) {
      loadedFileContents[composerPath] = content;
      const parsed = parseComposerJson(content);
      dependencies = [...dependencies, ...parsed.dependencies];
      devDependencies = [...devDependencies, ...parsed.devDependencies];
    }
  }

  // Java dependencies (build.gradle)
  if (importantFiles['build.gradle']) {
    const gradlePath = importantFiles['build.gradle'][0];
    console.log(`[Analyzer] Loading Gradle build: "${gradlePath}"`);
    const content = await getFileContent(owner, repo, gradlePath, branch);
    if (content) {
      loadedFileContents[gradlePath] = content;
      const parsed = parseBuildGradle(content);
      dependencies = [...dependencies, ...parsed];
    }
  }

  // Java dependencies (pom.xml)
  if (importantFiles['pom.xml']) {
    const pomPath = importantFiles['pom.xml'][0];
    console.log(`[Analyzer] Loading Maven POM: "${pomPath}"`);
    const content = await getFileContent(owner, repo, pomPath, branch);
    if (content) {
      loadedFileContents[pomPath] = content;
      const parsed = parsePomXml(content);
      dependencies = [...dependencies, ...parsed];
    }
  }

  // 4. Run detectors
  const languages = detectLanguages(stats.extensionCounts, metadata.language);
  const frameworks = detectFrameworks(importantFiles, [...dependencies, ...devDependencies], loadedFileContents);
  const stack = detectStack(dependencies, frameworks);
  const features = detectFeatures(treeScannerResult, dependencies);
  const commands = extractCommands(importantFiles, packageJsonData);
  const architectures = detectArchitecture(treeScannerResult, packageJsonData);

  // 5. Build and return summary JSON
  return buildIntelligenceSummary(
    metadata,
    treeScannerResult,
    languages,
    frameworks,
    stack,
    features,
    commands,
    architectures
  );
}
