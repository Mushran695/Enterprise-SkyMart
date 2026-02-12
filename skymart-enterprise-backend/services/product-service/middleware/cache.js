import redis from '../config/redisClient.js'

export function cacheMiddleware(keyFn, ttl = 60) {
  return async (req, res, next) => {
    try {
      const key = keyFn(req)
      const cached = await redis.get(key)
      if (cached) {
        res.setHeader('X-Cache', 'HIT')
        console.log(`[cache] HIT ${key} (${req.method} ${req.originalUrl})`)
        try {
          return res.json(JSON.parse(cached))
        } catch (e) {
          console.error('Failed to parse cached payload:', e)
        }
      }

      // intercept response.json to set cache on successful responses
      const sendJson = res.json.bind(res)
      res.json = (body) => {
        try {
          res.setHeader('X-Cache', 'MISS')
          // store in redis (best-effort, don't block response)
          redis.set(key, JSON.stringify(body), 'EX', ttl).catch(() => {})
          console.log(`[cache] SET ${key} (TTL ${ttl}s)`)
        } catch (e) {
          console.error('Cache set error', e)
        }
        return sendJson(body)
      };
      next()
    } catch (err) {
      console.error('cacheMiddleware error', err)
      return next()
    }
  }
}

// Convenience wrapper that uses a static prefix + the request's originalUrl
export function cache(prefix, ttl = 60) {
  return cacheMiddleware((req) => {
    return `${prefix}${req.originalUrl}`
  }, ttl)
}

export async function invalidatePattern(pattern) {
  try {
    let cursor = '0'
    let removed = 0
    // use SCAN to avoid blocking Redis for large keyspaces
    do {
      const reply = await redis.scan(cursor, 'MATCH', pattern, 'COUNT', '1000')
      cursor = reply[0]
      const keys = reply[1]
      if (keys && keys.length) {
        // redis.del accepts multiple keys
        removed += await redis.del(...keys)
      }
    } while (cursor !== '0')
    console.log(`[cache] invalidatePattern ${pattern} -> ${removed} keys removed`)
    return removed
  } catch (err) {
    console.warn('invalidatePattern failed', err && err.message ? err.message : err)
    return 0
  }
}
