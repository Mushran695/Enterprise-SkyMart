import axios from "axios"

export const adminLogin = (data) =>
  axios.post("http://localhost:5000/api/auth/login", data)
