import Cart from '../models/cart.model.js'

export const getCart = async (req, res) => {
  try {
    const userId = req.user?._id
    if (!userId) return res.status(401).json({ message: 'Not authorized' })

    let cart = await Cart.findOne({ user: userId })
    if (!cart) {
      cart = await Cart.create({ user: userId, items: [], totalAmount: 0 })
    }

    return res.json({ userId: String(cart.user), items: cart.items, totalAmount: cart.totalAmount })
  } catch (err) {
    console.error('getCart error:', err)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const addToCart = async (req, res) => {
  try {
    const userId = req.user?._id
    if (!userId) return res.status(401).json({ message: 'Not authorized' })

    const { productId, quantity = 1, category, title, price, image } = req.body
    if (!productId) return res.status(400).json({ message: 'productId is required' })

    let cart = await Cart.findOne({ user: userId })
    if (!cart) {
      cart = await Cart.create({ user: userId, items: [], totalAmount: 0 })
    }

    const qty = Number(quantity) || 1

    const idx = cart.items.findIndex(i => String(i.product) === String(productId))
    if (idx >= 0) {
      cart.items[idx].quantity += qty
      // keep latest info if provided
      if (title) cart.items[idx].title = title
      if (category) cart.items[idx].category = category
      if (price !== undefined) cart.items[idx].price = price
      if (image) cart.items[idx].image = image
    } else {
      cart.items.push({
        product: productId,
        category: category || '',
        title: title || '',
        price: price ?? 0,
        image: image || '',
        quantity: qty,
      })
    }

    cart.totalAmount = cart.items.reduce((sum, it) => sum + (Number(it.price) || 0) * (Number(it.quantity) || 0), 0)

    await cart.save()
    return res.status(200).json({ success: true, cart })
  } catch (err) {
    console.error('addToCart error:', err)
    return res.status(500).json({ message: 'Server error' })
  }
}
