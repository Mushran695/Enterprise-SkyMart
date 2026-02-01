import express from "express"
import {
  placeOrder,
  getMyOrders
} from "../controllers/order.controller.js"
import Order from "../models/order.model.js"
import { protect } from "../middleware/auth.middleware.js"

const router = express.Router()

// USER ROUTES
router.get("/my", protect, getMyOrders)
router.post("/", protect, placeOrder)

export default router
