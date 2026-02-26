import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { adminLogin } from "../../services/auth.api"

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  // UI-only states (do not affect auth logic)
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      const res = await adminLogin({ email, password })

      // Save admin token (primary) and keep legacy token for compatibility
      localStorage.setItem("admin_token", res.data.token)
      localStorage.setItem("token", res.data.token)
      localStorage.setItem("user", JSON.stringify(res.data.user))

      // Navigate to dashboard (router `basename` is "/admin", so use router-local path)
      navigate("/")
    } catch (err) {
      console.error("Login error:", err)
      setError(err?.response?.data?.message || "Invalid email or password")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-2 justify-center">
            <span className="text-2xl font-extrabold tracking-tight text-white">
              SkyMart
            </span>
            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-white/10 text-white border border-white/10">
              Admin
            </span>
          </div>
          <p className="mt-2 text-sm text-slate-300">
            Sign in to manage products, orders and customers
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-white/5 border border-white/10 shadow-2xl backdrop-blur p-6 sm:p-8">
          <h1 className="text-xl font-semibold text-white">Admin Login</h1>
          <p className="mt-1 text-sm text-slate-300">
            Use your admin credentials to continue
          </p>

          {error ? (
            <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          ) : null}

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@skymart.com"
                  className="w-full rounded-xl bg-white/10 text-white placeholder:text-slate-400 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400/60 focus:border-orange-400/40"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-xl bg-white/10 text-white placeholder:text-slate-400 border border-white/10 px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-orange-400/60 focus:border-orange-400/40"
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-200 hover:bg-white/10 transition"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold py-3 shadow-lg shadow-orange-500/20 hover:from-orange-400 hover:to-amber-400 active:scale-[0.99] transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Signing in..." : "Login"}
            </button>

            {/* Footer */}
            <div className="pt-2 text-center text-xs text-slate-400">
              Protected admin area • SkyMart
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login