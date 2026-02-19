import express from 'express'
import helmet from 'helmet'
// import cors from 'cors'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import config from './config/index.js'
import connectDB from './config/db.js'
import { notFound, errorHandler } from './middleware/errorHandler.js'
import { createProxyMiddleware } from 'http-proxy-middleware'
import adminRoutes from './routes/admin.routes.js'

const app = express()

app.use(helmet())
// app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

if (config.env === 'production') app.use(morgan('combined'))
else app.use(morgan('dev'))

app.use(rateLimit({ windowMs: config.rateLimit.windowMs, max: config.rateLimit.max }))

app.use('/api/admin', adminRoutes)

// Fallback proxy (optional)
const MONOLITH = process.env.MONOLITH_URL || 'http://host.docker.internal:5000'
app.use('/_proxy/api/admin', createProxyMiddleware({ target: MONOLITH, changeOrigin: true, pathRewrite: { '^/_proxy': '' } }))

app.get('/health', (_req, res) => res.json({ ok: true, service: process.env.SERVICE_NAME || 'admin-service' }))

app.use(notFound)
app.use(errorHandler)

const mongoUri = config?.mongoUri || process.env.MONGO_URI || process.env.MONGODB_URI
if (mongoUri) {
  connectDB().catch((e) => console.warn('admin-service: mongo connect failed', e.message))
}

const PORT = process.env.PORT || config.port || 3005
app.listen(PORT, () => console.log(`admin-service listening ${PORT}`))
