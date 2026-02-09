import {
  Squares2X2Icon,
  ListBulletIcon,
  FunnelIcon
} from '@heroicons/react/24/outline'

const ProductToolbar = ({
  view,
  setView,
  sort,
  setSort,
  total
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 bg-white border rounded-md px-4 py-3 shadow-sm">

      {/* LEFT */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-700">
          Showing {total} results
        </span>

        <div className="flex border rounded-md overflow-hidden">
          <button
            onClick={() => setView('grid')}
            className={`p-2 ${
              view === 'grid'
                ? 'bg-gray-100'
                : 'hover:bg-gray-50'
            }`}
          >
            <Squares2X2Icon className="h-5 w-5" />
          </button>

          <button
            onClick={() => setView('list')}
            className={`p-2 ${
              view === 'list'
                ? 'bg-gray-100'
                : 'hover:bg-gray-50'
            }`}
          >
            <ListBulletIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">
        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          className="border rounded-md px-3 py-2 text-sm bg-white"
        >
          <option value="">Sort by relevance</option>
          <option value="price-low">Price: Low → High</option>
          <option value="price-high">Price: High → Low</option>
          <option value="rating">Customer rating</option>
        </select>

        <button className="md:hidden p-2 border rounded-md">
          <FunnelIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}

export default ProductToolbar
