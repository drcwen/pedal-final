
import { useState, useEffect } from "react";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import { motion, AnimatePresence } from "motion/react"
import TransactionBikes from "./TransactionBikes"
import { MdOutlineKeyboardArrowRight } from "react-icons/md";

function TransactionRow({totalBikes, transactionId, fullName, transactionType, timeAdded, status, transactionData}) {

    const [dropDown, setDropDown] = useState(false);

  return (
    <>
        <div className='flex flex-col gap-6 bg-[#F0F0F0] p-2 rounded-lg border border-[#C9C9C9]'>
            
            <div className={`md:grid md:grid-cols-[40px_1fr_1fr_1fr_1fr_1fr_20px] flex flex-row justify-between items-center`}>
                <div className='bg-blue rounded-lg p-1 w-fit px-3 text-[#ffffff] font-bold font-akagi'>{totalBikes}</div>

                <div className='hidden md:flex justify-center font-akagi font-bold text-gray text-md lg:text-lg'>
                    {transactionId}
                </div>

                <div className='flex justify-center font-akagi font-medium text-gray text-md lg:text-lg'>
                    {fullName}
                </div>
                <div className='flex justify-center font-akagi font-medium text-gray text-md lg:text-lg'>
                    {transactionType}
                </div>
                <div className='hidden md:flex justify-center font-akagi font-medium text-gray text-md lg:text-lg'>
                    {timeAdded}
                </div>
                <div className='hidden md:flex justify-center font-akagi font-medium text-gray text-md lg:text-lg'>
                    {status}
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
                        className='md:px-10 px-2'
                    >
                        
                        <div className='md:hidden w-fit pb-4 flex flex-row items-center'>
                            <h1 className='text-md font-akagi font-bold text-gray '>All Details</h1>
                            <MdOutlineKeyboardArrowRight className='text-xl font-bold text-gray'/>
                        </div>

                        <div className='md:grid md:grid-cols-2 xl:grid-cols-3 flex flex-col gap-3 pb-5'>
                            
                            {transactionData.map((orders) => (
                                <TransactionBikes 
                                    image={orders.bike_types_mod.image_url}
                                    bikeType={orders.bike_types_mod.name}
                                    price={"P"+orders.bike_types_mod.price}
                                    unitId={orders.bike_id === null ? "NOT STARTED" : orders.bikes_mod.code}
                                    gpsId={orders.gps_id === null ? "NOT STARTED" : orders.gps_mod.code}
                                    duration={orders.duration_hours + " hour"}
                                    start={orders.start_time}
                                    end={orders.start_time}
                                />
                            ))}

                        </div>
                    </motion.div>   
                }
            </AnimatePresence>
        </div>
                        
    </>
  )
}

export default TransactionRow
