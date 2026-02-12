import Redis from 'ioredis'

const url = process.env.REDIS_URL || process.env.REDIS || 'redis://127.0.0.1:6379'
const redis = new Redis(url)

redis.on('error', (err) => console.error('Redis error', err))
redis.on('connect', () => console.info('Redis connected'))

export async function delByPattern(pattern) {
  const stream = redis.scanStream({ match: pattern, count: 100 })
  const pipeline = redis.pipeline()
  return new Promise((resolve, reject) => {
    stream.on('data', (keys) => {
      if (keys.length) keys.forEach((key) => pipeline.del(key))
    })
    stream.on('end', async () => {
      try {
        await pipeline.exec()
        resolve()
      } catch (e) { reject(e) }
    })
    stream.on('error', reject)
  })
}

export default redis
