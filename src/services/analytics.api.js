import axios from "axios"

const API = "http://localhost:5000/api/analytics"

const auth = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`
  }
})

export const getAdminStats = async () => {
  const { data } = await axios.get(`${API}/stats`, auth())
  return data
}

export const getOrderStats = async () => {
  const { data } = await axios.get(`${API}/orders`, auth())
  return data
}

export const getRevenueStats = async () => {
  const { data } = await axios.get(`${API}/revenue`, auth())
  return data
}

export const getCategoryStats = async () => {
  const { data } = await axios.get(`${API}/categories`, auth())
  return data
}
