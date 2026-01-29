import axios from "axios"

const BASE_URL = "http://localhost:5000/api/payment/create-order"

export const createOrder = async (amount) => {
  try {
    // Try AXIOS first
    const { data } = await axios.post(BASE_URL, { amount })
    return data
  } catch (axiosError) {
    console.warn("Axios failed, trying fetch...", axiosError)

    // Fallback to FETCH
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount })
    })

    if (!res.ok) {
      const err = await res.text()
      throw new Error("Order API failed: " + err)
    }

    return await res.json()
  }
}
