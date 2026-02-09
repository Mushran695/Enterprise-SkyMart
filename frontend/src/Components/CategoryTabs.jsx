import { useNavigate, useLocation } from 'react-router-dom'
import { categories } from '../data/categories'

const CATEGORY_ROUTE_MAP = {
  fashion: '/fashion',
  electronics: '/electronics',
  beauty: '/beauty',
  wellness: '/wellness'
}

const CategoryTabs = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const handleClick = (id) => {
    const route = CATEGORY_ROUTE_MAP[id]
    if (route) navigate(route)
  }

  return (
    <section className="bg-white border-b border-gray-200">
      <div className="max-w-screen-xl mx-auto px-4 pt-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Featured Categories
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Explore products by popular categories
        </p>
      </div>

      <div className="max-w-screen-xl mx-auto flex gap-6 justify-start md:justify-center overflow-x-auto scrollbar-hide px-4 py-6">
        {categories.map((cat) => {
          const isActive = location.pathname.includes(cat.id)

          return (
            <button
              key={cat.id}
              onClick={() => handleClick(cat.id)}
              className="group flex flex-col items-center min-w-[96px] sm:min-w-[120px]"
            >
              <div
                className={`w-24 h-24 rounded-full flex items-center justify-center transition-all
                ${
                  isActive
                    ? 'bg-blue-100 ring-2 ring-blue-500 scale-110'
                    : 'bg-gray-100 group-hover:scale-105'
                }`}
              >
                <img
                  src={cat.image}
                  alt={cat.label}
                  className="block w-14 h-14 object-contain"
                />
              </div>

              <span
                className={`mt-4 text-sm font-medium ${
                  isActive ? 'text-blue-600' : 'text-gray-800'
                }`}
              >
                {cat.label}
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}

export default CategoryTabs
