import { supabase } from "../../lib/supabase"
import { motion } from "motion/react"
import { useState, useEffect } from 'react';
import Sidebar from "./sidebar/Sidebar"
import SidebarMobile from "./sidebar/SidebarMobile"
import { MdOutlineKeyboardArrowRight } from "react-icons/md";

function Alerts() {

    
  return (
    <>
        <div className='w-full min-h-screen bg-[#F2F2F2] flex'>
            <Sidebar active=""/>
            <SidebarMobile active=""/>

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

        
               <div className='w-full h-full bg-[#ffffff] rounded-xl p-5 overflow-y-auto flex flex-col'>
                    <div className='flex flex-col gap-3'>
                        <div className='grid grid-cols-[1fr_1fr_1fr_120px_120px] bg-gray/10 p-3 rounded-lg'>
                            <div className='flex gap-3 items-center'>
                                <div className='bg-yellow rounded-lg p-1'>
                                    <img src='https://res.cloudinary.com/dp3vkgxtb/image/upload/v1775884918/family_bike_hkm9lu.png' 
                                    className='w-10'/>
                                </div>

                                <div className='flex flex-col font-akagi font-bold text-gray justify-center'>
                                    <h1 className='text-blue'>J10</h1>
                                    <h1 className='font-medium'>Mountain Bike</h1>
                                </div>
                            </div>

                            <div className='w-full text-center flex flex-col font-akagi font-bold text-gray justify-center'>
                                <h1 className='text-blue'>Broken chain bike</h1>
                            </div>

                            <div className='w-full justify-center text-center flex flex-col font-akagi font-bold text-gray justify-center'>
                                <h1 className='text-blue'>10:10 AM</h1>
                                <h1 className='font-medium'>Today</h1>
                            </div>

                            <div className='w-full flex items-center justify-center'>
                                <div className='rounded-lg px-3 py-1 bg-yellow  font-akagi font-bold text-navyblue'>
                                    Resolve
                                </div>
                            </div>

                            <div className='w-full flex items-center justify-end'>
                                <div className='rounded-lg px-3 py-1 border border-gray  font-akagi font-bold text-gray'>
                                    View Details
                                </div>
                            </div>
                        </div>

                        <div className='grid grid-cols-[1fr_1fr_1fr_120px_120px] bg-gray/10 p-3 rounded-lg'>
                            <div className='flex gap-3 items-center'>
                                <div className='bg-yellow rounded-lg p-1'>
                                    <img src='https://res.cloudinary.com/dp3vkgxtb/image/upload/v1775884918/family_bike_hkm9lu.png' 
                                    className='w-10'/>
                                </div>

                                <div className='flex flex-col font-akagi font-bold text-gray justify-center'>
                                    <h1 className='text-blue'>J10</h1>
                                    <h1 className='font-medium'>Mountain Bike</h1>
                                </div>
                            </div>

                            <div className='w-full text-center flex flex-col font-akagi font-bold text-gray justify-center'>
                                <h1 className='text-blue'>Broken chain bike</h1>
                            </div>

                            <div className='w-full justify-center text-center flex flex-col font-akagi font-bold text-gray justify-center'>
                                <h1 className='text-blue'>10:10 AM</h1>
                                <h1 className='font-medium'>Today</h1>
                            </div>

                            <div className='w-full flex items-center justify-center'>
                                <div className='rounded-lg px-3 py-1 bg-red-400  font-akagi font-bold text-[#ffffff]'>
                                    Resolve
                                </div>
                            </div>

                            <div className='w-full flex items-center justify-end'>
                                <div className='rounded-lg px-3 py-1 border border-gray  font-akagi font-bold text-gray'>
                                    View Details
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
        
    </>
  )
}

export default Alerts
