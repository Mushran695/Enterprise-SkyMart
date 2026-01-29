import express from "express"
import { protect } from "../middleware/auth.middleware.js"
import {
  getCart,
  addToCart,
  removeFromCart,
  updateQty
} from "../controllers/cart.controller.js"

const router = express.Router()

// GET cart
router.get("/", protect, getCart)

// ADD item
router.post("/", protect, addToCart)

// REMOVE item
router.delete("/:id", protect, removeFromCart)

// UPDATE QTY (+ / -)  ✅
router.put("/update", protect, updateQty)

export default router
