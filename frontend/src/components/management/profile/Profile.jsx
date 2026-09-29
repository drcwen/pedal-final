import { supabase } from "../../lib/supabase"
import Sidebar from "./sidebar/Sidebar"
import { MdDirectionsBike } from "react-icons/md";
import { motion } from "motion/react"
import SidebarMobile from "./sidebar/SidebarMobile"
import { useState, useEffect } from 'react';

function Profile() {
    

  return (
    <>

        <div className='w-full min-h-screen bg-[#F2F2F2] flex'>
            <Sidebar active={'dashboard'}/>

            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }} 
                className='flex flex-col flex-1 min-w-0 lg:h-screen lg:py-15 lg:px-10 p-5 md:p-7 gap-5'>

                <SidebarMobile active={'dashboard'}/>

                <h1 className='md:text-4xl text-2xl font-akagi font-bold tracking-wide text-blue'>Dashboard</h1>
            </motion.div>
        </div>

      
    </>
  )
}

export default Profile
