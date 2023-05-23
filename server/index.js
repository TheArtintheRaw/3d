import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';

import dalleRoutes from './routes/dalle.routes.js';
import printfulRoutes from './routes/printful.routes.js';
import stripeRoutes from './routes/stripe.routes.js';

dotenv.config();

// Stripe library
import Stripe from 'stripe';

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(cors());
app.use(express.static('public'));
app.use(express.json({ limit: '50mb' }));

const calculateOrderAmount = (items) => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return 3000;
};

app.post('/create-payment-intent', async (req, res) => {
  const { items, shipping } = req.body;

  // Validate shipping information
  if (
    !shipping ||
    !shipping.name ||
    !shipping.address ||
    !shipping.address.line1 ||
    !shipping.address.city ||
    !shipping.address.state ||
    !shipping.address.postal_code ||
    !shipping.address.country
  ) {
    return res.status(400).json({ error: 'Invalid shipping information' });
  }

  // Create a PaymentIntent with the order amount, currency, and shipping information
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: 'cad',
    automatic_payment_methods: {
      enabled: true,
    },
    shipping: {
      name: shipping.name,
      address: {
        line1: shipping.address.line1,
        city: shipping.address.city,
        state: shipping.address.state,
        postal_code: shipping.address.postal_code,
        country: shipping.address.country,
      },
    },
  });

  // Pass the shipping information to create an order with the Printful API
  try {
    const printfulOrder = await createPrintfulOrder(items, shipping);
    res.send({
      clientSecret: paymentIntent.client_secret,
      printfulOrder: printfulOrder,
    });
  } catch (error) {
    // Handle Printful API order creation error
    console.error('Printful order creation error:', error);
    res.status(500).json({ error: 'Error creating Printful order' });
  }
});

// Function to create an order with the Printful API
const createPrintfulOrder = async (items, shipping) => {
  try {
    // Prepare the order payload
    const orderPayload = {
      recipient: {
        name: shipping.name,
        address1: shipping.address.line1,
        city: shipping.address.city,
        state_code: shipping.address.state,
        country_code: shipping.address.country,
        zip: shipping.address.postal_code,
      },
      items: items.map((item) => ({
        variant_id: item.variantId,
        quantity: item.quantity,
      })),
    };

    // Make a POST request to create the order
    const response = await axios.post('https://api.printful.com/orders', orderPayload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.PRINTFUL_API_KEY}`,
      },
    });

    // Return the order data
    return printfulOrderData = response.data;
  } catch (error) {
    // Handle any errors that occur during the request
    throw new Error('Error creating Printful order');
  }
};

app.use('/api/v1/dalle', dalleRoutes);
app.use('/api/v1/printful', printfulRoutes);
app.use('/api/v1/stripe', stripeRoutes);

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello from DALL.E' });
});

app.listen(8080, () => console.log)