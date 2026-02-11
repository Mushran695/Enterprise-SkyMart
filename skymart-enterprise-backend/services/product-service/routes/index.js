import express from 'express'
import productRoutes from './product.routes.js'

export default function routes() {
  const router = express.Router()
  router.use('/api/products', productRoutes)
  return router
}
