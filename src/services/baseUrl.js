// Determine API base URL with precedence:
// 1. Vite env `VITE_API_URL`
// 2. If running in browser on localhost -> local backend
// 3. If in dev build (import.meta.env.DEV) -> local backend
// 4. Otherwise fallback to deployed API
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

export const API_BASE = API_BASE
