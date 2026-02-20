import api from "../api"

export const getAllProducts = async () => {
  const res = await api.get("/products")
  return res.data || []
}

export const getProducts = async (category) => {
  const res = await api.get("/products", {
    params: category ? { category } : {},
  })
  return res.data || []
}

export const getProductsByCategory = async (category) => {
  const res = await api.get("/products", {
    params: { category },
  })
  return res.data || []
}
