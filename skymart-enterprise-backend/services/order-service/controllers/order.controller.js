import Order from '../models/order.model.js'
import Cart from '../models/cart.model.js'
import { publish } from '../kafkaClient.js'

export const placeOrder = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body
    const userId = req.user._id

    // ✅ Idempotency FIRST (prevents "cart empty" on retry and prevents duplicates)
    if (razorpay_payment_id) {
      const existing = await Order.findOne({ "payment.razorpay_payment_id": razorpay_payment_id })
      if (existing) {
        return res.status(200).json({ success: true, order: existing, duplicate: true })
      }
    }

    const cart = await Cart.findOne({ user: userId })
    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' })
    }

    const products = cart.items.map(item => ({
      product: item.product,
      category: item.category || 'Uncategorized',
      title: item.title,
      price: item.price,
      qty: item.quantity || item.qty || 1,
      image: item.image
    }))

    const order = await Order.create({
      user: userId,
      products,
      totalAmount: cart.totalAmount || 0,
      payment: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
    })

    // ✅ Clear cart after order create
    cart.items = []
    cart.totalAmount = 0
    await cart.save()

    // ✅ publish ORDER_CREATED event (best-effort)
    publish('ORDER_CREATED', {
      id: order._id,
      user: order.user,
      totalAmount: order.totalAmount
    }).catch(e => console.error('Failed to publish ORDER_CREATED', e))

    return res.status(201).json({ success: true, order })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Order failed' })
  }
}

export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 })
  return res.json(orders)
}

export const getAllOrdersAdmin = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .lean()

    return res.json(orders)
  } catch (error) {
    console.error('Failed to fetch all orders (admin):', error)
    return res.status(500).json({ message: 'Failed to fetch orders', error: error.message })
  }
}

export const getOrderByIdAdmin = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .lean()

    if (!order) return res.status(404).json({ message: 'Order not found' })
    return res.json(order)
  } catch (error) {
    console.error('Failed to fetch order by id (admin):', error)
    return res.status(500).json({ message: 'Failed to fetch order', error: error.message })
  }
}

export const updateOrderStatusAdmin = async (req, res) => {
  try {
    const { status } = req.body
    const order = await Order.findById(req.params.id)
    if (!order) return res.status(404).json({ message: 'Order not found' })

    order.status = status || order.status
    await order.save()

    return res.json(order)
  } catch (error) {
    console.error('Failed to update order status (admin):', error)
    return res.status(500).json({ message: 'Failed to update order status', error: error.message })
  }
}