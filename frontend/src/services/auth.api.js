import api from "../api"

export const adminLogin = (data) => api.post("/auth/login", data)
