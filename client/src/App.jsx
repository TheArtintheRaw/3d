import React from 'react'
import Overlay from './Overlay'
import Customizer from './Customizer'
import { CanvasModel } from './Canvas'
import Checkout from './Checkout'

export default function App() {
  return (
    <div className="app transition-all ease-in">
      <Overlay />
      <Customizer />
      <CanvasModel />
      <Checkout />
    </div>
  )
}


