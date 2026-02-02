import axios from "axios"

const instance = axios.create({
  baseURL: "http://localhost:5000/api",
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
