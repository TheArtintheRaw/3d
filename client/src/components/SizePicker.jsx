import React from 'react'
import { useSnapshot } from 'valtio'

import state from '../store'

export const sizes = {
  S: 'Small',
  M: 'Medium',
  L: 'Large',
  XL: 'XLarge',
  XXL: 'XXLarge'
}

const SizePicker = () => {
  const snap = useSnapshot(state)

  const handleSizeChange = (event) => {
    const newSize = event.target.value
    state.size = newSize // update the size in your global state
  }

  return (
    <div className="absolute left-full ml-3">
      <select className="sizepicker-container" onChange={handleSizeChange}>
        {snap.sizes.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
    </div>
  )
}

export default SizePicker
