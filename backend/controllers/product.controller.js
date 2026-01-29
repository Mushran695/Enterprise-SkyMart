import Product from "../models/Product.js"

// PUBLIC — frontend
export const getAllProducts = async (req, res) => {
  const { category } = req.query

  const filter = category ? { category } : {}
  const products = await Product.find(filter).sort({ createdAt: -1 })

  res.json(products)
}

// ADMIN — create
export const createProduct = async (req, res) => {
  const product = await Product.create(req.body)
  res.status(201).json(product)
}

// ADMIN — update
export const updateProduct = async (req, res) => {
  const updated = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  )
  res.json(updated)
}

// ADMIN — delete
export const deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id)
  res.json({ message: "Deleted" })
}
