import express from 'express'
import { placeOrder, getMyOrders, getAllOrdersAdmin, getOrderByIdAdmin, updateOrderStatusAdmin } from '../controllers/order.controller.js'
import Order from '../models/order.model.js'
import { protect, adminOnly } from '../middleware/auth.middleware.js'

const router = express.Router()

// USER ROUTES
router.get('/my', protect, getMyOrders)
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id }).populate('products.product')
    if (!order) return res.status(404).json({ message: 'Order not found' })
    res.json(order)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch order' })
  }
})
router.post('/', protect, placeOrder)

// ADMIN ROUTES
router.get('/admin', protect, adminOnly, getAllOrdersAdmin)
router.get('/admin/:id', protect, adminOnly, getOrderByIdAdmin)
router.put('/admin/:id', protect, adminOnly, updateOrderStatusAdmin)

export default router
