import express from "express"
import {
  getAllOrdersAdmin,
  getOrderByIdAdmin,
  updateOrderStatusAdmin
} from "../controllers/order.controller.js"

const router = express.Router()

router.get("/admin", getAllOrdersAdmin)
router.get("/admin/:id", getOrderByIdAdmin)
router.put("/admin/:id", updateOrderStatusAdmin)

export default router
