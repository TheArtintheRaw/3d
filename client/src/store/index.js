import { proxy } from 'valtio'

const state = proxy({
  intro: true,
  colors: [
    {
      '#111111': 'Black',
    },
    {
      '#3e383e': 'Anthracite',
    },
    {
      '#801f24': 'Burgundy',
    },
    {
      '#112537': 'French_Navy',
    },
    {
      '#7a8ca8': 'Dark_Heather_Blue',
    },
    {
      '#2b2928': 'Dark_Heather_Grey',
    },
    {
      '#ccbaa3': 'Desert_Dust',
    },
    {
      '#cfcbc8': 'Heather_Grey',
    },
    {
      '#b2ac88': 'Sage',
    },
    {
      '#ee0717': 'Red',
    },
    {
      '#ffffff': 'White',
    },
    {
      '#3d737d': 'Stargazer',
    }
  ],
  color: '#111111',
  isLogoTexture: true,
  logoDecal: './3re.png',
  logoPosition: [0, 0.04, 0.1],
  logoScale: [0.15, 0.15, 0.1],
  sizes: ['S', 'M', 'L', 'XL', 'XXL'],
	size: 'L',
	selectedSize: null,
  selectedColor: null,
})

export default state
