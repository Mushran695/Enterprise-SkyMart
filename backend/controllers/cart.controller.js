import Cart from "../models/cart.model.js"
import mongoose from "mongoose"

/* =========================
   GET CART
========================= */
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
    res.json(cart || { items: [] })
  } catch {
    res.status(500).json({ message: "Failed to load cart" })
  }
}

/* =========================
   ADD TO CART
========================= */
export const addToCart = async (req, res) => {
  try {
    const { productId, title, price, image } = req.body

    let cart = await Cart.findOne({ user: req.user._id })

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [{
          product: new mongoose.Types.ObjectId(productId),
          title,
          price,
          image,
          qty: 1
        }]
      })
    } else {
      const item = cart.items.find(
        i => i.product.toString() === productId
      )

      if (item) item.qty += 1
      else {
        cart.items.push({
          product: new mongoose.Types.ObjectId(productId),
          title,
          price,
          image,
          qty: 1
        })
      }

      await cart.save()
    }

    res.json(cart)
  } catch {
    res.status(500).json({ message: "Add to cart failed" })
  }
}

/* =========================
   REMOVE FROM CART
========================= */
export const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })

    cart.items = cart.items.filter(
      i => i.product.toString() !== req.params.id
    )

    await cart.save()
    res.json(cart)
  } catch {
    res.status(500).json({ message: "Remove failed" })
  }
}

/* =========================
   UPDATE QTY  (+ / -)
========================= */
export const updateQty = async (req, res) => {
  try {
    const { productId, qty } = req.body

    const cart = await Cart.findOne({ user: req.user._id })

    const item = cart.items.find(
      i => i.product.toString() === productId
    )

    if (!item) return res.status(404).json({ message: "Not found" })

    if (qty <= 0) {
      cart.items = cart.items.filter(
        i => i.product.toString() !== productId
      )
    } else {
      item.qty = qty
    }

    await cart.save()
    res.json(cart)
  } catch {
    res.status(500).json({ message: "Qty update failed" })
  }
}
