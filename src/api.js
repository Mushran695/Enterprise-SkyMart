import axios from "axios"

const API_BASE = import.meta.env.VITE_API_URL || "https://mern-ecommerce-1-mpg2.onrender.com/api"

if (typeof window !== "undefined") {
  // eslint-disable-next-line no-console
  console.info("API base (api.js):", API_BASE)
}

const api = axios.create({
  baseURL: API_BASE,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
