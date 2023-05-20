import React, { useState } from 'react'
import { useSnapshot } from 'valtio'

import state from '../store'

const SizePicker = ({ size, setSize }) => {
  const snap = useSnapshot(state)

  size = size || snap.size

  const selectedSize = () => {
    if (size === '2xl') {
      return 'xxlarge'
    } else if (size === 'xl') {
      return 'xlarge'
    } else if (size === 'lg') {
      return 'large'
    } else if (size === 'md') {
      return 'medium'
    } else if (size === 'sm') {
      return 'small'
    } else {
      return 'small'
    }
  }

  return (
    <div className="absolute left-full ml-3">
      <select className="sizepicker-container">
        {snap.sizes.map((size) => (
          <option key={size} onChange={(e) => setSize((e.target.value = selectedSize))} onClick={() => (state.size = size)}>
            {size}
          </option>
        ))}
      </select>
    </div>
  )
}

export default SizePicker
