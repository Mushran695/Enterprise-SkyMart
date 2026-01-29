import express from "express"
import User from "../../models/User.js"
import { protect, adminOnly } from "../../middleware/auth.middleware.js"

const router = express.Router()

/* =========================
   GET ALL USERS (ADMIN)
========================= */
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select("-password")
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" })
  }
})

/* =========================
   UPDATE ROLE
========================= */
router.put("/:id/role", protect, adminOnly, async (req, res) => {
  try {
    const { role } = req.body

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password")

    res.json(user)
  } catch {
    res.status(500).json({ message: "Role update failed" })
  }
})

/* =========================
   UPDATE STATUS
========================= */
router.put("/:id/status", protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).select("-password")

    res.json(user)
  } catch {
    res.status(500).json({ message: "Status update failed" })
  }
})

export default router
