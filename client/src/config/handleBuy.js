import { useSnapshot } from 'valtio'
import state from '../store'

export const handleBuy = async () => {
	// Create a snapshot of the state at the time of function call
	const snap = useSnapshot(state)

	// Find the color name that corresponds to the selected color
	const colorName = snap.colors.find((color) => Object.keys(color)[0] === snap.color)[snap.color]

	// Get variant_id using the color name and size
	const variantId = productCatalog['Custom T-Shirt'].variants[colorName][snap.size].variant_id

	const printfulAreaWidth = 1200
	const printfulAreaHeight = 1600

	const decalWidth = snap.logoScale[0] * printfulAreaWidth
	const decalHeight = snap.logoScale[1] * printfulAreaHeight

	const decalLeft = ((snap.logoPosition[0] + 1) / 2) * printfulAreaWidth // assuming logoPosition.x is between -1 and 1
	const decalTop = (1 - (snap.logoPosition[1] + 1) / 2) * printfulAreaHeight // assuming logoPosition.y is between -1 and 1, and y increases upwards in Printful

	// Construct the payload for Printful API
	const payload = {
		sync_product: {
			name: 'Custom T-Shirt'
		},
		sync_variants: [
			{
				variant_id: variantId, // the variant_id you get from productCatalog and state
				"files": [
					{
						"type": "front", // assuming the decal is on the front
						"url": snap.logoDecal, // URL of the decal
						"position": {
							"area_width": printfulAreaWidth,
							"area_height": printfulAreaHeight,
							"width": decalWidth,
							"height": decalHeight,
							"top": decalTop,
							"left": decalLeft
						}
					}
				]
			}
		]
	}

	const config = {
		method: 'post',
		url: 'https://api.printful.com/store/products',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': 'Bearer {your_token}'
		},
		data: payload
	};

	try {
		const response = await axios(config);
		console.log(JSON.stringify(response.data));
		return response.data;
	} catch (error) {
		console.error(error);
	}
}

//     // If product and variant are successfully created, make a request to create a PaymentIntent with Stripe
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: calculateOrderAmount(items),
//       currency: 'cad',
//       automatic_payment_methods: {
//         enabled: true
//       }
//     })

//     // If everything is successful, return the client secret
//     return {
//       clientSecret: paymentIntent.client_secret
//     }
//   } catch (error) {
//     // Handle any errors
//     console.error('Error creating product or making payment:', error)
//     throw error
//   }
// }
