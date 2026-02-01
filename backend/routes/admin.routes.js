import express from "express"
import User from "../models/User.js"
import Product from "../models/Product.js"
import { protect } from "../middleware/auth.middleware.js"
import { adminOnly } from "../middleware/admin.middleware.js"
import { getDashboardStats } from "../controllers/analytics.controller.js"

const router = express.Router()

// 🔹 Admin Analytics
router.get("/analytics", protect, adminOnly, getDashboardStats)

// 🔹 Get All Users (Admin Only)
router.get("/users", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select("-password")
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" })
  }
})

// 🔹 Admin Product CRUD
router.get("/products", protect, adminOnly, async (req, res) => {
  try {
    const products = await Product.find()
    res.json(products)
  } catch (error) {
    console.error("Failed to fetch products (admin):", error)
    res.status(500).json({ message: "Failed to fetch products" })
  }
})

router.post("/products", protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.create(req.body)
    res.status(201).json(product)
  } catch (error) {
    console.error("Failed to create product:", error)
    res.status(400).json({ message: error.message })
  }
})

router.put("/products/:id", protect, adminOnly, async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    if (!updated) return res.status(404).json({ message: "Product not found" })
    res.json(updated)
  } catch (error) {
    console.error("Failed to update product:", error)
    res.status(400).json({ message: error.message })
  }
})

router.delete("/products/:id", protect, adminOnly, async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id)
    if (!deleted) return res.status(404).json({ message: "Product not found" })
    res.json({ message: "Product removed" })
  } catch (error) {
    console.error("Failed to delete product:", error)
    res.status(400).json({ message: error.message })
  }
})

export default router
