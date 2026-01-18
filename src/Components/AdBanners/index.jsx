import ad1 from "../../assets/ads/ad1.jpg"
import ad2 from "../../assets/ads/ad2.jpg"
import ad3 from "../../assets/ads/ad3.jpg"

const AdBanners = () => {
  const ads = [ad1, ad2, ad3]

  return (
    <section className="max-w-screen-xl mx-auto px-4 mt-20 mb-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {ads.map((ad, i) => (
          <div
            key={i}
            className="h-[160px] sm:h-[180px] md:h-[160px] overflow-hidden rounded-lg shadow-sm hover:shadow-md transition"
          >
            <img
              src={ad}
              alt={`Ad ${i + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </section>
  )
}

export default AdBanners
