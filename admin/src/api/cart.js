import api from "./index"

export const getCart = () => api.get("/cart")

export const addToCartAPI = (productId) =>
  api.post("/cart", { productId })

export const removeFromCartAPI = (productId) =>
  api.delete(`/cart/${productId}`)

export const updateQtyAPI = (productId, qty) =>
  api.put(`/cart/${productId}`, { qty })
