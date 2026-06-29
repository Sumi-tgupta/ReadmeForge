// Rely on native global fetch available in Node 18+

/**
 * Scanner service to retrieve metadata and structure of a public GitHub repository.
 * Relies on public GitHub APIs with graceful rate limit and error handling.
 */
export async function scanRepository(repoUrl) {
  try {
    // Parse owner and repo name from URL
    const urlPattern = /github\.com\/([^\/]+)\/([^\/]+)/i;
    const match = repoUrl.match(urlPattern);
    if (!match) {
      throw new Error('Invalid GitHub repository URL format. Use https://github.com/owner/repo');
    }

    const owner = match[1];
    let repo = match[2];
    // Remove .git suffix if present
    if (repo.endsWith('.git')) {
      repo = repo.slice(0, -4);
    }

    const headers = {
      'User-Agent': 'README-Forge-Scanner',
      'Accept': 'application/vnd.github.v3+json'
    };

    console.log(`[Scanner] Fetching repo info for ${owner}/${repo}...`);
    // 1. Get repository general info
    const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
    if (!repoRes.ok) {
      if (repoRes.status === 404) {
        throw new Error(`Repository ${owner}/${repo} not found or is private.`);
      }
      if (repoRes.status === 403) {
        throw new Error('GitHub API rate limit exceeded. Please try again later.');
      }
      throw new Error(`GitHub API returned error status: ${repoRes.status}`);
    }
    const repoData = await repoRes.json();

    // 2. Get languages breakdown
    let languages = {};
    try {
      const langRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/languages`, { headers });
      if (langRes.ok) {
        languages = await langRes.json();
      }
    } catch (langErr) {
      console.warn('[Scanner] Failed to fetch languages:', langErr.message);
    }

    // 3. Get root directory contents
    let files = [];
    try {
      const contentsRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents`, { headers });
      if (contentsRes.ok) {
        const contents = await contentsRes.json();
        files = Array.isArray(contents) ? contents.map(item => ({
          name: item.name,
          type: item.type,
          path: item.path
        })) : [];
      }
    } catch (contentsErr) {
      console.warn('[Scanner] Failed to fetch contents:', contentsErr.message);
    }

    // 4. Check for package.json or requirements.txt to read dependencies
    let dependencies = null;
    let scripts = null;
    const packageJsonFile = files.find(f => f.name.toLowerCase() === 'package.json');
    if (packageJsonFile) {
      try {
        const rawRes = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/master/package.json`, { headers });
        if (rawRes.ok) {
          const pkg = await rawRes.json();
          dependencies = {
            dependencies: pkg.dependencies ? Object.keys(pkg.dependencies) : [],
            devDependencies: pkg.devDependencies ? Object.keys(pkg.devDependencies) : []
          };
          scripts = pkg.scripts ? Object.keys(pkg.scripts) : [];
        }
      } catch (pkgErr) {
        console.warn('[Scanner] Failed to fetch raw package.json:', pkgErr.message);
      }
    }

    return {
      name: repoData.name,
      fullName: repoData.full_name,
      description: repoData.description || 'No description provided.',
      owner: repoData.owner?.login,
      stars: repoData.stargazers_count,
      forks: repoData.forks_count,
      license: repoData.license?.name || repoData.license?.spdx_id || 'None',
      topics: repoData.topics || [],
      languages: Object.keys(languages),
      files: files.map(f => `${f.type === 'dir' ? '[DIR]' : '[FILE]'} ${f.name}`),
      dependencies,
      scripts
    };
  } catch (err) {
    console.error(`[Scanner] Error scanning ${repoUrl}:`, err.message);
    throw err;
  }
}
