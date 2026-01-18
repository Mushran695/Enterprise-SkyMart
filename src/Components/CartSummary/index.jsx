import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeftIcon, LockClosedIcon } from '@heroicons/react/24/solid'
import { ShoppingCartContext } from '../../Context'
import OrderCard from '../../Components/OrderCard'
import { totalPrice, formatINR } from '../../utils'
import Layout from '../../Components/Layout'

const CartSummary = () => {
  const context = useContext(ShoppingCartContext)
  const navigate = useNavigate()

  const cartTotal = totalPrice(context.cartProducts)

  const handleCheckout = () => {
    const orderToAdd = {
      date: new Date().toLocaleDateString('en-IN'),
      products: context.cartProducts,
      totalProducts: context.cartProducts.length,
      totalPrice: cartTotal
    }

    context.setOrder([...context.order, orderToAdd])
    context.setCartProducts([])
    context.setSearchByTitle('')
    context.closeCheckoutSideMenu()

    navigate('/my-orders')
  }

  return (
    <Layout>
      <div className="max-w-screen-xl mx-auto px-4 py-6">

        {/* ================= HEADER ================= */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="hover:bg-gray-100 p-2 rounded"
          >
            <ChevronLeftIcon className="h-6 w-6 text-gray-700" />
          </button>
          <h1 className="text-2xl font-semibold">Shopping Cart</h1>
        </div>

        {/* ================= EMPTY CART ================= */}
        {context.cartProducts.length === 0 ? (
          <div className="bg-white border rounded-lg p-10 text-center">
            <h2 className="text-2xl font-semibold mb-3">
              Your SkyMart Cart is empty
            </h2>
            <p className="text-gray-600 mb-6">
              Add items to your cart to proceed with checkout.
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-yellow-400 hover:bg-yellow-500 px-6 py-2 rounded font-medium"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          /* ================= CART LAYOUT ================= */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ================= LEFT: CART ITEMS ================= */}
            <div className="lg:col-span-2 bg-white border rounded-lg p-5">
              <div className="flex justify-between items-center border-b pb-3 mb-4">
                <h2 className="text-lg font-semibold">
                  Shopping Cart
                </h2>
                <span className="text-sm text-gray-500">
                  Price
                </span>
              </div>

              <div className="space-y-6">
                {context.cartProducts.map(product => (
                  <OrderCard
                    key={product.id}
                    id={product.id}
                    title={product.title}
                    imageUrl={product.images?.[0]}
                    price={formatINR(product.price)}
                  />
                ))}
              </div>

              <div className="border-t mt-6 pt-4 text-right">
                <span className="text-lg">
                  Subtotal ({context.cartProducts.length} items):{' '}
                  <strong>{formatINR(cartTotal)}</strong>
                </span>
              </div>
            </div>

            {/* ================= RIGHT: CHECKOUT SUMMARY ================= */}
            <div className="bg-white border rounded-lg p-5 h-fit sticky top-24">

              <p className="text-green-700 text-sm mb-3">
                ✔ Your order is eligible for FREE Delivery
              </p>

              <p className="text-lg mb-4">
                Subtotal ({context.cartProducts.length} items):{' '}
                <span className="font-bold text-xl">
                  {formatINR(cartTotal)}
                </span>
              </p>

              {context.isUserAuthenticated ? (
                <button
                  onClick={handleCheckout}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 py-2 rounded font-medium flex items-center justify-center gap-2"
                >
                  <LockClosedIcon className="h-4 w-4" />
                  Proceed to Buy
                </button>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/sign-in')}
                    className="w-full bg-yellow-400 hover:bg-yellow-500 py-2 rounded font-medium"
                  >
                    Sign in to checkout
                  </button>

                  <button
                    onClick={() => navigate('/sign-up')}
                    className="w-full border border-gray-300 py-2 rounded hover:bg-gray-50"
                  >
                    Create your SkyMart account
                  </button>
                </div>
              )}

              <p className="text-xs text-gray-500 mt-4 text-center">
                🔒 Secure transaction
              </p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default CartSummary
