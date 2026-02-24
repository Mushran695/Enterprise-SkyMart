import Order from "../models/order.model.js"
import Cart from "../models/cart.model.js"

export const placeOrder = async (req, res) => {
  try {
    console.log("[DEBUG] placeOrder called", { ts: new Date().toISOString(), body: req.body, user: req.user && req.user._id })
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body

    const userId = req.user._id

    const cart = await Cart.findOne({ user: userId })
    console.log("[DEBUG] placeOrder - cart snapshot", { userId, items: cart?.items, totalAmount: cart?.totalAmount })

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" })
    }

    // Transform cart items to order products format
    const products = cart.items.map(item => ({
      product: item.product,
      category: item.category || "Uncategorized",
      title: item.title,
      price: item.price,
      qty: item.quantity,
      image: item.image
    }))

    const order = await Order.create({
      user: userId,
      products,
      // cart model uses `totalAmount` (not totalPrice)
      totalAmount: cart.totalAmount || 0,
      payment: {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      }
    })

    // Clear cart after order
    cart.items = []
    cart.totalAmount = 0
    await cart.save()

    res.status(201).json({
      success: true,
      order
    })

  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Order failed" })
  }
}

export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .sort({ createdAt: -1 })

  res.json(orders)
}

// ==========================
// ADMIN: Orders management
// ==========================
export const getAllOrdersAdmin = async (req, res) => {
  try {
    // use lean() to return plain objects and avoid hydration issues
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 }).lean()
    res.json(orders)
  } catch (error) {
    console.error('Failed to fetch all orders (admin):', error.stack || error)
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message })
  }
}

export const getOrderByIdAdmin = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email').lean()
    if (!order) return res.status(404).json({ message: 'Order not found' })
    res.json(order)
  } catch (error) {
    console.error('Failed to fetch order by id (admin):', error.stack || error)
    res.status(500).json({ message: 'Failed to fetch order', error: error.message })
  }
}

export const updateOrderStatusAdmin = async (req, res) => {
  try {
    const { status } = req.body
    const order = await Order.findById(req.params.id)
    if (!order) return res.status(404).json({ message: 'Order not found' })
    order.status = status || order.status
    await order.save()
    res.json(order)
  } catch (error) {
    console.error('Failed to update order status (admin):', error.stack || error)
    res.status(500).json({ message: 'Failed to update order', error: error.message })
  }
}
