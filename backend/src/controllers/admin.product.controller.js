import Product from "../../models/Product.js"

// GET all products (admin)
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
    res.json(products)
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products" })
  }
}

// CREATE product
export const addProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body)
    res.status(201).json(product)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// UPDATE product
export const updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    res.json(updated)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// DELETE product
export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id)
    res.json({ message: "Product deleted" })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}
