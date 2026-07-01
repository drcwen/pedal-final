
import { RiArrowDropDownLine } from "react-icons/ri";
import { RiArrowDropUpLine } from "react-icons/ri";
import { motion, AnimatePresence } from "motion/react"
import ReservationBikesOrders from "./ReservationBikesOrders"
import { useState, useEffect } from 'react';
import { supabase } from "../../../../lib/supabase"

function ReservationRow({ name, ordercount, type, start, bikeDetails }) {

    const [dropdown, setDropdown] = useState(false);

    function calculateEndTime(startTime, durationHours) {
        const date = new Date(`1970-01-01T${startTime}`);
        date.setHours(date.getHours() + durationHours);

        return date.toTimeString().slice(0, 8);
    }


    function Countdown() {
        const [seconds, setSeconds] = useState(120);

        useEffect(() => {
            if (seconds <= 0) return;

            const interval = setInterval(() => {
            setSeconds((prev) => prev - 1);
            }, 1000);

            return () => clearInterval(interval);
        }, [seconds]);

        return <h1>{seconds} seconds left</h1>;
    }

  return (
    <>
        <div 
            className='w-full flex flex-col rounded-lg bg-[#F0F0F0] md:px-10 px-4 py-2 border border-[#DBDBDB]'>

            <div className='w-full flex flex-row justify-between items-center'>
                <div className='w-full md:grid md:grid-cols-5 gap-5 items-center md:text-center flex flex-row'>
                    <h1 className='font-akagi font-bold text-gray text-lg'>{name}</h1>
                    <h1 className={`${dropdown === true ? "hidden md:block" : "block"} font-akagi font-semibold text-gray text-lg`}>{ordercount}</h1>
                    <h1 className='hidden md:block font-akagi font-semibold text-gray text-lg first-letter:uppercase'>{type}</h1>
                    <h1 className='hidden md:block font-akagi font-semibold text-gray text-lg'>{start}</h1>

                    <AnimatePresence initial={false}>
                        <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }} 
                                className={`md:py-0 ${dropdown === true ? "block py-4" : "hidden"}`}>
                            <div
                                className={`w-fit rounded-xl bg-green-500 transition-all duration-300 
                                    `}
                            >
                                <h1 className='font-akagi font-black text-[#ffffff] px-5 py-1 cursor-pointer'>START</h1>
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
                        <div className='w-full md:grid md:grid-cols-2 xl:grid-cols-3 flex flex-col gap-3'>
                            
                            {bikeDetails.map((order) => (
                                <ReservationBikesOrders 
                                    key={order.id}
                                    type={order.bike_types_mod.name}
                                    price={"P" + order.bike_types_mod.price}
                                    duration={order.duration_hours === 1 ? order.duration_hours + " Hour" : order.duration_hours + " Hours"}
                                    start={order.start_time}
                                    image={order.bike_types_mod.image_url}
                                    end={calculateEndTime(order.start_time, order.duration_hours)}
                                    remaining={"-"}
                                />
                            ))}

                        </div>

                    </motion.div>
                )}
            </AnimatePresence>
        </div>
                                
    </>
  )
}

export default ReservationRow
