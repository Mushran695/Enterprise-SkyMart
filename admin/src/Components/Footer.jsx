import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-[#131A22] text-gray-300 text-sm">

      <div className="max-w-screen-xl mx-auto px-6 py-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">

        {/* ABOUT */}
        <div>
          <h3 className="text-white font-semibold mb-3">Get to Know Us</h3>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:underline">About SkyMart</Link></li>
            <li><Link to="/" className="hover:underline">Careers</Link></li>
            <li><Link to="/" className="hover:underline">Press Releases</Link></li>
            <li><Link to="/" className="hover:underline">SkyMart Cares</Link></li>
          </ul>
        </div>

        {/* HELP */}
        <div>
          <h3 className="text-white font-semibold mb-3">Let Us Help You</h3>
          <ul className="space-y-2">
            <li><Link to="/my-account" className="hover:underline">Your Account</Link></li>
            <li><Link to="/my-orders" className="hover:underline">Your Orders</Link></li>
            <li><Link to="/help" className="hover:underline">Help Center</Link></li>
            <li><Link to="/returns" className="hover:underline">Returns</Link></li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="text-white font-semibold mb-3">Contact Us</h3>
          <p>Email: syedishaqmushran@gmail.com</p>
          <p className="mt-1">Phone: +91 7730996465</p>

          <div className="flex gap-4 mt-4">
            <a href="#" className="hover:underline">Facebook</a>
            <a href="#" className="hover:underline">Instagram</a>
            <a href="#" className="hover:underline">Twitter</a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 py-4 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} SkyMart • All rights reserved
      </div>
    </footer>
  )
}

export default Footer
