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
import axios from 'axios'

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
          prompt
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

  const printfulApiKey = process.env.PRINTFUL_API_KEY

  async function handleBuy() {
    // Find the color name that corresponds to the selected color
    const colorName = snap.colors.find((color) => Object.keys(color)[0] === snap.color)[snap.color]

    // Get variant_id using the color name and size
    const variantId = productCatalog['Custom T-Shirt'].variants[colorName][snap.size].variant_id

    const printfulAreaWidth = 1200
    const printfulAreaHeight = 1600

    const decalWidth = snap.logoScale[0] * printfulAreaWidth
    const decalHeight = snap.logoScale[1] * printfulAreaHeight

    const decalLeft = ((snap.logoPosition[0] + 1) / 2) * printfulAreaWidth // assuming logoPosition.x is between -1 and 1
    const decalTop = (1 - (snap.logoPosition[1] + 1) / 2) * printfulAreaHeight // assuming logoPosition.y is between -1 and 1, and y increases upwards in Printful

    // Construct the payload for Printful API
    const payload = {
      sync_product: {
        name: 'Custom T-Shirt'
      },
      sync_variants: [
        {
          variant_id: variantId, // the variant_id you get from productCatalog and state
          files: [
            {
              type: 'front', // assuming the decal is on the front
              url: `https://3d-vert.vercel.app/${snap.logoDecal}`, // URL of the decal
              position: {
                area_width: printfulAreaWidth,
                area_height: printfulAreaHeight,
                width: decalWidth,
                height: decalHeight,
                top: decalTop,
                left: decalLeft
              }
            }
          ]
        }
      ]
    }
    const config = {
      method: 'post',
      url: 'https://api.printful.com/store/products',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer+${printfulApiKey}`
      },
      data: payload
    }

    try {
      const response = await axios(config)
      console.log(JSON.stringify(response.data))
      return response.data
    } catch (error) {
      console.error(error)
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
            <BuyButton type="filled" title="Buy" handleClick={handleBuy} customStyles="w-fit px-4 py-2.5 font-bold text-sm" />
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
