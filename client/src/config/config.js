const config = {
	development: {
		backendUrl: 'http://localhost:8080/api/v1/dalle',
	},
	production: {
		backendUrl: 'https://api.openai.com/v1/images/generations',
	},
};

export default config;
