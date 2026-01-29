import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import Layout from "../../Components/Layout"

function SignUp() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
  })

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    try {
      setLoading(true)

      const { data } = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      // 🔥 If backend returned user, registration succeeded
      if (!data.user) {
        throw new Error("Registration failed")
      }

      // (optional) Auto login after signup
      if (data.token) {
        localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))
      }

      navigate("/sign-in")

    } catch (err) {
      console.error("Register error:", err.response?.data || err.message)

      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to create account"
      )
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
    setError("")
  }

  return (
    <Layout showFooter={false} showAds={false}>
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow">
          <h1 className="text-2xl font-semibold text-center mb-6">
            Create your account
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              name="name"
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
              className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              required
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              required
            />

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-black text-white py-2 rounded-md hover:bg-gray-800 transition disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create account"}
            </button>
          </form>

          <p className="text-sm text-center text-gray-600 mt-6">
            Already have an account?
            <Link to="/sign-in" className="ml-1 font-medium text-black hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  )
}

export default SignUp
