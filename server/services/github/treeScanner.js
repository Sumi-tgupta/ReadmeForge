import { IGNORED_PATHS, IGNORED_EXTENSIONS, IMPORTANT_FILES } from './constants.js';

/**
 * Parses and filters a GitHub recursive directory tree.
 * Strips out binaries, lockfiles, node_modules, build directories, etc.
 * Detects location of important configuration files.
 * 
 * @param {Array<object>} tree - GitHub tree nodes array
 * @returns {object} Scanned tree structure details and stats
 */
export function scanTree(tree) {
  if (!tree || !Array.isArray(tree)) {
    return { files: [], folders: [], importantFiles: {}, stats: { filesCount: 0, foldersCount: 0, sizeBytes: 0 } };
  }

  const files = [];
  const folders = [];
  const importantFiles = {}; // Maps base name -> list of actual paths found
  
  let filesCount = 0;
  let foldersCount = 0;
  let sizeBytes = 0;
  const extensionCounts = {};
  
  for (const node of tree) {
    const path = node.path;
    const segments = path.split('/');
    
    // 1. Path segment checks: Ignore ignored directories at any hierarchy depth
    const hasIgnoredSegment = segments.some(segment => IGNORED_PATHS.includes(segment));
    if (hasIgnoredSegment) {
      continue;
    }

    if (node.type === 'tree') {
      folders.push(path);
      foldersCount++;
    } else if (node.type === 'blob') {
      const filename = segments[segments.length - 1];
      const filenameLower = filename.toLowerCase();

      // 2. Extension / file-specific ignore checks
      const isIgnoredFile = IGNORED_EXTENSIONS.some(ignored => {
        if (ignored.startsWith('.')) {
          return filenameLower.endsWith(ignored);
        }
        return filenameLower === ignored;
      });

      if (isIgnoredFile) {
        continue;
      }

      files.push(path);
      filesCount++;
      sizeBytes += (node.size || 0);

      // Track extension types
      const dotIndex = filename.lastIndexOf('.');
      if (dotIndex !== -1) {
        const ext = filename.substring(dotIndex).toLowerCase();
        extensionCounts[ext] = (extensionCounts[ext] || 0) + 1;
      }

      // Check if file is in IMPORTANT_FILES registry
      // Note: we check if the full name match occurs
      const matchedImportant = IMPORTANT_FILES.find(important => {
        if (important.startsWith('*.')) {
          const matchExt = important.substring(1);
          return filenameLower.endsWith(matchExt);
        }
        return filenameLower === important.toLowerCase();
      });

      if (matchedImportant) {
        // Record all matched locations (since some repos might have multiple package.json files)
        if (!importantFiles[matchedImportant]) {
          importantFiles[matchedImportant] = [];
        }
        importantFiles[matchedImportant].push(path);
      }
    }
  }

  return {
    files,
    folders,
    importantFiles,
    stats: {
      filesCount,
      foldersCount,
      sizeBytes,
      extensionCounts
    }
  };
}
