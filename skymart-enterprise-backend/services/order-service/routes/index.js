import express from 'express'
import orderRoutes from './order.routes.js'
import cartRoutes from './cart.routes.js'

export default function routes() {
  const router = express.Router()

  // ✅ /api/orders/...
  router.use('/api/orders', orderRoutes)

  // ✅ /api/cart/...
  router.use('/api/cart', cartRoutes)

  return router
}