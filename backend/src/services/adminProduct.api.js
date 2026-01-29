import axios from "axios"

const API = "http://localhost:5000/api/products"

const auth = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`
  }
})

export const addProduct = (data) =>
  axios.post(API, data, auth())

export const updateProduct = (id, data) =>
  axios.put(`${API}/${id}`, data, auth())

export const deleteProduct = (id) =>
  axios.delete(`${API}/${id}`, auth())
