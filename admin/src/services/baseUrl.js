// admin/src/services/baseUrl.js (or wherever this code lives)

const envBase =
  import.meta.env.VITE_API_BASE ||
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  undefined;

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
  // ✅ Production fallback MUST be HTTPS
  apiBase = "https://api.skymartapp.com/api";
}

export const API_BASE = apiBase;