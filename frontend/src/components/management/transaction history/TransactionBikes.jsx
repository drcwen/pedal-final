import { supabase } from "../../../lib/supabase"

import { useState, useEffect } from "react";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import { motion, AnimatePresence } from "motion/react"

function TransactionBikes() {


  return (
    <>
        
        <div className=' border-1 shadow-md border-[#DBDBDB] p-3 rounded-lg flex flex-col gap-4'>
            <div className='flex flex-row justify-between items-center'>
                <div className='flex flex-row gap-3 items-center'>
                    <div className='items-center bg-yellow p-1 rounded-lg'>
                        <img 
                            src='https://res.cloudinary.com/dp3vkgxtb/image/upload/v1775884918/solo_bike_mhxxvb.png'
                            className='w-6'
                        />
                    </div>

                    <h1 className='text-md font-akagi font-bold text-gray'>Mountain Bike</h1>
                </div>

                <h1 className='text-md font-akagi font-bold text-gray'>P150</h1>
            </div>

            <div className='flex px-3'>
                <div className='w-full grid grid-cols-3 gap-2'>
                    <div className='flex flex-col'>
                        <h1 className='text-sm font-akagi font-bold text-gray'>UNIT ID</h1>
                        <h1 className='text-sm font-akagi font-medium text-gray'>J3</h1>
                    </div>

                    <div className='flex flex-col'>
                        <h1 className='text-sm font-akagi font-bold text-gray'>GPS ID</h1>
                        <h1 className='text-sm font-akagi font-medium text-gray'>jipies3</h1>
                    </div>

                    <div className='flex flex-col'>
                        <h1 className='text-sm font-akagi font-bold text-gray'>DURATION</h1>
                        <h1 className='text-sm font-akagi font-medium text-gray'>3 Hours</h1>
                    </div>

                    <div className='flex flex-col'>
                        <h1 className='text-sm font-akagi font-bold text-gray'>START</h1>
                        <h1 className='text-sm font-akagi font-medium text-gray'>1:00 PM</h1>
                    </div>

                    <div className='flex flex-col'>
                        <h1 className='text-sm font-akagi font-bold text-gray'>END</h1>
                        <h1 className='text-sm font-akagi font-medium text-gray'>4:00 PM</h1>
                    </div>
                </div>
            </div>
        </div>
                            
    </>
  )
}

export default TransactionBikes
