

import { motion } from "motion/react"
import { fadeScale } from "../../animations/fadeScale"
import {buttonClickBounce} from "../../animations/buttonClickBounce"

function HeroSection() {
  
  return (
    <>
        {/*Hero*/}
        <div className='min-w-full min-h-screen md:py-25 md:px-30 py-27 px-10 bg-[url(https://res.cloudinary.com/dp3vkgxtb/image/upload/v1777011902/mobile_bg_zwq1cf.png)] md:bg-[url(https://res.cloudinary.com/dp3vkgxtb/image/upload/v1777011902/hero_background_z70zpi.png)] bg-center bg-cover bg-no-repeat md:py-25 md:px-30 flex flex-col'>
        
          {/*PC Contents*/}
          <div className='hidden md:flex flex-1 pt-20 flex flex-col justify-between'>

            
              <div className='w-90 flex flex-col gap-3'>

                <motion.div
                  initial={fadeScale.initial}
                  animate={fadeScale.animate}
                  transition={fadeScale.transition}
                >
                  <h1 className='text-7xl font-black text-yellow font-akagi text-shadow-lg'>Experience our family bikes!</h1>
                  <h1 className='text-3xl font-black text-white font-akagi text-shadow-lg'>at La Mesa Eco Park!</h1>

                </motion.div>
              </div>
            

            <div className='flex flex-row gap-5 items-center'>

              <motion.div
                  initial={fadeScale.initial}
                  animate={fadeScale.animate}
                  transition={fadeScale.transition}
                >

                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onHoverStart={() => console.log('hover started!')}
                >
                  <div className='bg-yellow border-yellow border-3 px-10 py-3 rounded-sm text-center shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer'>
                    <h1 className='text-xl font-akagi font-black text-darkblue'>Reserve Now!</h1>
                  </div>
                </motion.button>

              </motion.div>

            </div>
          </div>

          {/*Mobile Contents*/}
          <div className='md:hidden flex flex-1 flex-col pt-10 justify-between'>


              <motion.div
                  initial={fadeScale.initial}
                  animate={fadeScale.animate}
                  transition={fadeScale.transition}
                  className='w-60 flex flex-col gap-3'>
                <h1 className='text-5xl font-akagi font-black text-yellow text-shadow-lg'>Experience our family bikes!</h1>
                <h1 className='text-xl font-akagi font-black text-white text-shadow-lg'>at La Mesa Eco Park!</h1>
              </motion.div>

              <div className='flex flex-row gap-4'>

                <motion.button
                    initial={fadeScale.initial}
                    animate={fadeScale.animate}
                    transition={fadeScale.transition}
                  >
                  <div className='px-5 py-2 border-3 border-yellow w-fit rounded-md'>
                      <h1 className='text-md font-akagi font-black text-yellow'>Reserve</h1>
                  </div>
                </motion.button>

              </div>

          </div>
        </div>
    </>
  )
}

export default HeroSection
