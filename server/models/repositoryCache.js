import { getDb } from '../db/connection.js';

function safeParse(val) {
  if (!val) return null;
  if (typeof val === 'object') return val;
  try {
    return JSON.parse(val);
  } catch (_) {
    return null;
  }
}

/**
 * Retrieves a persistent cache entry
 * 
 * @param {string} cacheKey - Unique repository key (owner/repo/branch/mode)
 * @returns {object|null} The cached row details, or null if missing/expired
 */
export async function getPersistentCache(cacheKey) {
  const supabase = getDb();
  
  const { data, error } = await supabase
    .from('repository_cache')
    .select('*')
    .eq('cache_key', cacheKey)
    .gt('expires_at', new Date().toISOString())
    .maybeSingle();

  if (error) {
    console.error('[RepositoryCache] getPersistentCache error:', error.message);
    return null;
  }

  if (!data) return null;

  return {
    cacheKey: data.cache_key,
    owner: data.owner,
    repo: data.repo,
    metadata: safeParse(data.metadata),
    intelligenceJson: safeParse(data.intelligence_json),
    generatedReadme: data.generated_readme,
    mode: data.mode,
    expiresAt: data.expires_at,
    createdAt: data.created_at
  };
}

/**
 * Saves or updates a persistent cache entry
 * 
 * @param {string} cacheKey - Unique repository key
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {object} metadata - Repository metadata
 * @param {object} intelligenceJson - Unified repository intelligence JSON
 * @param {string} generatedReadme - Markdown content
 * @param {string} mode - Scanning mode
 * @param {number} [ttlMs=3600000] - Expiry TTL (default 1 hour)
 */
export async function setPersistentCache(
  cacheKey, 
  owner, 
  repo, 
  metadata, 
  intelligenceJson, 
  generatedReadme, 
  mode = 'standard',
  ttlMs = 3600000
) {
  const supabase = getDb();
  const expiresAt = new Date(Date.now() + ttlMs).toISOString();

  const { error } = await supabase
    .from('repository_cache')
    .upsert({
      cache_key: cacheKey,
      owner,
      repo,
      metadata: metadata || null,
      intelligence_json: intelligenceJson || null,
      generated_readme: generatedReadme,
      mode,
      expires_at: expiresAt,
      created_at: new Date().toISOString()
    });

  if (error) {
    console.error('[RepositoryCache] setPersistentCache error:', error.message);
  }
}

/**
 * Prunes expired entries from the cache database
 */
export async function prunePersistentCache() {
  const supabase = getDb();
  const { error } = await supabase
    .from('repository_cache')
    .delete()
    .lte('expires_at', new Date().toISOString());

  if (error) {
    console.error('[RepositoryCache] prunePersistentCache error:', error.message);
  }
}
