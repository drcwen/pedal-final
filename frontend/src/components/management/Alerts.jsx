import { supabase } from "../../lib/supabase"
import { motion } from "motion/react"
import { useState, useEffect } from 'react';
import Sidebar from "./sidebar/Sidebar"
import SidebarMobile from "./sidebar/SidebarMobile"
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { IoCloseSharp } from "react-icons/io5";
import { IoMdLocate } from "react-icons/io";
import { RiArrowDropDownLine } from "react-icons/ri";
import { GoDotFill } from "react-icons/go";

function Alerts() {

    const [viewDetails, setViewDetails] = useState(false);
    const [showResolveDropdown, setShowResolveDropdown] = useState(false);
    const [resolveStatus, setResolveStatus] = useState("Resolve");

    const [activeAlerts, setActiveAlerts] = useState([]);

    function formatRelativeDate(timestamp) {
        if (!timestamp) return "";

        const date = new Date(timestamp);

        if (Number.isNaN(date.getTime())) {
            return "";
        }

        const getPHDate = (date) => {
            return new Intl.DateTimeFormat("en-CA", {
                timeZone: "Asia/Manila",
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
            }).format(date);
        };

        const givenDate = getPHDate(date);

        // Current date/time
        const now = new Date();
        const todayDate = getPHDate(now);

        // Create yesterday based on the current PH date
        const yesterday = new Date(
            now.toLocaleString("en-US", {
                timeZone: "Asia/Manila",
            })
        );

        yesterday.setDate(yesterday.getDate() - 1);

        const yesterdayDate = getPHDate(yesterday);

        if (givenDate === todayDate) {
            return "Today";
        }

        if (givenDate === yesterdayDate) {
            return "Yesterday";
        }

        const [year, month, day] = givenDate.split("-");

        return `${month}/${day}/${year}`;
    }

    function formatTime(timestamp) {
        if (!timestamp) return "";

        const date = new Date(timestamp);

        // Prevent "Invalid time value"
        if (Number.isNaN(date.getTime())) {
            return "";
        }

        return new Intl.DateTimeFormat("en-US", {
            timeZone: "Asia/Manila",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        }).format(date);
    }

    const getActiveAlerts = async () => {
    
        const { data, error } = await supabase
            .from("alerts_mod")
            .select(`*,
                bike_types_mod (
                    *
                ),
                bikes_mod (
                    *
                )
            `)
            .single();

        if (error) {
            console.error("Error getting user full name:", error);
            return "Unknown";
        }

        setActiveAlerts(data || []);

    };

    useEffect(() => {
        getActiveAlerts();
    }, []);

    console.log("Active", activeAlerts)

  return (
    <>
        <div className='w-full min-h-screen bg-[#F2F2F2] flex'>
            <Sidebar active=""/>
            <SidebarMobile active=""/>

            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }} 
                className='flex flex-col flex-1 min-w-0 lg:h-screen lg:py-15 lg:px-10 p-5 md:p-7 gap-5'
            >
                <div className='flex flex-col gap-1 font-akagi'>
                    <h1 className='md:text-4xl text-2xl font-bold tracking-wide text-blue'>Alerts</h1>
                    <h1 className='text-md font-medium text-gray'>Only emergency incidents reported by customers via QR code.</h1>
                </div>

        
               <div className='w-full h-full bg-[#ffffff] rounded-xl p-5 overflow-y-auto flex flex-col'>
                    <div className='flex flex-col gap-3'>

                        <div className='flex gap-2'></div>
                            <div className='grid grid-cols-2 border border-gray/15 md:grid-cols-[1fr_1fr_1fr_120px_120px] bg-gray/10 p-3 rounded-lg'>
                                
                                <div className='flex gap-3 items-center'>
                                    <div className='bg-yellow rounded-lg p-1'>
                                        <img src='https://res.cloudinary.com/dp3vkgxtb/image/upload/v1775884918/family_bike_hkm9lu.png' 
                                        className='w-10'/>
                                    </div>

                                    <div className='flex flex-col font-akagi font-bold text-gray justify-center'>
                                        <h1 className='text-blue'>{activeAlerts?.bikes_mod?.code}</h1>
                                        <h1 className='font-medium'>{activeAlerts?.bike_types_mod?.name}</h1>
                                    </div>
                                </div>

                                <div className='hidden md:flex w-full text-center md:flex-col font-akagi font-bold text-gray justify-center'>
                                    <h1 className='text-blue'>{activeAlerts?.concern}</h1>
                                </div>

                                <div className='hidden md:flex w-full justify-center text-center md:flex-col font-akagi font-bold text-gray justify-center'>
                                    <h1 className='text-blue'>{formatTime(activeAlerts?.created_at)}</h1>
                                    <h1 className='font-medium'>{formatRelativeDate(activeAlerts?.created_at)}</h1>
                                </div>

                                <div className='justify-end w-full flex items-center md:justify-center'>
                                    <div 
                                        onClick={() => {setViewDetails(!viewDetails)}}
                                        className='cursor-pointer rounded-lg px-3 py-1 bg-red-400  font-akagi font-bold text-[#ffffff]'>
                                        Resolve
                                    </div>
                                </div>

                                <div className='hidden md:flex w-full items-center justify-end'>
                                    <div 
                                        onClick={() => {setViewDetails(!viewDetails)}}
                                        className='cursor-pointer rounded-lg px-3 py-1 border border-gray  font-akagi font-bold text-gray'>
                                        View Details
                                    </div>
                                </div>
                            </div>

                            {viewDetails &&
                                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-100 p-5">
                                    <div className="
                                        bg-[#ffffff]
                                        p-5 md:p-5
                                        rounded-xl
                                        w-full
                                        max-w-lg
                                        max-h-[90vh]
                                        overflow-y-auto
                                        scrollbar-thin
                                        scrollbar-thumb-[#B9B9B9]
                                        scrollbar-track-[#E2E2E2] flex flex-col gap-5
                                    ">
                                        <div className='w-full bg-gray/15 border border-gray/20 p-3 rounded-lg flex justify-between items-center font-akagi font-bold text-gray'>
                                            <div className='flex gap-3'>
                                                <div className='bg-yellow rounded-lg p-1'>
                                                    <img src='https://res.cloudinary.com/dp3vkgxtb/image/upload/v1775884918/family_bike_hkm9lu.png' 
                                                    className='w-10'/>
                                                </div>

                                                <div className='flex flex-col justify-center'>
                                                    <h1 className='text-blue'>{activeAlerts?.bikes_mod?.code}</h1>
                                                    <h1 className='font-medium'>{activeAlerts?.bike_types_mod?.name}</h1>
                                                </div>
                                            </div>

                                            <div className='relative'>
                                                <div
                                                    onClick={() => setShowResolveDropdown(!showResolveDropdown)}
                                                    className='cursor-pointer flex items-center gap-2 w-fit px-3 py-1 bg-red-400 text-[#ffffff] rounded-lg'
                                                >
                                                    {resolveStatus}
                                                    <RiArrowDropDownLine
                                                        className={`text-xl transition-transform ${
                                                            showResolveDropdown ? "rotate-180" : ""
                                                        }`}
                                                    />
                                                </div>

                                                {showResolveDropdown && (
                                                    <div className='absolute right-0 top-full mt-2 w-36 bg-white border border-gray/20 rounded-lg shadow-lg overflow-hidden z-50'>
                                                        <div
                                                            onClick={() => {
                                                                setResolveStatus("Resolved");
                                                                setShowResolveDropdown(false);
                                                            }}
                                                            className='px-3 py-2 font-akagi font-bold text-gray hover:bg-gray/10 cursor-pointer'
                                                        >
                                                            Resolved
                                                        </div>

                                                        <div
                                                            onClick={() => {
                                                                setResolveStatus("Dismissed");
                                                                setShowResolveDropdown(false);
                                                            }}
                                                            className='px-3 py-2 font-akagi font-bold text-gray hover:bg-gray/10 cursor-pointer'
                                                        >
                                                            Dismissed
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <div className='px-3 flex flex-col font-akagi font-bold text-gray'>
                                            <div className='grid grid-cols-[80px_1fr]'>
                                                <h1>Date:</h1>
                                                <h1 className='font-medium'>{formatRelativeDate(activeAlerts?.created_at)}</h1>
                                            </div>

                                            <div className='grid grid-cols-[80px_1fr]'>
                                                <h1>Time:</h1>
                                                <h1 className='font-medium'>{formatTime(activeAlerts?.created_at)}</h1>
                                            </div>

                                            <div className='grid grid-cols-[80px_1fr]'>
                                                <h1>Concern:</h1>
                                                <h1 className='font-medium'>Broken chain bike</h1>
                                            </div>
                                        </div>

                                        <div className='flex justify-between font-akagi font-bold text-gray items-center'>
                                            <div 
                                                onClick={() => {setViewDetails(!viewDetails)}}
                                                className='border border-gray rounded-lg px-3 py-0.5 font-medium cursor-pointer'>
                                                Close
                                            </div>

                                            <div className='w-fit px-3 py-1 bg-green-400 rounded-lg flex gap-2 items-center text-[#ffffff]'>
                                                <IoMdLocate className='text-[#ffffff]'/>
                                                Locate
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                    </div>
                </div>
            </motion.div>
        </div>
        
    </>
  )
}

export default Alerts
