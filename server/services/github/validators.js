/**
 * Validators for the Repository Intelligence Engine
 */

/**
 * Validates a GitHub repository URL
 * Rejects organizations, gists, pull requests, issues, raw, blob, and wiki URLs.
 * Extracts the owner, repository, and optional branch/path.
 * 
 * @param {string} url - The URL to validate
 * @returns {object} { isValid: boolean, owner: string, repo: string, error?: string }
 */
export function validateRepoUrl(url) {
  if (!url || typeof url !== 'string') {
    return { isValid: false, error: 'Repository URL is required and must be a string' };
  }

  const cleanUrl = url.trim();

  // Basic regex check for github.com
  if (!cleanUrl.startsWith('https://github.com/') && !cleanUrl.startsWith('http://github.com/')) {
    return { isValid: false, error: 'Only public GitHub repositories are supported (must start with https://github.com/)' };
  }

  try {
    const parsedUrl = new URL(cleanUrl);
    const pathParts = parsedUrl.pathname.split('/').filter(p => p !== '');

    if (pathParts.length < 2) {
      return { isValid: false, error: 'Invalid URL structure. Must contain at least owner and repository names (e.g., https://github.com/owner/repo)' };
    }

    const [owner, repo, action, ...rest] = pathParts;

    // Check for ignored patterns in the action slot
    if (action) {
      const ignoredActions = ['issues', 'pulls', 'pull', 'projects', 'actions', 'security', 'pulse', 'wiki', 'settings', 'releases', 'tags'];
      if (ignoredActions.includes(action.toLowerCase())) {
        return { isValid: false, error: `Invalid URL: Directory actions like "${action}" are not supported. Please provide the root URL of a repository.` };
      }

      // Rejects blob or raw file paths (we need repository root)
      if (['blob', 'raw', 'tree'].includes(action.toLowerCase())) {
        // We can extract branch if it is tree, but let's reject file blobs or subfolders
        if (action.toLowerCase() === 'blob' || action.toLowerCase() === 'raw') {
          return { isValid: false, error: 'URL points to a specific file. Please provide the repository root URL.' };
        }
      }
    }

    // Owner and repo checks
    if (!/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i.test(owner)) {
      return { isValid: false, error: 'Invalid GitHub owner username structure' };
    }

    // GitHub repo names can be alphanumeric, hyphens, underscores, or periods
    if (!/^[a-z\d-_.]{1,100}$/i.test(repo)) {
      return { isValid: false, error: 'Invalid GitHub repository name structure' };
    }

    return {
      isValid: true,
      owner,
      repo: repo.replace(/\.git$/, '') // Strip trailing .git if present
    };

  } catch (err) {
    return { isValid: false, error: `Invalid URL format: ${err.message}` };
  }
}
