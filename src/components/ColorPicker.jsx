import React from 'react'
import { CirclePicker } from 'react-color'
import { useSnapshot } from 'valtio'

import state from '../store'

const ColorPicker = (color) => {
  const snap = useSnapshot(state)
  color = color || snap.color

  return (
    <div className="absolute left-full ml-3">
      <div className="colorpicker-container">
        <CirclePicker
          colors={['#111111', '#112537', '#2b2928', '#801f24', '#ee0717', '#3e383e', '#3d737d', '#7a8ca8', '#b2ac88', '#ccbaa3', '#cfcbc8', '#ffffff']}
          color={snap.color}
          disableAlpha
          onChange={(color) => (state.color = color.hex)}
        />
      </div>
    </div>
  )
}

export default ColorPicker
