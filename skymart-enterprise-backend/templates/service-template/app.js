import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import config from './config/index.js'
import connectDB from './config/db.js'
import { notFound, errorHandler } from './middleware/errorHandler.js'
import fs from 'fs'
import path from 'path'

const app = express()

// Basic middleware
app.use(helmet())
app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Logging
if (config.env === 'production') {
  app.use(morgan('combined'))
} else {
  app.use(morgan('dev'))
}

// Rate limiting
app.use(
  rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.max
  })
)

// Health endpoint
app.get('/health', (_req, res) => res.json({ ok: true, service: process.env.SERVICE_NAME || 'service' }))

// Try to auto-load routes/index.js if present (non-destructive)
try {
  const routesIndex = path.resolve('./routes/index.js')
  if (fs.existsSync(routesIndex)) {
    const routes = await import(routesIndex)
    if (routes && typeof routes.default === 'function') {
      app.use(routes.default())
    }
  }
} catch (err) {
  // ignore; services can keep their own route mounting inside local app.js
}

// Attach 404 + error handler
app.use(notFound)
app.use(errorHandler)

// Connect DB when app starts (optional)
if (config.mongoUri) {
  connectDB().catch((e) => console.warn('connectDB failed', e.message))
}

export default app
