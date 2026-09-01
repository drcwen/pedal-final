import { supabase } from "../../../lib/supabase"
import Sidebar from "../sidebar/Sidebar"
import SidebarMobile from "../sidebar/SidebarMobile"
import { FaPlus } from "react-icons/fa6";
import { useState, useEffect } from 'react';
import { motion } from "motion/react"
import { useNavigate } from "react-router-dom";
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { IoMdArrowDropdown } from "react-icons/io";

function Settings() {

    const [activeTab, setActiveTab] = useState("operatingHours");

    const [percent, setPercent] = useState("%");

    const [paymentOccurence, setPaymentOccurence] = useState("Periodic");

    const [periodicOccurence, setPeriodicOccurence] = useState("Every transaction");
    
    const [type, setType] = useState(null);

    const [percentage, setPercentage] = useState(null);

    const [dateOccurence, setDateOccurence] = useState(null);

    const periodicOccurenceOption = [
        "Every transaction",
        "Annually",
        "Bi-annually",
        "Quarterly",
        "Monthly"
    ]

    const [open, setOpen] = useState(false);

    const handleChange = (event) => {
        setPaymentOccurence(event.target.value);
    };

  return (
    <>

        <div className='w-full h-screen bg-[#F2F2F2] flex'>
            <Sidebar active={'settings'}/>
            

            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }} 
                className='flex-1 lg:p-5'>

                <SidebarMobile active={'pos'}/>
                    
                <div className='w-full h-full p-10 bg-[#ffffff] rounded-xl flex flex-col gap-5 overflow-y-scroll scrollbar-thin scrollbar-thumb-[#B9B9B9] scrollbar-track-[#E2E2E2]'>
                    
                    <h1 className='md:text-4xl text-2xl font-akagi font-bold tracking-wide text-blue'>System Settings</h1>

                    <div className='flex flex-row gap-5 font-akagi font-medium text-gray'>
                        <h1 
                            onClick={() => {setActiveTab("operatingHours")}}
                            className={`hover:underline duration-300 transition-all cursor-pointer
                            ${activeTab === "operatingHours" ? "text-navyblue text-bold" : "text-gray/90"}`}
                        >Operating Hours</h1>

                        <h1 
                            onClick={() => {setActiveTab("revenueDeductions")}}
                            className={`hover:underline duration-300 transition-all cursor-pointer
                            ${activeTab === "revenueDeductions" ? "text-navyblue text-bold" : "text-gray/90"}`}
                        >Revenue Deductions</h1>
                        
                        
                    </div>

                    {activeTab === "operatingHours" &&
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="w-full flex-1 min-h-0 md:grid md:grid-cols-2 flex flex-col rounded-xl bg-[#ebebeb] border border-gray/60"
                        >
                            <div className='w-full p-5 md:border-r-1 md:border-gray/60 flex flex-col gap-5'>

                                {/*Title*/}
                                <div className='w-full flex flex-col gap-1'>
                                    <h1 className='md:text-2xl text-xl font-akagi font-bold tracking-wide text-blue'>Operating Hours</h1>
                                    <h1 className='md:text-md text-sm font-akagi font-medium text-gray'>The unchecked date below will be unavailable for reservation.</h1>
                                </div>

                                <div className="w-full flex flex-col font-akagi font-medium text-gray gap-2">

                                    <h1>Monday</h1>

                                    <div className='w-full flex flex-row justify-between items-center gap-3'>
                                        <input type='time' className='w-full rounded-lg border border-gray px-2 py-1'/>
                                        -
                                        <input type='time' className='w-full rounded-lg border border-gray px-2 py-1'/>
                                    </div>
                                </div>
                            </div>

                        </motion.div>
                    }

                    {activeTab === "revenueDeductions" &&
                        <>
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="w-full rounded-xl bg-[#ebebeb] border border-gray/60"
                            >
                                <div className='w-full p-5 md:border-r-1 md:border-gray/60 flex flex-col gap-5'>

                                    {/*Title*/}
                                    <div className='w-full flex flex-col gap-1'>
                                        <h1 className='md:text-2xl text-xl font-akagi font-bold tracking-wide text-blue'>Add a Revenue Deduction</h1>
                                    </div>

                                    <div className='w-full lg:grid lg:grid-cols-2 flex flex-col gap-3 font-akagi font-bold text-gray'>
                                        <div className='flex flex-col gap-1'>
                                            <h1>Type</h1>
                                            <input onChange={(e) => setType(e.target.value)} type='text' className='px-2 py-1 rounded-lg border border-gray focus:outline-none'/>

                                        </div>

                                        <div className='flex flex-col gap-1'>
                                            <h1>Percentage/Amount</h1>
                                            <div className='flex flex-row gap-3'>
                                                <input onChange={(e) => setPercentage(e.target.value)} type='number' className='w-full px-2 py-1 rounded-lg border border-gray focus:outline-none'/>
                                                <div className='grid grid-cols-2 rounded-lg border border-blue'>
                                                    <div 
                                                        onClick={() => {setPercent("%")}}
                                                        className={`${percent === "%" ? "bg-blue text-[#ffffff]" : "text-blue"} px-4 py-1 rounded-tl-md rounded-bl-md`}>
                                                        %
                                                    </div>

                                                    <div 
                                                        onClick={() => {setPercent("P")}}
                                                        className={`${percent === "P" ? "bg-blue text-[#ffffff]" : "text-blue"} px-4 py-1 rounded-tr-md rounded-br-md text-[#ffffff]`}>
                                                        P
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='flex flex-col gap-3'>
                                            <div className='flex flex-col gap-1'>
                                                <h1>Payment Occurence</h1>
                                                <div className='flex flex-row gap-10 px-3'>
                                                    <div className='flex flex-row gap-1'>
                                                        <input type='radio' value='Periodic' checked={paymentOccurence === 'Periodic'} onChange={handleChange}/>
                                                        <h1 className='font-medium'>Periodic</h1>
                                                    </div>

                                                    <div className='flex flex-row gap-1'>
                                                        <input type='radio' value='One-time' checked={paymentOccurence === 'One-time'} onChange={handleChange}/>
                                                        <h1 className='font-medium'>One-time</h1>
                                                    </div>
                                                </div>
                                            </div>

                                            {paymentOccurence === "Periodic" &&
                                                <>
                                                    <div className="relative flex flex-row gap-5">
                                                        <div className="relative">
                                                            <div 
                                                                onClick={() => {setOpen(!open)}}
                                                                className="w-50 flex flex-row items-center justify-between border border-gray/60 px-2 py-1 rounded-lg text-md font-medium cursor-pointer">
                                                                {periodicOccurence}
                                                                <IoMdArrowDropdown className="text-xl" />
                                                            </div>

                                                            {open &&
                                                                <div className="absolute top-full left-0 mt-1 w-50 bg-white border border-gray/60 rounded-lg shadow-md z-50">
                                                                    {periodicOccurenceOption.map((option) => (
                                                                        <div
                                                                            key={option}
                                                                            onClick={() => {
                                                                                setPeriodicOccurence(option);
                                                                                setOpen(false);
                                                                            }}
                                                                            className="py-2 px-2 cursor-pointer hover:bg-gray-100"
                                                                        >
                                                                            {option}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            }   
                                                        </div>
                                                    </div>
                                                </>
                                            }

                                            {paymentOccurence === "One-time" &&
                                                <div className='flex flex-row gap-5'>
                                                    <div className='w-fit flex flex-row items-center justify-between border border-gray/60 px-2 py-1 rounded-lg text-md font-medium'>
                                                        <input type='date' value={dateOccurence} onChange={(e) => setDateOccurence(e.target.value)}/>
                                                    </div>
                                                </div>
                                            }
                                        </div>

                                        
                                    </div>

                                    <div className={`${type && percentage === null ? "hidden" : "block"} bg-yellow rounded-lg px-3 py-1 w-fit font-bold text-navyblue font-akagi cursor-pointer hover:scale-110 transition-all duration-300`}>
                                        Submit
                                    </div>

                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="w-full rounded-xl bg-[#ebebeb] border border-gray/60"
                            >
                                <div className='w-full p-5 md:border-r-1 md:border-gray/60 flex flex-col gap-5'>

                                    {/*Title*/}
                                    <div className='w-full flex flex-col gap-1'>
                                        <h1 className='md:text-2xl text-xl font-akagi font-bold tracking-wide text-blue'>Add a Revenue Deduction</h1>
                                    </div>

                                </div>
                            </motion.div>
                        </>
                    }
                    
                </div>
            </motion.div>
        </div>
    </>
  )
}

export default Settings
