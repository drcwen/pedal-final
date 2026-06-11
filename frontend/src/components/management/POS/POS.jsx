import { supabase } from "../../../lib/supabase"
import Sidebar from "../sidebar/Sidebar"
import { FaPlus } from "react-icons/fa6";
import ReservationRow from "./ReservationRow"
import { useState } from 'react';
import { motion } from "motion/react"

function POS() {

    const [activeTab, setActiveTab] = useState("ongoing");

  return (
    <>

        <div className='w-full h-screen bg-[#F2F2F2] flex'>
            <Sidebar active={'pos'}/>

            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }} 
                className='flex-1 py-15 px-10'>

                <div className='w-full h-full p-10 bg-[#ffffff] rounded-xl flex flex-col gap-12 overflow-y-scroll scrollbar-thin scrollbar-thumb-[#B9B9B9] scrollbar-track-[#E2E2E2]'>
                    
                    <div className='flex flex-col gap-12'>
                        <div className='flex flex-row gap-5'>
                            {/*Search*/}
                            <div className='rounded-lg bg-[#DBDBDB] px-3 py-2'>
                                <input className='text-xl font-akagi font-bold text-[#9E9E9E]' placeholder='Search'></input>
                            </div>
                        </div>

                        <div className='flex flex-col gap-5'>
                            {/*Date*/}
                            <div className=''>
                                <h1 className='text-2xl font-akagi font-bold text-[#9E9E9E]'>March 13, 2026</h1>
                            </div>

                            <div className='flex flex-row justify-between'>
                                {/*Transaction Types*/}
                                <div className='rounded-2xl border-3 border-blue grid grid-cols-2'>
                                    <div 
                                        onClick={() => setActiveTab("ongoing")}
                                        className={`p-2 flex justify-center px-5 cursor-pointer rounded-tl-xl rounded-bl-xl transition-all
                                            ${activeTab === "ongoing" ? "bg-blue" : "bg-transparent"}
                                        `}
                                    >
                                        <h1 
                                            className={`text-lg font-akagi font-bold transition-all
                                            ${activeTab === "ongoing" ? "text-[#ffffff]" : "text-blue"}
                                            `}
                                        >
                                            Ongoing
                                        </h1>
                                    </div>

                                    <div 
                                        onClick={() => setActiveTab("reservation")}
                                        className={`p-2 rounded-tr-xl rounded-br-xl flex justify-center px-5 cursor-pointer
                                            ${activeTab === "reservation" ? "bg-blue" : "bg-transparent"}
                                        `}
                                    >
                                        <h1 className={`text-lg font-akagi font-bold transition-all
                                            ${activeTab === "reservation" ? "text-[#ffffff]" : "text-blue"}
                                            `}>Reservations</h1>
                                    </div>
                                </div>

                                {/*Add Transactions*/}
                                <div className='rounded-2xl bg-yellow items-center flex flex-row gap-3 px-6 cursor-pointer'>
                                    <FaPlus className='text-2xl text-darkblue'/>
                                    <h1 className='text-xl font-akagi font-bold text-darkblue tracking-wider'>ADD</h1>
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
                                <ReservationRow name={"Wendel Derraco"} ordercount={"4 Bikes"} type={"Reservation"} start={"11:59 AM"}/>
                                <ReservationRow name={"Wendel Derraco"} ordercount={"4 Bikes"} type={"Reservation"} start={"11:59 AM"}/>
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
