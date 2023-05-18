import React from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {useSnapshot} from 'valtio';

import state from './store';
import {headContainerAnimation, headContentAnimation, headTextAnimation, slideAnimation} from './config/motion';
import {CustomButton} from './components';

export default function Overlay() {
	const snap = useSnapshot(state);

	return (
    <AnimatePresence>
      {snap.intro && (
        <motion.section className="home" {...slideAnimation('left')}>
          <motion.header {...slideAnimation('down')}>
            <img src="./3reblk.png" alt="logo" width={36} height={12} className="w-36 h-12 object-contain" />
          </motion.header>

          <motion.div className="home-content" {...headContainerAnimation}>
            <motion.div {...headTextAnimation}>
              <h1 className="head-text">
                Dope S<span className="text-white md:text-black">hirt</span> <br className="xl:block hidden" />
              </h1>
            </motion.div>
            <motion.div {...headContentAnimation} className="flex flex-col gap-5">
              <p className="max-w-md font-normal text-gray-600 text-base">
                Create your Dope Shirt. Order your Dope Shirt. Rock your Dope Shirt. With the Dope Shirt Customizer, defining your style starts with{' '}
                <strong>Dope Shirt</strong>
              </p>

              <CustomButton type="filled" title="Customize" customStyles="w-fit px-4 py-25 font-bold text-sm z-70" handleClick={() => (state.intro = false)} />
            </motion.div>
          </motion.div>
        </motion.section>
      )}
    </AnimatePresence>
  )
}
