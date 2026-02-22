import razorpay from '../config/razorpay.js'
import crypto from 'crypto'
import Order from '../models/order.model.js'
import Cart from '../models/cart.model.js'
import { publish } from '../kafkaClient.js'
import { fetchProductsBulk } from '../utils/productClient.js'

export const createOrder = async (req, res) => {
  try {
    const userId = req.user._id

    const cart = await Cart.findOne({ user: userId })
    if (!cart || !cart.items?.length) {
      return res.status(400).json({ message: "Cart is empty" })
    }

    const ids = cart.items.map((i) => String(i.product))
    const products = await fetchProductsBulk(ids)
    const map = new Map(products.map((p) => [String(p._id), p]))

    let totalAmount = 0
    const issues = []

    for (const item of cart.items) {
      const pid = String(item.product)
      const p = map.get(pid)
      const qty = Number(item.quantity || item.qty || 1)

      if (!p) {
        issues.push({ productId: pid, reason: "Product not found" })
        continue
      }

      if (typeof p.stock === "number" && p.stock < qty) {
        issues.push({ productId: pid, reason: "Out of stock", available: p.stock, requested: qty })
        continue
      }

      totalAmount += Number(p.price || 0) * qty
    }

    if (issues.length) {
      return res.status(409).json({ message: "Cart needs update", issues })
    }

    if (totalAmount <= 0) {
      return res.status(400).json({ message: "Invalid total" })
    }

    const orderAmount = Math.round(totalAmount * 100)
    const options = { amount: orderAmount, currency: "INR", receipt: "receipt_" + Date.now() }
    const order = await razorpay.orders.create(options)

    return res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    })
  } catch (error) {
    console.error("Razorpay Error:", error)
    return res.status(500).json({ message: "Order creation failed", error: error.message })
  }
}

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      const missing = {}
      if (!razorpay_order_id) missing.razorpay_order_id = "missing"
      if (!razorpay_payment_id) missing.razorpay_payment_id = "missing"
      if (!razorpay_signature) missing.razorpay_signature = "missing"
      return res.status(400).json({ success: false, message: "Missing payment details", missing_fields: missing })
    }

    // idempotency check
    const already = await Order.findOne({ "payment.razorpay_payment_id": razorpay_payment_id })
    if (already) {
      return res.status(200).json({ success: true, message: "Payment already verified", orderId: already._id })
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id
    const secretKey = (process.env.RAZORPAY_KEY_SECRET || "").toString()
    const expectedSignature = crypto.createHmac("sha256", secretKey).update(body).digest("hex")

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Payment verification failed" })
    }

    const userId = req.user._id
    const cart = await Cart.findOne({ user: userId })
    if (!cart || !cart.items?.length) {
      return res.status(200).json({
        success: true,
        payment_verified: true,
        message: "Payment verified but cart is empty",
      })
    }

    const totalAmount = cart.items.reduce(
      (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || item.qty || 1),
      0
    )

    const orderProducts = cart.items.map((item) => ({
      product: item.product,
      category: item.category,
      title: item.title,
      price: item.price,
      image: item.image,
      qty: item.quantity || item.qty || 1,
    }))

    const newOrder = new Order({
      user: userId,
      products: orderProducts,
      totalAmount,
      status: "Pending",
      payment: { razorpay_order_id, razorpay_payment_id, razorpay_signature },
    })

    await newOrder.save()
    await Cart.findOneAndUpdate({ user: userId }, { items: [], totalAmount: 0 })

    // publish events (best-effort)
    publish("ORDER_CREATED", { id: newOrder._id, user: newOrder.user, totalAmount: newOrder.totalAmount }).catch((e) =>
      console.error("Failed to publish ORDER_CREATED", e)
    )
    publish("PAYMENT_SUCCESS", { orderId: newOrder._id, payment: { razorpay_order_id, razorpay_payment_id } }).catch((e) =>
      console.error("Failed to publish PAYMENT_SUCCESS", e)
    )

    return res.status(200).json({ success: true, message: "Payment verified and order created", orderId: newOrder._id })
  } catch (err) {
    console.error("Verification Error:", err)
    return res.status(500).json({ success: false, message: "Verification error", error: err.message })
  }
}
