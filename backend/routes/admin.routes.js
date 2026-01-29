import express from "express"
import User from "../models/User.js"
import { protect, adminOnly } from "../middleware/admin.middleware.js"
import { getAnalytics } from "../controllers/analytics.controller.js"

const router = express.Router()

// 🔹 Admin Analytics
router.get("/analytics", protect, adminOnly, getAnalytics)

// 🔹 Get All Users (Admin Only)
router.get("/users", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select("-password")
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" })
  }
})

export default router
