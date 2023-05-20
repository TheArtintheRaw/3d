/* eslint-disable no-unused-vars */
/* eslint-disable no-alert */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */
import React, { useRef, useState, useLayoutEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, useTexture, AccumulativeShadows, RandomizedLight, Decal, Environment, Center, Html } from '@react-three/drei'
import { easing } from 'maath'
import { useSnapshot } from 'valtio'
import state from './store'
import { LogoControls } from './canvas/LogoControls'
import ImageBorder from './canvas/ImageBorder'
import * as THREE from 'three'

export const App = () => {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 0, 0], fov: 25 }}
      gl={{ preserveDrawingBuffer: true }}
      eventSource={document.getElementById('root')}
      eventPrefix="client">
      <ambientLight intensity={0.5} />
      <Environment preset="city" />

      <CameraRig>
        <Backdrop />
        <ImageBorder />
        <Center>
          <Shirt />
        </Center>
      </CameraRig>
    </Canvas>
  )
}

const Backdrop = () => {
  const shadows = useRef()

  useFrame((state, delta) => easing.dampC(shadows.current.getMesh().material.color, state.color, 0.25, delta))

  return (
    <AccumulativeShadows ref={shadows} temporal frames={60} alphaTest={0.85} scale={10} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.14]}>
      <RandomizedLight amount={4} radius={9} intensity={0.55} ambient={0.25} position={[5, 5, -10]} />
      <RandomizedLight amount={4} radius={5} intensity={0.25} ambient={0.55} position={[-5, 5, -9]} />
    </AccumulativeShadows>
  )
}

function CameraRig({ children }) {
  const group = useRef()
  const snap = useSnapshot(state)

  useFrame((state, delta) => {
    const isBreakpoint = window.innerWidth <= 1260
    const isMobile = window.innerWidth <= 600

    // Set the initial position of the model
    let targetPosition = [0, 0, 2]
    if (snap.intro) {
      if (isBreakpoint) {
        targetPosition = [0, 0, 2]
      }

      if (isMobile) {
        targetPosition = [0, 0, 4]
      }
    } else if (isMobile) {
      targetPosition = [0, 0, 2.5]
    } else {
      targetPosition = [0, 0, 2]
    }

    // Set model camera position
    easing.damp3(state.camera.position, targetPosition, 0.25, delta)

    document.addEventListener('pointermove', controlShirt)
    // Update rotation of the group only when left mouse button is pressed down

    function controlShirt(e) {
      if (e.buttons === 1 && group.current) {
        easing.dampE(group.current.rotation, [0, state.pointer.x, 0], 0.25, delta)
      }
    }
  })

  return <group ref={group}>{children}</group>
}

function Shirt() {
  const snap = useSnapshot(state)

  const decalTexture = useTexture(snap.logoDecal)
  const { nodes, materials } = useGLTF('/shirt_baked.glb')
  const [decalPosition, setDecalPosition] = useState(snap.logoPosition)
  const [decalScale, setDecalScale] = useState(snap.logoScale)

  useFrame((state, delta) => easing.dampC(materials.lambert1.color, snap.color, 0.25, delta))

  const maxBoundingArea = {
    minX: -0.07,
    maxX: 0.07,
    minY: -0.16,
    maxY: 0.15,
    minSize: 0.05,
    maxSize: 0.3
  }

  const handleDivMouseEnter = (e) => {
    e.stopPropagation()
  }

  const shirtGeometry = nodes.T_Shirt_male.geometry
  shirtGeometry.computeBoundingBox()
  const shirtBoundingBox = shirtGeometry.boundingBox

  const shirtWidth = shirtBoundingBox.max.x - shirtBoundingBox.min.x
  const shirtHeight = shirtBoundingBox.max.y - shirtBoundingBox.min.y

  const padding = 0.05 // Padding around the edges of the shirt
  const maxDecalWidth = shirtWidth - padding
  const maxDecalHeight = shirtHeight - padding

  const aspectRatio = decalTexture?.image.width / decalTexture?.image.height

  const handleDecalMove = (direction) => {
    const moveAmount = 0.01
    const newDecalPosition = [...decalPosition]

    // Move the decal in the specified direction
    if (direction === 'left' && newDecalPosition[0] > maxBoundingArea.minX) {
      newDecalPosition[0] -= moveAmount
    } else if (direction === 'right' && newDecalPosition[0] < maxBoundingArea.maxX) {
      newDecalPosition[0] += moveAmount
    } else if (direction === 'up' && newDecalPosition[1] < maxBoundingArea.maxY) {
      newDecalPosition[1] += moveAmount
    } else if (direction === 'down' && newDecalPosition[1] > maxBoundingArea.minY) {
      newDecalPosition[1] -= moveAmount
    }

    if (
      newDecalPosition[0] >= maxBoundingArea.minX &&
      newDecalPosition[0] <= maxBoundingArea.maxX &&
      newDecalPosition[1] >= maxBoundingArea.minY &&
      newDecalPosition[1] <= maxBoundingArea.maxY
    ) {
      setDecalPosition(newDecalPosition)
    }
  }

  const handleDecalResize = (operation) => {
    const resizeAmount = 0.01
    let newDecalSize = [...decalScale] // Copy array

    if (operation === '+' && newDecalSize[0] < maxDecalWidth && newDecalSize[1] < maxDecalHeight) {
      newDecalSize[0] += resizeAmount
      newDecalSize[1] += resizeAmount * aspectRatio // Preserve aspect ratio
    } else if (operation === '-' && newDecalSize[0] > 0.07 && newDecalSize[1] > 0.07) {
      // Adding check for Y as well
      newDecalSize[0] -= resizeAmount
      newDecalSize[1] -= resizeAmount * aspectRatio // Preserve aspect ratio
    }

    if (
      newDecalSize[0] >= maxBoundingArea.minSize &&
      newDecalSize[0] <= maxBoundingArea.maxSize &&
      newDecalSize[1] >= maxBoundingArea.minSize &&
      newDecalSize[1] <= maxBoundingArea.maxSize
    ) {
      setDecalScale(newDecalSize, newDecalSize, newDecalSize) // Update state only when new size is within bounding area
    }

    console.log(newDecalSize)
    console.log(maxDecalHeight, maxDecalWidth)
    console.log(shirtBoundingBox)
    console.log(shirtWidth, shirtHeight, aspectRatio)
  }

  const [shirtPosition, setShirtPosition] = useState(null)
  useLayoutEffect(() => {
    if (nodes.T_Shirt_male) {
      const position = new THREE.Vector3()
      position.setFromMatrixPosition(nodes.T_Shirt_male.matrixWorld)
      setShirtPosition(position)
    }
  }, [nodes.T_Shirt_male])

  const stateString = JSON.stringify(snap)

  return (
    <group key={stateString}>
      {!snap.intro && shirtPosition && (
        <Html onMouseEnter={handleDivMouseEnter} position={[shirtPosition.x, shirtPosition.y + 0.2, shirtPosition.z]} translateZ={2}>
          <LogoControls onMouseEnter={handleDivMouseEnter} onMove={handleDecalMove} onResize={handleDecalResize} />
        </Html>
      )}
      <mesh castShadow geometry={nodes.T_Shirt_male.geometry} material={materials.lambert1} material-roughness={1} dispose={null}>
        {snap.isLogoTexture && (
          <Decal debug position={decalPosition} scale={decalScale} rotation={[0, 0, 0]} opacity={1} map={decalTexture} depthTest={false} depthWrite={false} />
        )}
      </mesh>
    </group>
  )
}
