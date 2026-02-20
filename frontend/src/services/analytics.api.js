import api from "../api"

export const getAdminStats = async () => {
  const { data } = await api.get("/analytics/stats")
  return data
}

export const getOrderStats = async () => {
  const { data } = await api.get("/analytics/orders")
  return data
}

export const getRevenueStats = async () => {
  const { data } = await api.get("/analytics/revenue")
  return data
}

export const getCategoryStats = async () => {
  const { data } = await api.get("/analytics/categories")
  return data
}
