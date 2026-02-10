import api from "./axios"

const PRODUCT_API = `/products`
const ADMIN_API = `/admin`
const ANALYTICS_API = `/analytics`

/* ================================
   PRODUCTS
================================ */

export const fetchProducts = async () => {
  const res = await api.get(PRODUCT_API)
  return res.data
}

export const createProduct = async product => {
  const res = await api.post(PRODUCT_API, product)
  return res.data
}

export const updateProduct = async (id, product) => {
  const res = await api.put(`${PRODUCT_API}/${id}`, product)
  return res.data
}

export const deleteProduct = async id => {
  const res = await api.delete(`${PRODUCT_API}/${id}`)
  return res.data
}

/* ================================
   ADMIN ANALYTICS
================================ */

/* FETCH ALL ANALYTICS DATA */
export const getAdminAnalytics = async () => {
  try {
    const [statsRes, ordersRes, revenueRes, categoriesRes] = await Promise.all([
      api.get(`${ANALYTICS_API}/stats`),
      api.get(`${ANALYTICS_API}/orders`),
      api.get(`${ANALYTICS_API}/revenue`),
      api.get(`${ANALYTICS_API}/categories`),
    ])

    return {
      stats: statsRes.data,
      orders: ordersRes.data,
      revenue: revenueRes.data,
      categories: categoriesRes.data,
    }
  } catch (error) {
    console.error("❌ Analytics fetch error:", error)
    throw error
  }
}

/* INDIVIDUAL ENDPOINTS */
export const getAdminStats = async () => {
  const res = await api.get(`${ANALYTICS_API}/stats`)
  return res.data
}

export const getOrderStats = async () => {
  const res = await api.get(`${ANALYTICS_API}/orders`)
  return res.data
}

export const getRevenueStats = async () => {
  const res = await api.get(`${ANALYTICS_API}/revenue`)
  return res.data
}

export const getCategoryStats = async () => {
  const res = await api.get(`${ANALYTICS_API}/categories`)
  return res.data
}

/* ================================
   ADMIN USERS
================================ */

export const getAllUsers = async () => {
  const res = await api.get(`${ADMIN_API}/users`)
  return res.data
}
