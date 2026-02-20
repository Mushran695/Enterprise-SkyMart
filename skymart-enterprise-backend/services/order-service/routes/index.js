import express from 'express'
import orderRoutes from './order.routes.js'
import cartRoutes from './cart.routes.js'

export default function routes() {
  const router = express.Router()
  router.use('/api/orders', orderRoutes)
  router.use('/api/cart', cartRoutes) // exposes /api/cart...
  return router
}

