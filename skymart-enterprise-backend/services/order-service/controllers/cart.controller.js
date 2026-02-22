import Cart from '../models/cart.model.js'
import mongoose from 'mongoose'

/* =========================
   GET CART
========================= */
export const getCart = async (req, res) => {
  try {
    const userId = req.user?._id
    if (!userId) return res.status(401).json({ message: 'Not authorized' })

    let cart = await Cart.findOne({ user: userId })
    if (!cart) {
      cart = await Cart.create({ user: userId, items: [], totalAmount: 0 })
    }

    return res.json(cart || { items: [] })
  } catch (err) {
    console.error('getCart failed', err)
    return res.status(500).json({ message: 'Failed to load cart' })
  }
}

/* =========================
   ADD TO CART
========================= */
export const addToCart = async (req, res) => {
  try {
    const userId = req.user?._id
    if (!userId) return res.status(401).json({ message: 'Not authorized' })

    const { productId, category, title, price, image } = req.body

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid productId' })
    }

    let cart = await Cart.findOne({ user: userId })

    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [
          {
            product: new mongoose.Types.ObjectId(productId),
            category,
            title,
            price,
            image,
            quantity: 1,
          },
        ],
        totalAmount: Number(price || 0),
      })
      return res.status(201).json(cart)
    }

    const item = cart.items.find((i) => String(i.product) === String(productId))

    if (item) item.quantity += 1
    else {
      cart.items.push({
        product: new mongoose.Types.ObjectId(productId),
        category,
        title,
        price,
        image,
        quantity: 1,
      })
    }

    cart.totalAmount = cart.items.reduce(
      (sum, it) => sum + (Number(it.price) || 0) * (Number(it.quantity) || 0),
      0
    )

    await cart.save()
    return res.json(cart)
  } catch (err) {
    console.error('addToCart failed', err)
    return res.status(500).json({ message: 'Add to cart failed' })
  }
}

/* =========================
   REMOVE FROM CART
========================= */
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user?._id
    if (!userId) return res.status(401).json({ message: 'Not authorized' })

    const productId = req.params.productId
    const cart = await Cart.findOne({ user: userId })
    if (!cart) return res.json({ items: [] })

    cart.items = cart.items.filter((i) => String(i.product) !== String(productId))

    cart.totalAmount = cart.items.reduce(
      (sum, it) => sum + (Number(it.price) || 0) * (Number(it.quantity) || 0),
      0
    )

    await cart.save()
    return res.json(cart)
  } catch (err) {
    console.error('removeFromCart failed', err)
    return res.status(500).json({ message: 'Remove failed' })
  }
}

/* =========================
   UPDATE QTY (+ / -)
========================= */
export const updateQty = async (req, res) => {
  try {
    const userId = req.user?._id
    if (!userId) return res.status(401).json({ message: 'Not authorized' })

    const productId = req.params.productId
    const { qty } = req.body

    const cart = await Cart.findOne({ user: userId })
    if (!cart) return res.status(404).json({ message: 'Cart not found' })

    const item = cart.items.find((i) => String(i.product) === String(productId))
    if (!item) return res.status(404).json({ message: 'Item not found' })

    const n = Number(qty)
    if (!Number.isFinite(n)) return res.status(400).json({ message: 'Invalid qty' })

    if (n <= 0) {
      cart.items = cart.items.filter((i) => String(i.product) !== String(productId))
    } else {
      item.quantity = n
    }

    cart.totalAmount = cart.items.reduce(
      (sum, it) => sum + (Number(it.price) || 0) * (Number(it.quantity) || 0),
      0
    )

    await cart.save()
    return res.json(cart)
  } catch (err) {
    console.error('updateQty failed', err)
    return res.status(500).json({ message: 'Qty update failed' })
  }
}
