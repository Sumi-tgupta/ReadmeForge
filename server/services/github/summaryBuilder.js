/**
 * Summary Builder: Generates the unified Repository Intelligence JSON and folder structures
 */

/**
 * Builds the comprehensive Repository Intelligence JSON structure
 * 
 * @param {object} metadata - Core GitHub metadata
 * @param {object} treeScannerOutput - Output of treeScanner
 * @param {Array<string>} languages - Sorted language list
 * @param {Array<string>} frameworks - Sorted frameworks list
 * @param {object} stack - Categorized stack details
 * @param {Array<string>} features - Codebase feature capability tags
 * @param {object} commands - Run commands dictionary
 * @param {Array<string>} architectures - Architecture profiles
 * @returns {object} Highly optimized Repository Intelligence JSON
 */
export function buildIntelligenceSummary(
  metadata,
  treeScannerOutput,
  languages,
  frameworks,
  stack,
  features,
  commands,
  architectures
) {
  const structure = generateAsciiTree(treeScannerOutput.files, treeScannerOutput.folders);

  return {
    repository: {
      name: metadata.name || '',
      owner: metadata.owner?.login || '',
      description: metadata.description || '',
      homepage: metadata.homepage || '',
      topics: metadata.topics || [],
      stars: metadata.stargazers_count || 0,
      forks: metadata.forks_count || 0,
      license: metadata.license?.spdx_id || metadata.license?.name || 'None',
      defaultBranch: metadata.default_branch || 'main',
      archived: metadata.archived || false,
      sizeKb: metadata.size || 0
    },
    stack: {
      languages,
      frameworks,
      ...stack
    },
    architectures,
    features,
    commands,
    structure
  };
}

/**
 * Generates a simplified, depth-limited ASCII representation of the folder tree structure
 * 
 * @param {Array<string>} files - Scanned file paths
 * @param {Array<string>} folders - Scanned folder paths
 * @param {number} [maxDepth=3] - Maximum tree depth to output
 * @returns {Array<string>} List of string lines representing the ASCII tree
 */
export function generateAsciiTree(files, folders, maxDepth = 3) {
  const root = { name: 'Root', children: {} };

  // Helper to insert a path into the virtual tree
  const insertPath = (path, isDir) => {
    const parts = path.split('/');
    if (parts.length > maxDepth) return; // skip deep paths to save tokens

    let current = root;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isLast = i === parts.length - 1;
      
      if (!current.children[part]) {
        current.children[part] = {
          name: part,
          isDir: !isLast || isDir,
          children: {}
        };
      }
      current = current.children[part];
    }
  };

  // Insert folders
  folders.forEach(f => insertPath(f, true));
  // Insert files (only if they are root files or immediate directory children to save space)
  files.forEach(f => {
    const parts = f.split('/');
    if (parts.length <= 2) {
      insertPath(f, false);
    }
  });

  const lines = [];

  // Helper to build tree lines recursively
  const buildTree = (node, prefix = '') => {
    const keys = Object.keys(node.children).sort((a, b) => {
      // Directories first, then alphabetical
      const nodeA = node.children[a];
      const nodeB = node.children[b];
      if (nodeA.isDir && !nodeB.isDir) return -1;
      if (!nodeA.isDir && nodeB.isDir) return 1;
      return a.localeCompare(b);
    });

    keys.forEach((key, idx) => {
      const child = node.children[key];
      const isLast = idx === keys.length - 1;
      const connector = isLast ? '└── ' : '├── ';
      
      lines.push(`${prefix}${connector}${child.name}${child.isDir ? '/' : ''}`);
      
      if (child.isDir && Object.keys(child.children).length > 0) {
        const newPrefix = prefix + (isLast ? '    ' : '│   ');
        buildTree(child, newPrefix);
      }
    });
  };

  buildTree(root);
  return lines;
}
