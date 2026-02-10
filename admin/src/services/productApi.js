import api from "./axios"

const BASE = `/products`

export const getAllProducts = async () => {
  const res = await api.get(BASE)
  return res.data
}

export const getProducts = async (category) => {
  const res = await api.get(BASE, { params: category ? { category } : {} })
  return res.data
}

export const getProductsByCategory = async (category) => {
  const res = await api.get(BASE, { params: { category } })
  return res.data
}
