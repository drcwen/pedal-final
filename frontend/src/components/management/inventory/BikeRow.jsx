import { MdModeEditOutline } from "react-icons/md";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react"
import BikeInventoryInfo from "./BikeInventoryInfo"
import { FaPlus } from "react-icons/fa";

function BikeRow() {

    const [dropDown, setDropDown] = useState(false);

  return (
    <>
            <div className='bg-[#EBEBEB] w-full rounded-lg px-3 py-1 border border-[#c9c9c9]'>
                <div className='grid md:grid-cols-[70px_1fr_1fr_1fr_1fr_20px] grid-cols-[1fr_1fr_20px] gap-4 items-center text-center font-akagi text-md lg:text-lg font-bold text-gray'>
                    <div className='hidden md:flex items-center justify-center'>
                        <img 
                            className=' w-10'
                            src='https://res.cloudinary.com/dp3vkgxtb/image/upload/v1775884920/go_kart_upmxbh.png'
                        />
                    </div>

                    <h1>Mountain Bike</h1>

                    <h1 className='hidden md:block'>1</h1>

                    <h1 className='hidden md:block'>150</h1>

                    <div className={`w-full flex flex-row justify-center items-center`}>
                        <div className={`bg-blue flex flex-row gap-2 px-5 py-1 rounded-lg items-center cursor-pointer ${dropDown === true ? 'block' : 'hidden'}`}>
                            <MdModeEditOutline className='text-md text-[#ffffff]'/>
                            <h1 className='text-[#ffffff] text-md'>Edit</h1>
                        </div>
                    </div>

                    <AnimatePresence initial={false}>
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }} 
                            className='flex items-center justify-center cursor-pointer'
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
                                className='flex flex-col gap-7 py-5'
                            >
                                <div className='flex flex-col gap-3'>
                                    <div className='grid md:grid-cols-3 xl:grid-cols-5 grid-cols-2 gap-2 text-center font-akagi text-md font-bold text-gray'>
                                        <div className='border border-[#c9c9c9] hover:scale-103 hover:shadow-2xl duration-300 transition-all rounded-lg shadow-lg flex flex-col gap-2 py-2 items-center'>
                                            <h1>Total Qty</h1>
                                            <h1 className='text-xl'>1</h1>
                                        </div>

                                        <div className='border border-[#c9c9c9] hover:scale-103 hover:shadow-2xl duration-300 transition-all rounded-lg shadow-lg flex flex-col gap-2 py-2 items-center'>
                                            <h1>Available</h1>
                                            <h1 className='text-xl'>1</h1>
                                        </div>

                                        <div className='border border-[#c9c9c9] hover:scale-103 hover:shadow-2xl duration-300 transition-all rounded-lg shadow-lg flex flex-col gap-2 py-2 items-center'>
                                            <h1>Currently Rented</h1>
                                            <h1 className='text-xl'>1</h1>
                                        </div>

                                        <div className='border border-[#c9c9c9] hover:scale-103 hover:shadow-2xl duration-300 transition-all rounded-lg shadow-lg flex flex-col gap-2 py-2 items-center'>
                                            <h1>Under Maintenance</h1>
                                            <h1 className='text-xl'>1</h1>
                                        </div>

                                        <div className='border border-[#c9c9c9] hover:scale-103 hover:shadow-2xl duration-300 transition-all rounded-lg shadow-lg flex flex-col gap-2 py-2 items-center'>
                                            <h1>Lost</h1>
                                            <h1 className='text-xl'>1</h1>
                                        </div>
                                    </div>
                                </div>

                                <div className='flex flex-col gap-3'>
                                    <div className='px-3 grid grid-cols-[1fr_1fr_1fr_1fr_1fr_30px] gap-2 font-akagi font-bold text-gray/50 text-md text-center'>
                                        <div className=''>
                                            ID
                                        </div>

                                        <div className=''>
                                            Times Rented
                                        </div>

                                        <div className=''>
                                            Date Added
                                        </div>

                                        <div className=''>
                                            Earnings
                                        </div>

                                        <div className=''>
                                            Status
                                        </div>

                                        <div className='flex items-center justify-center'>
                                            
                                        </div>
                                    </div>

                                    <BikeInventoryInfo />

                                    <div className='w-full flex items-center justify-center'>
                                        <div className='bg-blue text-md font-akagi py-2 items-center cursor-pointer px-3 font-bold text-[#ffffff] rounded-lg flex flex-row gap-3'>
                                            <FaPlus className='text-[#ffffff] text-md'/>
                                            Add New Bike
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

export default BikeRow
