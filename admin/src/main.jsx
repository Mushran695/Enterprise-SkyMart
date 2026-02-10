import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from "./App"
import "./index.css"

// Only rewrite when the browser is at the root path ('/') so we don't accidentally
// create duplicate basenames like '/admin/admin'. If the user visits other paths
// (or the URL already starts with '/admin'), do nothing.
if (typeof window !== 'undefined') {
  const p = window.location.pathname || '/'
  if (p === '/' || p === '' || p === '/index.html') {
    const newPath = '/admin'
    const search = window.location.search || ''
    const hash = window.location.hash || ''
    window.history.replaceState({}, '', newPath + search + hash)
  }
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* Single BrowserRouter for the admin app. Use basename so routes map to /admin/* */}
    <BrowserRouter basename="/admin">
      <App />
    </BrowserRouter>
  </StrictMode>
)
