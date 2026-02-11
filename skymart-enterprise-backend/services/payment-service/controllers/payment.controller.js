import razorpay from '../config/razorpay.js'
import crypto from 'crypto'
import Order from '../models/order.model.js'
import Cart from '../models/cart.model.js'

export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body
    if (!amount) return res.status(400).json({ message: 'Amount missing' })
    const orderAmount = Math.round(amount * 100)
    const options = { amount: orderAmount, currency: 'INR', receipt: 'receipt_' + Date.now() }
    const order = await razorpay.orders.create(options)
    res.status(200).json({ success: true, orderId: order.id, amount: order.amount, currency: order.currency })
  } catch (error) {
    console.error('Razorpay Error:', error)
    res.status(500).json({ message: 'Order creation failed', error: error.message })
  }
}

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      const missing = {}
      if (!razorpay_order_id) missing.razorpay_order_id = 'missing'
      if (!razorpay_payment_id) missing.razorpay_payment_id = 'missing'
      if (!razorpay_signature) missing.razorpay_signature = 'missing'
      return res.status(400).json({ success: false, message: 'Missing payment details', missing_fields: missing })
    }

    const body = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(body).digest('hex')

    if (expectedSignature === razorpay_signature) {
      try {
        const userId = req.user._id
        const cart = await Cart.findOne({ user: userId })
        if (!cart || !cart.items.length) {
          return res.status(200).json({ success: true, payment_verified: true, message: 'Payment verified but no cart items found' })
        }
        let totalAmount = cart.totalAmount
        if (!totalAmount) totalAmount = cart.items.reduce((sum, item) => sum + (item.price * (item.quantity || item.qty)), 0)
        const orderProducts = cart.items.map(item => ({ product: item.product, category: item.category, title: item.title, price: item.price, image: item.image, qty: item.quantity || item.qty }))
        const newOrder = new Order({ user: userId, products: orderProducts, totalAmount, status: 'Pending', payment: { razorpay_order_id, razorpay_payment_id, razorpay_signature } })
        await newOrder.save()
        await Cart.findOneAndUpdate({ user: userId }, { items: [], totalAmount: 0 })
        return res.status(200).json({ success: true, message: 'Payment verified and order created', orderId: newOrder._id })
      } catch (dbError) {
        console.error('Database error while saving order:', dbError)
        return res.status(500).json({ success: true, payment_verified: true, message: 'Payment verified but failed to save order', error: dbError.message })
      }
    } else {
      return res.status(400).json({ success: false, message: 'Payment verification failed' })
    }
  } catch (err) {
    console.error('Verification Error:', err)
    return res.status(500).json({ success: false, message: 'Verification error', error: err.message })
  }
}
