// Determine API base URL with precedence:
// 1. Vite env `VITE_API_BASE`
// 2. If running in browser on localhost -> local backend
// 3. If in dev build (import.meta.env.DEV) -> local backend
// 4. Otherwise fallback to deployed API
let apiBase
if (import.meta.env.VITE_API_BASE) {
  apiBase = import.meta.env.VITE_API_BASE
} else {
  // Force admin to talk to the central API gateway by default
  apiBase = 'http://13.60.55.228:8080/api'
}

export const API_BASE = apiBase
