import { Kafka } from 'kafkajs'

const brokers = (process.env.KAFKA_BROKERS || 'localhost:9092').split(',')
const clientId = process.env.KAFKA_CLIENT_ID || (process.env.SERVICE_NAME || 'notification-service')
const kafka = new Kafka({ clientId, brokers })

export async function createConsumer({ groupId, topics = [], eachMessage }) {
  const consumer = kafka.consumer({ groupId })
  await consumer.connect()
  for (const t of topics) await consumer.subscribe({ topic: t, fromBeginning: false })
  await consumer.run({ eachMessage })
  return consumer
}

export default kafka
