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
                    <div className='grid grid-cols-[]'>

                    </div>
                </div>
            </motion.div>
        </div>
        
    </>
  )
}

export default Alerts
