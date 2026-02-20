import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import config from './config/index.js'
import connectDB from './config/db.js'
import { createProxyMiddleware } from 'http-proxy-middleware'
import apiRoutes from './routes/index.js'

const app = express()

app.use(helmet())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

app.use(morgan(config.env === 'production' ? 'combined' : 'dev'))

app.use(
  rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.max,
  })
)

// ✅ Mount API routes under /api
// This means: routes/index.js defines /cart and /orders (NOT /api/cart)
app.use('/api', apiRoutes())

// Phase-1 fallback proxy to monolith for unextracted paths (keep if you need it)
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

// Connect DB if mongoUri exists
const mongoUri = config?.mongoUri || process.env.MONGO_URI || process.env.MONGODB_URI
if (mongoUri) {
  connectDB().catch((e) => console.warn('order-service: mongo connect failed', e.message))
}

export default app