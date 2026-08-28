import { supabase } from "../../../lib/supabase"
import Sidebar from "../sidebar/Sidebar"
import SidebarMobile from "../sidebar/SidebarMobile"
import { FaPlus } from "react-icons/fa6";
import { useState, useEffect } from 'react';
import { motion } from "motion/react"
import { useNavigate } from "react-router-dom";
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { IoMdArrowDropdown } from "react-icons/io";
import { Calendar } from 'primereact/calendar';
import "primereact/resources/themes/lara-light-cyan/theme.css";

function DataReports() {

    const [dates, setDates] = useState(null);
    
    useEffect(() => {
        const fetchData = async () => {
            const { data, error } = await supabase.rpc(
                "get_daily_dashboard_data",
                {
                    start_date: "2026-08-01",
                    end_date: "2026-08-31"
                }
            );

            console.log("RPC DATA:", data);
            console.log("RPC ERROR:", error);

            if (error) {
                console.error("RPC Error:", error);
                return;
            }

            console.log("Dashboard data:", data);
        };

        fetchData();
    }, []);
  return (
    <>

        <div className='w-full h-screen bg-[#F2F2F2] flex'>
            <Sidebar active={'datareports'}/>
            

            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }} 
                className='flex-1 lg:p-10 px-8 py-10 overflow-y-scroll scrollbar-thin scrollbar-thumb-[#B9B9B9] scrollbar-track-[#E2E2E2]'>

                <SidebarMobile active={'datareports'}/>

                <div className='flex flex-col gap-5'>
                    <h1 className='md:text-4xl text-2xl font-akagi font-bold tracking-wide text-blue'>Data Reports</h1>
                    
                    <div className='flex flex-row justify-between gap-3 items-center'>

                        <div className='flex flex-row gap-3'>
                            <h1 className='font-akagi font-medium text-gray'>Sales</h1>
                        </div>

                        <Calendar 
                            value={dates} 
                            onChange={(e) => setDates(e.value)} 
                            selectionMode="range" 
                            readOnlyInput 
                            hideOnRangeSelection 
                            placeholder="Select date range" 
                            showOtherMonths
                            selectOtherMonths
                            className="w-fit" 
                            appendTo={document.body} 
                            inputClassName="w-fit rounded-xl bg-[#D9D9D9] cursor-pointer font-akagi font-bold text-[#505050] border border-[#D9D9D9] md:px-4 md:py-2 px-2 py-2 focus:outline-none" 
                            pt={{ 
                                panel: 
                                { 
                                    className: "mt-2 rounded-2xl border border-[#E2E2E2] bg-white p-6 shadow-xl" 
                                }, 
                                header: 
                                { 
                                    className: "flex items-center justify-between border-none bg-transparent pb-4" 
                                }, 
                                title: 
                                { 
                                    className: "font-akagi text-lg font-bold text-blue w-full text-center" 
                                }, 
                                previousButton: 
                                { 
                                    className: "h-9 w-9 rounded-full text-[#505050] transition hover:bg-[#F0F0F0] flex items-center justify-center" 
                                }, 
                                nextButton: 
                                { 
                                    className: "h-9 w-9 rounded-full text-[#505050] transition hover:bg-[#F0F0F0] flex items-center justify-center" 
                                }, 
                                table: 
                                {
                                    className: "w-full font-akagi text-[#505050] cursor-pointer border-separate border-spacing-y-2 border-spacing-x-4 text-center"
                                }
                            }} 
                        />
                    </div>

                    <div className='bg-[#ffffff] w-full rounded-xl p-5'>
                        <h1 className='md:text-xl text-lg font-akagi font-bold tracking-wide text-gray'>Rentals for</h1>
                    </div>
                    
                </div>
            </motion.div>
        </div>
    </>
  )
}

export default DataReports
