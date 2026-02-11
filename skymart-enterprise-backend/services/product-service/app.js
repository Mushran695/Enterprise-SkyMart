import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import productRoutes from './routes/product.routes.js'
import { createProxyMiddleware } from 'http-proxy-middleware'

dotenv.config()
const app = express()
app.use(express.json())

const MONOLITH = process.env.MONOLITH_URL || 'http://host.docker.internal:5000'

if (process.env.MONGO_URI) {
  connectDB().catch((e) => console.warn('product-service: mongo connect failed', e.message))
}

app.use('/api/products', productRoutes)

// Fallback proxy for product paths not yet extracted
app.use('/_proxy/api/products', createProxyMiddleware({ target: MONOLITH, changeOrigin: true, pathRewrite: { '^/_proxy': '' } }))

app.get('/health', (req, res) => res.json({ ok: true, service: 'product-service' }))

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`product-service listening ${PORT}`))
