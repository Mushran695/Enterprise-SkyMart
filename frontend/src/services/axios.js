import axios from "axios"
import { API_BASE } from "./baseUrl"

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
    // API debug helper: in dev, log failed responses
    if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
      try {
        // eslint-disable-next-line no-console
        console.warn("API error:", {
          url: err.config?.url,
          method: err.config?.method,
          status: err.response?.status,
          message: err.response?.data || err.message,
        })
      } catch (e) {}
    }
    return Promise.reject(err)
  }
)

export default instance
