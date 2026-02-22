import Cart from "../models/cart.model.js"
import mongoose from "mongoose"

const computeTotal = (items) => {
  return items.reduce((sum, it) => sum + (Number(it.price || 0) * Number(it.quantity || 0)), 0)
}

/* =========================
   GET CART
========================= */
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
    if (!cart) return res.json({ items: [], totalAmount: 0 })

    // ensure totalAmount consistent
    cart.totalAmount = computeTotal(cart.items)
    await cart.save()

    return res.json({ items: cart.items, totalAmount: cart.totalAmount })
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

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
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
    } else {
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
    }

    // recompute total and return consistent shape
    cart.totalAmount = computeTotal(cart.items)
    await cart.save()

    return res.status(200).json({ items: cart.items, totalAmount: cart.totalAmount })
  } catch (err) {
    console.error("addToCart failed", err)
    return res.status(500).json({ message: "Add to cart failed" })
  }
}

/* =========================
   REMOVE FROM CART
   route: DELETE /:productId
========================= */
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params
    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid productId" })
    }

    const cart = await Cart.findOne({ user: req.user._id })
    if (!cart) return res.json({ items: [], totalAmount: 0 })

    cart.items = cart.items.filter((i) => i.product.toString() !== productId)
    cart.totalAmount = computeTotal(cart.items)
    await cart.save()

    return res.json({ items: cart.items, totalAmount: cart.totalAmount })
  } catch (err) {
    console.error("removeFromCart failed", err)
    return res.status(500).json({ message: "Remove failed" })
  }
}

/* =========================
   UPDATE QTY  (+ / -)
   route: PUT /:productId   body: { qty }
========================= */
export const updateQty = async (req, res) => {
  try {
    const productId = req.params.productId
    const { qty } = req.body

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid productId" })
    }

    const n = Number(qty)
    if (!Number.isFinite(n)) return res.status(400).json({ message: "Invalid qty" })

    const cart = await Cart.findOne({ user: req.user._id })
    if (!cart) return res.status(404).json({ message: "Cart not found" })

    const item = cart.items.find((i) => i.product.toString() === productId)
    if (!item) return res.status(404).json({ message: "Item not found" })

    if (n <= 0) {
      cart.items = cart.items.filter((i) => i.product.toString() !== productId)
    } else {
      item.quantity = n
    }

    cart.totalAmount = computeTotal(cart.items)
    await cart.save()

    return res.json({ items: cart.items, totalAmount: cart.totalAmount })
  } catch (err) {
    console.error("updateQty failed", err)
    return res.status(500).json({ message: "Qty update failed" })
  }
}