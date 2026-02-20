import { Kafka } from 'kafkajs'

const brokers = (process.env.KAFKA_BROKERS || 'localhost:9092').split(',')
const clientId = process.env.KAFKA_CLIENT_ID || (process.env.SERVICE_NAME || 'order-service')
const kafka = new Kafka({ clientId, brokers })

const producer = kafka.producer()

// Retry/backoff parameters (configurable via env)
const MAX_RETRIES = Number(process.env.KAFKA_CONNECT_MAX_RETRIES || 10)
const BASE_DELAY_MS = Number(process.env.KAFKA_CONNECT_BASE_DELAY_MS || 1000)
const RETRY_AFTER_MS = Number(process.env.KAFKA_RETRY_AFTER_MS || 5 * 60 * 1000) // 5 minutes

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function attemptConnect(attempt = 0) {
  try {
    await producer.connect()
    console.log('Kafka producer connected for', clientId)
    return true
  } catch (err) {
    const isFinal = attempt >= MAX_RETRIES
    const delay = isFinal ? RETRY_AFTER_MS : BASE_DELAY_MS * Math.pow(2, attempt)
    // Log succinctly to avoid spamming logs; include attempt count and next retry delay
    console.warn(`Kafka connect attempt=${attempt + 1} failed: ${err && err.message}. retry in ${delay}ms${isFinal ? ' (will retry periodically)' : ''}`)
    // Schedule next attempt
    setTimeout(() => {
      attemptConnect(attempt + 1).catch(() => {})
    }, delay)
    return false
  }
}

export async function connectProducer() {
  // Kick off connection attempts in background and don't throw — make non-fatal to startup
  attemptConnect().catch((e) => console.warn('Kafka background connect failed unexpectedly', e && e.message))
}

export async function publish(topic, message) {
  try {
    await producer.send({ topic, messages: [{ value: JSON.stringify(message) }] })
  } catch (err) {
    // Non-fatal: log at warn level and return — message may be lost but service stays up
    console.warn('Kafka publish error', err && err.message)
  }
}

export async function createConsumer({ groupId, topics = [], eachMessage }) {
  const consumer = kafka.consumer({ groupId })
  try {
    await consumer.connect()
  } catch (err) {
    console.warn('Kafka consumer connect failed', err && err.message)
    // Let caller handle re-trying consumer creation if needed
    throw err
  }
  for (const t of topics) await consumer.subscribe({ topic: t, fromBeginning: false })
  await consumer.run({ eachMessage })
  return consumer
}

export default kafka
