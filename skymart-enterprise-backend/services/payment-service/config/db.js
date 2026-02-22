import mongoose from 'mongoose'

const defaultOpts = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4
}

let isConnected = false

export default async function connectDB(opts = {}) {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI
  if (!mongoUri) throw new Error('MONGO_URI is not set')
  if (isConnected && mongoose.connection.readyState === 1) return mongoose.connection
  const options = { ...defaultOpts, ...opts }
  const conn = await mongoose.connect(mongoUri, options)
  isConnected = true

  mongoose.connection.on('connected', () => {
    console.info('MongoDB connected')
  })
  mongoose.connection.on('reconnected', () => {
    console.info('MongoDB reconnected')
  })
  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected')
    isConnected = false
  })
  mongoose.connection.on('error', (err) => {
    console.error('MongoDB error', err)
  })

  console.log(`payment-service: MongoDB Connected: ${conn.connection.host}`)
  return mongoose.connection
}
