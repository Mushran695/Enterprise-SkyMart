import api from './axios'

const BASE = '/notification'

export const getNotifications = async (params = {}) => {
  try {
    const { data } = await api.get(`${BASE}/list`, { params })
    return data
  } catch (err) {
    // If service not available, propagate gracefully
    if (err.response?.status === 404) return { unavailable: true }
    throw err
  }
}

export const sendTestNotification = async (payload = { message: 'Test notification from Admin' }) => {
  try {
    const { data } = await api.post(`${BASE}/test`, payload)
    return data
  } catch (err) {
    if (err.response?.status === 404) return { unavailable: true }
    throw err
  }
}

export default { getNotifications, sendTestNotification }
