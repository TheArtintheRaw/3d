import React, { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useSnapshot } from 'valtio'

import config from './config/config'
import state from './store'
import { download } from './assets'
import { downloadCanvasToImage, reader } from './config/helpers'
import { EditorTabs, FilterTabs, DecalTypes } from './config/constants'
import { fadeAnimation, slideAnimation } from './config/motion'
import { AIPicker, ColorPicker, CustomButton, FilePicker, SizePicker, Tab, DisplayStats, BuyButton } from './components'
import { productCatalog } from './components/catalogData'


const Customizer = () => {
  const snap = useSnapshot(state)

  const [file, setFile] = useState('')

  const [prompt, setPrompt] = useState('')
  const [generatingImg, setGeneratingImg] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [activeEditorTab, setActiveEditorTab] = useState('')
  const [activeFilterTab, setActiveFilterTab] = useState({
    logoShirt: true
  })

  // show tab content depending on the activeTab
  const generateTabContent = () => {
    if (!isOpen) return null
    switch (activeEditorTab) {
      case 'colorpicker':
        return <ColorPicker />
      case 'filepicker':
        return <FilePicker file={file} setFile={setFile} readFile={readFile} />
      case 'aipicker':
        return <AIPicker prompt={prompt} setPrompt={setPrompt} generatingImg={generatingImg} handleSubmit={handleSubmit} />
      case 'sizepicker':
        return <SizePicker />
      default:
        return null
    }
  }

  const handleClickOutside = (event) => {
    if (event.target.closest('.editortabs-container')) return
    setIsOpen(false)
  }

  useEffect(() => {
    window.addEventListener('click', handleClickOutside)
    return () => window.removeEventListener('click', handleClickOutside)
  }, [])

  const handleTabClick = (tabName) => {
    setIsOpen((prev) => !prev)
    setActiveEditorTab(tabName)
  }

  const handleSubmit = async (type) => {
    if (!prompt) return alert('Please enter a prompt')

    try {
      setGeneratingImg(true)

      const response = await fetch('https://imager-zhu6.onrender.com/api/v1/dalle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          payload
        })
      })

      const data = await response.json()

      handleDecals(type, `data:image/png;base64,${data.photo}`)
    } catch (error) {
      alert(error)
    } finally {
      setGeneratingImg(false)
      setActiveEditorTab('')
    }
  }

  const handleDecals = (type, result) => {
    const decalType = DecalTypes[type]

    state[decalType.stateProperty] = result

    if (!activeFilterTab[decalType.filterTab]) {
      handleActiveFilterTab(decalType.filterTab)
    }
  }

  const handleActiveFilterTab = (tabName) => {
    switch (tabName) {
      case 'logoShirt':
        state.isLogoTexture = !activeFilterTab[tabName]
        break
      case 'stylishShirt':
        state.isFullTexture = !activeFilterTab[tabName]
        break
      default:
        state.isLogoTexture = true
        state.isFullTexture = false
        break
    }

    // after setting the state, activeFilterTab is updated

    setActiveFilterTab((prevState) => {
      return {
        ...prevState,
        [tabName]: !prevState[tabName]
      }
    })
  }

  const readFile = (type) => {
    reader(file).then((result) => {
      handleDecals(type, result)
      setActiveEditorTab('')
    })
  }

  async function createProduct(variantId, imgUrl, decalLeft, decalTop, decalWidth, decalHeight) {
    const response = await fetch('/createproduct', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        variantId,
        imgUrl,
        decalWidth,
        decalHeight,
        decalLeft,
        decalTop
      })
    })

    if (response.ok) {
      const data = await response.json()
      return data.id // Return the product ID
    } else {
      throw new Error('Failed to create product')
    }
  }

  // Find the color name that corresponds to the selected color


  async function createOrder(recipient, variantId, id) {
    const response = await fetch('/createorder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ recipient, variantId, id })
    })

    if (response.ok) {
      const data = await response.json()
      return data
    } else {
      throw new Error('Failed to create order')
    }
  }

  const colorName = snap.colors.find((color) => Object.keys(color)[0] === snap.color)[snap.color]
  // Get variant_id using the color name and size
  const variantId = productCatalog['Custom T-Shirt'].variants[colorName][snap.size].variant_id

  const imgUrl = snap.logoDecal

  const printfulAreaWidth = 1200
  const printfulAreaHeight = 1600

  const decalWidth = snap.logoScale[0] * printfulAreaWidth
  const decalHeight = snap.logoScale[1] * printfulAreaHeight

  const decalLeft = ((snap.logoPosition[0] + 1) / 2) * printfulAreaWidth // assuming logoPosition.x is between -1 and 1
  const decalTop = (1 - (snap.logoPosition[1] + 1) / 2) * printfulAreaHeight // assuming logoPosition.y is between -1 and 1, and y increases upwards in Printful

  const handleBuy = async () => {
    try {
      const productId = await createProduct(variantId, imgUrl, decalWidth, decalHeight, decalTop, decalLeft)
      console.log(productId)
    } catch (error) {
      console.error(error) // This will catch and print the error
    }
  }


  return (
    <AnimatePresence>
      {!snap.intro && (
        <>
          <motion.div key="custom" className="absolute top-0 left-0 z-10" {...slideAnimation('left')}>
            <div className="flex items-center min-h-screen">
              <div className="editortabs-container tabs">
                {EditorTabs.map((tab) => (
                  <Tab key={tab.name} tab={tab} handleClick={() => handleTabClick(tab.name)} />
                ))}

                {generateTabContent()}
              </div>
            </div>
          </motion.div>

          <motion.div className="absolute z-10 top-5 right-5" {...fadeAnimation}>
            <CustomButton type="filled" title="Go Back" handleClick={() => (state.intro = true)} customStyles="w-fit px-4 py-2.5 font-bold text-sm" />
          </motion.div>

          <motion.div className="absolute z-10 bottom-16 right-5" {...fadeAnimation}>
            <BuyButton type="filled" title="Buy" handleClick={handleBuy(createProduct, createOrder)} customStyles="w-fit px-4 py-2.5 font-bold text-sm" />
          </motion.div>

          <motion.div className="filtertabs-container" {...slideAnimation('up')}>
            {FilterTabs.map((tab) => (
              <Tab key={tab.name} tab={tab} isFilterTab isActiveTab={activeFilterTab[tab.name]} handleClick={() => handleActiveFilterTab(tab.name)} />
            ))}
          </motion.div>
          <motion.div className="absolute bottom-16 left-0" {...slideAnimation('up')}>
            <DisplayStats />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default Customizer
