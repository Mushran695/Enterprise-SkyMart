import { useContext, useEffect, useRef, useState } from 'react'

import Layout from '../../Components/Layout'
import Card from '../../Components/Card'
import ProductDetail from '../../Components/ProductDetail'
import SidebarFilter from '../../Components/SidebarFilter'
import CategoryTabs from '../../Components/CategoryTabs'

import { ShoppingCartContext } from '../../Context'

import banner1 from '../../assets/banners/banner1.jpg'
import banner2 from '../../assets/banners/banner2.jpg'
import banner3 from '../../assets/banners/banner3.jpg'

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ShoppingBagIcon,
  DevicePhoneMobileIcon,
  SparklesIcon,
  HeartIcon
} from '@heroicons/react/24/solid'

/* =======================
   Skeleton Loader
======================= */
const CardSkeleton = () => (
  <div className="bg-white border p-3 animate-pulse rounded-lg">
    <div className="h-40 bg-gray-200 mb-3 rounded"></div>
    <div className="h-4 bg-gray-200 mb-2 rounded"></div>
    <div className="h-4 bg-gray-200 w-1/2 rounded"></div>
  </div>
)

const Home = () => {
  const context = useContext(ShoppingCartContext)
  const sliderRef = useRef(null)

  const banners = [banner1, banner2, banner3]

  /* ===== UI STATES ===== */
  const [view] = useState('grid')
  const [sort] = useState('')
  const [limit] = useState(20)
  const [activeTab, setActiveTab] = useState('Fashion')

  /* =======================
     Auto Banner Scroll
  ======================= */
  useEffect(() => {
    const slider = sliderRef.current
    if (!slider) return

    let index = 0
    const interval = setInterval(() => {
      index = (index + 1) % banners.length
      slider.scrollTo({
        left: slider.clientWidth * index,
        behavior: 'smooth'
      })
    }, 3500)

    return () => clearInterval(interval)
  }, [])

  const scrollLeft = () => {
    sliderRef.current?.scrollBy({
      left: -sliderRef.current.clientWidth,
      behavior: 'smooth'
    })
  }

  const scrollRight = () => {
    sliderRef.current?.scrollBy({
      left: sliderRef.current.clientWidth,
      behavior: 'smooth'
    })
  }

  /* =======================
     CATEGORY HANDLER
  ======================= */
  const handleCategoryClick = (label, categoryValue) => {
    setActiveTab(label)
    context.setSearchByCategory(categoryValue)
  }

  /* =======================
     PRODUCTS LOGIC
  ======================= */
  const isFiltering =
    context.searchByTitle ||
    context.searchByCategory ||
    context.priceRange ||
    context.minRating ||
    context.onlyFeatured ||
    context.onlyDiscount

  const products = isFiltering
    ? context.filteredItems
    : context.items

  const sortedProducts = [...products].sort((a, b) => {
    if (sort === 'price-low') return a.price - b.price
    if (sort === 'price-high') return b.price - a.price
    if (sort === 'rating') return b.rating - a.rating
    return 0
  })

  const visibleProducts =
    limit === 'all'
      ? sortedProducts
      : sortedProducts.slice(0, limit)

  /* =======================
     RENDER PRODUCTS
  ======================= */
  const renderProducts = () => {
    if (context.isLoading) {
      return Array.from({ length: 12 }).map((_, i) => (
        <CardSkeleton key={i} />
      ))
    }

    if (isFiltering && sortedProducts.length === 0) {
      return (
        <div className="col-span-full text-center py-16">
          <h3 className="text-lg font-semibold mb-2">
            No products found
          </h3>
          <p className="text-gray-500">
            Try adjusting your filters
          </p>
        </div>
      )
    }

    return visibleProducts.map(item => (
      <Card key={item.id} data={item} />
    ))
  }

  return (
    <Layout>

      {/* =======================
          HERO BANNER
      ======================= */}
      <div className="relative w-full max-w-screen-xl mx-auto mt-4 mb-6 px-3 sm:px-6">

        {/* LEFT ARROW (HIDDEN ON MOBILE) */}
        <button
          onClick={scrollLeft}
          className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white p-2 shadow rounded-full"
        >
          <ChevronLeftIcon className="h-6 w-6" />
        </button>

        <div
          ref={sliderRef}
          className="flex overflow-hidden rounded-xl"
        >
          {banners.map((banner, i) => (
            <img
              key={i}
              src={banner}
              alt="Banner"
              className="min-w-full h-[180px] sm:h-[280px] lg:h-[360px] object-cover"
            />
          ))}
        </div>

        {/* RIGHT ARROW (HIDDEN ON MOBILE) */}
        <button
          onClick={scrollRight}
          className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white p-2 shadow rounded-full"
        >
          <ChevronRightIcon className="h-6 w-6" />
        </button>
      </div>

      {/* =======================
          CATEGORY ICON STRIP
      ======================= */}
      <CategoryTabs />

      {/* =======================
          MAIN CONTENT
      ======================= */}
      <div className="max-w-screen-xl mx-auto px-4 pb-10 flex flex-col md:flex-row gap-6">

        {/* SIDEBAR (DESKTOP ONLY) */}
        <aside className="hidden md:block w-64 shrink-0">
          <SidebarFilter />
        </aside>

        {/* PRODUCTS */}
        <section className="flex-1">

          {/* HEADER */}
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Popular Products</h2>
            <p className="text-gray-500 text-sm">
              Do not miss the current offers until the end of March.
            </p>
          </div>

          {/* CATEGORY TABS (SCROLLABLE ON MOBILE) */}
          <div className="flex gap-6 border-b mb-4 overflow-x-auto scrollbar-hide">
            {[
              {
                label: 'Fashion',
                value: 'Fashion & Apparel',
                icon: ShoppingBagIcon
              },
              {
                label: 'Electronics',
                value: 'Electronics & Gadgets',
                icon: DevicePhoneMobileIcon
              },
              {
                label: 'Beauty',
                value: 'Beauty & Personal Care',
                icon: SparklesIcon
              },
              {
                label: 'Wellness',
                value: 'Health & Fitness',
                icon: HeartIcon
              }
            ].map(({ label, value, icon: Icon }) => (
              <button
                key={label}
                onClick={() => handleCategoryClick(label, value)}
                className={`flex items-center gap-2 pb-2 whitespace-nowrap ${
                  activeTab === label
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500'
                }`}
              >
                <Icon className="h-5 w-5" />
                {label}
              </button>
            ))}
          </div>

          {/* PRODUCT GRID */}
          <div
            className={`grid gap-4 ${
              view === 'grid'
                ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
                : 'grid-cols-1'
            }`}
          >
            {renderProducts()}
          </div>
        </section>
      </div>

      <ProductDetail />
    </Layout>
  )
}

export default Home
