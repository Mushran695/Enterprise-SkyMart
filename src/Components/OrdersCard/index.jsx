import { ChevronRightIcon } from '@heroicons/react/24/solid'
import { formatINR } from '../../utils'

const OrdersCard = ({ date, totalPrice, totalProducts }) => {
  return (
    <div className="flex justify-between items-center mb-3 border border-black rounded-lg p-4 w-80 hover:shadow-md transition-shadow">
      <div className="flex justify-between w-full items-center">
        
        {/* LEFT */}
        <div className="flex flex-col">
          <span className="font-light text-sm text-gray-600">
            {date}
          </span>
          <span className="font-light text-sm">
            {totalProducts} items
          </span>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2">
          <span className="font-medium text-xl">
            {formatINR(totalPrice)}
          </span>
          <ChevronRightIcon className="h-6 w-6 text-black" />
        </div>

      </div>
    </div>
  )
}

export default OrdersCard
