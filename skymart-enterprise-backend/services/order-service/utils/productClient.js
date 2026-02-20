import axios from "axios"

const PRODUCT_BASE = process.env.PRODUCT_SERVICE_URL || "http://product-service:3001"

export async function fetchProductsBulk(ids) {
  const { data } = await axios.post(`${PRODUCT_BASE}/api/products/bulk`, { ids })
  return data?.products || []
}