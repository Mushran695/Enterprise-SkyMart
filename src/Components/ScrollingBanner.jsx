const ScrollingBanner = () => {
  const items = [
    '🔥 50% OFF on Fashion',
    '🚚 Free Delivery on Orders above ₹999',
    '⭐ Premium Quality Products',
    '💳 Secure Payments',
    '🆕 New Arrivals Every Week'
  ]

  return (
    <div className="w-full overflow-hidden bg-black text-white py-2">
      <div className="flex animate-scroll whitespace-nowrap">
        {[...items, ...items].map((text, index) => (
          <span
            key={index}
            className="mx-8 text-sm md:text-base font-medium"
          >
            {text}
          </span>
        ))}
      </div>
    </div>
  )
}

export default ScrollingBanner
