import { useContext, useEffect, useState } from "react"
import Layout from "../Components/Layout"
import SidebarFilter from "../Components/SidebarFilter"
import ProductToolbar from "../Components/ProductToolbar"
import Card from "../Components/Card"
import ProductDetail from "../Components/ProductDetail"
import { ShoppingCartContext } from "../Context"

const CategoryPage = ({ title, categoryValue }) => {
  const context = useContext(ShoppingCartContext)

  const [view, setView] = useState("grid")
  const [sort, setSort] = useState("")
  const [limit, setLimit] = useState(20)

  useEffect(() => {
    context.setSearchByCategory(categoryValue)
    return () => context.setSearchByCategory("")
  }, [categoryValue])

  let products = context.filteredItems

  const sortedProducts = [...products].sort((a, b) => {
    if (sort === "price-low") return a.price - b.price
    if (sort === "price-high") return b.price - a.price
    if (sort === "rating") return b.rating - a.rating
    return 0
  })

  const visibleProducts =
    limit === "all" ? sortedProducts : sortedProducts.slice(0, limit)

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">

        {/* Sidebar */}
        <aside className="hidden md:block w-72 shrink-0 bg-white rounded-lg shadow-sm border p-4 sticky top-24 h-fit">
          <SidebarFilter />
        </aside>

        {/* Main Content */}
        <section className="flex-1">

          {/* Header */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
              <p className="text-gray-500 mt-1">
                Discover the best {title.toLowerCase()} products
              </p>
            </div>
            <span className="text-sm text-gray-500 mt-2 sm:mt-0">
              {sortedProducts.length} items found
            </span>
          </div>

          {/* Toolbar */}
          <div className="bg-white border rounded-lg p-3 mb-4 shadow-sm">
            <ProductToolbar
              view={view}
              setView={setView}
              sort={sort}
              setSort={setSort}
              limit={limit}
              setLimit={setLimit}
              total={sortedProducts.length}
            />
          </div>

          {/* Products */}
          {visibleProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-lg border">
              <p className="text-xl font-semibold text-gray-700">
                No products found
              </p>
              <p className="text-gray-500 mt-2">
                Try changing filters or search criteria
              </p>
            </div>
          ) : (
            <div
              className={`grid gap-5 ${
                view === "grid"
                  ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
                  : "grid-cols-1"
              }`}
            >
              {visibleProducts.map(item => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow hover:shadow-md transition p-2"
                >
                  <Card data={item} />
                </div>
              ))}
            </div>
          )}

        </section>
      </div>

      <ProductDetail />
    </Layout>
  )
}

export default CategoryPage
