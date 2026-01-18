const AdBanners = () => {
  return (
    <section className="max-w-screen-xl mx-auto px-4 mt-20 mb-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['ad1', 'ad2', 'ad3'].map((ad, i) => (
          <div
            key={i}
            className="h-[160px] overflow-hidden rounded-lg shadow-sm hover:shadow-md transition"
          >
            <img
              src={`/src/assets/ads/${ad}.jpg`}
              alt={`Ad ${i + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  )
}

export default AdBanners
