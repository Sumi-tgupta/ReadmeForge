/**
 * Request Queue and Deduplication Layer for the Repository Intelligence Engine
 */

const activeScans = new Map();

/**
 * Executes an asynchronous scanning task, deduplicating concurrent identical requests.
 * If a task for the given key is already running, it returns the existing promise.
 * 
 * @param {string} key - Unique key for the scan (e.g. "owner/repo/branch/mode")
 * @param {Function} scanFn - Async function performing the actual scan
 * @returns {Promise<any>} The result of the scanning task
 */
export async function queueScan(key, scanFn) {
  if (activeScans.has(key)) {
    console.log(`[Queue] Deduplicating request: Sharing running scan for "${key}"`);
    return activeScans.get(key);
  }

  console.log(`[Queue] Starting new scan task for "${key}"`);
  
  const scanPromise = (async () => {
    try {
      return await scanFn();
    } finally {
      // Always remove from active map when completed (fulfilled or rejected)
      activeScans.delete(key);
    }
  })();

  activeScans.set(key, scanPromise);
  return scanPromise;
}

/**
 * Returns current statistics of the scan queue
 */
export function getQueueStats() {
  return {
    activeCount: activeScans.size,
    keys: Array.from(activeScans.keys())
  };
}
