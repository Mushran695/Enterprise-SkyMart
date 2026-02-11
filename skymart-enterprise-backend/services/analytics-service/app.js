import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import analyticsRoutes from './routes/analytics.routes.js'
import { createProxyMiddleware } from 'http-proxy-middleware'

dotenv.config()
const app = express()
app.use(express.json())

const MONOLITH = process.env.MONOLITH_URL || 'http://host.docker.internal:5000'

if (process.env.MONGO_URI) {
  connectDB().catch((e) => console.warn('analytics-service: mongo connect failed', e.message))
}

app.use('/api/analytics', analyticsRoutes)
app.use('/api/admin', analyticsRoutes)

// Fallback proxy
app.use('/_proxy/api/analytics', createProxyMiddleware({ target: MONOLITH, changeOrigin: true, pathRewrite: { '^/_proxy': '' } }))
app.use('/_proxy/api/admin', createProxyMiddleware({ target: MONOLITH, changeOrigin: true, pathRewrite: { '^/_proxy': '' } }))

app.get('/health', (req, res) => res.json({ ok: true, service: 'analytics-service' }))

const PORT = process.env.PORT || 3004
app.listen(PORT, () => console.log(`analytics-service listening ${PORT}`))
