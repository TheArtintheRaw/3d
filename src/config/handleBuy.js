const apiKey = import.meta.env.PRINT_API_KEY;
const productId = '644fc2e1598';
const userFile = file; // Assuming 'file' is a File object provided by the user
const userColor = 'color_code'; // Replace with the chosen color code
const userSize = 'size_code'; // Replace with the chosen size code

const createProduct = async () => {
	// First, upload the file to Printful
	const fileUploadData = new FormData();
	fileUploadData.append('file', userFile);
	fileUploadData.append('filename', userFile.name);
	fileUploadData.append('type', 'image/png'); // Replace with the correct file type

	const fileUploadResponse = await fetch('https://api.printful.com/files', {
		method: 'POST',
		headers: {
			Authorization: 'Basic ' + btoa(apiKey + ':'),
		},
		body: fileUploadData,
	});

	const fileUploadResult = await fileUploadResponse.json();
	const fileId = fileUploadResult.result.id;

	// Then, create the product using the uploaded file, color, size, and product ID
	const orderData = {
		recipient: {
			// Replace with recipient information
			name: 'John Doe',
			address1: '123 Main St',
			city: 'Los Angeles',
			state_code: 'CA',
			country_code: 'US',
			zip: '90001',
		},
		items: [
			{
				product_id: productId,
				variant_id: userColor + '-' + userSize,
				quantity: 1,
				files: [
					{
						id: fileId,
					},
				],
			},
		],
	};

	const orderResponse = await fetch('https://api.printful.com/orders', {
		method: 'POST',
		headers: {
			Authorization: 'Basic ' + btoa(apiKey + ':'),
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(orderData),
	});

	const orderResult = await orderResponse.json();
	console.log(orderResult);
};

createProduct();
