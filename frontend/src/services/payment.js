import api from "../api"

export const createOrder = async (amount) => {
  const { data } = await api.post("/payment/create-order", { amount })
  return data
}
