import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { adminLogin } from "../../services/auth.api"

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const res = await adminLogin({ email, password })

      localStorage.setItem("token", res.data.token)
      localStorage.setItem("user", JSON.stringify(res.data.user))

      // Navigate to dashboard (router `basename` is "/admin", so use router-local path)
      navigate("/")
    } catch (err) {
      console.error("Login error:", err)
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  )
}

export default Login
