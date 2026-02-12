import express from 'express'
import dotenv from 'dotenv'
import { createConsumer } from './kafkaClient.js'

dotenv.config()
const app = express()
app.use(express.json())

app.get('/health', (req, res) => res.json({ ok: true, service: 'notification-service' }))

// Start Kafka consumer to listen to important events
;(async () => {
	try {
		await createConsumer({
			groupId: process.env.KAFKA_GROUP_ID || 'notification-service-group',
			topics: ['USER_REGISTERED', 'ORDER_CREATED', 'PAYMENT_SUCCESS'],
			eachMessage: async ({ topic, partition, message }) => {
				try {
					const value = message.value ? message.value.toString() : null
					console.log(`Received event ${topic}:`, value)
				} catch (e) {
					console.error('Error handling message', e)
				}
			}
		})
		console.log('Notification consumer started')
	} catch (err) {
		console.error('Failed to start notification consumer', err)
	}
})()

const PORT = process.env.PORT || 3010
app.listen(PORT, () => console.log(`notification-service listening ${PORT}`))
