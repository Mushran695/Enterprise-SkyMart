import { adminLogin } from "../../services/auth.api"

const handleLogin = async (email, password) => {
  const res = await adminLogin({ email, password })

  localStorage.setItem("token", res.data.token)
  localStorage.setItem("user", JSON.stringify(res.data.user))
}
