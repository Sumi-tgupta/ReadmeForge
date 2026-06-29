import { getDb } from '../db/connection.js';

/**
 * Model helper to manage SQLite persistent cache for scanned repositories.
 */

let isInitialized = false;

/**
 * Initializes the repository_cache table in the SQLite database
 */
export function initTable() {
  if (isInitialized) return;
  
  const db = getDb();
  db.exec(`
    CREATE TABLE IF NOT EXISTS repository_cache (
      cache_key TEXT PRIMARY KEY,
      owner TEXT NOT NULL,
      repo TEXT NOT NULL,
      metadata TEXT,
      intelligence_json TEXT,
      generated_readme TEXT,
      mode TEXT DEFAULT 'standard',
      expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_repo_cache_owner_repo ON repository_cache(owner, repo);
  `);

  isInitialized = true;
}

/**
 * Retrieves a persistent cache entry
 * 
 * @param {string} cacheKey - Unique repository key (owner/repo/branch/mode)
 * @returns {object|null} The cached row details, or null if missing/expired
 */
export function getPersistentCache(cacheKey) {
  initTable();
  const db = getDb();
  
  const row = db.prepare(`
    SELECT * FROM repository_cache 
    WHERE cache_key = ? AND expires_at > datetime('now')
  `).get(cacheKey);

  if (!row) return null;

  try {
    return {
      cacheKey: row.cache_key,
      owner: row.owner,
      repo: row.repo,
      metadata: row.metadata ? JSON.parse(row.metadata) : null,
      intelligenceJson: row.intelligence_json ? JSON.parse(row.intelligence_json) : null,
      generatedReadme: row.generated_readme,
      mode: row.mode,
      expiresAt: row.expires_at,
      createdAt: row.created_at
    };
  } catch (err) {
    console.error('[RepositoryCache] Error parsing DB cache JSON:', err.message);
    return null;
  }
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
export function setPersistentCache(
  cacheKey, 
  owner, 
  repo, 
  metadata, 
  intelligenceJson, 
  generatedReadme, 
  mode = 'standard',
  ttlMs = 3600000
) {
  initTable();
  const db = getDb();

  const expiresAt = new Date(Date.now() + ttlMs).toISOString();

  db.prepare(`
    INSERT OR REPLACE INTO repository_cache (
      cache_key, owner, repo, metadata, intelligence_json, generated_readme, mode, expires_at, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
  `).run(
    cacheKey,
    owner,
    repo,
    metadata ? JSON.stringify(metadata) : null,
    intelligenceJson ? JSON.stringify(intelligenceJson) : null,
    generatedReadme,
    mode,
    expiresAt
  );
}

/**
 * Prunes expired entries from the cache database
 */
export function prunePersistentCache() {
  initTable();
  const db = getDb();
  db.prepare("DELETE FROM repository_cache WHERE expires_at <= datetime('now')").run();
}
