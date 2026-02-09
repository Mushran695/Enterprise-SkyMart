import axios from "axios"
import { API_BASE } from "./baseUrl"

export const adminLogin = (data) =>
  axios.post(`${API_BASE}/auth/login`, data)
