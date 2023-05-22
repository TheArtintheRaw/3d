import React from 'react'
import { CirclePicker } from 'react-color'
import { useSnapshot } from 'valtio'
import state from '../store'

export const colors = {
  '#111111': 'Black',

  '#3e383e': 'Anthracite',

  '#801f24': 'Burgundy',

  '#112537': 'French_Navy',

  '#7a8ca8': 'Dark_Heather_Blue',

  '#2b2928': 'Dark_Heather_Grey',

  '#ccbaa3': 'Desert_Dust',

  '#cfcbc8': 'Heather_Grey',

  '#b2ac88': 'Sage',

  '#ee0717': 'Red',

  '#ffffff': 'White',

  '#3d737d': 'Stargazer'
}

const colorOptions = [
  { name: 'Black', color: '#111111' },
  { name: 'Burgundy', color: '#801f24' },
  { name: 'Anthracite', color: '#3e383e' },
  { name: 'French_Navy', color: '#112537' },
  { name: 'Dark_Heather_Blue', color: '#7a8ca8' },
  { name: 'Dark_Heather_Grey', color: '#2b2928' },
  { name: 'Desert_Dust', color: '#ccbaa3' },
  { name: 'Red', color: '#ee0717' },
  { name: 'Sage', color: '#b2ac88' },
  { name: 'Heather_Grey', color: '#cfcbc8' },
  { name: 'White', color: '#ffffff' },
  { name: 'Stargazer', color: '#3d737d' }
]

const ColorPicker = () => {
  const snap = useSnapshot(state)

  const handleChange = (color) => {
    // Find the color name by comparing color hex
    const selectedColorName = colorOptions.find((option) => option.color === color.hex).name
    console.log('Selected color name: ', selectedColorName)
    state.color = color.hex
  }

  return (
    <div className="absolute left-full ml-3">
      <div className="colorpicker-container">
        <CirclePicker colors={colorOptions.map((option) => option.color)} color={snap.color} disableAlpha onChange={handleChange} />
      </div>
    </div>
  )
}

export default ColorPicker
