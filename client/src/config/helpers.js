export const downloadCanvasToImage = () => {
  const canvas = document.querySelector('canvas')
  const dataURL = canvas.toDataURL()
  const link = document.createElement('a')

  link.href = dataURL
  link.download = 'canvas.png'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const reader = (file) =>
  new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.onload = () => resolve(fileReader.result)
    fileReader.readAsDataURL(file)
  })

export const getContrastingColor = (color) => {
  // Remove the '#' character if it exists
  const hex = color.replace('#', '')

  // Convert the hex string to RGB values
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  // Calculate the brightness of the color
  const brightness = (r * 299 + g * 587 + b * 114) / 1000

  // Return black or white depending on the brightness
  return brightness > 128 ? 'black' : 'white'
}

export async function createProduct() {
  try {
    const response = await fetch('/create-product', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        logoDecal: state.logoDecal, // Assuming this is base64 or a URL
        size: state.size,
        color: state.color,
        decalPosition: state.decalPosition,
        decalSize: state.decalSize
      })
    })

    const result = await response.json()
    console.log(result)
  } catch (error) {
    console.error('Error:', error)
  }
}
