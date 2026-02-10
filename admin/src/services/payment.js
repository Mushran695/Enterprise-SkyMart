import api from "./axios"

const BASE_PATH = `/payment/create-order`

export const createOrder = async (amount) => {
  const { data } = await api.post(BASE_PATH, { amount })
  return data
}
