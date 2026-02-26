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

  const goTo = (i) => {
    slider.scrollTo({
      left: slider.clientWidth * i,
      behavior: "smooth",
    })
  }

  const interval = setInterval(() => {
    index = (index + 1) % banners.length
    goTo(index)
  }, 3500)

  const onResize = () => goTo(index)
  window.addEventListener("resize", onResize)

  return () => {
    clearInterval(interval)
    window.removeEventListener("resize", onResize)
  }
}, [banners.length])

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
  {/* arrows stay same behavior; still hidden on mobile */}
  <button
    onClick={scrollLeft}
    className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur p-2 shadow rounded-full hover:bg-white transition"
    aria-label="Previous banner"
  >
    <ChevronLeftIcon className="h-6 w-6" />
  </button>

  <div
    ref={sliderRef}
    className="
      banner-scroll
      flex w-full
      overflow-x-auto sm:overflow-hidden
      scroll-smooth
      snap-x snap-mandatory
      rounded-xl
      [-ms-overflow-style:none] [scrollbar-width:none]
    "
  >
    {/* hide scrollbar (webkit) */}
    <style>{`
      .banner-scroll::-webkit-scrollbar { display: none; }
    `}</style>

    <div className="banner-track flex w-full">
      {banners.map((banner, i) => (
        <div
          key={i}
          className="
            min-w-full flex-shrink-0
            snap-start
          "
        >
          {/* Aspect ratio keeps banner stable on all screens */}
    <div className="relative w-full aspect-[16/7] sm:aspect-[16/6] bg-gray-100 overflow-hidden rounded-xl">
      <img
        src={banner}
        alt={`Banner ${i + 1}`}
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
        loading={i === 0 ? "eager" : "lazy"}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/10" />
    </div>
        </div>
        ))}
      </div>
    </div>

     <button
        onClick={scrollRight}
        className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur p-2 shadow rounded-full hover:bg-white transition"
        aria-label="Next banner"
      >
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
