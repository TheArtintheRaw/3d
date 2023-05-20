import React, { useState } from 'react'
import { useSnapshot } from 'valtio'

import state from '../store'

const SizePicker = ({ size, setSize }) => {
  const snap = useSnapshot(state)
  size = size || snap.size

  return (
    <div className="absolute left-full ml-3">
      <select className="sizepicker-container">
        {snap.sizes.map((size) => (
          <option key={size} onChange={(e) => setSize(e.target.size)} onClick={() => (state.size = size)}>
            {size}
          </option>
        ))}
      </select>
    </div>
  )
}

export default SizePicker
