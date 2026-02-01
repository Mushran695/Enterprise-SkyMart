import {
  MinusIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid"

const OrderCard = ({
  // OLD (do not remove)
  id,
  title,
  imageUrl,
  price,
  handleDelete,
  totalPrice,
  totalProducts,

  // NEW (optional)
  item,
  increaseQty,
  decreaseQty,
  buyNow,
  quantity,
}) => {
  // Handle both qty and quantity field names, plus passed quantity prop
  const qty = item?.qty ?? item?.quantity ?? quantity ?? 1
  const finalTitle = item?.title || title
  const finalImage =
  item?.image ||
  item?.product?.image ||
  imageUrl ||
  "https://via.placeholder.com/120"
  const unitPrice = item?.price ?? price
  const productId = item?.product || id

  // For display in My Orders list view
  if (totalPrice && totalProducts !== undefined) {
    return (
      <div className="bg-white border rounded-lg p-4 hover:shadow-md transition">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-semibold text-gray-800">Order Summary</p>
            <p className="text-sm text-gray-600">{totalProducts} items</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-green-600">
              ₹{typeof totalPrice === 'number' ? totalPrice.toFixed(2) : totalPrice}
            </p>
          </div>
        </div>
      </div>
    )
  }

  // For detailed order items view
  return (
    <div className="grid grid-cols-[120px_1fr_180px] gap-6 border-b py-6">
      {/* IMAGE */}
      <img
        src={finalImage}
        alt={finalTitle}
        className="w-[120px] h-[120px] object-contain border rounded bg-white"
      />

      {/* DETAILS */}
      <div className="flex flex-col gap-2">
        <p className="font-medium text-gray-800 line-clamp-2">
          {finalTitle}
        </p>

        <p className="text-green-600 text-sm font-medium">
          In Stock
        </p>

        {/* QTY CONTROLS (safe) */}
        {item && increaseQty && decreaseQty && (
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center border rounded">
              <button
                onClick={() => decreaseQty(item)}
                className="px-2 py-1 hover:bg-gray-100"
              >
                <MinusIcon className="w-4 h-4" />
              </button>

              <span className="px-3">{qty}</span>

              <button
                onClick={() => increaseQty(item)}
                className="px-2 py-1 hover:bg-gray-100"
              >
                <PlusIcon className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => handleDelete?.(productId)}
              className="text-sm text-blue-600 hover:underline"
            >
              Delete
            </button>
          </div>
        )}

        {/* BUY NOW */}
        {buyNow && (
          <button
            onClick={() => buyNow(item)}
            className="mt-3 w-fit bg-yellow-400 hover:bg-yellow-500 text-black text-sm font-semibold px-4 py-1.5 rounded"
          >
            Buy Now
          </button>
        )}
      </div>

      {/* PRICE */}
      <div className="text-right">
        <p className="text-lg font-semibold">
          ₹{((unitPrice || 0) * (qty || 1)).toFixed(2)}
        </p>

        {qty > 1 && (
          <p className="text-sm text-gray-500">
            ₹{unitPrice} each
          </p>
        )}
      </div>
    </div>
  )
}

export default OrderCard
