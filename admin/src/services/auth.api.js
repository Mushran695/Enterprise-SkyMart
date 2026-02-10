import api from "./axios"

export const adminLogin = (data) => api.post(`/auth/login`, data)
