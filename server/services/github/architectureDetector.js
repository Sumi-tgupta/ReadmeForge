/**
 * Architecture Detector: Maps repository components to architectural profiles (monorepo, API, CLI, mobile, library, etc.)
 */

/**
 * Detects architectural patterns in the repository tree
 * 
 * @param {object} treeScannerOutput - Files, folders, and importantFiles mapping
 * @param {object} packageJsonData - Extracted packages and dependencies
 * @returns {Array<string>} List of architectural patterns detected
 */
export function detectArchitecture(treeScannerOutput, packageJsonData = {}) {
  const architectures = new Set();
  const { folders = [], files = [], importantFiles = {} } = treeScannerOutput;
  const dependencies = packageJsonData.dependencies || [];
  const depSet = new Set(dependencies.map(d => d.toLowerCase()));

  // 1. Monorepo detection
  const hasMultiplePackageDocs = 
    (importantFiles['package.json'] && importantFiles['package.json'].length > 1) ||
    (importantFiles['cargo.toml'] && importantFiles['cargo.toml'].length > 1) ||
    (importantFiles['go.mod'] && importantFiles['go.mod'].length > 1);

  const hasWorkspaces = files.some(f => f.includes('pnpm-workspace.yaml') || f.includes('lerna.json')) ||
                        folders.includes('packages') || folders.includes('apps');

  if (hasMultiplePackageDocs || hasWorkspaces) {
    architectures.add('Monorepo Workspace');
  }

  // 2. Mobile app detection
  const hasMobileFolders = folders.some(f => f === 'ios' || f === 'android');
  const hasMobileDeps = depSet.has('react-native') || depSet.has('expo') || depSet.has('flutter') || depSet.has('cordova');
  if (hasMobileFolders || hasMobileDeps) {
    architectures.add('Mobile Application');
  }

  // 3. Desktop application
  const hasDesktopDeps = depSet.has('electron') || depSet.has('tauri') || depSet.has('@tauri-apps/api');
  if (hasDesktopDeps) {
    architectures.add('Desktop Application');
  }

  // 4. CLI tool
  const hasCliFolders = folders.some(f => f === 'bin' || f === 'cli' || f === 'cmd');
  const hasCliDeps = depSet.has('commander') || depSet.has('yargs') || depSet.has('clap') || depSet.has('cobra');
  if (hasCliFolders || hasCliDeps) {
    architectures.add('Command Line Interface (CLI) Tool');
  }

  // 5. Library / NPM Package / Crate
  const hasLibraryConfigs = files.some(f => f.includes('tsup.config') || f.includes('rollup.config') || f.includes('vite.config.lib'));
  if (hasLibraryConfigs || depSet.has('microbundle')) {
    architectures.add('Software Development Library / Package');
  }

  // 6. REST / GraphQL API Backend
  const hasBackendFrameworks = depSet.has('express') || depSet.has('fastify') || depSet.has('@nestjs/core') || depSet.has('fastapi') || depSet.has('django');
  if (hasBackendFrameworks) {
    architectures.add('Web Service API Backend');
  }

  // Fallback default: client-side web application
  const hasFrontendFrameworks = depSet.has('react') || depSet.has('vue') || depSet.has('angular') || depSet.has('svelte') || importantFiles['index.html'];
  if (hasFrontendFrameworks && !hasBackendFrameworks) {
    architectures.add('Frontend Client Application');
  }

  return Array.from(architectures);
}
