import express from 'express'
import dotenv from 'dotenv'

dotenv.config()
const app = express()
app.use(express.json())

app.get('/health', (req, res) => res.json({ ok: true, service: 'notification-service' }))

const PORT = process.env.PORT || 3010
app.listen(PORT, () => console.log(`notification-service listening ${PORT}`))
