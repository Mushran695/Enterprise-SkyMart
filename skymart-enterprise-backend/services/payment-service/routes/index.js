import express from 'express'
import paymentRoutes from './payment.routes.js'

export default function routes() {
  const router = express.Router()
  router.use('/api/payment', paymentRoutes)
  return router
}
