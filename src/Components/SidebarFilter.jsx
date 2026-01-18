import { useContext, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ShoppingCartContext } from '../Context'

const SidebarFilter = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const {
    setPriceRange,
    setMinRating,
    setOnlyFeatured,
    setOnlyDiscount
  } = useContext(ShoppingCartContext)

  /* =======================
     CATEGORY CONFIG
  ======================= */
  const categories = [
    { label: 'Fashion', path: '/fashion' },
    { label: 'Electronics', path: '/electronics' },
    { label: 'Beauty', path: '/beauty' },
    { label: 'Wellness', path: '/wellness' }
  ]

  /* =======================
     PRICE STATE
  ======================= */
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(100000)

  return (
    <aside className="w-64 bg-white border border-gray-200 p-4 h-fit sticky top-24">

      {/* =======================
          CATEGORIES (NEW)
      ======================= */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Categories</h2>

        <div className="flex flex-col gap-1">
          {categories.map(cat => {
            const isActive = location.pathname === cat.path

            return (
              <button
                key={cat.label}
                onClick={() => navigate(cat.path)}
                className={`
                  text-left px-3 py-2 rounded-md text-sm transition
                  ${
                    isActive
                      ? 'bg-orange-100 text-orange-600 font-semibold'
                      : 'hover:bg-gray-100 text-gray-700'
                  }
                `}
              >
                {cat.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* =======================
          FILTERS
      ======================= */}
      <h2 className="text-lg font-semibold mb-4 border-t pt-4">
        Filter by
      </h2>

      {/* PRICE */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold mb-2">Price</h3>

        <div className="flex justify-between text-xs text-gray-600 mb-2">
          <span>₹{minPrice}</span>
          <span>₹{maxPrice}</span>
        </div>

        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max="100000"
            step="500"
            value={minPrice}
            onChange={(e) => setMinPrice(Number(e.target.value))}
            className="w-full accent-orange-500"
          />

          <input
            type="range"
            min="0"
            max="100000"
            step="500"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full accent-orange-500"
          />
        </div>

        <button
          className="mt-3 w-full border border-gray-400 py-1 text-sm hover:border-orange-500 hover:text-orange-600"
          onClick={() => setPriceRange([minPrice, maxPrice])}
        >
          Apply
        </button>
      </div>

      {/* RATING */}
      <div className="mb-5 border-t pt-4">
        <h3 className="text-sm font-semibold mb-2">
          Customer Rating
        </h3>

        <button
          className="block text-sm hover:text-orange-600 mb-1"
          onClick={() => setMinRating(4)}
        >
          ⭐⭐⭐⭐ & Up
        </button>

        <button
          className="block text-sm hover:text-orange-600"
          onClick={() => setMinRating(5)}
        >
          ⭐⭐⭐⭐⭐
        </button>
      </div>

      {/* DEALS */}
      <div className="mb-5 border-t pt-4">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            className="accent-orange-500"
            onChange={(e) => setOnlyFeatured(e.target.checked)}
          />
          Featured Products
        </label>

        <label className="flex items-center gap-2 text-sm cursor-pointer text-red-600 mt-2">
          <input
            type="checkbox"
            className="accent-red-600"
            onChange={(e) => setOnlyDiscount(e.target.checked)}
          />
          50% OFF or more
        </label>
      </div>

      {/* CLEAR */}
      <button
        className="text-sm text-blue-600 hover:underline"
        onClick={() => {
          setPriceRange(null)
          setMinRating(null)
          setOnlyFeatured(false)
          setOnlyDiscount(false)
          setMinPrice(0)
          setMaxPrice(100000)
        }}
      >
        Clear all filters
      </button>
    </aside>
  )
}

export default SidebarFilter
