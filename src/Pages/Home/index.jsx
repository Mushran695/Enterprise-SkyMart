import { useContext, useRef, useState, useEffect } from "react"
import Layout from "../../Components/Layout"
import Card from "../../Components/Card"
import ProductDetail from "../../Components/ProductDetail"
import SidebarFilter from "../../Components/SidebarFilter"
import CategoryTabs from "../../Components/CategoryTabs"
import { ShoppingCartContext } from "../../Context"

import banner1 from "../../assets/banners/banner1.jpg"
import banner2 from "../../assets/banners/banner2.jpg"
import banner3 from "../../assets/banners/banner3.jpg"

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ShoppingBagIcon,
  DevicePhoneMobileIcon,
  SparklesIcon,
  HeartIcon,
} from "@heroicons/react/24/solid"

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

/* =======================
   Category Mapping
======================= */
const CATEGORY_MAP = [
  { label: "Fashion", value: "Fashion", icon: ShoppingBagIcon },
  { label: "Electronics", value: "Electronics", icon: DevicePhoneMobileIcon },
  { label: "Beauty", value: "Beauty", icon: SparklesIcon },
  { label: "Wellness", value: "Wellness", icon: HeartIcon },
]

const Home = () => {
  const {
    items,
    filteredItems,
    searchByTitle,
    searchByCategory,
    setSearchByCategory,
    isLoading,
  } = useContext(ShoppingCartContext)

  const sliderRef = useRef(null)
  const banners = [banner1, banner2, banner3]
  const [activeTab, setActiveTab] = useState("Fashion")

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
        behavior: "smooth",
      })
    }, 3500)

    return () => clearInterval(interval)
  }, [])

  const scrollLeft = () => {
    sliderRef.current?.scrollBy({
      left: -sliderRef.current.clientWidth,
      behavior: "smooth",
    })
  }

  const scrollRight = () => {
    sliderRef.current?.scrollBy({
      left: sliderRef.current.clientWidth,
      behavior: "smooth",
    })
  }

  const handleCategoryClick = (label, backendValue) => {
    setActiveTab(label)
    setSearchByCategory(backendValue)
  }

  const isFiltering = searchByTitle || searchByCategory
  const products = isFiltering ? filteredItems : items

  const renderProducts = () => {
    if (isLoading) {
      return Array.from({ length: 12 }).map((_, i) => (
        <CardSkeleton key={i} />
      ))
    }

    if (!products || products.length === 0) {
      return (
        <div className="col-span-full text-center py-16">
          <h3 className="text-lg font-semibold mb-2">No products found</h3>
          <p className="text-gray-500">Try adjusting your filters</p>
        </div>
      )
    }

    return products.map(item => <Card key={item._id} data={item} />)
  }

  return (
    <Layout>
      {/* BANNERS */}
      <div className="relative w-full max-w-screen-xl mx-auto mt-4 mb-6 px-3 sm:px-6">
        <button onClick={scrollLeft} className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white p-2 shadow rounded-full">
          <ChevronLeftIcon className="h-6 w-6" />
        </button>

        <div ref={sliderRef} className="flex overflow-hidden rounded-xl">
          {banners.map((banner, i) => (
            <img key={i} src={banner} alt="Banner" className="min-w-full h-[180px] sm:h-[280px] lg:h-[360px] object-cover" />
          ))}
        </div>

        <button onClick={scrollRight} className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white p-2 shadow rounded-full">
          <ChevronRightIcon className="h-6 w-6" />
        </button>
      </div>

      <CategoryTabs />

      <div className="max-w-screen-xl mx-auto px-4 pb-10 flex flex-col md:flex-row gap-6">
        <aside className="hidden md:block w-64 shrink-0">
          <SidebarFilter />
        </aside>

        <section className="flex-1">
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {renderProducts()}
          </div>
        </section>
      </div>

      <ProductDetail />
    </Layout>
  )
}

export default Home
