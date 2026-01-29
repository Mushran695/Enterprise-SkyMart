import { useContext } from "react"
import {
  XMarkIcon,
  ShoppingCartIcon,
  BoltIcon,
} from "@heroicons/react/24/solid"
import { ShoppingCartContext } from "../../Context"
import { formatINR } from "../../utils"

const ProductDetail = () => {
  const context = useContext(ShoppingCartContext)
  const product = context.productToShow

  if (!context.isProductDetailOpen || !product?._id) return null

  const isInCart = context.cartItems.some(
    item => item._id === product._id
  )

  const handleAddToCart = () => {
    if (!isInCart) context.addToCart(product)
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={context.closeProductDetail}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 bg-gray-100 overflow-y-auto">
        
        {/* Header */}
{/* HEADER */}
<div className="sticky top-0 bg-white border-b z-10 shadow-sm">
  <div className="flex items-center justify-between px-6 py-4">

    {/* Mobile Back (LEFT) */}
    <button
      onClick={context.closeProductDetail}
      className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-black md:hidden"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      Back
    </button>

    {/* Title (center) */}
    <h2 className="text-lg md:text-xl font-semibold mx-auto">
      Product Details
    </h2>

    {/* Desktop Back (RIGHT) */}
    <button
      onClick={context.closeProductDetail}
      className="hidden md:flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-black"
    >
      Back
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 rotate-180"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
    </button>

  </div>
</div>



        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* Images */}
          <div className="lg:col-span-5 bg-white p-6 rounded-lg shadow">
            <img
              src={product.image || "https://via.placeholder.com/500"}
              alt={product.title}
              className="w-full h-[420px] object-contain"
            />
          </div>

          {/* Info */}
          <div className="lg:col-span-4 space-y-4">
            <h1 className="text-2xl font-semibold text-gray-900">
              {product.title}
            </h1>

            <p className="text-gray-600 text-sm">
              {product.description}
            </p>

            <div className="border-t pt-4 space-y-1">
              <p className="text-3xl font-bold">
                {formatINR(product.price)}
              </p>
              <p className="text-green-600 text-sm">
                Inclusive of all taxes
              </p>
            </div>

            <span className="inline-block text-xs bg-gray-100 px-3 py-1 rounded">
              Category: {product.category}
            </span>
          </div>

          {/* Buy Box */}
          <div className="lg:col-span-3">
            <div className="bg-white border rounded-lg shadow p-6 space-y-4 sticky top-24">
              
              <p className="text-2xl font-bold">
                {formatINR(product.price)}
              </p>

              <p className="text-green-600 text-sm">
                FREE delivery Tomorrow
              </p>

              <p className="text-green-700 font-semibold">
                In Stock
              </p>

              <button
                onClick={handleAddToCart}
                disabled={isInCart}
                className={`w-full py-3 rounded font-semibold flex items-center justify-center gap-2 transition ${
                  isInCart
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-yellow-400 hover:bg-yellow-500"
                }`}
              >
                <ShoppingCartIcon className="h-5 w-5" />
                {isInCart ? "Added to Cart" : "Add to Cart"}
              </button>

              <button
                className="w-full bg-orange-500 hover:bg-orange-600 py-3 rounded font-semibold flex items-center justify-center gap-2 transition"
              >
                <BoltIcon className="h-5 w-5" />
                Buy Now
              </button>

              <p className="text-xs text-gray-500 text-center">
                Secure transaction 🔒
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProductDetail
