import express from 'express'
import helmet from 'helmet'
// import cors from 'cors'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import config from './config/index.js'
import connectDB from './config/db.js'
import { notFound, errorHandler } from './middleware/errorHandler.js'
import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'
import { createProxyMiddleware } from 'http-proxy-middleware'

const app = express()

app.use(helmet())
// app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

app.use(morgan(config.env === 'production' ? 'combined' : 'dev'))

app.use(
  rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.max,
  })
)

// Mount extracted routes if available (supports router object or factory)
try {
  const routesIndex = path.resolve('./routes/index.js')
  if (fs.existsSync(routesIndex)) {
    const routes = await import(pathToFileURL(routesIndex).href)
    const routeExport = routes && routes.default ? routes.default : routes
    if (routeExport) {
      if (typeof routeExport === 'function') {
        app.use(routeExport())
      } else {
        app.use(routeExport)
      }
    }
  }
} catch (err) {
  console.error("Failed to mount routes:", err)
}

// Phase-1 fallback proxy to monolith for unextracted paths
const MONOLITH = process.env.MONOLITH_URL || 'http://host.docker.internal:5000'
app.use(
  '/_proxy/api/orders',
  createProxyMiddleware({
    target: MONOLITH,
    changeOrigin: true,
    pathRewrite: { '^/_proxy': '' },
  })
)

app.get('/health', (_req, res) =>
  res.json({ ok: true, service: process.env.SERVICE_NAME || 'order-service' })
)

app.use(notFound)
app.use(errorHandler)

// Connect DB if mongoUri exists
if (config.mongoUri || process.env.MONGO_URI || process.env.MONGODB_URI) {
  connectDB().catch((e) => console.warn('order-service: connectDB failed', e.message))
}

export default app
