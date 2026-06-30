
import { RiArrowDropDownLine } from "react-icons/ri";
import { RiArrowDropUpLine } from "react-icons/ri";
import { motion, AnimatePresence } from "motion/react"
import { useState } from 'react';
import OngoingBikesOrders from "./OngoingBikesOrders"

function OngoingRow({ name, ordercount, type, start }) {

    const [dropdown, setDropdown] = useState(false);

  return (
    <>
        <div 
            className='w-full flex flex-col rounded-lg bg-[#F0F0F0] md:px-10 px-4 py-2 border border-[#DBDBDB]'>

            <div className='w-full flex flex-row justify-between items-center'>
                <div className='w-full md:grid md:grid-cols-5 gap-5 items-center md:text-center flex flex-row'>
                    <h1 className='font-akagi font-bold text-gray text-lg'>{name}</h1>
                    <h1 className={`${dropdown === true ? "hidden md:block" : "block"} font-akagi font-semibold text-gray text-lg`}>{ordercount}</h1>
                    <h1 className='hidden md:block font-akagi font-semibold text-gray text-lg'>{type}</h1>
                    <h1 className='hidden md:block font-akagi font-semibold text-gray text-lg'>{start}</h1>

                    <AnimatePresence initial={false}>
                        <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }} 
                                className={`md:py-0 ${dropdown === true ? "block py-4" : "hidden"}`}>
                            <div
                                className={`w-fit rounded-xl bg-red-500 transition-all duration-300 
                                    `}
                            >
                                <h1 className='font-akagi font-black text-[#ffffff] px-5 py-1 cursor-pointer'>END</h1>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
                <div 
                    onClick={() => setDropdown(!dropdown)}
                    className='cursor-pointer'
                >
                    {dropdown ? (
                        <RiArrowDropUpLine className='text-3xl text-gray'/>
                    ): (
                        <RiArrowDropDownLine className='text-3xl text-gray'/>
                    )}
                    
                </div>
            </div>

            <AnimatePresence initial={false}>
                {dropdown && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className='w-full flex flex-col overflow-hidden py-5'>
                        <div className='w-full md:grid md:grid-cols-3 flex flex-col gap-3'>
                            <OngoingBikesOrders 
                                bikeId='W13'
                                gpsId='jipies13'
                                type='Mountain Bike' 
                                price='P150' 
                                duration='1 Hour' 
                                start='1:00 PM' 
                                end='2:00 PM' 
                                remaining='1 Hour'
                            />

                            <OngoingBikesOrders 
                                type='Mountain Bike' 
                                price='P150' 
                                duration='1 Hour' 
                                start='1:00 PM' 
                                end='2:00 PM' 
                                remaining='1 Hour'
                            />

                            <OngoingBikesOrders 
                                type='Mountain Bike' 
                                price='P150' 
                                duration='1 Hour' 
                                start='1:00 PM' 
                                end='2:00 PM' 
                                remaining='1 Hour'
                            />

                            <OngoingBikesOrders 
                                type='Mountain Bike' 
                                price='P150' 
                                duration='1 Hour' 
                                start='1:00 PM' 
                                end='2:00 PM' 
                                remaining='1 Hour'
                            />


                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
                                
    </>
  )
}

export default OngoingRow
