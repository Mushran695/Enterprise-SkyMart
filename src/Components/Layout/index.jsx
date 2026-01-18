import Navbar from '../Navbar'
import Footer from '../Footer'

const Layout = ({ children, showFooter = true }) => {
  return (
    <>
      <Navbar />

      <main className="min-h-[calc(100vh-120px)]">
        {children}
      </main>

      {showFooter && <Footer />}
    </>
  )
}

export default Layout
