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

                <div className='w-full h-full bg-[#ffffff] rounded-xl p-5 overflow-y-auto flex flex-col '>
                    <div className="
    w-full bg-[#f5f5f5] rounded-xl
    p-4
    flex flex-col gap-4

    md:flex-row md:items-center md:gap-5
    md:px-4 md:py-4
">
    
    {/* BIKE INFO */}
    <div className="
        flex items-center gap-3
        md:w-[35%]
    ">
        <img
            src=""
            className="
                w-20 h-20 rounded-xl object-cover
                md:w-[85px] md:h-[85px]
            "
        />

        <div className="font-akagi text-gray">
            <h1 className="font-medium">
                Test
            </h1>

            <h1 className="font-medium">
                Test
            </h1>
        </div>
    </div>


    {/* CONCERN */}
    <div className="
        flex flex-col  gap-1
        font-akagi text-gray

        md:flex-1
    ">
        <h1 className="font-bold">
            Chain problem
        </h1>

        <h1 className="
            font-medium
            whitespace-nowrap
            max-w-full
            overflow-hidden
            text-ellipsis
        ">
            Like huhu please help me
        </h1>
    </div>


    {/* TIME + STATUS */}
    <div className="
        flex items-center justify-between gap-10
        font-akagi text-gray

        md:w-[40%] md:justify-end
    ">

        {/* TIME */}
        <div className="text-center">
            <h1 className="font-bold">
                11:59 AM
            </h1>

            <h1 className="font-medium">
                Today
            </h1>
        </div>

        {/* STATUS */}
        <div className="flex items-center gap-10">
            <div className="
                bg-green-500 text-white
                font-bold
                rounded-lg
                px-5 py-2
                whitespace-nowrap
            ">
                RESOLVED
            </div>

            <span className="text-2xl">
                ›
            </span>
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
