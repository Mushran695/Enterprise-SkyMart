import Product from "../../models/Product.js"

/* =========================
   MOCK PRODUCTS (FALLBACK)
========================= */
const mockProducts = [
  {
    id: 1,
    title: "iPhone 15",
    price: 79999,
    category: "electronics",
    rating: 4.8,
    image: "https://via.placeholder.com/300",
  },
  {
    id: 2,
    title: "Men T-Shirt",
    price: 999,
    category: "fashion",
    rating: 4.2,
    image: "https://via.placeholder.com/300",
  },
  {
    id: 3,
    title: "Face Serum",
    price: 1299,
    category: "beauty",
    rating: 4.5,
    image: "https://via.placeholder.com/300",
  },
]

/* =========================
   FETCH ALL PRODUCTS
   (DB → fallback to mock)
========================= */
export const fetchAllProducts = async () => {
  try {
    const products = await Product.find()
    return products.length ? products : mockProducts
  } catch (error) {
    console.error("DB error, returning mock products")
    return mockProducts
  }
}

export const fetchProductsByCategory = (category) =>
  Product.find({ category })


/* =========================
   CREATE PRODUCT
========================= */
export const createProduct = async (data) => {
  return await Product.create(data)
}

/* =========================
   EDIT PRODUCT
========================= */
export const editProduct = async (id, data) => {
  return await Product.findByIdAndUpdate(id, data, { new: true })
}

/* =========================
   REMOVE PRODUCT
========================= */
export const removeProduct = async (id) => {
  return await Product.findByIdAndDelete(id)
}
