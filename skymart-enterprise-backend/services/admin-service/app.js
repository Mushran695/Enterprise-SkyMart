import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import adminRoutes from './routes/admin.routes.js'
import { createProxyMiddleware } from 'http-proxy-middleware'

dotenv.config()
const app = express()
app.use(express.json())

const MONOLITH = process.env.MONOLITH_URL || 'http://host.docker.internal:5000'

if (process.env.MONGO_URI) {
  connectDB().catch((e) => console.warn('admin-service: mongo connect failed', e.message))
}

app.use('/api/admin', adminRoutes)

// Fallback proxy
app.use('/_proxy/api/admin', createProxyMiddleware({ target: MONOLITH, changeOrigin: true, pathRewrite: { '^/_proxy': '' } }))

app.get('/health', (req, res) => res.json({ ok: true, service: 'admin-service' }))

const PORT = process.env.PORT || 3005
app.listen(PORT, () => console.log(`admin-service listening ${PORT}`))
