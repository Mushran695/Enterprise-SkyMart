import express from "express"
import Order from "../models/order.model.js"
import Product from "../models/Product.js"
import { protect } from "../../middleware/auth.middleware.js"

const router = express.Router()

// ===================================================
// CREATE ORDER (USER)
// ===================================================
router.post("/", protect, async (req, res) => {
  try {
    let { cartItems, products, totalAmount } = req.body

    let finalProducts = []

    // ✅ New safe system (cartItems from frontend)
    if (cartItems) {
      finalProducts = await Promise.all(
        cartItems.map(async (item) => {
          const product = await Product.findById(item.productId)

          return {
            product: product._id,
            title: product.title,
            price: product.price,
            quantity: item.qty,
          }
        })
      )

      totalAmount = finalProducts.reduce(
        (sum, p) => sum + p.price * p.quantity,
        0
      )
    }

    // ✅ Old system fallback (so nothing breaks)
    else {
      finalProducts = products
    }

    const order = await Order.create({
      user: req.user._id,
      items: finalProducts,
      totalAmount,
      status: "Pending",
    })

    res.status(201).json(order)
  } catch (error) {
    console.error("Create order error:", error)
    res.status(500).json({ message: "Order creation failed" })
  }
})

// ===================================================
// USER ORDERS
// ===================================================
router.get("/my", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    })
    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders" })
  }
})

// ===================================================
// ADMIN ROUTES
// ===================================================

// GET ALL ORDERS
router.get("/admin", protect, async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("user", "name email")

    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders" })
  }
})

// GET SINGLE ORDER
router.get("/admin/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")

    if (!order) return res.status(404).json({ message: "Order not found" })

    res.json(order)
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch order" })
  }
})

// UPDATE STATUS
router.put("/admin/:id", protect, async (req, res) => {
  try {
    const { status } = req.body

    const order = await Order.findById(req.params.id)
    if (!order) return res.status(404).json({ message: "Order not found" })

    order.status = status
    await order.save()

    res.json(order)
  } catch (error) {
    res.status(500).json({ message: "Failed to update order" })
  }
})

export default router
