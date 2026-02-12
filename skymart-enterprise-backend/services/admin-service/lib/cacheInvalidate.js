import { delByPattern } from './redisClient.js'

/**
 * Invalidate admin-related cache keys using scan-based deletion.
 * Returns number of deleted keys (best-effort).
 */
export async function invalidateAdminCache() {
  try {
    const removed = await delByPattern('admin:*')
    console.log(`[cache] invalidateAdminCache -> ${removed || 0} keys removed`)
    return removed || 0
  } catch (err) {
    console.warn('invalidateAdminCache failed', err && err.message ? err.message : err)
    return 0
  }
}

export default invalidateAdminCache
