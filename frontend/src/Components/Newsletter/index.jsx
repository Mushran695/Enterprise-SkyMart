const Newsletter = () => {
  return (
    <section className="bg-[#232F3E] py-12 px-4">
      <div className="max-w-screen-md mx-auto bg-white p-8 rounded-md text-center shadow">

        <h2 className="text-2xl font-bold mb-2">
          Get ₹20 OFF on your first order
        </h2>

        <p className="text-gray-600 text-sm mb-6">
          Subscribe to receive updates, deals, and exclusive offers.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <input
            type="email"
            placeholder="Enter your email"
            className="border border-gray-300 px-4 py-3 rounded w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <button className="bg-[#F0C14B] hover:bg-[#e6b84c] text-black px-6 py-3 rounded font-medium">
            Subscribe
          </button>
        </div>
      </div>
    </section>
  )
}

export default Newsletter
