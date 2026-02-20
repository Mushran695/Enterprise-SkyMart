import express from 'express'
import { protect } from '../middleware/auth.middleware.js'
import { getCart, addToCart, updateQty, removeFromCart } from '../controllers/cart.controller.js'

const router = express.Router()

// These are RELATIVE because mounted at /api/cart
router.get(['/', ''], protect, getCart)
router.post(['/', ''], protect, addToCart)

// matches controller: req.params.productId
router.put('/:productId', protect, updateQty)
router.delete('/:productId', protect, removeFromCart)

export default router