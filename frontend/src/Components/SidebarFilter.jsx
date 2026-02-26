import { useContext, useState } from "react"
import { ShoppingCartContext } from "../Context"
import { XMarkIcon } from "@heroicons/react/24/solid"

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
  const [price, setPrice] = useState(200000)
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    rating: true,
    deals: true,
  })

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const clearFilters = () => {
    setSearchByCategory("")
    setMinRating(null)
    setOnlyFeatured(false)
    setOnlyDiscount(false)
    setMaxPrice(null)
    setPrice(200000)
  }

  return (
    <aside className="sticky top-24 h-fit">
      {/* CARD CONTAINER */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden">
        
        {/* HEADER */}
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-200 px-5 py-4">
          <h2 className="text-lg font-bold text-gray-800 flex items-center justify-between">
            <span>✨ Filters</span>
            <button 
              onClick={clearFilters}
              className="text-xs bg-white text-red-600 px-3 py-1 rounded-full font-semibold hover:bg-red-50 transition"
            >
              Reset
            </button>
          </h2>
        </div>

        <div className="p-5 space-y-5">

          {/* ======================= CATEGORIES ======================= */}
          <div>
            <button 
              onClick={() => toggleSection('categories')}
              className="w-full flex items-center justify-between mb-3"
            >
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Categories</h3>
              <span className="text-gray-400 text-xl">{expandedSections.categories ? '−' : '+'}</span>
            </button>

            {expandedSections.categories && (
              <div className="flex flex-col gap-2">
                {categories.map(cat => {
                  const isActive = searchByCategory?.toLowerCase() === cat.toLowerCase()

                  return (
                    <button
                      key={cat}
                      onClick={() => setSearchByCategory(cat)}
                      className={`
                        text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                        ${
                          isActive
                            ? "bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-md scale-105"
                            : "bg-gray-50 text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                        }
                      `}
                    >
                      {cat}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* ======================= PRICE ======================= */}
          <div className="border-t pt-5">
            <button 
              onClick={() => toggleSection('price')}
              className="w-full flex items-center justify-between mb-3"
            >
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Price</h3>
              <span className="text-gray-400 text-xl">{expandedSections.price ? '−' : '+'}</span>
            </button>

            {expandedSections.price && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600 font-medium">₹100</span>
                  <span className="text-sm font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                    ₹{price.toLocaleString('en-IN')}
                  </span>
                </div>

                <input
                  type="range"
                  min="100"
                  max="200000"
                  step="500"
                  value={price}
                  onChange={(e) => {
                    const value = Number(e.target.value)
                    setPrice(value)
                    setMaxPrice(value)
                  }}
                  className="w-full h-2 bg-gray-200 rounded-lg accent-blue-500 cursor-pointer hover:accent-orange-600"
                />

                <div className="flex justify-between text-xs text-gray-600">
                  <span>Min</span>
                  <span>Max: ₹200,000</span>
                </div>
              </div>
            )}
          </div>

          {/* ======================= RATING ======================= */}
          <div className="border-t pt-5">
            <button 
              onClick={() => toggleSection('rating')}
              className="w-full flex items-center justify-between mb-3"
            >
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Rating</h3>
              <span className="text-gray-400 text-xl">{expandedSections.rating ? '−' : '+'}</span>
            </button>

            {expandedSections.rating && (
              <div className="space-y-2">
                <button
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium bg-gray-50 hover:bg-yellow-50 transition flex items-center justify-between group"
                  onClick={() => setMinRating(4)}
                >
                  <span className="group-hover:text-yellow-600">⭐⭐⭐⭐ & Up</span>
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full group-hover:bg-yellow-200">30+</span>
                </button>

                <button
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium bg-gray-50 hover:bg-yellow-50 transition flex items-center justify-between group"
                  onClick={() => setMinRating(5)}
                >
                  <span className="group-hover:text-yellow-600">⭐⭐⭐⭐⭐</span>
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full group-hover:bg-yellow-200">12+</span>
                </button>
              </div>
            )}
          </div>

          {/* ======================= DEALS ======================= */}
          <div className="border-t pt-5">
            <button 
              onClick={() => toggleSection('deals')}
              className="w-full flex items-center justify-between mb-3"
            >
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Special</h3>
              <span className="text-gray-400 text-xl">{expandedSections.deals ? '−' : '+'}</span>
            </button>

            {expandedSections.deals && (
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 hover:bg-blue-100 cursor-pointer transition">
                  <input
                    type="checkbox"
                    className="accent-blue-500 w-4 h-4 cursor-pointer"
                    onChange={(e) => setOnlyFeatured(e.target.checked)}
                  />
                  <span className="font-medium text-gray-700">⭐ Featured Products</span>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-lg bg-red-50 hover:bg-red-100 cursor-pointer transition">
                  <input
                    type="checkbox"
                    className="accent-red-500 w-4 h-4 cursor-pointer"
                    onChange={(e) => setOnlyDiscount(e.target.checked)}
                  />
                  <span className="font-medium text-red-600">🔥 50% OFF or more</span>
                </label>
              </div>
            )}
          </div>

        </div>

        {/* FOOTER */}
        <div className="border-t bg-gray-50 px-5 py-4">
          <button
            className="w-full py-2 px-4 text-sm font-bold rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all duration-200"
            onClick={clearFilters}
          >
            Clear all filters
          </button>
        </div>
      </div>
    </aside>
  )
}

export default SidebarFilter
