
import { useState, useEffect } from "react";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import { motion, AnimatePresence } from "motion/react"
import TransactionBikes from "./TransactionBikes"
import { MdOutlineKeyboardArrowRight } from "react-icons/md";

function TransactionRow({totalBikes, transactionId, fullName, transactionType, timeAdded, status, transactionData, transactionPayment, extensionsData, changeBikesData}) {

    const [dropDown, setDropDown] = useState(false);
    useEffect(() => {
    console.log(extensionsData);
}, []);

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
                        className='md:px-10 px-2 flex flex-col gap-3'
                    >
                        <div className='w-full flex flex-col gap-1 font-akagi font-bold text-gray'>
                            <div className='grid grid-cols-[100px_1fr] gap-2'>
                                <h1>Total:</h1>
                                <h1 className='font-medium'>P{transactionPayment.total_amount}</h1>
                            </div>

                            <div className='grid grid-cols-[100px_1fr] gap-2'>
                                <h1>Tendered:</h1>
                                <h1 className='font-medium'>P{transactionPayment.amount_paid}</h1>
                            </div>

                            <div className='grid grid-cols-[100px_1fr] gap-2'>
                                <h1>Change:</h1>
                                <h1 className='font-medium'>P{transactionPayment.change_amount}</h1>
                            </div>

                            <div className='grid grid-cols-[100px_1fr] gap-2'>
                                <h1>Method:</h1>
                                <h1 className='font-medium'>{transactionPayment.payment_method}</h1>
                            </div>

                            <div className={`${transactionPayment.payment_method === "GCash" ? "block" : "hidden"} grid grid-cols-[100px_1fr] gap-2`}>
                                <h1>Reference:</h1>
                                <h1 className='font-medium'>{transactionPayment.reference_number}</h1>
                            </div>
                        </div>

                        
                        <div className='md:hidden w-fit pb-4 flex flex-row items-center'>
                            <h1 className='text-md font-akagi font-bold text-gray '>All Details</h1>
                            <MdOutlineKeyboardArrowRight className='text-xl font-bold text-gray'/>
                        </div>

                            <div className={`${transactionType === "reservation" || transactionType === "walk-in" ? "md:grid md:grid-cols-2 xl:grid-cols-3" : "hidden"} flex flex-col gap-3 pb-5`}>
                                
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

                        {transactionType === "extend" && (
                            <div className="flex flex-col gap-2">

                            </div>
                        )}
                        
                    </motion.div>   
                }
            </AnimatePresence>
        </div>
                        
    </>
  )
}

export default TransactionRow
