// frontend/src/services/baseUrl.js

// Preferred env (use this going forward):
//   VITE_API_BASE_URL = "http://<EC2-IP>:8080/api"
// Backward compatible:
//   VITE_API_URL

const envBase =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "";

let apiBase;

if (envBase) {
  apiBase = envBase;
} else if (
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1")
) {
  apiBase = "http://localhost:5000/api";
} else if (import.meta.env.DEV) {
  apiBase = "http://localhost:5000/api";
} else {
  // Fallback ONLY if env not provided in production build
  apiBase = "https://mern-ecommerce-1-mpg2.onrender.com/api";
}

export const API_BASE = apiBase;
