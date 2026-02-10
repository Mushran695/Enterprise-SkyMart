// Determine API base URL with precedence:
// 1. Vite env `VITE_API_BASE`
// 2. If running in browser on localhost -> local backend
// 3. If in dev build (import.meta.env.DEV) -> local backend
// 4. Otherwise fallback to deployed API
let apiBase
if (import.meta.env.VITE_API_BASE) {
  apiBase = import.meta.env.VITE_API_BASE
} else if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
  apiBase = 'http://localhost:5000/api'
} else if (import.meta.env.DEV) {
  apiBase = 'http://localhost:5000/api'
} else {
  apiBase = 'https://mern-ecommerce-1-mpg2.onrender.com/api'
}

export const API_BASE = apiBase
