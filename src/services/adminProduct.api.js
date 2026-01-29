import axios from "axios"

const API = axios.create({
  baseURL: "http://localhost:5000/api/admin",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`
  }
})

export const getAllProducts = async () => {
  const res = await API.get("/products")
  return res.data
}

export const addProduct = async (data) => {
  const res = await API.post("/products", data)
  return res.data
}

export const updateProduct = async (id, data) => {
  const res = await API.put(`/products/${id}`, data)
  return res.data
}

export const deleteProduct = async (id) => {
  const res = await API.delete(`/products/${id}`)
  return res.data
}
