import axios from "axios"

const API = "http://localhost:5000/api/products"

export const fetchProducts = (category) =>
  axios.get(category ? `${API}?category=${category}` : API)
