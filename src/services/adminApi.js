const PRODUCT_API = "http://localhost:5000/api/products"
const ADMIN_API = "http://localhost:5000/api/admin"

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
})

/* ================================
   PRODUCTS
================================ */

export const fetchProducts = async () => {
  const res = await fetch(PRODUCT_API)
  return res.json()
}

export const createProduct = async product => {
  const res = await fetch(PRODUCT_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(product),
  })
  return res.json()
}

export const updateProduct = async (id, product) => {
  const res = await fetch(`${PRODUCT_API}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(product),
  })
  return res.json()
}

export const deleteProduct = async id => {
  await fetch(`${PRODUCT_API}/${id}`, {
    method: "DELETE",
    headers: authHeader(),
  })
}

/* ================================
   ADMIN ANALYTICS
================================ */

const ANALYTICS_API = "http://localhost:5000/api/analytics"

/* FETCH ALL ANALYTICS DATA */
export const getAdminAnalytics = async () => {
  try {
    const token = localStorage.getItem("token")
    console.log("🔐 Token available:", !!token)
    
    const headers = {
      "Content-Type": "application/json",
      ...authHeader()
    }
    
    console.log("📡 Fetching analytics from:", ANALYTICS_API)
    
    const [statsRes, ordersRes, revenueRes, categoriesRes] = await Promise.all([
      fetch(`${ANALYTICS_API}/stats`, { headers }),
      fetch(`${ANALYTICS_API}/orders`, { headers }),
      fetch(`${ANALYTICS_API}/revenue`, { headers }),
      fetch(`${ANALYTICS_API}/categories`, { headers }),
    ])
    
    // Check for response errors
    if (!statsRes.ok) throw new Error(`Stats failed: ${statsRes.status}`)
    if (!ordersRes.ok) throw new Error(`Orders failed: ${ordersRes.status}`)
    if (!revenueRes.ok) throw new Error(`Revenue failed: ${revenueRes.status}`)
    if (!categoriesRes.ok) throw new Error(`Categories failed: ${categoriesRes.status}`)
    
    const stats = await statsRes.json()
    const orders = await ordersRes.json()
    const revenue = await revenueRes.json()
    const categories = await categoriesRes.json()
    
    console.log("✅ All analytics fetched successfully:", { stats, orders, revenue, categories })
    
    return { stats, orders, revenue, categories }
  } catch (error) {
    console.error("❌ Analytics fetch error:", error)
    throw error
  }}

/* INDIVIDUAL ENDPOINTS */
export const getAdminStats = async () => {
  const res = await fetch(`${ANALYTICS_API}/stats`, {
    headers: authHeader(),
  })
  return res.json()
}

export const getOrderStats = async () => {
  const res = await fetch(`${ANALYTICS_API}/orders`, {
    headers: authHeader(),
  })
  return res.json()
}

export const getRevenueStats = async () => {
  const res = await fetch(`${ANALYTICS_API}/revenue`, {
    headers: authHeader(),
  })
  return res.json()
}

export const getCategoryStats = async () => {
  const res = await fetch(`${ANALYTICS_API}/categories`, {
    headers: authHeader(),
  })
  return res.json()
}

/* ================================
   ADMIN USERS
================================ */

export const getAllUsers = async () => {
  const res = await fetch(`${ADMIN_API}/users`, {
    headers: authHeader(),
  })
  return res.json()
}
