import express from 'express'
import adminRoutes from './admin.routes.js'

export default function routes() {
  const router = express.Router()
  router.use('/api/admin', adminRoutes)
  return router
}
