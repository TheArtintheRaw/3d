import React, { useMemo } from 'react'
import * as THREE from 'three'

const ImageBorder = () => {
  const borderSize = 0.1 // Adjust the size of the border here
  const borderGeometry = new THREE.BoxGeometry(
    0.04 + borderSize * 2, // Width
    0.135 + borderSize * 2, // Height
    0.001 // Depth
  )
  const borderMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true
  })
  const borderMesh = useMemo(() => {
    const mesh = new THREE.Mesh(borderGeometry, borderMaterial)
    mesh.position.z = 0.15
    mesh.position.y = 0.04 // Move the border mesh slightly in front of the shirt mesh
    return mesh
  }, [])

  return <primitive object={borderMesh} />
}
export default ImageBorder
