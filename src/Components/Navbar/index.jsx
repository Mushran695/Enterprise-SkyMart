import { useContext, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  ShoppingCartIcon,
  Bars3Icon,
  XMarkIcon,
  MapPinIcon
} from '@heroicons/react/24/solid'
import { ShoppingCartContext } from '../../Context'

const Navbar = () => {
  const context = useContext(ShoppingCartContext)
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleSignOut = (e) => {
    e.preventDefault()
    context.handleSignOut()
    navigate('/sign-in')
    setIsMenuOpen(false)
  }

  const handleCategoryClick = (category) => {
    context.setSearchByCategory(category)
    navigate('/')
    setIsMenuOpen(false)
  }

  return (
    <nav className="w-full bg-[#131921] text-white">

      {/* ================= TOP NAVBAR ================= */}
      <div className="relative z-20">
        <div className="flex items-center px-4 md:px-6 py-3 gap-4">

          {/* MOBILE MENU */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen
              ? <XMarkIcon className="h-6 w-6" />
              : <Bars3Icon className="h-6 w-6" />
            }
          </button>

          {/* LOGO */}
          <NavLink to="/" className="font-bold text-2xl whitespace-nowrap">
            SkyMart
          </NavLink>

          {/* LOCATION */}
          <div className="hidden md:flex items-center gap-1 cursor-pointer hover:outline outline-1 outline-white p-1 rounded">
            <MapPinIcon className="h-5 w-5 text-gray-300" />
            <div className="leading-tight">
              <p className="text-xs text-gray-300">Deliver to</p>
              <p className="text-sm font-semibold">India</p>
            </div>
          </div>

          {/* SEARCH BAR */}
          <div className="hidden md:flex flex-1 max-w-3xl mx-4">
            <div className="flex w-full rounded-md overflow-hidden">

              {/* CATEGORY SELECT (FIXED) */}
              <select
                className="bg-gray-200 text-black px-3 text-sm outline-none"
                onChange={(e) => handleCategoryClick(e.target.value)}
              >
                <option value="">All</option>
                <option value="Fashion & Apparel">Fashion</option>
                <option value="Electronics & Gadgets">Electronics</option>
                <option value="Beauty & Personal Care">Beauty</option>
                <option value="Health & Fitness">Wellness</option>
              </select>

              {/* SEARCH INPUT */}
              <input
                type="text"
                placeholder="Search SkyMart"
                className="flex-1 px-4 py-2 text-black outline-none"
                onChange={(e) => context.setSearchByTitle(e.target.value)}
              />

              {/* SEARCH BUTTON */}
              <button className="bg-[#febd69] px-4 flex items-center justify-center text-black">
                🔍
              </button>
            </div>
          </div>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-6 ml-auto">

            {/* SIGN IN */}
            {context.isUserAuthenticated ? (
              <div className="hidden md:block cursor-pointer hover:outline outline-1 outline-white p-1 rounded">
                <p className="text-xs">Hello, {context.account?.email}</p>
                <p className="font-semibold text-sm">Account & Lists</p>
              </div>
            ) : (
              <NavLink
                to="/sign-in"
                className="hidden md:block cursor-pointer hover:outline outline-1 outline-white p-1 rounded"
              >
                <p className="text-xs">Hello, Sign in</p>
                <p className="font-semibold text-sm">Account & Lists</p>
              </NavLink>
            )}

            {/* CART */}
            <button
              onClick={() => context.openCheckoutSideMenu()}
              className="relative flex items-end gap-1 hover:outline outline-1 outline-white p-1 rounded"
            >
              <ShoppingCartIcon className="h-7 w-7" />
              <span className="absolute top-0 right-6 bg-[#f08804] text-black w-5 h-5 text-xs flex items-center justify-center rounded-full font-bold">
                {context.cartProducts.length}
              </span>
              <span className="hidden md:block font-semibold">Cart</span>
            </button>
          </div>
        </div>

        {/* MOBILE SEARCH */}
        <div className="md:hidden px-4 pb-3">
          <input
            type="text"
            placeholder="Search SkyMart"
            className="w-full px-4 py-2 rounded-lg outline-none text-black"
            onChange={(e) => context.setSearchByTitle(e.target.value)}
          />
        </div>
      </div>

      {/* ================= CATEGORY BAR ================= */}
      <div className="sticky top-0 z-10 bg-[#232f3e] text-white">
        <div className="flex items-center gap-6 px-4 md:px-6 py-2 text-sm overflow-x-auto">

          <button
            onClick={() => handleCategoryClick('')}
            className="font-semibold whitespace-nowrap hover:underline"
          >
            All
          </button>

          <button onClick={() => handleCategoryClick('Fashion & Apparel')}>
            Fashion
          </button>

          <button onClick={() => handleCategoryClick('Electronics & Gadgets')}>
            Electronics
          </button>

          <button onClick={() => handleCategoryClick('Beauty & Personal Care')}>
            Beauty
          </button>

          <button onClick={() => handleCategoryClick('Health & Fitness')}>
            Wellness
          </button>
        </div>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-white text-black z-50 md:hidden">
          <div className="flex justify-between items-center px-4 py-5 border-b">
            <span className="font-bold text-2xl">SkyMart</span>
            <button onClick={() => setIsMenuOpen(false)}>
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <ul className="flex flex-col py-4 text-lg">
            <li className="px-4 py-2" onClick={() => handleCategoryClick('')}>All</li>
            <li className="px-4 py-2" onClick={() => handleCategoryClick('Fashion & Apparel')}>Fashion</li>
            <li className="px-4 py-2" onClick={() => handleCategoryClick('Electronics & Gadgets')}>Electronics</li>
            <li className="px-4 py-2" onClick={() => handleCategoryClick('Beauty & Personal Care')}>Beauty</li>
            <li className="px-4 py-2" onClick={() => handleCategoryClick('Health & Fitness')}>Wellness</li>
          </ul>

          {context.isUserAuthenticated && (
            <div className="border-t mt-auto px-4 py-4">
              <button onClick={handleSignOut} className="text-red-600">
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar
