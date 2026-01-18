import { useContext } from 'react'
import {
  XMarkIcon,
  ShoppingCartIcon,
  BoltIcon
} from '@heroicons/react/24/solid'
import { ShoppingCartContext } from '../../Context'
import { formatINR } from '../../utils'

const ProductDetail = () => {
  const context = useContext(ShoppingCartContext)
  const product = context.productToShow

  if (!context.isProductDetailOpen || !product?.id) return null

  const isInCart = context.cartProducts.some(
    item => item.id === product.id
  )

  const handleAddToCart = () => {
    if (!isInCart) {
      context.addToCart(product)
    }
  }

  return (
    <>
      {/* FULLSCREEN OVERLAY */}
      <div className="fixed inset-0 bg-black/50 z-40" />

      {/* FULLSCREEN PRODUCT VIEW */}
      <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
        
        {/* HEADER */}
        <div className="sticky top-0 bg-white border-b z-10">
          <div className="flex items-center justify-between px-6 py-4">
            <h2 className="text-xl font-semibold">Product Details</h2>
            <XMarkIcon
              className="h-6 w-6 cursor-pointer"
              onClick={context.closeProductDetail}
            />
          </div>
        </div>

        {/* BODY */}
        <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* LEFT – IMAGES */}
          <div className="lg:col-span-1">
            <img
              src={product.images?.[0] || 'https://via.placeholder.com/500'}
              alt={product.title}
              className="w-full h-[420px] object-contain border rounded-lg bg-white"
            />
          </div>

          {/* CENTER – PRODUCT INFO */}
          <div className="lg:col-span-1 space-y-4">
            <h1 className="text-2xl font-semibold">
              {product.title}
            </h1>

            <p className="text-gray-600">
              {product.description}
            </p>

            <div className="border-t pt-4">
              <p className="text-3xl font-bold text-black">
                {formatINR(product.price)}
              </p>

              <p className="text-green-600 text-sm mt-1">
                Inclusive of all taxes
              </p>
            </div>

            <span className="inline-block text-xs bg-gray-100 px-3 py-1 rounded">
              Category: {product.category?.name}
            </span>
          </div>

          {/* RIGHT – BUY BOX */}
          <div className="lg:col-span-1">
            <div className="border rounded-lg p-5 sticky top-24 space-y-4">
              
              <p className="text-xl font-bold">
                {formatINR(product.price)}
              </p>

              <p className="text-green-600 text-sm">
                FREE delivery Tomorrow
              </p>

              <p className="text-sm">
                Or fastest delivery Today
              </p>

              <p className="text-green-700 font-medium">
                In Stock
              </p>

              <button
                onClick={handleAddToCart}
                className={`w-full py-2 rounded font-medium flex items-center justify-center gap-2 ${
                  isInCart
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-yellow-400 hover:bg-yellow-500'
                }`}
              >
                <ShoppingCartIcon className="h-5 w-5" />
                {isInCart ? 'Added to Cart' : 'Add to Cart'}
              </button>

              <button
                className="w-full bg-orange-400 hover:bg-orange-500 py-2 rounded font-medium flex items-center justify-center gap-2"
              >
                <BoltIcon className="h-5 w-5" />
                Buy Now
              </button>

              <p className="text-xs text-gray-500">
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
