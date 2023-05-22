import React, { useState } from 'react'
import { useSnapshot } from 'valtio'
import state from '../store'
import { colors } from './ColorPicker'
import { sizes } from './SizePicker'

const DisplayStats = () => {
  const snap = useSnapshot(state)
  const colorName = colors[snap.color]
  const sizeName = sizes[snap.size]

  return (
    <div className="p-2 border border-gray-300 rounded-md bg-gray-200 w-auto m-4">
      <p className="text-sm text-gray-700">Selected Size: {sizeName || 'None'}</p>
      <p className="text-sm text-gray-700">Selected Color: {colorName || 'None'}</p>
    </div>
  )
}

export default DisplayStats
