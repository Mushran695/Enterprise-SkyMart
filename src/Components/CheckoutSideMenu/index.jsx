import { useContext } from "react"
import { XMarkIcon } from "@heroicons/react/24/solid"
import { ShoppingCartContext } from "../../Context"
import { useNavigate } from "react-router-dom"

const CheckoutSideMenu = () => {
  const {
    cartItems = [],
    removeFromCart,
    updateCartQty,
    checkoutOrder,
    closeCheckoutSideMenu,
  } = useContext(ShoppingCartContext)

  const navigate = useNavigate()

  const total = cartItems.reduce(
    (sum, i) => sum + i.price * i.qty,
    0
  )

  const handleViewCart = () => {
    closeCheckoutSideMenu()
    navigate("/cart-summary")
  }

  return (
    <aside className="
      fixed bottom-0 right-0
      w-full h-[90vh]
      md:top-0 md:h-screen md:w-[360px]
      bg-white
      border-t md:border-t-0 md:border-l border-black
      flex flex-col z-50
    ">
      {/* HEADER */}
      <div className="flex justify-between items-center p-4 border-b border-black sticky top-0 bg-white z-10">
        <h2 className="font-medium text-lg">My Order</h2>
        <XMarkIcon
          className="h-6 w-6 cursor-pointer"
          onClick={closeCheckoutSideMenu}
        />
      </div>

      {/* CART ITEMS */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-28">
        {cartItems.length === 0 && (
          <p className="text-center text-gray-500 mt-10">
            Your cart is empty
          </p>
        )}

        {cartItems.map(item => (
          <div
            key={item.product}
            className="flex justify-between items-center mb-4"
          >
            <div className="flex gap-3">
              <img
                src={item.image}
                alt={item.title}
                className="w-16 h-16 object-cover rounded"
              />

              <div>
                <p className="text-sm font-medium">{item.title}</p>

                {/* + / - QTY */}
                <div className="flex items-center gap-2 mt-1">
                  <button
                    onClick={() =>
                      updateCartQty(item.product, item.qty - 1)
                    }
                    className="px-2 py-1 border rounded"
                  >
                    −
                  </button>

                  <span>{item.qty}</span>

                  <button
                    onClick={() =>
                      updateCartQty(item.product, item.qty + 1)
                    }
                    className="px-2 py-1 border rounded"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1">
              <p className="font-medium">
                ${(item.price * item.qty).toFixed(2)}
              </p>
              <XMarkIcon
                className="h-5 w-5 cursor-pointer"
                onClick={() => removeFromCart(item.product)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <div className="border-t border-black p-4 sticky bottom-0 bg-white">
        <div className="flex justify-between mb-4">
          <span className="font-medium">Total:</span>
          <span className="font-medium">
            ${total.toFixed(2)}
          </span>
        </div>

        <button
          onClick={handleViewCart}
          disabled={cartItems.length === 0}
          className="w-full bg-black text-white py-3 rounded disabled:bg-gray-400"
        >
          View Cart
        </button>
      </div>
    </aside>
  )
}

export default CheckoutSideMenu
