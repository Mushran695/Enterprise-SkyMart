import { useContext, useState } from "react"
import { ShoppingCartContext } from "../Context"

const SidebarFilter = () => {
  const {
    searchByCategory,
    setSearchByCategory,
    setMinRating,
    setOnlyFeatured,
    setOnlyDiscount,
    setMaxPrice,
  } = useContext(ShoppingCartContext)

  const categories = ["Fashion", "Electronics", "Beauty", "Wellness"]
  const [price, setPrice] = useState(100000)

  return (
    <aside className="w-72 bg-white border border-gray-200 rounded-xl shadow-sm p-5 h-fit sticky top-24">

      {/* TITLE */}
      <h2 className="text-xl font-semibold mb-4 border-b pb-3">
        Filters
      </h2>

      {/* =======================
          CATEGORIES
      ======================= */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
          Categories
        </h3>

        <div className="flex flex-col gap-2">
          {categories.map(cat => {
            const isActive =
              searchByCategory?.toLowerCase() === cat.toLowerCase()

            return (
              <button
                key={cat}
                onClick={() => setSearchByCategory(cat)}
                className={`
                  text-left px-4 py-2 rounded-lg text-sm transition font-medium
                  ${
                    isActive
                      ? "bg-orange-100 text-orange-600 shadow-inner"
                      : "hover:bg-gray-100 text-gray-700"
                  }
                `}
              >
                {cat}
              </button>
            )
          })}
        </div>
      </div>

      {/* =======================
          PRICE
      ======================= */}
      <div className="mb-6 border-t pt-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
          Price
        </h3>

        <div className="flex justify-between text-xs text-gray-600 mb-2">
          <span>₹0</span>
          <span className="font-medium">₹{price}</span>
        </div>

        <input
          type="range"
          min="0"
          max="100000"
          step="500"
          value={price}
          onChange={(e) => {
            const value = Number(e.target.value)
            setPrice(value)
            setMaxPrice(value)
          }}
          className="w-full accent-orange-500 cursor-pointer"
        />
      </div>

      {/* =======================
          RATING
      ======================= */}
      <div className="mb-6 border-t pt-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
          Customer Rating
        </h3>

        <div className="space-y-2">
          <button
            className="flex items-center gap-2 text-sm hover:text-orange-600"
            onClick={() => setMinRating(4)}
          >
            ⭐⭐⭐⭐ <span className="text-gray-600">& Up</span>
          </button>

          <button
            className="flex items-center gap-2 text-sm hover:text-orange-600"
            onClick={() => setMinRating(5)}
          >
            ⭐⭐⭐⭐⭐
          </button>
        </div>
      </div>

      {/* =======================
          DEALS
      ======================= */}
      <div className="mb-6 border-t pt-5 space-y-3">
        <label className="flex items-center gap-3 text-sm cursor-pointer">
          <input
            type="checkbox"
            className="accent-orange-500 w-4 h-4"
            onChange={(e) => setOnlyFeatured(e.target.checked)}
          />
          <span className="font-medium text-gray-700">
            Featured Products
          </span>
        </label>

        <label className="flex items-center gap-3 text-sm cursor-pointer">
          <input
            type="checkbox"
            className="accent-red-600 w-4 h-4"
            onChange={(e) => setOnlyDiscount(e.target.checked)}
          />
          <span className="font-medium text-red-600">
            50% OFF or more
          </span>
        </label>
      </div>

      {/* =======================
          CLEAR
      ======================= */}
      <button
        className="w-full py-2 text-sm font-medium rounded-lg border hover:bg-gray-100 transition"
        onClick={() => {
          setSearchByCategory("")
          setMinRating(null)
          setOnlyFeatured(false)
          setOnlyDiscount(false)
          setMaxPrice(null)
          setPrice(100000)
        }}
      >
        Clear all filters
      </button>
    </aside>
  )
}

export default SidebarFilter
