import Redis from 'ioredis';

const host = process.env.REDIS_HOST || '127.0.0.1';
const port = process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379;

const redis = new Redis({ host, port });

redis.on('connect', () => console.log('Redis client connecting...'));
redis.on('ready', () => console.log('Redis client ready'));
redis.on('error', (err) => console.error('Redis error:', err));
redis.on('close', () => console.log('Redis connection closed'));

export default redis;
