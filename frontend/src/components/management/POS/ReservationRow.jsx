
import { supabase } from "../../../lib/supabase"
import { RiArrowDropDownLine } from "react-icons/ri";
import { RiArrowDropUpLine } from "react-icons/ri";
import { motion, AnimatePresence } from "motion/react"
import ReservationBikesOrders from "./ReservationBikesOrders"
import { useState } from 'react';

function ReservationRow({ name, ordercount, type, start }) {

    const [dropdown, setDropdown] = useState(false);
    const gridLayout =
  "grid grid-cols-[1fr_100px_100px_100px_100px_1fr] items-center";

  return (
    <>
        <div 
            className='w-full flex flex-col rounded-lg rounded-lg bg-[#F0F0F0] px-10 py-2'>

            <div className='w-full flex flex-row justify-between items-center'>
                <div className='w-full grid grid-cols-5 gap-5 items-center text-center'>
                    <h1 className='font-akagi font-bold text-gray text-lg'>{name}</h1>
                    <h1 className='font-akagi font-semibold text-gray text-lg'>{ordercount}</h1>
                    <h1 className='font-akagi font-semibold text-gray text-lg'>{type}</h1>
                    <h1 className='font-akagi font-semibold text-gray text-lg'>{start}</h1>

                    <AnimatePresence initial={false}>
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }} 
                            className={`w-fit rounded-xl bg-green-500 transition-all duration-300 
                                ${dropdown === true ? "block" : "hidden"}
                                `}
                        >
                            <h1 className='font-akagi font-black text-[#ffffff] px-5 py-1 cursor-pointer'>START</h1>
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
                        className='w-full flex flex-col overflow-hidden'>
                        <div className='w-full flex flex-col gap-3'>
                            <div className={`${gridLayout} w-full font-semibold py-3`}>
                                <div className='flex justify-center text-sm font-akagi text-gray'>Type</div>
                                <div className='flex justify-center text-sm font-akagi text-gray'>Duration</div>
                                <div className='flex justify-center text-sm font-akagi text-gray'>Start Time</div>
                                <div className='flex justify-center text-sm font-akagi text-gray'>End Time</div>
                                <div className='flex justify-center text-sm font-akagi text-gray'>Remaining</div>
                                <div className='flex justify-center text-sm font-akagi text-gray'></div>
                            </div>

                            <div className='h-0.5 w-full bg-black/10'></div>

                            <ReservationBikesOrders type={"Mountain Bike"} duration={"3 Hours"} start={"1:00 PM"} end={"4:00 PM"} remaining={"00:30"}/>
                            <ReservationBikesOrders type={"Mountain Bike"} duration={"3 Hours"} start={"1:00 PM"} end={"4:00 PM"} remaining={"00:30"}/>
                            <ReservationBikesOrders type={"Mountain Bike"} duration={"3 Hours"} start={"1:00 PM"} end={"4:00 PM"} remaining={"00:30"}/>
                            <ReservationBikesOrders type={"Mountain Bike"} duration={"3 Hours"} start={"1:00 PM"} end={"4:00 PM"} remaining={"00:30"}/>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
                                
    </>
  )
}

export default ReservationRow
