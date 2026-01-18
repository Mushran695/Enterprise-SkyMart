import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCartContext } from '../../Context'
import Layout from '../../Components/Layout'

function SignUp() {
  const context = useContext(ShoppingCartContext)
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    context.handleSignUp(
      formData.email,
      formData.password,
      formData.name
    )

    navigate('/my-account')
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    setError('')
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
              className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email address"
              className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <button
              type="submit"
              className="bg-black text-white py-2 rounded-md hover:bg-gray-800 transition"
            >
              Create account
            </button>
          </form>

          <p className="text-sm text-center text-gray-600 mt-6">
            Already have an account?
            <Link
              to="/sign-in"
              className="ml-1 font-medium text-black hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>

      </div>
    </Layout>
  )
}

export default SignUp
