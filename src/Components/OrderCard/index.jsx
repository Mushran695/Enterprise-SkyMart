import { XMarkIcon } from '@heroicons/react/24/solid'

const OrderCard = ({ id, title, imageUrl, price, handleDelete }) => {
  return (
    <div className="flex justify-between items-center mb-4">
      {/* LEFT */}
      <div className="flex items-center gap-3">
        <figure className="w-20 h-20 flex-shrink-0">
          <img
            className="w-full h-full rounded-lg object-cover"
            src={imageUrl || 'https://via.placeholder.com/80'}
            alt={title}
          />
        </figure>

        <p className="text-sm font-light line-clamp-2">
          {title}
        </p>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">
        <p className="text-lg font-medium">${price}</p>

        {handleDelete && (
          <XMarkIcon
            onClick={() => handleDelete(id)}
            className="h-6 w-6 cursor-pointer hover:text-red-500 transition"
            title="Remove item"
          />
        )}
      </div>
    </div>
  )
}

export default OrderCard
