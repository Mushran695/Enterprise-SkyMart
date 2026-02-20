import api from './axios'

const BASE = '/orders'

export const getOrders = async (params = {}) => {
  const { data } = await api.get(BASE, { params })
  return data
}

export const getOrderById = async (id) => {
  const { data } = await api.get(`${BASE}/${id}`)
  return data
}

export const updateOrderStatus = async (id, status) => {
  const { data } = await api.put(`${BASE}/${id}/status`, { status })
  return data
}

export const searchOrders = async (query) => {
  const { data } = await api.get(`${BASE}`, { params: { q: query } })
  return data
}

export default {
  getOrders,
  getOrderById,
  updateOrderStatus,
  searchOrders
}
