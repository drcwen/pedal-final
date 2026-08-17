import { MdModeEditOutline } from "react-icons/md";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react"
import BikeInventoryInfo from "../BikeInventoryInfo"
import { FaPlus } from "react-icons/fa";
import { RiImageAddFill } from "react-icons/ri";
import { IoChevronBack } from "react-icons/io5";

function MaintenanceRow() {

    const [dropDown, setDropDown] = useState(false);

  return (
    <>
        <div className='bg-[#F2F2F2] w-full rounded-lg px-3 py-2 border border-[#c9c9c9]'>
            
            <div className='flex flex-row justify-between font-akagi font-bold text-gray items-center'>
                    <div className='bg-blue p-1 rounded-lg text-[#ffffff] px-2 flex items-center'>
                        W1
                    </div>

                <div className='bg-red-400 rounded-lg p-1 px-2 text-[#ffffff]'>
                    Unsettled
                </div>

                <div className=''
                    onClick={() => setDropDown(!dropDown)}>
                    <RiArrowDropDownLine/>
                </div>
            </div>

            <AnimatePresence initial={false}>
                    {dropDown === true &&
                        <>
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className='flex flex-col gap-7 py-3'
                            >
                                <div className='h-0.5 w-full bg-[#c9c9c9] rounded-full'></div>

                                <div className='md:grid xl:grid-cols-3 md:grid-cols-2 flex flex-col gap-5 lg:px-5 px-2'>
                                    <div className='flex flex-col gap-3 bg-[#ffffff] p-4 rounded-lg border border-[#c9c9c9] font-akagi font-bold text-md text-black/50'>
                                        <h1 className='text-black/70 text-lg'>Customer Details</h1>
                                        <div className='flex flex-col gap-1 px-5'>
                                            <div className='grid grid-cols-[100px_1fr]'>
                                                <h1>Name:</h1>
                                                <h1>Wendel Derraco</h1>
                                            </div>

                                            <div className='grid grid-cols-[100px_1fr]'>
                                                <h1>Type:</h1>
                                                <h1>Walk-in</h1>
                                            </div>

                                            <div className='grid grid-cols-[100px_1fr]'>
                                                <h1>Name:</h1>
                                                <h1>Wendel Derraco</h1>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='flex flex-col gap-3 bg-[#ffffff] p-4 rounded-lg border border-[#c9c9c9] font-akagi font-bold text-md text-black/50'>
                                        <h1 className='text-black/70 text-lg'>Maintenance Details</h1>
                                        <div className='flex flex-col gap-1 px-5'>
                                            <div className='grid grid-cols-[80px_1fr]'>
                                                <h1>Name:</h1>
                                                <h1>Wendel Derraco</h1>
                                            </div>

                                            <div className='grid grid-cols-[80px_1fr]'>
                                                <h1>Type:</h1>
                                                <h1>Walk-in</h1>
                                            </div>

                                            <div className='grid grid-cols-[80px_1fr]'>
                                                <h1>Name:</h1>
                                                <h1>Wendel Derraco</h1>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='flex flex-col gap-3 bg-[#ffffff] p-4 rounded-lg border border-[#c9c9c9] font-akagi font-bold text-md text-black/50'>
                                        <h1 className='text-black/70 text-lg'>Transaction Details</h1>
                                        <div className='flex flex-col gap-1 px-5'>

                                            <div className='grid grid-cols-[100px_1fr]'>
                                                <h1>Total:</h1>
                                                <h1>P200</h1>
                                            </div>

                                            <div className='grid grid-cols-[100px_1fr]'>
                                                <h1>Payment:</h1>
                                                <h1>P200</h1>
                                            </div>

                                            <div className='grid grid-cols-[100px_1fr]'>
                                                <h1>Change:</h1>
                                                <h1>0</h1>
                                            </div>

                                            <div className='grid grid-cols-[100px_1fr]'>
                                                <h1>Method:</h1>
                                                <h1>Cash</h1>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    }
                </AnimatePresence>
        </div>
    </>
  )
}

export default MaintenanceRow
