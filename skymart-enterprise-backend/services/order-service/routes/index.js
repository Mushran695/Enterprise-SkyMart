import express from 'express'
import orderRoutes from './order.routes.js'

export default function routes() {
  const router = express.Router()
  router.use('/api/orders', orderRoutes)
  return router
}
