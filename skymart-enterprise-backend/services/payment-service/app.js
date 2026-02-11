import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import paymentRoutes from './routes/payment.routes.js'
import { createProxyMiddleware } from 'http-proxy-middleware'

dotenv.config()
const app = express()
app.use(express.json())

const MONOLITH = process.env.MONOLITH_URL || 'http://host.docker.internal:5000'

if (process.env.MONGO_URI) {
  connectDB().catch((e) => console.warn('payment-service: mongo connect failed', e.message))
}

app.use('/api/payment', paymentRoutes)

// Fallback proxy
app.use('/_proxy/api/payment', createProxyMiddleware({ target: MONOLITH, changeOrigin: true, pathRewrite: { '^/_proxy': '' } }))

app.get('/health', (req, res) => res.json({ ok: true, service: 'payment-service' }))

const PORT = process.env.PORT || 3003
app.listen(PORT, () => console.log(`payment-service listening ${PORT}`))
