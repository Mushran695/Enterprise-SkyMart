import axios from "axios"

// Resolve API base: prefer Vite env; if running in browser on localhost use local backend; otherwise use deployed URL
let API_BASE
if (import.meta.env.VITE_API_URL) {
  API_BASE = import.meta.env.VITE_API_URL
} else if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
  API_BASE = 'http://localhost:5000/api'
} else if (import.meta.env.DEV) {
  API_BASE = 'http://localhost:5000/api'
} else {
  API_BASE = 'https://mern-ecommerce-1-mpg2.onrender.com/api'
}
const API_URL = `${API_BASE}/admin`

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`
})

export const getAllProducts = async () => {
  const res = await axios.get(`${API_URL}/products`, { headers: authHeaders() })
  return res.data
}

export const addProduct = async (data) => {
  const res = await axios.post(`${API_URL}/products`, data, { headers: authHeaders() })
  return res.data
}

export const updateProduct = async (id, data) => {
  const res = await axios.put(`${API_URL}/products/${id}`, data, { headers: authHeaders() })
  return res.data
}

export const deleteProduct = async (id) => {
  const res = await axios.delete(`${API_URL}/products/${id}`, { headers: authHeaders() })
  return res.data
}
