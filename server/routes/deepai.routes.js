async function generateImage(text) {
  try {
    const response = await fetch('https://api.deepai.org/api/text2img', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.DEEPAI_API_KEY
      },
      body: JSON.stringify({
        text
      })
    })

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`)
    }

    const data = await response.json()
    const imageUrl = data.output.url
    console.log('Generated image URL:', imageUrl)

    return imageUrl
  } catch (error) {
    console.error('Error generating image:', error)
  }
}

const text = 'A beautiful sunset over the mountains'
generateImage(text)
