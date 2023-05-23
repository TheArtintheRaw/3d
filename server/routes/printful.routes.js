import express from 'express'
import axios from 'axios'
import * as dotenv from 'dotenv'
import { productCatalog } from './catalogData'

dotenv.config()

const router = express.Router()
const printfulApiBaseUrl = 'https://api.printful.com'
const printfulApiKey = process.env.PRINTFUL_API_KEY

const printfulApi = axios.create({
  baseURL: printfulApiBaseUrl,
  headers: {
    Authorization: `Basic ${printfulApiKey}`,
    'Content-Type': 'application/json'
  }
})

// Endpoint to create a product
router.post(`/createProduct`, async (req, res) => {
  // Extract data from request body
  const { variantId, imgUrl, decalWidth, decalHeight, decalTop, decalLeft } = req.body

  // Construct the payload for Printful API
  const payload = {
    sync_product: {
      name: 'Custom T-Shirt'
    },
    sync_variants: [
      {
        variant_id: variantId,
        files: [
          {
            type: 'front',
            url: imgUrl,
            position: {
              area_width: 1200,
              area_height: 1600,
              width: decalWidth,
              height: decalHeight,
              top: decalTop,
              left: decalLeft
            }
          }
        ]
      }
    ]
  }

  try {
    const response = await printfulApi.post(`/store/products`, payload);
    const productId = response.data.result.sync_product.id;
    res.json({ id: productId, ...response.data }); // Include the product ID in the response
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

router.post(`/createOrder`, async (req, res) => {
  const { recipient, productId, variantId } = req.body

  const payload = {
    recipient: recipient,
    items: [
      {
        retail_price: 30.00,
        id: productId,
        variant_id: variantId,
        quantity: 1,
        files: [
          {
            type: 'front',
            url: imgUrl
          }
        ]
      }
    ]
  }

  try {
    const response = await printfulApi.post(`/store/products`, payload)
    const productID = response.data.result.sync_product.id
    res.json({ id: productID, ...response.data }) // Include the product ID in the response
  } catch (error) {
    res.status(500).json({ error: error.toString() })
  }
})

export default router
