import { useContext } from "react"
import { ShoppingCartContext } from "../../Context"
import { CheckIcon } from "@heroicons/react/24/solid"

const Card = ({ data }) => {
  const context = useContext(ShoppingCartContext)

  const cartItems = Array.isArray(context?.cartItems)
    ? context.cartItems
    : []

  const {
    _id,
    name = "",
    title = "",
    price = 0,
    image = "",
    category = "",
  } = data || {}

  const productName = name || title

  // ✅ Handles both productId OR populated product
  const isInCart = cartItems.some(
    item => item.product === _id || item.product?._id === _id
  )

  const handleAddToCart = (e) => {
    e.stopPropagation()
    context.addToCart(data)
  }

  const handleOpenProduct = () => {
    context.setProductToShow(data)
    context.openProductDetail()
  }

  return (
    <div
      onClick={handleOpenProduct}
      className="bg-white border rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col overflow-hidden"
    >
      <div className="relative w-full h-56 flex items-center justify-center bg-gray-50">
        <img
          src={image || "/placeholder.png"}
          alt={productName}
          className="h-full w-full object-contain p-4 transition-transform duration-300 hover:scale-105"
        />
        {isInCart && (
          <span className="absolute top-2 right-2 bg-green-600 text-white p-1 rounded-full shadow">
            <CheckIcon className="w-4 h-4" />
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow gap-2">
        <p className="text-xs text-gray-500 uppercase mb-1">{category}</p>

        <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
          {productName}
        </h3>

        <div className="mt-2 flex items-center gap-1">
          <span className="text-xs text-gray-500">₹</span>
          <span className="text-lg font-bold">{price}</span>
        </div>

        <div className="mt-auto pt-4">
          {!isInCart ? (
            <button
              onClick={handleAddToCart}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black text-sm py-2 rounded-lg font-semibold shadow hover:shadow-md transition"
            >
              Add to Cart
            </button>
          ) : (
            <div className="w-full text-center bg-green-100 text-green-700 py-2 rounded-md text-sm font-medium">
              In Cart
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Card
