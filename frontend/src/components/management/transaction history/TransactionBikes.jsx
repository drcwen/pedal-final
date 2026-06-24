import { supabase } from "../../../lib/supabase"

import { useState, useEffect } from "react";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import { motion, AnimatePresence } from "motion/react"

function TransactionBikes() {


  return (
    <>
        
        <div className='md:grid md:grid-cols-[40px_1fr_1fr_1fr_1fr_1fr_1fr_1fr] items-center gap-2 px-10'>
            <div className='bg-yellow p-1 rounded-lg'>
                <img className='w-10' src='https://res.cloudinary.com/dp3vkgxtb/image/upload/v1775884920/go_kart_upmxbh.png'></img>
            </div>

            <div className='flex justify-center font-akagi font-bold text-gray'>
                Mountain Bike
            </div>

            <div className='flex justify-center font-akagi font-bold text-gray'>
                J13
            </div>

            <div className='flex justify-center font-akagi font-bold text-gray'>
                jipies3
            </div>

            <div className='flex justify-center font-akagi font-bold text-gray'>
                1 Hour
            </div>

            <div className='flex justify-center font-akagi font-bold text-gray'>
                10:48AM
            </div>

            <div className='flex justify-center font-akagi font-bold text-gray'>
                11:48AM
            </div>

            <div className='flex justify-center font-akagi font-bold text-gray'>
                P150
            </div>
        </div>
                            
    </>
  )
}

export default TransactionBikes
