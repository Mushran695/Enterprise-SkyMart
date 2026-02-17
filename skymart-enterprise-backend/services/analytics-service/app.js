import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import analyticsRoutes from './routes/analytics.routes.js'
import { notFound, errorHandler } from './middleware/errorHandler.js'

dotenv.config()

const app = express()
app.use(express.json())

if (process.env.MONGO_URI || process.env.MONGODB_URI) {
  connectDB().catch((e) =>
    console.warn('analytics-service Mongo connect failed', e.message)
  )
}

app.use('/api/analytics', analyticsRoutes)

app.get('/health', (req, res) =>
  res.json({ ok: true, service: 'analytics-service' })
)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 3004
app.listen(PORT, () =>
  console.log(`analytics-service running on port ${PORT}`)
)
