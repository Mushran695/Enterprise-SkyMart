import { useContext } from 'react'
import { ShoppingCartContext } from '../../Context'

const Card = ({ data }) => {
  const context = useContext(ShoppingCartContext)

  const showProduct = () => {
    context.setProductToShow(data)
    context.openProductDetail()
  }

  const addProductToCart = (e) => {
    e.stopPropagation()

    const alreadyInCart = context.cartProducts.some(
      product => product.id === data.id
    )

    if (!alreadyInCart) {
      context.addToCart(data)
    }
  }

  const isInCart = context.cartProducts.some(
    product => product.id === data.id
  )

  return (
    <div
      onClick={showProduct}
      className="bg-white w-full max-w-[260px] mx-auto border hover:shadow-md transition cursor-pointer"
    >
      {/* IMAGE */}
      <div className="relative w-full h-[240px] p-3">
        {/* CATEGORY */}
        <span className="absolute top-3 left-3 bg-gray-100 text-xs px-2 py-1 rounded">
          {data.category?.name}
        </span>

        {/* DISCOUNT */}
        {data.discount > 0 && (
          <span className="absolute top-3 right-3 bg-red-600 text-white text-xs px-2 py-1 rounded">
            {data.discount}% off
          </span>
        )}

        <img
          src={data.images?.[0] || 'https://via.placeholder.com/300'}
          alt={data.title}
          className="w-full h-full object-contain"
          loading="lazy"
        />
      </div>

      {/* CONTENT */}
      <div className="px-3 pb-4 flex flex-col gap-2">
        {/* TITLE */}
        <p className="text-sm font-medium leading-snug line-clamp-2 hover:text-orange-600">
          {data.title}
        </p>

        {/* PRICE */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold">
            ₹{data.price}
          </span>

          {data.discount > 0 && (
            <span className="text-sm text-gray-500 line-through">
              ₹{data.originalPrice}
            </span>
          )}
        </div>

        {/* ADD TO CART */}
        <button
          onClick={addProductToCart}
          disabled={isInCart}
          className={`mt-2 w-full py-2 text-sm rounded-full font-medium transition ${
            isInCart
              ? 'bg-gray-300 text-black cursor-not-allowed'
              : 'bg-[#ffd814] hover:bg-[#f7ca00]'
          }`}
        >
          {isInCart ? 'Added to Cart' : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}

export default Card
