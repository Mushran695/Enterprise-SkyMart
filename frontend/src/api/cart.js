import api from "./index"

export const getCart = () => api.get("/cart")

// Accept a product object and send the richer payload the new order-service expects
export const addToCartAPI = (product) =>
  api.post("/cart", {
    productId: product._id || product.id,
    category: product.category,
    title: product.name || product.title,
    price: product.price,
    image: product.image,
  })

export const removeFromCartAPI = (productId) =>
  api.delete(`/cart/${productId}`)

// order-service expects a PUT to /cart/update with { productId, qty }
export const updateQtyAPI = (productId, qty) =>
  api.put(`/cart/update`, { productId, qty })
