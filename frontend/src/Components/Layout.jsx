import Navbar from './Navbar'
import AdBanners from './AdBanners'
import Newsletter from './Newsletter'
import Footer from './Footer'

const Layout = ({
  children,
  showFooter = true,
  showAds = true,
  showNavbar = true
}) => {
  return (
    <div className="min-h-screen overflow-x-hidden">
      {showNavbar && <Navbar />}

      <main className="min-h-screen">
        {children}
      </main>

      {showAds && <AdBanners />}
      {showFooter && <Newsletter />}
      {showFooter && <Footer />}
    </div>
  )
}

export default Layout
