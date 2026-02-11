import express from 'express'
import authRoutes from './auth.routes.js'

export default function routes() {
  const router = express.Router()
  router.use('/api/auth', authRoutes)
  return router
}
