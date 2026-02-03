import axios from "axios"

export const adminLogin = (data) =>
  axios.post("https://mern-ecommerce-1-mpg2.onrender.com/api/auth/login", data)
