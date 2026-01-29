import Order from "../models/Orders.js"
import Product from "../models/Product.js"

/**
 * Get active cart
 */
export const getCart = async (req, res) => {
  try {
    const cart = await Order.findOne({
      user: req.user.id,
      status: "cart",
    }).populate("products.product")

    if (!cart) {
      return res.json({ products: [], totalAmount: 0 })
    }

    res.json(cart)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

/**
 * Add product to cart
 */
export const addToCart = async (req, res) => {
  try {
    const { productId, qty } = req.body
    const product = await Product.findById(productId)

    if (!product) return res.status(404).json({ message: "Product not found" })

    let cart = await Order.findOne({ user: req.user.id, status: "cart" })

    if (!cart) {
      cart = await Order.create({
        user: req.user.id,
        products: [],
        totalAmount: 0,
        status: "cart",
      })
    }

    const existingItem = cart.products.find(
      (p) => p.product.toString() === productId
    )

    if (existingItem) {
      existingItem.qty += qty
    } else {
      cart.products.push({
        product: product._id,
        title: product.name,
        price: product.price,
        qty,
      })
    }

    cart.totalAmount = cart.products.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    )

    await cart.save()

    res.json(cart)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

/**
 * Update quantity
 */
export const updateCartItem = async (req, res) => {
  try {
    const { productId, qty } = req.body

    const cart = await Order.findOne({ user: req.user.id, status: "cart" })
    if (!cart) return res.status(404).json({ message: "Cart not found" })

    const item = cart.products.find(
      (p) => p.product.toString() === productId
    )

    if (!item) return res.status(404).json({ message: "Item not in cart" })

    item.qty = qty

    cart.totalAmount = cart.products.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    )

    await cart.save()
    res.json(cart)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

/**
 * Remove from cart
 */
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body

    const cart = await Order.findOne({ user: req.user.id, status: "cart" })

    cart.products = cart.products.filter(
      (p) => p.product.toString() !== productId
    )

    cart.totalAmount = cart.products.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    )

    await cart.save()
    res.json(cart)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
