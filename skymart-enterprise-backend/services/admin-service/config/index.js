import dotenv from 'dotenv'

dotenv.config()

const NODE_ENV = process.env.NODE_ENV || 'development'

const config = {
  env: NODE_ENV,
  port: Number(process.env.PORT) || 3005,
  mongoUri: process.env.MONGO_URI || '',
  jwtSecret: process.env.JWT_SECRET || 'please-change-me',
  logLevel: process.env.LOG_LEVEL || (NODE_ENV === 'production' ? 'info' : 'debug'),
  rateLimit: {
    windowMs: Number(process.env.RATE_WINDOW_MS) || 15 * 60 * 1000,
    max: Number(process.env.RATE_MAX) || 100
  }
}

export default config
