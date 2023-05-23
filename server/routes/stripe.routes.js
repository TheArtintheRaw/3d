import express from 'express'

const router = express.Router()

router.post('/', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature']

  let event

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object

    if (paymentIntent.shipping) {
      const { name, address } = paymentIntent.shipping

      // Call createOrder function or perform desired actions with shipping information
      createOrder({
        name: name,
        address1: address.line1,
        city: address.city,
        state_code: address.state,
        country_code: address.country,
        zip: address.postal_code,
        items: [
          /* Your items here */
        ]
      })
    }

    res.sendStatus(200)
  } else {
    res.sendStatus(400)
  }
})

export default router
