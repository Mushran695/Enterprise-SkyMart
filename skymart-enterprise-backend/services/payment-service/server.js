import http from 'http'
import app from './app.js'
import config from './config/index.js'
import { connectProducer } from './kafkaClient.js'

const PORT = config.port || 3003

const server = http.createServer(app)

// Connect Kafka producer (best-effort)
connectProducer().catch(err => console.error('Kafka connect failed', err))

server.listen(PORT, () => {
  console.log(`${process.env.SERVICE_NAME || 'payment-service'} listening on ${PORT} (env=${config.env})`)
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
