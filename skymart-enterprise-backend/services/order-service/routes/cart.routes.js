import express from 'express'
import Cart from '../models/cart.model.js'
import { protect } from '../middleware/auth.middleware.js'

const router = express.Router()

// GET /api/cart
router.get(['/', ''], protect, async (req, res) => {
  try {
   const cart = await Cart.findOne({ user: req.user._id })
    if (!cart) return res.json({ items: [], totalAmount: 0 })
    res.json(cart)
  } catch (err) {
    console.error('getCart failed', err)
    res.status(500).json({ message: 'Failed to fetch cart' })
  }
})

// POST /api/cart - add or increment item
router.post(['/', ''], protect, async (req, res) => {
  try {
    const { productId, quantity = 1, title, price = 0, image, category } = req.body
    if (!productId) return res.status(400).json({ message: 'productId is required' })

    let cart = await Cart.findOne({ user: req.user._id })
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [], totalAmount: 0 })
    }

    const existing = cart.items.find((i) => String(i.product) === String(productId))
    if (existing) {
      existing.quantity = (existing.quantity || 0) + Number(quantity)
    } else {
      cart.items.push({ product: productId, quantity: Number(quantity), title, price, image, category })
    }

    cart.totalAmount = cart.items.reduce((sum, it) => sum + (it.price || 0) * (it.quantity || 0), 0)
    await cart.save()
    res.status(201).json(cart)
  } catch (err) {
    console.error('addToCart failed', err)
    res.status(500).json({ message: 'Failed to add to cart' })
  }
})

// DELETE /api/cart/:id - remove item by item _id
// DELETE /api/cart/:productId - remove item by product id
router.delete('/:productId', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
    if (!cart) return res.status(404).json({ message: 'Cart not found' })
    const { productId } = req.params
    cart.items = cart.items.filter((i) => String(i.product) !== String(productId))
    cart.totalAmount = cart.items.reduce((sum, it) => sum + (it.price || 0) * (it.quantity || 0), 0)
    await cart.save()
    res.json(cart)
  } catch (err) {
    console.error('removeFromCart failed', err)
    res.status(500).json({ message: 'Failed to remove item' })
  }
})

// PUT /api/cart/update - update quantity
router.put('/update', protect, async (req, res) => {
  try {
    const { productId, qty } = req.body
    if (!productId) return res.status(400).json({ message: 'productId required' })
    const cart = await Cart.findOne({ user: req.user._id })
    if (!cart) return res.status(404).json({ message: 'Cart not found' })
    const item = cart.items.find((i) => String(i.product) === String(productId))
    if (!item) return res.status(404).json({ message: 'Item not found' })
    item.quantity = Number(qty || item.quantity)
    if (item.quantity < 1) {
      cart.items = cart.items.filter((i) => String(i.product) !== String(productId))
    }
    cart.totalAmount = cart.items.reduce((sum, it) => sum + (it.price || 0) * (it.quantity || 0), 0)
    await cart.save()
    res.json(cart)
  } catch (err) {
    console.error('updateCart failed', err)
    res.status(500).json({ message: 'Failed to update cart' })
  }
})

export default router
