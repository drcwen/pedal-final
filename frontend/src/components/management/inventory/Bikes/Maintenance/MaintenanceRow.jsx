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
            <div className='grid lg:grid-cols-[90px_1fr_1fr_1fr_1fr_90px] grid-cols-[90px_1fr_1fr_90px] gap-2 text-center items-center'>
                <div className='flex flex-row justify-center items-center'>
                    <div className='w-fit rounded-lg bg-blue p-1 text-sm font-akagi font-bold text-[#ffffff]'>
                        W-1
                    </div>
                </div>

                <div className='hidden md:block text-lg font-akagi font-bold text-gray'>
                    Bike ID
                </div>

                <div className='hidden md:block text-lg font-akagi font-bold text-gray'>
                    Bike Type
                </div>

                <div className='text-lg font-akagi font-bold text-gray'>
                    Reason
                </div>

                <div className='text-lg font-akagi font-bold text-gray'>
                    Status
                </div>

                <AnimatePresence initial={false}>
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }} 
                            className='flex items-center text-gray text-2xl justify-center cursor-pointer'
                        >
                            {dropDown === true ? <RiArrowDropUpLine onClick={() => {setDropDown(false)}}/> : <RiArrowDropDownLine onClick={() => {setDropDown(true)}}/>}
                        </motion.div>
                    </AnimatePresence>
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
