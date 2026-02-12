import express from 'express'
import Order from '../models/Order.js'
import Product from '../models/Product.js'
import User from '../models/User.js'
import { protect } from '../middleware/auth.middleware.js'
import { cache, invalidatePattern } from '../middleware/cache.js'

const router = express.Router()

router.get('/stats', protect, cache('analytics', 60), async (req, res) => {
  try {
    const [totalOrders, totalUsers, totalProducts, revenueAgg] = await Promise.all([
      Order.countDocuments(),
      User.countDocuments(),
      Product.countDocuments(),
      Order.aggregate([{ $group: { _id: null, total: { $sum: '$totalAmount' } } }])
    ])

    const result = {
      revenue: revenueAgg[0]?.total || 0,
      orders: totalOrders,
      users: totalUsers,
      conversion: totalUsers > 0 ? ((totalOrders / totalUsers) * 100).toFixed(2) : 0,
      products: totalProducts
    }
    res.json(result)
  } catch (error) {
    console.error('/stats error:', error)
    res.status(500).json({ message: 'Dashboard analytics failed' })
  }
})

router.get('/orders', protect, cache('analytics', 60), async (req, res) => {
  try {
    const data = await Order.aggregate([
      { $group: { _id: { $month: '$createdAt' }, orders: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ])
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    const result = data.map(d => ({ month: months[d._id - 1], orders: d.orders }))
    res.json(result)
  } catch (error) {
    console.error('/orders error:', error)
    res.status(500).json({ message: 'Order analytics failed' })
  }
})

router.get('/revenue', protect, cache('analytics', 60), async (req, res) => {
  try {
    const data = await Order.aggregate([
      { $group: { _id: { $month: '$createdAt' }, revenue: { $sum: '$totalAmount' } } },
      { $sort: { _id: 1 } }
    ])
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    const result = data.map(d => ({ month: months[d._id - 1], revenue: d.revenue }))
    res.json(result)
  } catch (error) {
    console.error('/revenue error:', error)
    res.status(500).json({ message: 'Revenue analytics failed' })
  }
})

router.get('/categories', protect, cache('analytics', 60), async (req, res) => {
  try {
    const data = await Order.aggregate([
      { $unwind: '$products' },
      { $group: { _id: '$products.category', value: { $sum: '$products.qty' } } },
      { $sort: { value: -1 } }
    ])
    const result = data.map(d => ({ name: d._id || 'Uncategorized', value: d.value }))
    res.json(result)
  } catch (error) {
    console.error('/categories error:', error)
    res.status(500).json({ message: 'Category analytics failed' })
  }
})

export default router
