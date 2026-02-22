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
import { createProxyMiddleware } from 'http-proxy-middleware'
import paymentRoutes from './routes/payment.routes.js'

const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

if (config.env === 'production') app.use(morgan('combined'))
else app.use(morgan('dev'))

app.use(rateLimit({ windowMs: config.rateLimit.windowMs, max: config.rateLimit.max }))

// Mount extracted routes if available (supports runtime-extracted route bundles)
try {
  const routesIndex = path.resolve('./routes/index.js')
  if (fs.existsSync(routesIndex)) {
    const routes = await import(routesIndex)
    if (routes && typeof routes.default === 'function') app.use(routes.default())
  }
} catch (err) {
  // ignore optional extracted routes
}

// Mount payment routes
if (paymentRoutes && typeof paymentRoutes === 'function') {
  app.use('/api/payment', paymentRoutes)
}

// Phase-1 fallback proxy to monolith for unextracted paths
const MONOLITH = process.env.MONOLITH_URL || 'http://host.docker.internal:5000'
app.use('/_proxy/api/payment', createProxyMiddleware({ target: MONOLITH, changeOrigin: true, pathRewrite: { '^/_proxy': '' } }))

app.get('/health', (_req, res) => res.json({ ok: true, service: process.env.SERVICE_NAME || 'payment-service' }))

app.use(notFound)
app.use(errorHandler)

// Connect to Mongo only if a URI is provided
const mongoUri = config?.mongoUri || process.env.MONGO_URI || process.env.MONGODB_URI
if (mongoUri) {
  connectDB().catch((e) => console.warn('payment-service: mongo connect failed', e.message))
}

export default app
