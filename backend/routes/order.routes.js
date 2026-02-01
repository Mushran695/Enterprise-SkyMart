import express from "express"
import {
  placeOrder,
  getMyOrders,
  getAllOrdersAdmin,
  getOrderByIdAdmin,
  updateOrderStatusAdmin
} from "../controllers/order.controller.js"
import Order from "../models/order.model.js"
import { protect } from "../middleware/auth.middleware.js"
import { adminOnly } from "../middleware/admin.middleware.js"

const router = express.Router()

// USER ROUTES
router.get("/my", protect, getMyOrders)
router.post("/", protect, placeOrder)

// ADMIN ROUTES
router.get("/admin", protect, adminOnly, getAllOrdersAdmin)
router.get("/admin/:id", protect, adminOnly, getOrderByIdAdmin)
router.put("/admin/:id", protect, adminOnly, updateOrderStatusAdmin)

export default router
