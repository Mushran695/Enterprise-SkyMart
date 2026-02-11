import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import orderRoutes from './routes/order.routes.js'
import { createProxyMiddleware } from 'http-proxy-middleware'

dotenv.config()
const app = express()
app.use(express.json())

const MONOLITH = process.env.MONOLITH_URL || 'http://host.docker.internal:5000'

if (process.env.MONGO_URI) {
  connectDB().catch((e) => console.warn('order-service: mongo connect failed', e.message))
}

app.use('/api/orders', orderRoutes)

// Fallback proxy for order paths not yet extracted
app.use('/_proxy/api/orders', createProxyMiddleware({ target: MONOLITH, changeOrigin: true, pathRewrite: { '^/_proxy': '' } }))

app.get('/health', (req, res) => res.json({ ok: true, service: 'order-service' }))

const PORT = process.env.PORT || 3002
app.listen(PORT, () => console.log(`order-service listening ${PORT}`))
