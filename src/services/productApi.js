import axios from "axios"

const API_URL = "http://localhost:5000/api/products"

/* =========================
   AXIOS INSTANCE
========================= */
const api = axios.create({
  baseURL: API_URL,
})

/* =========================
   GET ALL PRODUCTS
========================= */
export const getAllProducts = async () => {
  const res = await api.get("/")
  return res.data   // ✅ backend sends array directly
}

/* =========================
   GET PRODUCTS (alias)
========================= */
export const getProducts = async (category) => {
  const res = await api.get("/", {
    params: category ? { category } : {},
  })
  return res.data
}

/* =========================
   PRODUCTS BY CATEGORY
========================= */
export const getProductsByCategory = async (category) => {
  const res = await api.get("/", {
    params: { category },
  })
  return res.data
}
