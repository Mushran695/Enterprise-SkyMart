import Product from "../../models/Product.js"

export const fetchAllProducts = async () => {
  return await Product.find().sort({ createdAt: -1 })
}

export const createProduct = async (data) => {
  return await Product.create(data)
}

export const editProduct = async (id, data) => {
  return await Product.findByIdAndUpdate(id, data, { new: true })
}

export const removeProduct = async (id) => {
  return await Product.findByIdAndDelete(id)
}
