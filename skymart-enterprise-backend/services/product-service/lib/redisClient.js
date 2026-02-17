import Redis from 'ioredis'

const url = process.env.REDIS_URL || process.env.REDIS || 'redis://redis:6379'
let redis = null
let useFallback = Boolean(process.env.FORCE_REDIS_FALLBACK && process.env.FORCE_REDIS_FALLBACK !== '0')

if (!useFallback) {
  try {
    redis = new Redis(url)
    redis.on('error', (err) => {
      console.error('Redis error', err)
      // fall back to in-memory store on connection failures
      useFallback = true
    })
    redis.on('connect', () => console.info('Redis connected'))
  } catch (e) {
    console.warn('ioredis init failed, using in-memory fallback', e.message)
    useFallback = true
  }
} else {
  console.info('FORCE_REDIS_FALLBACK enabled; using in-memory cache')
}

// In-memory fallback store for local/demo when Redis isn't available
const memory = new Map()

async function get(key) {
  if (!useFallback && redis) return redis.get(key)
  const v = memory.get(key)
  return Promise.resolve(v === undefined ? null : v)
}

async function set(key, value, mode, ttl) {
  if (!useFallback && redis) return redis.set(key, value, mode, ttl)
  memory.set(key, value)
  if (mode === 'EX' && ttl) {
    setTimeout(() => memory.delete(key), ttl * 1000)
  }
  return Promise.resolve('OK')
}

// Delete keys by pattern using iteration for fallback
async function delByPattern(pattern) {
  if (!useFallback && redis) {
    const stream = redis.scanStream({ match: pattern, count: 100 })
    const pipeline = redis.pipeline()
    let removed = 0
    return new Promise((resolve, reject) => {
      stream.on('data', (keys) => {
        if (keys.length) keys.forEach((key) => pipeline.del(key))
      })
      stream.on('end', async () => {
        try {
          const res = await pipeline.exec()
          // sum deleted count where available
          res.forEach((r) => {
            if (Array.isArray(r) && r[1] && typeof r[1] === 'number') removed += r[1]
          })
          resolve(removed)
        } catch (e) {
          reject(e)
        }
      })
      stream.on('error', reject)
    })
  }

  // fallback scanning
  const keys = Array.from(memory.keys())
  let removed = 0
  const regex = new RegExp('^' + pattern.replace('*', '.*') + '$')
  keys.forEach((k) => {
    if (regex.test(k)) {
      memory.delete(k)
      removed++
    }
  })
  return removed
}

const client = {
  get,
  set,
  delByPattern,
  on: (ev, cb) => redis && redis.on ? redis.on(ev, cb) : null
}

export default client
