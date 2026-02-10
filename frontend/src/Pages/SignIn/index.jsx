import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Layout from "../../Components/Layout"
import api from "../../api"

const SignIn = () => {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      })

      const { token, user } = res.data

      if (!token || !user) {
        throw new Error("Invalid server response")
      }

      // Store auth data
      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(user))

      // Redirect by role
      if (user.role === "admin") {
        navigate("/", { replace: true })
      } else {
        navigate("/", { replace: true })
      }

    } catch (err) {
      console.error("Login error:", err.response?.data || err.message)

      setError(
        err.response?.data?.message || "Invalid email or password"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout showAds={false}>
      <div className="min-h-[calc(100vh-140px)] flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-white border rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-center mb-6">
            Sign in
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded border px-3 py-2 text-sm focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded border px-3 py-2 text-sm focus:ring-2 focus:ring-black"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-2 rounded font-medium hover:bg-gray-800 transition disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            New to SkyMart?{" "}
            <Link
              to="/sign-up"
              className="font-semibold text-black hover:underline"
            >
              Create your account
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  )
}

export default SignIn
