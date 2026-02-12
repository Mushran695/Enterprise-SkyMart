import redis from '../config/redisClient.js'

/**
 * Invalidate all keys matching `products:*` using iterative SCAN + DEL.
 * Returns number of deleted keys (best-effort).
 */
export async function invalidateProductsCache() {
  const pattern = 'products:*'
  let cursor = '0'
  let removed = 0
  try {
    do {
      const reply = await redis.scan(cursor, 'MATCH', pattern, 'COUNT', '1000')
      cursor = reply[0]
      const keys = reply[1]
      if (keys && keys.length) {
        // del accepts multiple keys; guard against too many args
        removed += await redis.del(...keys)
      }
    } while (cursor !== '0')

    console.log(`[cache] invalidateProductsCache -> ${removed} keys removed`)
    return removed
  } catch (err) {
    console.warn('invalidateProductsCache failed', err && err.message ? err.message : err)
    return 0
  }
}

export default invalidateProductsCache
