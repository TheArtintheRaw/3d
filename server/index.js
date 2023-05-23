import express from 'express'
import cors from 'cors'
import * as dotenv from 'dotenv'

import dalleRoutes from './routes/dalle.routes.js'
import printfulRoutes from './routes/printful.routes.js'

dotenv.config()

// Stripe library
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const app = express()
app.use(cors())
app.use(express.static('public'))
app.use(express.json({ limit: '50mb' }))

const calculateOrderAmount = (items) => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return 1400
}

app.post('/create-payment-intent', async (req, res) => {
  const { items } = req.body

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: 'cad',
    automatic_payment_methods: {
      enabled: true
    }
  })

  res.send({
    clientSecret: paymentIntent.client_secret
  })
})

app.use('/api/v1/dalle', dalleRoutes)
app.use('/api/v1/printful', printfulRoutes) // Corrected here

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello from DALL.E' })
})

app.listen(8080, () => console.log('Server has started on port 8080'))
