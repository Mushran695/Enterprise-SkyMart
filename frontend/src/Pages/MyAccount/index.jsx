import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../Components/Layout'
import { ShoppingCartContext } from '../../Context'

function MyAccount() {
    const context = useContext(ShoppingCartContext)
    const navigate = useNavigate()

    const handleSignOut = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        context.setIsUserAuthenticated(false)
        context.setAccount(null)
        navigate('/sign-in')
    }

    if (!context?.isUserAuthenticated) {
        navigate('/sign-in')
        return null
    }

    if (context?.isLoading) {
        return (
            <Layout>
                <div className="animate-pulse p-8">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                    <div className="space-y-4">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                </div>
            </Layout>
        )
    }

    return (
        <Layout>
            <div className="max-w-2xl mx-auto p-8">
                <h1 className="text-3xl font-bold mb-8">My Account</h1>
                
                <div className="bg-white shadow rounded-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Name</label>
                            <p className="mt-1 text-gray-900">{context?.account?.name || context?.account?.email?.split('@')[0] || 'Not provided'}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Email</label>
                            <p className="mt-1 text-gray-900">{context?.account?.email || 'Not provided'}</p>
                        </div>
                        {context?.account?.role && (
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Account Type</label>
                                <p className="mt-1 text-gray-900 capitalize">{context?.account?.role}</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white shadow rounded-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
                    <button
                        onClick={() => navigate('/my-orders')}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 text-blue-600 transition-colors"
                    >
                        → View Your Orders
                    </button>
                </div>

                <button
                    onClick={handleSignOut}
                    className="w-full bg-red-600 text-white rounded-lg py-2 px-4 hover:bg-red-700 transition-colors font-semibold"
                >
                    Sign Out
                </button>
            </div>
        </Layout>
    )
}

export default MyAccount