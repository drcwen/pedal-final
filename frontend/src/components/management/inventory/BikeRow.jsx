import { MdModeEditOutline } from "react-icons/md";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react"

function BikeRow() {

    const [dropDown, setDropDown] = useState(false);

  return (
    <>
            <div className='bg-[#EBEBEB] w-full rounded-lg px-3 py-1 border border-[#c9c9c9]'>
                <div className='grid grid-cols-[70px_1fr_1fr_1fr_1fr_20px] gap-4 items-center text-center font-akagi text-md lg:text-lg font-bold text-gray'>
                    <div className='flex items-center justify-center'>
                        <img 
                            className='w-10'
                            src='https://res.cloudinary.com/dp3vkgxtb/image/upload/v1775884920/go_kart_upmxbh.png'
                        />
                    </div>

                    <h1>Mountain Bike</h1>

                    <h1>1</h1>

                    <h1>150</h1>

                    <div className='w-full flex flex-row justify-center items-center'>
                        <div className='bg-blue flex flex-row gap-2 px-5 py-1 rounded-lg items-center cursor-pointer'>
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
                                    className='flex flex-col gap-3 py-5'
                                >
                                    <div className='flex flex-col gap-3'>
                                        <div className='grid grid-cols-5 gap-2 text-center font-akagi text-md font-bold text-gray'>
                                            <div className='flex flex-col gap-2'>
                                                <h1>Hello</h1>
                                                <h1>Hello</h1>
                                            </div>

                                            <div className='flex flex-col gap-2'>
                                                <h1>Hello</h1>
                                                <h1>Hello</h1>
                                            </div>

                                            <div className='flex flex-col gap-2'>
                                                <h1>Hello</h1>
                                                <h1>Hello</h1>
                                            </div>

                                            <div className='flex flex-col gap-2'>
                                                <h1>Hello</h1>
                                                <h1>Hello</h1>
                                            </div>

                                            <div className='flex flex-col gap-2'>
                                                <h1>Hello</h1>
                                                <h1>Hello</h1>
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
