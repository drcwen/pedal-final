import { fade } from "../../../animations/fade"
import { motion } from "framer-motion";
import AdjustQuantity from "../../ui/AdjustQuantity"
import { useState } from "react";

function CartRentRow({
    image,
    name,
    hour,
    reservationdate,
    starttime,
    checked,
    onCheck,
    price,
    quantity,
    onQuantityChange,
    range
}) {

    function getEndTimePH(range) {
        if (!range) return null;

        const match = range.match(/,"([^"]+)"\)/);

        if (!match) return null;

        const endDate = new Date(
            match[1]
                .replace(" ", "T")
                .replace("+00", "Z")
        );

        return endDate.toLocaleTimeString("en-US", {
            timeZone: "Asia/Manila",
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        });
    }

    function formatTime(time) {
        if (!time) return "";

        const [hours, minutes] = time.split(":");

        const hour = Number(hours);

        const period = hour >= 12 ? "PM" : "AM";

        const formattedHour = hour % 12 || 12;

        return `${formattedHour}:${minutes} ${period}`;
    }

    const formatDisplayDate = (dateString) => {
        if (!dateString) return "";

        const [year, month, day] = dateString.split("-");

        const months = {
            "01": "Jan",
            "02": "Feb",
            "03": "Mar",
            "04": "Apr",
            "05": "May",
            "06": "Jun",
            "07": "Jul",
            "08": "Aug",
            "09": "Sep",
            "10": "Oct",
            "11": "Nov",
            "12": "Dec"
        };

        return `${months[month]} ${Number(day)}, ${year}`;
    };

  return (

            <motion.div 
                initial={fade.initial}
                animate={fade.animate}
                transition={fade.transition}
                className='flex flex-col gap-5'>

                {/*PC*/}
                <div className='hidden lg:grid lg:grid-cols-[40px_1fr_100px_50px_150px_150px_100px] gap-3 text-md lg:items-center border border-gray/15 rounded-lg bg-gray/10 p-5 lg:p-0 lg:px-3 lg:py-4 font-akagi font-bold'>
                    <div className=''>
                        <input type='checkbox' className='lg:w-5 lg:h-5 accent-blue-500'
                            checked={checked}
                            onChange={onCheck}></input>
                    </div>

                    <div className='flex flex-row gap-4 items-center'>
                        <div className='rounded-lg flex items-center'>
                            <img src={image} className='px-2 py-2 lg:w-20 w-20 rounded-lg'></img>
                        </div>

                        <h1 className='font-bold text-lg text-blue font-akagi'>{name}</h1>

                    </div>

                    <AdjustQuantity
                                value={quantity}
                                limit={10}
                                setValue={(newValue) => {
                                    if (typeof newValue === "function") {
                                        onQuantityChange(newValue(quantity));
                                    } else {
                                        onQuantityChange(newValue);
                                    }
                                }}
                            />

                    <div className='w-full rounded-lgitems-center justify-center text-center'>
                        <h1 className='py-1 text-[#6D7172] font-medium text-md'>{hour} hour</h1>
                    </div>


                    <div className='w-full rounded-lg items-center justify-center text-center'>
                        <h1 className='py-1 text-[#6D7172] font-medium text-md'>{formatDisplayDate(reservationdate)}</h1>
                    </div>

                    <div className='w-full rounded-lg items-center flex flex-row justify-center text-center'>
                        <h1 className='py-1 text-[#6D7172] font-medium text-md'>{formatTime(starttime)}-</h1>
                        <h1 className='py-1 text-[#6D7172] font-medium text-md'>{getEndTimePH(range)}</h1>
                    </div>

                    <div className='flex items-center justify-end'>
                        <h1 className='lg:flex hidden text-2xl text-blue font-akagi font-bold '>P{price * hour}</h1>
                    </div>


                </div>


                {/*Mobile*/}
                <div className='flex flex-col lg:hidden gap-2 border border-gray/15 rounded-lg bg-gray/10 p-2 px-3'>
                    <div className='grid grid-cols-[10px_1fr_70px] gap-2 items-center'>
                        <input type='checkbox' className='lg:w-5 lg:h-5 accent-blue-500'
                            checked={checked}
                            onChange={onCheck}></input>
                        
                        <div className='flex flex-row gap-2'>
                            <div className='rounded-lg flex items-center'>
                                <img src={image} className='px-2 py-2 w-15 rounded-lg'></img>
                            </div>

                            <div className='flex flex-col justify-center font-akagi font-medium text-gray'>
                                <h1 className='font-bold text-blue'>{name}</h1>
                                <div className='flex flex-row gap-1'>
                                    <h1>{hour === 1 ? hour + " hour" : hour + " hours"}</h1>
                                </div>
                            </div>
                        </div>

                        <div className='w-full'>
                            <AdjustQuantity
                                value={quantity}
                                limit={10}
                                setValue={(newValue) => {
                                    if (typeof newValue === "function") {
                                        onQuantityChange(newValue(quantity));
                                    } else {
                                        onQuantityChange(newValue);
                                    }
                                }}
                            />
                        </div>

                        <div />

                        <div className='col-span-2 w-full p-2 flex flex-col'>
                            <div className='grid grid-cols-[90px_1fr] font-akagi font-bold text-gray'>
                                <h1>Date:</h1>
                                <h1 className='font-medium'>{formatDisplayDate(reservationdate)}</h1>
                                <h1>Duration:</h1>
                                <h1 className='font-medium'>{hour === 1 ? hour + " hour" : hour + " hours"}</h1>

                                <h1>Start Time:</h1>
                                <h1 className='font-medium'>{formatTime(starttime)}-{getEndTimePH(range)}</h1>
                            </div>
                        </div>
                    </div>
                </div>
                
            </motion.div>

  );
}

export default CartRentRow;