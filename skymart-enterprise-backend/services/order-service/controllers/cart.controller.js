import Cart from "../models/cart.model.js"
import mongoose from "mongoose"

/* =========================
   GET CART
========================= */
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
    return res.json(cart || { items: [] })
  } catch (err) {
    console.error("getCart failed", err)
    return res.status(500).json({ message: "Failed to load cart" })
  }
}

/* =========================
   ADD TO CART
========================= */
export const addToCart = async (req, res) => {
  try {
    const { productId, category, title, price, image } = req.body

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid productId" })
    }

    let cart = await Cart.findOne({ user: req.user._id })

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
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
      })
      return res.status(201).json(cart)
    }

    const item = cart.items.find((i) => i.product.toString() === productId)

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

    await cart.save()
    return res.json(cart)
  } catch (err) {
    console.error("addToCart failed", err)
    return res.status(500).json({ message: "Add to cart failed" })
  }
}

/* =========================
   REMOVE FROM CART
========================= */
export const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
    if (!cart) return res.json({ items: [] })

    cart.items = cart.items.filter((i) => i.product.toString() !== req.params.id)

    await cart.save()
    return res.json(cart)
  } catch (err) {
    console.error("removeFromCart failed", err)
    return res.status(500).json({ message: "Remove failed" })
  }
}

/* =========================
   UPDATE QTY  (+ / -)
========================= */
export const updateQty = async (req, res) => {
  try {
    const { productId, qty } = req.body

    const cart = await Cart.findOne({ user: req.user._id })
    if (!cart) return res.status(404).json({ message: "Cart not found" })

    const item = cart.items.find((i) => i.product.toString() === productId)
    if (!item) return res.status(404).json({ message: "Item not found" })

    const n = Number(qty)
    if (!Number.isFinite(n)) return res.status(400).json({ message: "Invalid qty" })

    if (n <= 0) {
      cart.items = cart.items.filter((i) => i.product.toString() !== productId)
    } else {
      item.quantity = n
    }

    await cart.save()
    return res.json(cart)
  } catch (err) {
    console.error("updateQty failed", err)
    return res.status(500).json({ message: "Qty update failed" })
  }
}