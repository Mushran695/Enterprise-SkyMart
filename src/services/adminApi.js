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
   ADMIN ANALYTICS (🔥 FIXED)
================================ */

/* DASHBOARD CARDS */
export const getAdminStats = async () => {
  const res = await fetch(`${ADMIN_API}/analytics`, {
    headers: authHeader(),
  })
  return res.json()
}

/* BAR CHART */
export const getOrderStats = async () => {
  const res = await fetch(`${ADMIN_API}/analytics/orders`, {
    headers: authHeader(),
  })
  return res.json()
}

/* LINE CHART */
export const getRevenueStats = async () => {
  const res = await fetch(`${ADMIN_API}/analytics/revenue`, {
    headers: authHeader(),
  })
  return res.json()
}

/* PIE CHART */
export const getCategoryStats = async () => {
  const res = await fetch(`${ADMIN_API}/analytics/categories`, {
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
