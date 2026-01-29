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
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const {
    cartItems = [],
    isUserAuthenticated = false,
    account = null,
    setSearchByTitle = () => {},
    setSearchByCategory = () => {},
    openCheckoutSideMenu = () => {},
    setIsUserAuthenticated = () => {},
    setAccount = () => {},
  } = useContext(ShoppingCartContext) || {}

  // ✅ MongoDB-safe cart count (uses quantity)
  const cartCount = Array.isArray(cartItems)
    ? cartItems.reduce((sum, item) => sum + (item.qty || 1), 0)
    : 0

  const handleLogout = (e) => {
    e.preventDefault()
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setIsUserAuthenticated(false)
    setAccount(null)
    navigate('/sign-in')
    setIsMenuOpen(false)
  }

  const handleCategoryClick = (category) => {
    setSearchByCategory(category)
    navigate('/')
    setIsMenuOpen(false)
  }

  return (
    <nav className="w-full bg-[#131921] text-white">

      {/* ================= TOP BAR ================= */}
      <div className="relative z-20">
        <div className="flex items-center px-4 md:px-6 py-3 gap-4">

          {/* MOBILE MENU */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
          </button>

          {/* LOGO */}
          <NavLink to="/" className="font-bold text-2xl whitespace-nowrap">
            SkyMart
          </NavLink>

          {/* LOCATION */}
          <div className="hidden md:flex items-center gap-1 hover:outline outline-1 outline-white p-1 rounded">
            <MapPinIcon className="h-5 w-5 text-gray-300" />
            <div className="leading-tight">
              <p className="text-xs text-gray-300">Deliver to</p>
              <p className="text-sm font-semibold">India</p>
            </div>
          </div>

          {/* SEARCH BAR */}
          <div className="hidden md:flex flex-1 max-w-3xl mx-4">
            <div className="flex w-full rounded-md overflow-hidden">
              <select
                className="bg-gray-200 text-black px-3 text-sm outline-none"
                onChange={(e) => handleCategoryClick(e.target.value)}
              >
                <option value="">All</option>
                <option value="Fashion">Fashion</option>
                <option value="Electronics">Electronics</option>
                <option value="Beauty">Beauty</option>
                <option value="Health">Wellness</option>
              </select>

              <input
                type="text"
                placeholder="Search SkyMart"
                className="flex-1 px-4 py-2 text-black outline-none"
                onChange={(e) => setSearchByTitle(e.target.value)}
              />

              <button className="bg-[#febd69] px-4 text-black">🔍</button>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-6 ml-auto">

            {/* ACCOUNT */}
            <NavLink
  to="/sign-in"
  className="hidden md:block hover:outline outline-1 outline-white p-1 rounded"
>
  <p className="text-xs">
    Hello, {isUserAuthenticated ? account?.email || "User" : "Sign in"}
  </p>
  <p className="font-semibold text-sm">Account & Lists</p>
</NavLink>


            {/* CART */}
            <button
              onClick={openCheckoutSideMenu}
              className="relative flex items-end gap-1 hover:outline outline-1 outline-white p-1 rounded"
            >
              <ShoppingCartIcon className="h-7 w-7" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-6 bg-[#f08804] text-black w-5 h-5 text-xs flex items-center justify-center rounded-full font-bold">
                  {cartCount}
                </span>
              )}
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
            onChange={(e) => setSearchByTitle(e.target.value)}
          />
        </div>
      </div>

      {/* ================= CATEGORY BAR ================= */}
      <div className="bg-[#232f3e] text-white">
        <div className="flex gap-6 px-4 py-2 text-sm overflow-x-auto">
          {['', 'Fashion', 'Electronics', 'Beauty', 'Wellness'].map((cat, i) => (
            <button
              key={i}
              onClick={() => handleCategoryClick(cat)}
              className="whitespace-nowrap hover:underline"
            >
              {cat || 'All'}
            </button>
          ))}
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
            <li className="px-4 py-2" onClick={() => handleCategoryClick('Fashion')}>Fashion</li>
            <li className="px-4 py-2" onClick={() => handleCategoryClick('Electronics')}>Electronics</li>
            <li className="px-4 py-2" onClick={() => handleCategoryClick('Beauty')}>Beauty</li>
            <li className="px-4 py-2" onClick={() => handleCategoryClick('Wellness')}>Wellness</li>
          </ul>

          {isUserAuthenticated && (
            <div className="border-t px-4 py-4">
              <button onClick={handleLogout} className="text-red-600">
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
