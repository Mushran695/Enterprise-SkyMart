import { useContext, useEffect, useState } from 'react'
import Layout from '../Components/Layout'
import SidebarFilter from '../Components/SidebarFilter'
import ProductToolbar from '../Components/ProductToolbar'
import Card from '../Components/Card'
import ProductDetail from '../Components/ProductDetail'
import { ShoppingCartContext } from '../Context'


const CategoryPage = ({ title, categoryValue }) => {
  const context = useContext(ShoppingCartContext)

  const [view, setView] = useState('grid')
  const [sort, setSort] = useState('')
  const [limit, setLimit] = useState(20)

  useEffect(() => {
    context.setSearchByCategory(categoryValue)
    return () => context.setSearchByCategory('')
  }, [categoryValue])

  /* BASE PRODUCTS */
  let products = context.filteredItems

  /* SORTING (SAME AS HOME) */
  const sortedProducts = [...products].sort((a, b) => {
    if (sort === 'price-low') return a.price - b.price
    if (sort === 'price-high') return b.price - a.price
    if (sort === 'rating') return b.rating - a.rating
    return 0
  })

  /* LIMIT */
  const visibleProducts =
    limit === 'all'
      ? sortedProducts
      : sortedProducts.slice(0, limit)

  return (
    <Layout>
      <div className="max-w-screen-xl mx-auto px-4 pb-10 flex gap-6">

        {/* SIDEBAR */}
        <aside className="hidden md:block w-64">
          <SidebarFilter />
        </aside>

        {/* PRODUCTS */}
        <section className="flex-1">

          <div className="mb-4">
            <h2 className="text-2xl font-semibold">{title}</h2>
            <p className="text-gray-500 text-sm">
              Browse all {title.toLowerCase()} products
            </p>
          </div>

          {/* TOOLBAR (NOT STICKY) */}
          <ProductToolbar
            view={view}
            setView={setView}
            sort={sort}
            setSort={setSort}
            limit={limit}
            setLimit={setLimit}
            total={sortedProducts.length}
          />

          {/* GRID / LIST */}
          <div
            className={`mt-4 grid gap-4 ${
              view === 'grid'
                ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
                : 'grid-cols-1'
            }`}
          >
            {visibleProducts.map(item => (
              <Card key={item.id} data={item} />
            ))}
          </div>
        </section>
      </div>

      <ProductDetail />
    </Layout>
  )
}

export default CategoryPage
