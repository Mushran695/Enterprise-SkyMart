import express from 'express'
import Product from '../models/Product.js'
import { protect, adminOnly } from '../middleware/auth.middleware.js'
import { cache, invalidatePattern } from '../middleware/cache.js'
import { invalidateProductsCache } from '../lib/cacheInvalidate.js'

const router = express.Router()

// PUBLIC — GET PRODUCTS (cached)
router.get('/', cache('products', 60), async (req, res) => {
    try {
      const { category } = req.query
      const filter = category ? { category } : {}
      const products = await Product.find(filter)
      res.json(products)
    } catch (error) {
      console.error('Product fetch error:', error)
      res.status(500).json({ message: 'Failed to fetch products' })
    }
  }
)

// ADMIN — CREATE
router.post('/', protect, adminOnly, async (req, res) => {
    try {
      const product = await Product.create(req.body)
      // invalidate product list caches and analytics caches
      await invalidateProductsCache()
      await invalidatePattern('analytics:*')
      res.status(201).json(product)
    } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// ADMIN — UPDATE
router.put('/:id', protect, adminOnly, async (req, res) => {
    try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
    await invalidateProductsCache()
    await invalidatePattern('analytics:*')
    res.json(updated)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// ADMIN — DELETE
router.delete('/:id', protect, adminOnly, async (req, res) => {
    try {
    await Product.findByIdAndDelete(req.params.id)
    await invalidateProductsCache()
    await invalidatePattern('analytics:*')
    res.json({ message: 'Product removed' })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

export default router
