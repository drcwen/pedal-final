import { supabase } from "../../lib/supabase"
import { motion } from "motion/react"
import { useState, useEffect } from 'react';
import Sidebar from "./sidebar/Sidebar"

function Alerts() {

    
  return (
    <>
        <div className='w-full min-h-screen bg-[#F2F2F2] flex'>
            <Sidebar active=""/>

            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }} 
                className='flex flex-col flex-1 min-w-0 lg:h-screen lg:py-15 lg:px-10 p-5 md:p-7 gap-5'>

                <div className='flex flex-col gap-1 font-akagi'>
                    <h1 className='md:text-4xl text-2xl font-bold tracking-wide text-blue'>Alerts</h1>
                    <h1 className='text-md font-medium text-gray'>Only emergency incidents reported by customers via QR code.</h1>
                </div>

                <div className='w-full h-full bg-[#ffffff] rounded-xl p-5 overflow-y-auto flex flex-col '>
                    <div className='w-full rounded-lg bg-gray/10 p-3 grid grid-cols-[200px_1fr_150px_70px_70px] gap-5 items-center'>
                        <div className='flex flex-row gap-3 items-center font-akagi font-bold text-gray'>
                            <div className='bg-yellow rounded-lg p-1'>
                                <img src={'https://res.cloudinary.com/dp3vkgxtb/image/upload/v1775884921/kiddie_sidecar_oe7wve.png'} className='w-15'/>
                            </div>
                            <div className='font-akagi flex flex-col gap-1'>
                                <h1>J1</h1>
                                <h1 className='font-medium'>Solo Kiddie Bike</h1>
                            </div>
                        </div>

                        <div className='items-center flex flex-col gap-1 font-akagi text-gray'>
                            <h1 className='font-bold'>Chain problem</h1>
                            <h1 className='font-medium'>uhuhu</h1>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
        
    </>
  )
}

export default Alerts
