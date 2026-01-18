import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Layout from '../../Components/Layout'
import { ShoppingCartContext } from '../../Context'

const SignIn = () => {
  const context = useContext(ShoppingCartContext)
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const success = context.handleSignIn(email, password)

    if (success) {
      navigate('/', { replace: true })
    } else {
      setError('Invalid email or password')
    }
  }

  return (
    <Layout showAds={false}>
      {/* PAGE WRAPPER */}
      <div className="min-h-[calc(100vh-140px)] flex items-center justify-center px-4">

        {/* SIGN IN CARD */}
        <div className="w-full max-w-sm bg-white border rounded-lg shadow-sm p-6">
          
          <h2 className="text-2xl font-bold text-center mb-6">
            Sign in
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>

            {/* EMAIL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* ERROR */}
            {error && (
              <p className="text-sm text-red-600">
                {error}
              </p>
            )}

            {/* BUTTON */}
            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded font-medium hover:bg-gray-800 transition"
            >
              Sign in
            </button>
          </form>

          {/* SIGN UP LINK */}
          <p className="mt-6 text-center text-sm text-gray-600">
            New to SkyMart?{' '}
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
