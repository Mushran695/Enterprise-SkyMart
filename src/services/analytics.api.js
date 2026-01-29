import axios from "axios"

const API = axios.create({
  baseURL: "http://localhost:5000/api/analytics",
  withCredentials: true
})

/* ================================
   DASHBOARD CARDS
================================ */
export const getAdminStats = async () => {
  const res = await API.get("/")
  return res.data
}

/* ================================
   ORDERS PER MONTH
================================ */
export const getOrderStats = async () => {
  const res = await API.get("/orders")
  return res.data
}

/* ================================
   REVENUE PER MONTH
================================ */
export const getRevenueStats = async () => {
  const res = await API.get("/revenue")
  return res.data
}

/* ================================
   CATEGORY PIE
================================ */
export const getCategoryStats = async () => {
  const res = await API.get("/categories")
  return res.data
}
