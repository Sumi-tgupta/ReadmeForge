/**
 * Memory cache layer for Repository Intelligence outputs
 */

const cacheStore = new Map();
const DEFAULT_TTL = 3600 * 1000; // 1 hour in milliseconds

/**
 * Generates a standard cache key
 * 
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {string} sha - Commit SHA or branch name (default)
 * @param {string} mode - Scanning mode (e.g. "standard")
 * @returns {string} The formatted cache key
 */
export function buildCacheKey(owner, repo, sha, mode) {
  return `${owner.toLowerCase()}/${repo.toLowerCase()}/${(sha || 'default').toLowerCase()}/${mode.toLowerCase()}`;
}

/**
 * Retrieves a cached item if not expired
 * 
 * @param {string} key - Cache key
 * @returns {any|null} The cached item value, or null if missing/expired
 */
export function getCached(key) {
  const item = cacheStore.get(key);
  if (!item) return null;

  if (Date.now() > item.expiresAt) {
    cacheStore.delete(key);
    return null;
  }

  return item.value;
}

/**
 * Stores an item in cache with a TTL
 * 
 * @param {string} key - Cache key
 * @param {any} value - Value to cache
 * @param {number} [ttl=DEFAULT_TTL] - Time to live in milliseconds
 */
export function setCache(key, value, ttl = DEFAULT_TTL) {
  cacheStore.set(key, {
    value,
    expiresAt: Date.now() + ttl
  });
}

/**
 * Evicts expired items from the cache store to reclaim memory
 */
export function pruneCache() {
  const now = Date.now();
  for (const [key, item] of cacheStore.entries()) {
    if (now > item.expiresAt) {
      cacheStore.delete(key);
    }
  }
}

/**
 * Returns cache size and details
 */
export function getCacheStats() {
  pruneCache();
  return {
    size: cacheStore.size,
    keys: Array.from(cacheStore.keys())
  };
}

// Automatically prune cache every 15 minutes to prevent memory leaks
setInterval(pruneCache, 15 * 60 * 1000).unref();
