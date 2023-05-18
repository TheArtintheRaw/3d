/* eslint-disable no-alert */
import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useSnapshot } from 'valtio'

import { EditorTabs, FilterTabs, DecalTypes } from './config/constants'
import { fadeAnimation, slideAnimation } from './config/motion'
import { AIPicker, SizePicker, ColorPicker, CustomButton, FilePicker, Tab } from './components'
import state from './store'
import { reader } from './config/helpers'

const Customizer = () => {
  const snap = useSnapshot(state)
  const [color, setColor] = useState('#111111')
  const [file, setFile] = useState('')
  const [prompt, setPrompt] = useState('')
  const [generatingImg, setGeneratingImg] = useState(false)
  const [size, setSize] = useState('')
  const [activeEditorTab, setActiveEditorTab] = useState('')
  const [activeFilterTab, setActiveFilterTab] = useState({
    logoShirt: true
  })

  // Show tab content depending on the activeTab
  const generateTabContent = () => {
    switch (activeEditorTab) {
      case 'sizepicker':
        return <SizePicker setSize={setSize} size={size} sizes={size} />
      case 'colorpicker':
        return <ColorPicker color={color} />
      case 'filepicker':
        return <FilePicker file={file} setFile={setFile} readFile={readFile} />
      case 'aipicker':
        return <AIPicker prompt={prompt} setPrompt={setPrompt} generatingImg={generatingImg} handleSubmit={handleSubmit} />
      default:
        return null
    }
  }

  const handleSubmit = async (type) => {
    if (!prompt) {
      return alert('Please enter a prompt')
    }

    try {
      setGeneratingImg(true)

      const response = await fetch('https://aishirt-u1up.onrender.com:8000/api/v1/dalle', {
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
        break
    }

    // After setting the state, activeFilterTab is updated

    setActiveFilterTab((prevState) => ({
      ...prevState,
      [tabName]: !prevState[tabName]
    }))
  }

  const readFile = (type) => {
    reader(file).then((result) => {
      handleDecals(type, result)
      setActiveEditorTab('')
    })
  }

  const handleActiveEditorTab = (tabName) => {
    if (activeEditorTab === tabName) {
      setActiveEditorTab('')
    } else {
      setActiveEditorTab(tabName)
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
                  <Tab key={tab.name} tab={tab} handleClick={() => handleActiveEditorTab(tab.name)} onMouseEnter />
                ))}

                {generateTabContent()}
              </div>
            </div>
          </motion.div>

          <motion.div className="absolute z-10 top-5 right-5" {...fadeAnimation}>
            <CustomButton type="filled" title="Go Back" handleClick={() => (state.intro = true)} customStyles="w-fit px-4 py-2.5 font-bold text-sm" />
          </motion.div>

          {/* <motion.div className='absolute z-10 bottom-5 right-5' {...fadeAnimation}>
						<CustomButton
							type='filled'
							title='Order Now'
							handleClick={() => handleBuyNow()}
							customStyles='w-fit px-4 py-2.5 font-bold text-sm'
						/>
					</motion.div> */}

          <motion.div className="filtertabs-container w-1/2 ml-[25%]" {...slideAnimation('up')}>
            {FilterTabs.map((tab) => (
              <Tab key={tab.name} tab={tab} isFilterTab isActiveTab={activeFilterTab[tab.name]} handleClick={() => handleActiveFilterTab(tab.name)} />
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default Customizer
