import api from "./axios"

const PRODUCTS_PATH = `/products`

export const getAllProducts = async () => {
  const res = await api.get(PRODUCTS_PATH)
  return res.data
}

export const addProduct = async (data) => {
  const res = await api.post(PRODUCTS_PATH, data)
  return res.data
}

export const updateProduct = async (id, data) => {
  const res = await api.put(`${PRODUCTS_PATH}/${id}`, data)
  return res.data
}

export const deleteProduct = async (id) => {
  const res = await api.delete(`${PRODUCTS_PATH}/${id}`)
  return res.data
}
