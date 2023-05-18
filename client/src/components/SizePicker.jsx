import React, { useState } from 'react'
import { useSnapshot } from 'valtio'

import state from '../store'

const SizePicker = (size) => {
  const snap = useSnapshot(state)
  const [selectedSize, setSelectedSize] = useState(snap.size)

  size = size || snap.size

  const handleChange = (e) => {
    setSelectedSize(e.state.size)
  }

  return (
    <div className="absolute left-full ml-3">
      <select className="sizepicker-container">
        {snap.sizes.map((size) => (
          <option key={size} onChange={handleChange} onClick={() => (state.size = size)}>
            {size}
          </option>
        ))}
      </select>
    </div>
  )
}

export default SizePicker
