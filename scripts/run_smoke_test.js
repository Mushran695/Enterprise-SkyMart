// Smoke test script for local dev environment
// Runs: login, fetch products, add to cart, get cart, remove from cart, fetch analytics

const API = 'http://localhost:5000/api'
const fetch = global.fetch

const log = (...a) => console.log(...a)

const sleep = ms => new Promise(r => setTimeout(r, ms))

const run = async () => {
  try {
    log('1) Logging in as admin...')
    const loginRes = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@skymart.com', password: 'Admin@123' })
    })
    if (!loginRes.ok) throw new Error('Login failed: ' + loginRes.status)
    const loginJson = await loginRes.json()
    const token = loginJson.token
    log('  token length:', token?.length)

    const authHeaders = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

    log('2) Fetching products...')
    const prodRes = await fetch(`${API}/products`, { headers: authHeaders })
    if (!prodRes.ok) throw new Error('Products fetch failed: ' + prodRes.status)
    const prodJson = await prodRes.json()
    const list = Array.isArray(prodJson) ? prodJson : prodJson.products || []
    if (!list.length) throw new Error('No products found')
    const pid = list[0]._id || list[0].id
    log('  picked product id:', pid)

    log('3) Adding product to cart...')
    const addRes = await fetch(`${API}/cart`, {
      method: 'POST', headers: authHeaders,
      body: JSON.stringify({ productId: pid, category: list[0].category || 'Misc', title: list[0].title || list[0].name || '', price: list[0].price || 10, image: list[0].image || '' })
    })
    if (!addRes.ok) throw new Error('Add to cart failed: ' + addRes.status)
    log('  added to cart')

    // small delay for DB
    await sleep(300)

    log('4) Fetching cart...')
    const cartRes = await fetch(`${API}/cart`, { headers: authHeaders })
    if (!cartRes.ok) throw new Error('Get cart failed: ' + cartRes.status)
    const cartJson = await cartRes.json()
    log('  cart items count:', (cartJson.items || []).length)

    log('5) Removing item from cart...')
    const itemId = (cartJson.items || [])[0]?.product
    if (itemId) {
      const delRes = await fetch(`${API}/cart/${itemId}`, { method: 'DELETE', headers: authHeaders })
      if (delRes.ok) log('  removed item')
      else log('  remove failed status:', delRes.status)
    } else {
      log('  no item to remove')
    }

    log('6) Fetching analytics stats...')
    const statsRes = await fetch(`${API}/analytics/stats`, { headers: authHeaders })
    if (!statsRes.ok) throw new Error('Stats failed: ' + statsRes.status)
    const stats = await statsRes.json()
    log('  stats:', stats)

    log('\nSMOKE TEST PASSED')
    process.exit(0)
  } catch (err) {
    console.error('\nSMOKE TEST FAILED:', err)
    process.exit(2)
  }
}

run()
