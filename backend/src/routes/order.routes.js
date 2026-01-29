import express from "express"
import Order from "../../models/Orders.js"
import { protect } from "../../middleware/auth.middleware.js"

const router = express.Router()

// CREATE ORDER (User checkout)
router.post("/", protect, async (req, res) => {
  try {
    const { products, totalAmount } = req.body

    const order = await Order.create({
      user: req.user._id,
      products,
      totalAmount,
    })

    res.status(201).json(order)
  } catch (error) {
    res.status(500).json({ message: "Order creation failed" })
  }
})

// GET LOGGED IN USER ORDERS
router.get("/my", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 })
    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders" })
  }
})

// ADMIN — GET ALL ORDERS
router.get("/", protect, async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email")
    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders" })
  }
})

export default router
