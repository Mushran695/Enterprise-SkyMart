import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import paymentRoutes from './routes/payment.routes.js'
import { notFound, errorHandler } from './middleware/errorHandler.js'

dotenv.config()

const app = express()
app.use(express.json())

if (process.env.MONGO_URI || process.env.MONGODB_URI) {
  connectDB().catch((e) =>
    console.warn('payment-service Mongo connect failed', e.message)
  )
}

app.use('/api/payment', paymentRoutes)

app.get('/health', (req, res) =>
  res.json({ ok: true, service: 'payment-service' })
)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 3003
app.listen(PORT, () =>
  console.log(`payment-service running on port ${PORT}`)
)
