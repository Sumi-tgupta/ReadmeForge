/**
 * GitHub API Client using native fetch.
 * Incorporates GITHUB_TOKEN support for elevated rate limits.
 */

const GITHUB_API_BASE = 'https://api.github.com';

/**
 * Helper to build GitHub headers
 */
function getHeaders() {
  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'README-Forge-Intelligence-Engine'
  };

  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
  }

  return headers;
}

/**
 * Fetches repository core metadata from GitHub
 * 
 * @param {string} owner - Repo owner
 * @param {string} repo - Repo name
 * @returns {Promise<object>} Core metadata JSON
 */
export async function getRepoMetadata(owner, repo) {
  const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}`;
  const response = await fetch(url, { headers: getHeaders() });

  if (response.status === 404) {
    throw new Error(`Repository not found: ${owner}/${repo}`);
  }
  if (response.status === 403 || response.status === 429) {
    throw new Error('GitHub API rate limit exceeded or access forbidden. Please add a GITHUB_TOKEN on the server.');
  }
  if (!response.ok) {
    throw new Error(`GitHub metadata fetch failed: ${response.statusText} (${response.status})`);
  }

  return await response.json();
}

/**
 * Fetches the recursive directory tree of the repository
 * 
 * @param {string} owner - Repo owner
 * @param {string} repo - Repo name
 * @param {string} branch - Branch/ref name
 * @returns {Promise<object>} The tree nodes list
 */
export async function getRecursiveTree(owner, repo, branch) {
  const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`;
  const response = await fetch(url, { headers: getHeaders() });

  if (response.status === 404) {
    throw new Error(`Default branch "${branch}" tree not found for repository: ${owner}/${repo}`);
  }
  if (!response.ok) {
    throw new Error(`GitHub tree fetch failed: ${response.statusText} (${response.status})`);
  }

  const json = await response.json();
  
  if (json.truncated) {
    console.warn(`[GitHub Client] Tree scan for ${owner}/${repo} was truncated by GitHub API`);
  }

  return json;
}

/**
 * Fetches raw file content from the repository
 * 
 * @param {string} owner - Repo owner
 * @param {string} repo - Repo name
 * @param {string} path - Remote path of the file
 * @param {string} branch - Branch/ref name
 * @returns {Promise<string|null>} File contents or null if not found
 */
export async function getFileContent(owner, repo, path, branch) {
  const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;
  const headers = getHeaders();
  // Request raw format directly from GitHub API
  headers['Accept'] = 'application/vnd.github.raw';

  try {
    const response = await fetch(url, { headers });
    
    if (response.status === 404) {
      return null;
    }
    if (!response.ok) {
      throw new Error(`Failed to fetch file "${path}": ${response.statusText}`);
    }

    return await response.text();
  } catch (err) {
    console.error(`[GitHub Client] Error fetching file content for "${path}":`, err.message);
    return null;
  }
}
