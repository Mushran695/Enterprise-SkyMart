import redis, { delByPattern } from '../lib/redisClient.js'

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
      const sendJson = res.json.bind(res)
      res.json = (body) => {
        try {
          res.setHeader('X-Cache', 'MISS')
          redis.set(key, JSON.stringify(body), 'EX', ttl).catch(() => {})
          console.log(`[cache] SET ${key} (TTL ${ttl}s)`)
        } catch (e) {}
        return sendJson(body)
      }
      next()
    } catch (err) { next() }
  }
}

export { delByPattern as invalidatePattern }

// Convenience wrapper that composes a prefix with the request URL
export function cache(prefix, ttl = 60) {
  return cacheMiddleware((req) => `${prefix}:${req.originalUrl}`, ttl)
}
