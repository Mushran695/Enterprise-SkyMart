import api from './axios'

const BASE = '/payment'

export const listPayments = async (params = {}) => {
  const { data } = await api.get(`${BASE}/payments`, { params })
  return data
}

export const verifyPayment = async (payload) => {
  const { data } = await api.post(`${BASE}/verify-payment`, payload)
  return data
}

export default { listPayments, verifyPayment }
