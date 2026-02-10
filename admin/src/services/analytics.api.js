import api from "./axios"

const API = `/analytics`

export const getAdminStats = async () => {
  const { data } = await api.get(`${API}/stats`)
  return data
}

export const getOrderStats = async () => {
  const { data } = await api.get(`${API}/orders`)
  return data
}

export const getRevenueStats = async () => {
  const { data } = await api.get(`${API}/revenue`)
  return data
}

export const getCategoryStats = async () => {
  const { data } = await api.get(`${API}/categories`)
  return data
}
