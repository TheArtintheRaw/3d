const express = require('express')
const axios = require('axios')
const productCatalog = require('./catalogData.js')

const router = express.Router()

// Printful API configuration
const printfulApiBaseUrl = 'https://api.printful.com'
const printfulApiKey = process.env.PRINTFUL_API_KEY

const productData =  productCatalog

// Route to create a product
router.post('/create-product', async (req, res) => {
  try {
    const { productName, variantSize } = req.body

    // Find the product details in the catalog data
    const product = productData[productName]
    if (!product) {
      throw new Error('Product not found')
    }

    // Find the variant ID for the selected size
    const variantId = product.variants[variantSize]
    if (!variantId) {
      throw new Error('Variant not found')
    }

    // Create product payload using the retrieved details
    const productPayload = {
      // Populate the payload as needed for product creation
      product_id: product.product_id,
      variant_id: variantId.variant_id
      // Add any other required fields
    }

    // Make a POST request to Printful API to create the product
    const response = await axios.post(`${printfulApiBaseUrl}/store/products`, productPayload, {
      headers: {
        Authorization: `Bearer ${printfulApiKey}`
      }
    })

    // Handle the response from the Printful API
    if (response.data.result) {
      res.status(201).json(response.data.result)
    } else {
      throw new Error('Failed to create product')
    }
  } catch (error) {
    console.error('Error creating product:', error)
    res.status(500).json({ error: 'Failed to create product' })
  }
})

// Route to create an order
router.post('/create-order', async (req, res) => {
  try {
    const { recipient, items } = req.body

    // Create an array to store the order items
    const orderItems = []

    // Iterate through each item in the request
    for (const item of items) {
      const { productName, variantSize, quantity } = item

      // Find the product details in the catalog data
      const product = productCatalog[productName]
      if (!product) {
        throw new Error(`Product '${productName}' not found`)
      }

      // Find the variant ID for the selected size
      const variant = product.variants[variantSize]
      if (!variant) {
        throw new Error(`Variant for size '${variantSize}' not found`)
      }

      // Create an order item object
      const orderItem = {
        product_id: product.product_id,
        variant_id: variant.variant_id,
        quantity
      }

      // Add the item to the order items array
      orderItems.push(orderItem)
    }

    // Create order payload using the retrieved details
    const orderPayload = {
      recipient,
      items: orderItems
      // Add any other required fields
    }

    // Make a POST request to Printful API to create the order
    const response = await axios.post(`${printfulApiBaseUrl}/orders`, orderPayload, {
      headers: {
        Authorization: `Bearer ${printfulApiKey}`
      }
    })

    // Handle the response from the Printful API
    if (response.data.result) {
      res.status(201).json(response.data.result)
    } else {
      throw new Error('Failed to create order')
    }
  } catch (error) {
    console.error('Error creating order:', error)
    res.status(500).json({ error: 'Failed to create order' })
  }
})

module.exports = router
