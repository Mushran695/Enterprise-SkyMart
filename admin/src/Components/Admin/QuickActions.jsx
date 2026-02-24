import { useState } from "react"
import { useNavigate } from "react-router-dom"

const QuickActions = () => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const actions = [
    { name: "Orders", to: "/orders" },
    { name: "Products", to: "/products" },
    { name: "Users", to: "/users" },
    { name: "Analytics", to: "/analytics" },
  ]

  return (
    <>
      {/* Floating button - mobile only */}
      <div className="lg:hidden fixed bottom-6 right-4 z-50 flex flex-col items-end">
        <button
          aria-label="Quick actions"
          onClick={() => setOpen(o => !o)}
          className="bg-blue-600 text-white rounded-full p-3 shadow-lg h-12 w-12 flex items-center justify-center"
        >
          {/* simple plus */}
          <span className="text-xl">+</span>
        </button>

        {/* sheet */}
        <div
          className={`mt-3 w-56 bg-white rounded-xl shadow-lg overflow-hidden transition-transform ${open ? "translate-y-0" : "translate-y-2 scale-95 opacity-0 pointer-events-none"}`}
          style={{ transformOrigin: "bottom right" }}
        >
          <div className="p-2">
            {actions.map(a => (
              <button
                key={a.name}
                onClick={() => {
                  setOpen(false)
                  navigate(a.to)
                }}
                className="w-full text-left px-3 py-3 rounded hover:bg-gray-50 text-sm"
              >
                {a.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default QuickActions
