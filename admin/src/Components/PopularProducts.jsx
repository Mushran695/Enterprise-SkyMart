import { useSearchParams } from "react-router-dom"
import {
  ShoppingBagIcon,
  DevicePhoneMobileIcon,
  SparklesIcon,
  HeartIcon,
} from "@heroicons/react/24/outline"

const categories = [
  { id: "fashion", label: "Fashion", icon: ShoppingBagIcon },
  { id: "electronics", label: "Electronics", icon: DevicePhoneMobileIcon },
  { id: "beauty", label: "Beauty", icon: SparklesIcon },
  { id: "wellness", label: "Wellness", icon: HeartIcon },
]

const PopularProducts = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeCategory = searchParams.get("category") || "fashion"

  const handleClick = category => {
    setSearchParams({ category })
  }

  return (
    <section className="max-w-screen-xl mx-auto px-4 mt-10">
      {/* HEADER */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Popular Products</h2>
        <p className="text-gray-500 text-sm">
          Do not miss the current offers until the end of March.
        </p>
      </div>

      {/* CATEGORY TABS */}
      <div className="flex items-center gap-6 border-b overflow-x-auto">
        {categories.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => handleClick(id)}
            className={`flex items-center gap-2 pb-3 text-sm font-medium whitespace-nowrap transition
              ${
                activeCategory === id
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-800"
              }`}
          >
            <Icon className="w-5 h-5" />
            {label}
          </button>
        ))}
      </div>
    </section>
  )
}

export default PopularProducts
