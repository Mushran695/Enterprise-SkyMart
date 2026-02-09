import { useContext, useState } from "react"
import { ShoppingCartContext } from "../../Context"
import { 
  CheckIcon, 
  HeartIcon, 
  EyeIcon,
  StarIcon
} from "@heroicons/react/24/solid"
import { HeartIcon as HeartOutlineIcon } from "@heroicons/react/24/outline"

const Card = ({ data }) => {
  const context = useContext(ShoppingCartContext)
  const [isWishlisted, setIsWishlisted] = useState(false)

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
    rating = 0,
    discount = 0,
    isFeatured = false,
  } = data || {}

  const productName = name || title

  // Check if product is in cart
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

  const toggleWishlist = (e) => {
    e.stopPropagation()
    setIsWishlisted(!isWishlisted)
  }

  const handleQuickView = (e) => {
    e.stopPropagation()
    handleOpenProduct()
  }

  // Calculate discount price
  const discountedPrice = discount > 0 ? (price * (1 - discount / 100)).toFixed(2) : price

  return (
    <div
      onClick={handleOpenProduct}
      className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col overflow-hidden group h-full hover:border-orange-300"
    >
      {/* IMAGE SECTION */}
      <div className="relative w-full h-56 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        
        {/* Featured Badge */}
        {isFeatured && (
          <div className="absolute top-3 left-3 z-10 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            ⭐ Featured
          </div>
        )}

        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-3 right-3 z-10 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            -{discount}%
          </div>
        )}

        {/* In Cart Indicator */}
        {isInCart && (
          <span className="absolute bottom-3 left-3 z-10 bg-green-600 text-white p-2 rounded-full shadow-lg flex items-center gap-1">
            <CheckIcon className="w-4 h-4" />
            <span className="text-xs font-bold">In Cart</span>
          </span>
        )}

        {/* Product Image */}
        <img
          src={image || "/placeholder.png"}
          alt={productName}
          className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-110"
        />

        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
          <button
            onClick={handleQuickView}
            className="bg-white text-gray-800 p-3 rounded-full hover:bg-orange-500 hover:text-white transition-all shadow-lg transform hover:scale-110"
            title="Quick View"
          >
            <EyeIcon className="w-5 h-5" />
          </button>
          <button
            onClick={toggleWishlist}
            className="bg-white text-gray-800 p-3 rounded-full hover:bg-red-500 hover:text-white transition-all shadow-lg transform hover:scale-110"
            title="Add to Wishlist"
          >
            {isWishlisted ? (
              <HeartIcon className="w-5 h-5 text-red-500" />
            ) : (
              <HeartOutlineIcon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="p-4 flex flex-col flex-grow gap-2">
        
        {/* Category */}
        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">
          {category || "Uncategorized"}
        </p>

        {/* Title */}
        <h3 className="text-sm font-bold text-gray-900 line-clamp-2 h-10 group-hover:text-orange-600 transition">
          {productName}
        </h3>

        {/* Rating and Price Row */}
        <div className="flex items-center justify-between pt-2">
          {/* Rating */}
          {rating > 0 && (
            <div className="flex items-center gap-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"}`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-600 font-medium">({rating})</span>
            </div>
          )}
        </div>

        {/* Price Section */}
        <div className="mt-2 pt-2 border-t border-gray-100">
          <div className="flex items-baseline gap-2">
            <span className="text-xs text-gray-400">₹</span>
            {discount > 0 ? (
              <>
                <span className="text-lg font-bold text-gray-900">
                  ₹{discountedPrice}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  ₹{price}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-gray-900">
                ₹{price}
              </span>
            )}
          </div>
        </div>

        {/* Button Section */}
        <div className="mt-auto pt-4">
          {!isInCart ? (
            <button
              onClick={handleAddToCart}
              className="w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white text-sm py-2 rounded-lg font-bold shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
            >
              🛒 Add to Cart
            </button>
          ) : (
            <button
              onClick={handleAddToCart}
              className="w-full bg-green-500 hover:bg-green-600 text-white text-sm py-2 rounded-lg font-bold shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              <CheckIcon className="w-4 h-4" />
              In Cart
            </button>
          )}
        </div>

        {/* Wishlist indicator */}
        {isWishlisted && (
          <div className="mt-2 text-center text-xs text-red-600 font-semibold">
            ❤️ Added to Wishlist
          </div>
        )}
      </div>
    </div>
  )
}

export default Card
