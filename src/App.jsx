import React from 'react'
import Overlay from './Overlay'
import Customizer from './Customizer'
import { CanvasModel } from './Canvas'
import ErrorBoundary from './components/ErrorBoundary'

function App() {
  return (
    <div className="app transition-all ease-in">
      <ErrorBoundary>
        <Overlay />
        <Customizer />
        <CanvasModel />
      </ErrorBoundary>
    </div>
  )
}

export default App
