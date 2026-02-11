import express from 'express'
import analyticsRoutes from './analytics.routes.js'

export default function routes() {
  const router = express.Router()
  router.use('/api/analytics', analyticsRoutes)
  return router
}
