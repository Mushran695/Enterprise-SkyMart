import express from 'express'
import orderRoutes from './order.routes.js'
import cartRoutes from './cart.routes.js'

export default function routes() {
  const router = express.Router()

  // mounted under app.use('/api', ...)
  // ✅ /api/orders/...
  router.use('/orders', orderRoutes)

  // ✅ /api/cart/...
  router.use('/cart', cartRoutes)

  return router
}