import { supabase } from "../../../../lib/supabase"
import Sidebar from "../../sidebar/Sidebar"
import SidebarMobile from "../../sidebar/SidebarMobile"
import { FaPlus } from "react-icons/fa6";
import ReservationRow from "../reservation/ReservationRow"
import { useState } from 'react';
import { motion } from "motion/react"
import { IoChevronBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

function WalkInRent({image, name, availableBikes, isOpen, onClick, bikeId, bikeData, setBikeData, setCart}) {
    
    const navigate = useNavigate();

    const quantity = bikeData[bikeId]?.quantity || 0;
    const hours = bikeData[bikeId]?.hours || 0;

    const handleAdd = (e) => {
        e.stopPropagation();

        const quantity = bikeData[bikeId]?.quantity || 0;
        const hours = bikeData[bikeId]?.hours || 0;

        if (quantity === 0 || hours === 0) return;
    
         setCart(prev => {
            const existingIndex = prev.findIndex(item => item.bikeId === bikeId);

            if (existingIndex !== -1) {
                const updated = [...prev];
                updated[existingIndex] = {
                    ...updated[existingIndex],
                    quantity,
                    hours,
                    total: quantity * hours * 200
                };
                return updated;
            }

            return [
                ...prev,
                {
                    bikeId,
                    name,
                    image,
                    quantity,
                    hours,
                    price: 200,
                    total: quantity * hours * 200
                }
            ];
        });
    };

  return (
    <>
        <div 
            onClick={onClick}
            className={`rounded-xl bg-[#EBEBEB] p-4 flex flex-col items-center text-center justify-center gap-4 border border-[#C8C8C8] cursor-pointer
                ${isOpen == true ? `bg-blue` : `bg-[#EBEBEB]`}
                ${availableBikes === 0 ? `opacity-50 bg-black pointer-events-none` : ``}
            `}>
            <img 
                className='w-30'
                src={image}/>
            <h1 className={`text-lg font-akagi font-bold tracking-wide
                ${isOpen == true ? `text-[#ffffff]` : `text-[#505050] `}
                `}
            >
                {name}</h1>
            {isOpen && (
                <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}className='flex flex-col w-full gap-3'>

                <div className='bg-navyblue rounded-lg px-2 py-1 font-akagi font-medium text-sm text-yellow'>{availableBikes === 0 ? "No Available Units" : availableBikes + " units available"}</div>
                    <div className='flex md:flex-row flex-col justify-between px-4 md:items-center'>
                        <h1 className='text-md font-akagi font-medium text-[#ffffff]'>Quantity</h1>
                        <div className='rounded-lg border-2 border-[#ffffff] grid grid-cols-3 font-akagi font-medium'>
                            <div
                                onClick={(e) => {
                                e.stopPropagation();

                                setBikeData(prev => ({
                                    ...prev,
                                    [bikeId]: {
                                        ...prev[bikeId],
                                        quantity: Math.max(0, (prev[bikeId]?.quantity || 0) - 1)
                                    }
                                }));
                                }}
                                className='px-2 text-[#ffffff] cursor-pointer'
                            >
                                -
                            </div>

                            <div className='bg-white text-blue'>
                                {quantity}
                            </div>

                            <div
                                onClick={(e) => {
                                    e.stopPropagation();

                                    setBikeData(prev => ({
                                        ...prev,
                                        [bikeId]: {
                                            ...prev[bikeId],
                                            quantity: Math.min(
                                                availableBikes,
                                                (prev[bikeId]?.quantity || 0) + 1
                                            )
                                        }
                                    }));
                                }}
                                className='text-[#ffffff] cursor-pointer px-2'
                            >
                                +
                            </div>
                        </div>
                    </div>

                    <div className='flex md:flex-row flex-col justify-between px-4 md:items-center'>
                        <h1 className='text-md font-akagi font-medium text-[#ffffff]'>Hours</h1>
                        <div className='rounded-lg border-2 border-[#ffffff] grid grid-cols-3 font-akagi font-medium'>
                            <div
                                onClick={(e) => {
                                    e.stopPropagation();

                                    setBikeData(prev => ({
                                        ...prev,
                                        [bikeId]: {
                                            ...prev[bikeId],
                                            hours: Math.max(0, (prev[bikeId]?.hours || 0) - 1)
                                        }
                                    }));
                                }}
                                className='px-2 text-[#ffffff] cursor-pointer'
                            >
                                -
                            </div>

                            <div className='bg-white text-blue'>
                                {hours}
                            </div>

                            <div
                                onClick={(e) => {
                                    e.stopPropagation();

                                    setBikeData(prev => ({
                                        ...prev,
                                        [bikeId]: {
                                            ...prev[bikeId],
                                            hours: (prev[bikeId]?.hours || 0) + 1
                                        }
                                    }));
                                }}
                                className='text-[#ffffff] cursor-pointer px-2'
                            >
                                +
                            </div>
                        </div>
                    </div>
                    <div 
                        onClick={handleAdd}
                        className='rounded-xl bg-yellow py-1 font-akagi font-bold text-darkblue'>
                        Add
                    </div>
                </motion.div>
            )}
        </div>

    </>
  )
}

export default WalkInRent
