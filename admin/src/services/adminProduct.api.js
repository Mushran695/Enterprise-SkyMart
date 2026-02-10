import axios from "axios"
import { API_BASE } from "./baseUrl"

const PRODUCTS_API = `${API_BASE}/products`

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`
})

export const getAllProducts = async () => {
  const res = await axios.get(PRODUCTS_API)
  return res.data
}

export const addProduct = async (data) => {
  const res = await axios.post(PRODUCTS_API, data, { headers: authHeaders() })
  return res.data
}

export const updateProduct = async (id, data) => {
  const res = await axios.put(`${PRODUCTS_API}/${id}`, data, { headers: authHeaders() })
  return res.data
}

export const deleteProduct = async (id) => {
  const res = await axios.delete(`${PRODUCTS_API}/${id}`, { headers: authHeaders() })
  return res.data
}
