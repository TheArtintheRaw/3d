import express from 'express';
import axios from 'axios';

const router = express.Router();
const printfulApiBaseUrl = 'https://api.printful.com';
const printfulApiKey = process.env.PRINT_API_KEY;  // Store your API key securely

// Axios instance for requests to the Printful API
const printfulApi = axios.create({
  baseURL: printfulApiBaseUrl,
  headers: {
    'Authorization': `Bearer+${printfulApiKey}`,
    'Content-Type': 'application/json',
  },
});

router.post('/store/products', async (req, res) => {
  try {
    // Get the list of all products
    const { data: productList } = await printfulApi.get('/products');

    // Find the specific product
    const product = productList.result.find(p => p.name === 'Unisex Organic Cotton T-Shirt | Stanley/Stella STTU755');
    if (!product) {
      return res.status(404).send('Product not found');
    }

    // Get the product details
    const { data: productDetails } = await printfulApi.get(`/products/${product.id}`);

    // Extract the variant IDs
    const variantIds = productDetails.result.variants.map(v => v.id);

    // Respond with the product and variant IDs
    res.json({
      productId: 456,
      variantIds: variantIds,
    });
  } catch (error) {
    console.error('Failed to fetch product details:', error);
    res.status(500).send('Failed to fetch product details');
  }
});

export default router;