import { validateRepoUrl } from './validators.js';
import { getRepoMetadata } from './githubClient.js';
import { analyzeRepository } from './githubAnalyzer.js';
import { queueScan } from './requestQueue.js';
import { buildCacheKey, getCached, setCache } from './cache.js';

/**
 * Validates, loads, and scans a public GitHub repository.
 * Deduplicates concurrent requests and caches outputs in memory.
 * 
 * @param {string} url - GitHub repository URL
 * @param {string} [mode='standard'] - Analysis mode
 * @returns {Promise<object>} The Repository Intelligence JSON
 */
export async function scanRepository(url, mode = 'standard') {
  // 1. Validate repository URL
  const validation = validateRepoUrl(url);
  if (!validation.isValid) {
    throw new Error(validation.error || 'Invalid repository URL');
  }

  const { owner, repo } = validation;
  
  // 2. Fetch metadata first to resolve default branch / SHA to build cache key
  console.log(`[RepoScanner] Fetching metadata for ${owner}/${repo}`);
  const metadata = await getRepoMetadata(owner, repo);
  
  if (metadata.private) {
    throw new Error('Repository is private. Only public repositories are supported.');
  }

  const branch = metadata.default_branch || 'main';
  const cacheKey = buildCacheKey(owner, repo, branch, mode);

  // 3. Cache Check
  const cachedSummary = getCached(cacheKey);
  if (cachedSummary) {
    console.log(`[RepoScanner] Cache hit for "${cacheKey}"`);
    return cachedSummary;
  }

  // 4. Request Queueing (Deduplication) & Analysis
  const result = await queueScan(cacheKey, async () => {
    // Run full analysis
    const summary = await analyzeRepository(owner, repo, metadata);
    
    // Store in cache
    setCache(cacheKey, summary);
    return summary;
  });

  return result;
}
