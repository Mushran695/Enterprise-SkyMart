import { Kafka } from 'kafkajs'

const brokers = (process.env.KAFKA_BROKERS || 'localhost:9092').split(',')
const clientId = process.env.KAFKA_CLIENT_ID || (process.env.SERVICE_NAME || 'auth-service')
const kafka = new Kafka({ clientId, brokers })

const producer = kafka.producer()

export async function connectProducer() {
  try {
    await producer.connect()
    console.log('Kafka producer connected for', clientId)
  } catch (err) {
    console.error('Kafka producer connection error', err)
  }
}

export async function publish(topic, message) {
  try {
    await producer.send({ topic, messages: [{ value: JSON.stringify(message) }] })
  } catch (err) {
    console.error('Kafka publish error', err)
  }
}

export async function createConsumer({ groupId, topics = [], eachMessage }) {
  const consumer = kafka.consumer({ groupId })
  await consumer.connect()
  for (const t of topics) await consumer.subscribe({ topic: t, fromBeginning: false })
  await consumer.run({ eachMessage })
  return consumer
}

export default kafka
