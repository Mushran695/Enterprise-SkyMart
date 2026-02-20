import http from 'http'
import app from './app.js'
import config from './config/index.js'
import { connectProducer } from './kafkaClient.js'
import routes from './routes/index.js'
import { notFound, errorHandler } from './middleware/errorHandler.js'

// Mount routes unconditionally under `/api` so gateway paths like /api/cart match.
if (routes) {
  try {
    if (typeof routes === 'function') {
      app.use('/api', routes())
    } else if (routes.default && typeof routes.default === 'function') {
      app.use('/api', routes.default())
    } else {
      app.use('/api', routes)
    }
  } catch (e) {
    console.warn('Failed to mount routes in server.js', e && e.message)
  }
}

// Attach not-found and generic error handlers after routes are mounted
app.use(notFound)
app.use(errorHandler)

const PORT = config.port || 3002

const server = http.createServer(app)

// Connect Kafka producer (best-effort). connectProducer now runs background retries and is non-fatal.
connectProducer()

// Helper to list routes for debugging
function listAppRoutes(appInstance) {
  const out = []
  const stack = appInstance._router && appInstance._router.stack ? appInstance._router.stack : []
  stack.forEach((layer) => {
    if (layer.route && layer.route.path) {
      const methods = Object.keys(layer.route.methods).join(',')
      out.push(`${methods.toUpperCase()} ${layer.route.path}`)
    } else if (layer.name === 'router' && layer.handle && layer.handle.stack) {
      layer.handle.stack.forEach((l) => {
        if (l.route && l.route.path) {
          const methods = Object.keys(l.route.methods).join(',')
          out.push(`${methods.toUpperCase()} ${l.route.path}`)
        }
      })
    }
  })
  return out
}

server.listen(PORT, () => {
  console.log(`${process.env.SERVICE_NAME || 'order-service'} listening on ${PORT} (env=${config.env})`)
  try {
    console.log('Mounted routes:', listAppRoutes(app).slice(0, 200))
  } catch (e) {
    console.warn('Could not list routes at startup', e && e.message)
  }
})

function shutdown(signal) {
  console.log(`Received ${signal}, shutting down`)
  server.close((err) => {
    if (err) {
      console.error('Error during server close', err)
      process.exit(1)
    }
    console.log('Server closed')
    process.exit(0)
  })
}

process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception', err)
  process.exit(1)
})

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection', reason)
})
