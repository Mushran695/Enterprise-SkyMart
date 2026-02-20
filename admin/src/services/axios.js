import axios from "axios"
import { API_BASE } from "./baseUrl"

// Log the resolved API base at runtime to help debug deployed bundles
if (typeof window !== "undefined") {
  // eslint-disable-next-line no-console
  console.info("API base:", API_BASE)
}

const instance = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json"
  }
})

// Add token to request headers
instance.interceptors.request.use(
  config => {
    // Prefer admin_token but fall back to legacy 'token'
    const token = localStorage.getItem("admin_token") || localStorage.getItem("token")
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
  async err => {
    // If unauthorized -> clear auth and send to admin login (router basename is /admin)
    if (err.response?.status === 401 || err.response?.status === 403) {
      // Clear admin auth and redirect to login with a visible message
      localStorage.removeItem("admin_token")
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      try { alert('Session expired. Please login again.') } catch (e) {}
      window.location.href = "/admin/login"
      return Promise.reject(err)
    }

    // Retry idempotent GETs up to 2 times on network errors / 5xx
    const config = err.config || {}
    const shouldRetry = config && config.method === 'get'
    if (shouldRetry) {
      config.__retryCount = config.__retryCount || 0
      const maxRetries = 2
      const status = err.response?.status
      const networkOrServerError = !err.response || (status >= 500 && status < 600)
      if (networkOrServerError && config.__retryCount < maxRetries) {
        config.__retryCount += 1
        // exponential backoff
        await new Promise(r => setTimeout(r, 200 * config.__retryCount))
        return instance(config)
      }
    }

    // Normalize timeout / network error messages for UI
    if (err.code === 'ECONNABORTED' || err.message?.toLowerCase().includes('timeout')) {
      return Promise.reject(new Error('Request timed out (10s). Please try again.'))
    }

    if (!err.response) {
      return Promise.reject(new Error('Network error. Check your connection or API gateway.'))
    }

    return Promise.reject(err)
  }
)

export default instance
