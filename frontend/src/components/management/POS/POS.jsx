import { supabase } from "../../../lib/supabase"
import Sidebar from "../sidebar/Sidebar"
import SidebarMobile from "../sidebar/SidebarMobile"
import { FaPlus } from "react-icons/fa6";
import ReservationRow from "./reservation/ReservationRow"
import OngoingRow from "./ongoing/OngoingRow.jsx"
import { useState } from 'react';
import { motion } from "motion/react"
import { useNavigate } from "react-router-dom";

function POS() {

    const [activeTab, setActiveTab] = useState("ongoing");
    const navigate = useNavigate();

  return (
    <>

        <div className='w-full h-screen bg-[#F2F2F2] flex'>
            <Sidebar active={'pos'}/>
            

            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }} 
                className='flex-1 lg:p-5'>

                <SidebarMobile active={'pos'}/>
                    
                <div className='w-full h-full p-10 bg-[#ffffff] rounded-xl flex flex-col gap-12 overflow-y-scroll scrollbar-thin scrollbar-thumb-[#B9B9B9] scrollbar-track-[#E2E2E2]'>
                    
                    <div className='flex flex-col gap-12'>
                        <div className='flex flex-row gap-5'>
                            {/*Search*/}
                            <div className='rounded-lg bg-[#DBDBDB] lg:px-3 lg:py-2 px-2 py-1'>
                                <input className='text-md lg:text-xl font-akagi font-bold text-[#9E9E9E]' placeholder='Search'></input>
                            </div>
                        </div>

                        <div className='flex flex-col gap-5'>
                            {/*Date*/}
                            <div className=''>
                                <h1 className='text-lg lg:text-2xl font-akagi font-bold text-[#9E9E9E]'>March 13, 2026</h1>
                            </div>

                            <div className='w-fit lg:w-full flex lg:flex-row flex-col gap-5 lg:justify-between'>
                                {/*Transaction Types*/}
                                <div className='rounded-2xl border-3 border-blue grid grid-cols-2'>
                                    <div 
                                        onClick={() => setActiveTab("ongoing")}
                                        className={`md:p-2 py-2 flex justify-center px-5 cursor-pointer rounded-tl-xl rounded-bl-xl transition-all
                                            ${activeTab === "ongoing" ? "bg-blue" : "bg-transparent"}
                                        `}
                                    >
                                        <h1 
                                            className={`text-md lg:text-lg font-akagi font-bold transition-all
                                            ${activeTab === "ongoing" ? "text-[#ffffff]" : "text-blue"}
                                            `}
                                        >
                                            Ongoing
                                        </h1>
                                    </div>

                                    <div 
                                        onClick={() => setActiveTab("reservation")}
                                        className={`md:p-2 py-2 rounded-tr-xl rounded-br-xl flex justify-center px-5 cursor-pointer
                                            ${activeTab === "reservation" ? "bg-blue" : "bg-transparent"}
                                        `}
                                    >
                                        <h1 className={`text-md lg:text-lg font-akagi font-bold px-5 transition-all
                                            ${activeTab === "reservation" ? "text-[#ffffff]" : "text-blue"}
                                            `}>Reservations</h1>
                                    </div>
                                </div>

                                {/*Add Transactions*/}
                                <div 
                                    onClick={() => navigate("/pos/create")}
                                    className='w-fit rounded-xl lg:rounded-2xl bg-yellow items-center flex flex-row gap-3 lg:px-6 p-2 cursor-pointer'
                                >
                                    <FaPlus className='lg:text-2xl text-lg text-darkblue'/>
                                    <h1 className='lg:text-xl text-md font-akagi font-bold text-darkblue tracking-wider'>ADD</h1>
                                </div>

                            </div>
                        </div>
                    </div>

                    
                    <div className='flex-1'>

                        {activeTab === "reservation" && (

                            <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.25, ease: "easeInOut" }} 
                                className='flex flex-col gap-3'
                            >
                                <ReservationRow name={"Wendel Derraco"} ordercount={"4 Bikes"} type={"Reservation"} start={"11:59 AM"}/>
                                <ReservationRow name={"Wendel Derraco"} ordercount={"4 Bikes"} type={"Reservation"} start={"11:59 AM"}/>
                                <ReservationRow name={"Wendel Derraco"} ordercount={"4 Bikes"} type={"Reservation"} start={"11:59 AM"}/>
                                <ReservationRow name={"Wendel Derraco"} ordercount={"4 Bikes"} type={"Reservation"} start={"11:59 AM"}/>
                                <ReservationRow name={"Wendel Derraco"} ordercount={"4 Bikes"} type={"Reservation"} start={"11:59 AM"}/>
                                <ReservationRow name={"Wendel Derraco"} ordercount={"4 Bikes"} type={"Reservation"} start={"11:59 AM"}/>
                                <ReservationRow name={"Wendel Derraco"} ordercount={"4 Bikes"} type={"Reservation"} start={"11:59 AM"}/>
                            </motion.div >

                        )}

                        {activeTab === "ongoing" && (
                            <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.25, ease: "easeInOut" }} 
                                className='flex flex-col gap-3'
                            >
                                <OngoingRow name={"Wendel Derraco"} ordercount={"4 Bikes"} type={"Walk-in"} start={"11:59 AM"}/>
                                <OngoingRow name={"Wendel Derraco"} ordercount={"4 Bikes"} type={"Reservation"} start={"11:59 AM"}/>
                            </motion.div>
                        )}
                        
                    </div>
                </div>
            </motion.div>
        </div>
    </>
  )
}

export default POS
