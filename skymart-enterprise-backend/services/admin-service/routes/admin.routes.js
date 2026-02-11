import express from 'express'
import User from '../models/User.js'
import Product from '../models/Product.js'
import Order from '../models/Order.js'
import { protect } from '../middleware/auth.middleware.js'
import { adminOnly } from '../middleware/auth.middleware.js'
import { Router } from 'express'

const router = express.Router()

// Admin analytics route placeholder (reuse analytics-service or implement here)
router.get('/analytics', protect, adminOnly, async (req, res) => {
  res.json({ message: 'Admin analytics endpoint - implement or proxy to analytics-service' })
})

router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password')
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users' })
  }
})

router.get('/products', protect, adminOnly, async (req, res) => {
  try {
    const products = await Product.find()
    res.json(products)
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products' })
  }
})

router.post('/products', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.create(req.body)
    res.status(201).json(product)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

router.put('/products/:id', protect, adminOnly, async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!updated) return res.status(404).json({ message: 'Product not found' })
    res.json(updated)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

router.delete('/products/:id', protect, adminOnly, async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id)
    if (!deleted) return res.status(404).json({ message: 'Product not found' })
    res.json({ message: 'Product removed' })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

router.get('/orders-simple', protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.aggregate([
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
      { $project: { totalAmount: 1, status: 1, createdAt: 1, 'user.email': 1 } }
    ])
    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders (simple)', error: error.message })
  }
})

export default router
