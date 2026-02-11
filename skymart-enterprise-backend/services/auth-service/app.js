import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import authRoutes from './routes/auth.routes.js'
import { createProxyMiddleware } from 'http-proxy-middleware'

dotenv.config()
const app = express()
app.use(express.json())

const MONOLITH = process.env.MONOLITH_URL || 'http://host.docker.internal:5000'

// Connect to Mongo if provided
if (process.env.MONGO_URI) {
  connectDB().catch((e) => console.warn('auth-service: mongo connect failed', e.message))
}

// Use extracted auth routes (Phase 2 replacement)
app.use('/api/auth', authRoutes)

// Fallback proxy for any other auth-related paths not yet extracted
app.use('/_proxy/api/auth', createProxyMiddleware({ target: MONOLITH, changeOrigin: true, pathRewrite: { '^/_proxy': '' } }))

app.get('/health', (req, res) => {
  res.json({ ok: true, service: 'auth-service' })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`auth-service listening ${PORT}`))
