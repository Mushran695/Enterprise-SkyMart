import axios from "axios"

// Use Vite env variable when deployed on Vercel, fallback to known Render URL for backwards compatibility
const API_BASE = import.meta.env.VITE_API_URL || "https://mern-ecommerce-1-mpg2.onrender.com/api"

// Log the resolved API base at runtime to help debug deployed bundles
if (typeof window !== "undefined") {
  // eslint-disable-next-line no-console
  console.info("API base:", API_BASE)
}

const instance = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json"
  }
})

// Add token to request headers
instance.interceptors.request.use(
  config => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  err => Promise.reject(err)
)

// Handle response
instance.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.clear()
      window.location.href = "/sign-in"
    }
    return Promise.reject(err)
  }
)

export default instance
