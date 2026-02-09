import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  XMarkIcon,
  ShoppingCartIcon,
  BoltIcon,
  StarIcon,
  HeartIcon,
  TruckIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/solid"
import { HeartIcon as HeartOutlineIcon } from "@heroicons/react/24/outline"
import { ShoppingCartContext } from "../../Context"
import { formatINR } from "../../utils"

const ProductDetail = () => {
  const context = useContext(ShoppingCartContext)
  const navigate = useNavigate()
  const product = context.productToShow
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [imageZoom, setImageZoom] = useState(false)

  if (!context.isProductDetailOpen || !product?._id) return null

  const isInCart = context.cartItems.some(
    item => item._id === product._id
  )

  const handleAddToCart = () => {
    if (!isInCart) {
      context.addToCart(product)
    }
  }

  const handleBuyNow = () => {
    if (!isInCart) context.addToCart(product)
    context.closeProductDetail()
    navigate("/cart-summary")
  }

  const handleQuantityChange = (delta) => {
    setQuantity(prev => Math.max(1, prev + delta))
  }

  const discountedPrice = product.discount > 0 
    ? (product.price * (1 - product.discount / 100)).toFixed(2) 
    : product.price

  const savingAmount = product.discount > 0 
    ? (product.price - discountedPrice).toFixed(2) 
    : 0

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 z-40 backdrop-blur-sm"
        onClick={context.closeProductDetail}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
        
        {/* Header */}
        <div className="sticky top-0 bg-white border-b z-10 shadow-sm">
          <div className="flex items-center justify-between px-4 md:px-6 py-4 max-w-7xl mx-auto w-full">
            <button
              onClick={context.closeProductDetail}
              className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-black"
            >
              <XMarkIcon className="h-6 w-6" />
              <span className="hidden sm:inline">Close</span>
            </button>
            <h2 className="text-lg md:text-xl font-bold text-gray-900">
              Product Details
            </h2>
            <div className="w-8" />
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 md:gap-8">

            {/* ================= IMAGE SECTION ================= */}
            <div className="md:col-span-1 lg:col-span-5">
              <div 
                className="relative w-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden shadow-lg"
                onMouseEnter={() => setImageZoom(true)}
                onMouseLeave={() => setImageZoom(false)}
              >
                <img
                  src={product.image || "https://via.placeholder.com/500"}
                  alt={product.title}
                  className={`w-full h-[400px] md:h-[500px] object-contain p-6 transition-transform duration-300 ${
                    imageZoom ? "scale-125" : "scale-100"
                  }`}
                />
                
                {/* Featured Badge */}
                {product.isFeatured && (
                  <div className="absolute top-4 left-4 bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    ⭐ Featured
                  </div>
                )}

                {/* Discount Badge */}
                {product.discount > 0 && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    -{product.discount}% OFF
                  </div>
                )}
              </div>

              {/* Zoom Hint */}
              <p className="text-xs text-gray-500 text-center mt-2">
                Hover to zoom
              </p>
            </div>

            {/* ================= DETAILS SECTION ================= */}
            <div className="md:col-span-1 lg:col-span-4 space-y-5">
              
              {/* Category & Title */}
              <div>
                <p className="text-sm font-bold text-orange-600 uppercase tracking-wider mb-2">
                  {product.category || "Uncategorized"}
                </p>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                  {product.title}
                </h1>
              </div>

              {/* Rating */}
              {product.rating > 0 && (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`w-5 h-5 ${i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-bold text-gray-900">{product.rating}</span>
                  <span className="text-sm text-gray-600">(142 reviews)</span>
                </div>
              )}

              {/* Description */}
              {product.description && (
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Price Section */}
              <div className="border-t border-b py-5 space-y-2">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-gray-900">
                    ₹{discountedPrice}
                  </span>
                  {product.discount > 0 && (
                    <>
                      <span className="text-xl text-gray-400 line-through">
                        ₹{product.price}
                      </span>
                      <span className="text-lg font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full">
                        Save ₹{savingAmount}
                      </span>
                    </>
                  )}
                </div>
                <p className="text-sm text-green-600 font-semibold">
                  ✓ Inclusive of all taxes
                </p>
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-semibold text-green-700">In Stock</span>
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-start gap-2">
                  <TruckIcon className="w-5 h-5 text-orange-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm font-bold text-gray-900">Free Delivery</p>
                    <p className="text-xs text-gray-600">Tomorrow</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <ShieldCheckIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm font-bold text-gray-900">Secure</p>
                    <p className="text-xs text-gray-600">Payment 🔒</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <ArrowPathIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm font-bold text-gray-900">Return</p>
                    <p className="text-xs text-gray-600">30-day policy</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <HeartIcon className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm font-bold text-gray-900">Save</p>
                    <p className="text-xs text-gray-600">To wishlist</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ================= BUY BOX SECTION ================= */}
            <div className="md:col-span-2 lg:col-span-3">
              <div className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-xl shadow-lg p-6 space-y-5 sticky top-24">
                
                {/* Price Display */}
                <div>
                  <p className="text-sm text-gray-600 mb-1">Price</p>
                  <p className="text-3xl font-bold text-gray-900">
                    ₹{discountedPrice}
                  </p>
                  {product.discount > 0 && (
                    <p className="text-sm text-green-600 font-semibold mt-1">
                      Save ₹{savingAmount} ({product.discount}% OFF)
                    </p>
                  )}
                </div>

                {/* Quantity Selector */}
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-2 block">
                    Quantity
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition"
                    >
                      −
                    </button>
                    <span className="flex-1 text-center font-bold text-lg">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={isInCart}
                  className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all duration-200 text-lg ${
                    isInCart
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : "bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-xl active:scale-95"
                  }`}
                >
                  <ShoppingCartIcon className="h-6 w-6" />
                  {isInCart ? "✓ Added to Cart" : "Add to Cart"}
                </button>

                {/* Buy Now Button */}
                <button
                  onClick={handleBuyNow}
                  className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all duration-200 text-lg shadow-lg hover:shadow-xl active:scale-95"
                >
                  <BoltIcon className="h-6 w-6" />
                  Buy Now
                </button>

                {/* Wishlist Button */}
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all duration-200 border-2 ${
                    isWishlisted
                      ? "bg-red-50 border-red-500 text-red-600"
                      : "bg-gray-50 border-gray-300 text-gray-700 hover:border-red-500"
                  }`}
                >
                  {isWishlisted ? (
                    <>
                      <HeartIcon className="h-5 w-5" />
                      Saved to Wishlist ❤️
                    </>
                  ) : (
                    <>
                      <HeartOutlineIcon className="h-5 w-5" />
                      Add to Wishlist
                    </>
                  )}
                </button>

                {/* Trust Badges */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                  <p className="text-xs text-green-700 font-semibold">
                    ✓ 100% Authentic
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    Secure transaction with encrypted payment
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

export default ProductDetail
