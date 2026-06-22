import { supabase } from "../../../lib/supabase"

import { useState, useEffect } from "react";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import { motion, AnimatePresence } from "motion/react"
import TransactionBikes from "./TransactionBikes"

function TransactionRow() {

    const [dropDown, setDropDown] = useState(false);

  return (
    <>
        <div className='flex flex-col gap-2 bg-[#F0F0F0] p-2 rounded-lg border border-[#C9C9C9]'>
            
            <div className='grid grid-cols-[40px_1fr_1fr_1fr_1fr_1fr_20px] items-center text-center'>
                <div className='bg-blue rounded-lg p-1 text-center w-fit px-3 text-[#ffffff] font-bold font-akagi'>2</div>

                <div className='flex justify-center font-akagi font-bold text-gray'>
                    20260326-001
                </div>

                <div className='flex justify-center font-akagi font-medium text-gray'>
                    Wendel Derraco
                </div>
                <div className='flex justify-center font-akagi font-medium text-gray'>
                    Walk-in
                </div>
                <div className='flex justify-center font-akagi font-medium text-gray'>
                    10:48AM
                </div>
                <div className='flex justify-center font-akagi font-medium text-gray'>
                    Completed
                </div>


                <AnimatePresence initial={false}>
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }} 
                        className='flex justify-center text-3xl text-gray'
                    >
                        {dropDown == true ? <RiArrowDropUpLine onClick={() => setDropDown(false)}/> : <RiArrowDropDownLine onClick={() => setDropDown(true)}/>}
                    </motion.div>
                </AnimatePresence>
            </div>

            <AnimatePresence initial={false}>
                {dropDown && 
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className=' overflow-hidden flex flex-col gap-4'
                    >
                        <div className='grid grid-cols-[40px_1fr_70px_70px_90px_100px_100px_40px] items-center gap-2 px-10'>
                            <div className=''>
                                
                            </div>

                            <div className='flex justify-center font-akagi font-medium text-gray/50'>
                                Type
                            </div>

                            <div className='flex justify-center font-akagi font-medium text-gray/50'>
                                ID
                            </div>

                            <div className='flex justify-center font-akagi font-medium text-gray/50'>
                                GPS
                            </div>

                            <div className='flex justify-center font-akagi font-medium text-gray/50'>
                                Duration
                            </div>

                            <div className='flex justify-center font-akagi font-medium text-gray/50'>
                                Start
                            </div>

                            <div className='flex justify-center font-akagi font-medium text-gray/50'>
                                End
                            </div>

                            <div className='flex justify-center font-akagi font-medium text-gray/50'>
                                Price
                            </div>
                        </div>

                        <div className='flex flex-col gap-3'>
                            <TransactionBikes/>
                            <TransactionBikes/>
                            <TransactionBikes/>
                            <TransactionBikes/>
                            <TransactionBikes/>
                            <TransactionBikes/>
                        </div>
                    </motion.div>   
                }
            </AnimatePresence>
        </div>
                        
    </>
  )
}

export default TransactionRow
