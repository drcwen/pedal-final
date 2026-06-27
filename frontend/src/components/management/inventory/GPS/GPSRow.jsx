
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react"
import { MdModeEditOutline } from "react-icons/md";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";

function GPSRow() {

    const [dropDown, setDropDown] = useState(false);

  return (
    <>

        <div className='w-full bg-[#EBEBEB] rounded-xl py-2 border border-[#C9C9C9]'>
            <div className='px-3 md:px-0 flex flex-row justify-between md:grid md:grid-cols-[1fr_1fr_1fr_100px_50px] gap-2 text-center items-center font-akagi font-bold text-[#9E9E9E]'>
                <div className=''>GPS Name</div>
                <div className=''>Battery Life</div>
                <div className='hidden md:block'>Status</div>
                <div className='hidden bg-blue rounded-lg py-1 md:flex md:flex-row gap-2 items-center justify-center'>
                    <MdModeEditOutline className='text-lg text-[#ffffff]'/>
                    <h1 className='text-lg font-akagi font-bold text-[#ffffff]'>Edit</h1>
                </div>


                <AnimatePresence initial={false}>
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }} 
                        className='text-xl text-[#9E9E9E]'
                    >
                        {dropDown === true ? <RiArrowDropUpLine onClick={() => {setDropDown(false)}}/> : <RiArrowDropDownLine onClick={() => {setDropDown(true)}}/> }
                    </motion.div>
                </AnimatePresence>
            </div>

            <AnimatePresence initial={false}>
                {dropDown === true && 
                    
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }} 
                            className='w-full grid grid-cols-2'
                        >
                            <div className='flex flex-col items-center justify-center font-akagi font-bold text-[#9E9E9E]'>
                                
                            </div>

                            <div className='flex flex-col items-center justify-center font-akagi font-bold text-[#9E9E9E]'>
                                <h1>Details</h1>
                            </div>
                        </motion.div>
                    
                }
            </AnimatePresence>

        </div>
                            
    </>
  )
}

export default GPSRow
