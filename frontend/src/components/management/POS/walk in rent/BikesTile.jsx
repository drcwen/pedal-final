import { supabase } from "../../../../lib/supabase"
import Sidebar from "../../sidebar/Sidebar"
import SidebarMobile from "../../sidebar/SidebarMobile"
import { FaPlus } from "react-icons/fa6";
import ReservationRow from "../ReservationRow"
import { useState } from 'react';
import { motion } from "motion/react"
import { IoChevronBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

function WalkInRent({image, name}) {
    
    const navigate = useNavigate();

  return (
    <>
        <div className='rounded-xl bg-[#EBEBEB] p-4 flex flex-col items-center text-center justify-center gap-4 border border-[#C8C8C8] cursor-pointer'>
            <img 
                className='w-30'
                src={image}/>
            <h1 className='text-lg font-akagi font-bold text-[#505050] tracking-wide'>{name}</h1>
        </div>
    </>
  )
}

export default WalkInRent
