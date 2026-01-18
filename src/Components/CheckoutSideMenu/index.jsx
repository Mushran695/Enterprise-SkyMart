import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { XMarkIcon } from '@heroicons/react/24/solid'
import { ShoppingCartContext } from '../../Context'
import OrderCard from '../OrderCard'
import { totalPrice, formatINR } from '../../utils'
import './styles.css'

const CheckoutSideMenu = () => {
  const context = useContext(ShoppingCartContext)
  const navigate = useNavigate()

  const handleDelete = (id) => {
    context.removeFromCart(id)
  }

  const handleViewCart = () => {
    context.closeCheckoutSideMenu()
    navigate('/cart-summary')
  }

  return (
    <>
      {/* OVERLAY */}
      <div
        className={`fixed inset-0 bg-black/50 transition-opacity duration-300 ${
          context.isCheckoutSideMenuOpen
            ? 'opacity-100'
            : 'opacity-0 pointer-events-none'
        }`}
        onClick={context.closeCheckoutSideMenu}
      />

      {/* SIDEBAR */}
      <aside
        className={`checkout-side-menu fixed right-0 top-[68px] h-[calc(100vh-68px)]
        w-full sm:w-[360px] bg-white border border-black rounded-lg
        transform transition-transform duration-300 ease-in-out z-20
        ${context.isCheckoutSideMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="font-medium text-xl">My Order</h2>
          <XMarkIcon
            className="h-6 w-6 cursor-pointer"
            onClick={context.closeCheckoutSideMenu}
          />
        </div>

        {/* CART ITEMS */}
        <div className="flex-1 overflow-y-auto px-6">
          {context.cartProducts.length === 0 ? (
            <p className="text-center text-gray-500 mt-10">
              Your cart is empty
            </p>
          ) : (
            context.cartProducts.map(product => (
              <OrderCard
                key={product.id}
                id={product.id}
                title={product.title}
                imageUrl={product.images?.[0]}
                price={product.price}
                handleDelete={handleDelete}
              />
            ))
          )}
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 border-t mt-auto">
          <p className="flex justify-between items-center mb-3">
            <span className="font-light">Total:</span>
            <span className="font-medium text-2xl">
              {formatINR(totalPrice(context.cartProducts))}
            </span>
          </p>

          <button
            className="bg-black text-white w-full py-3 rounded-lg hover:bg-gray-800 disabled:bg-gray-400"
            onClick={handleViewCart}
            disabled={context.cartProducts.length === 0}
          >
            View Cart
          </button>
        </div>
      </aside>
    </>
  )
}

export default CheckoutSideMenu
