import { supabase } from "../../../lib/supabase"
import Sidebar from "../sidebar/Sidebar"
import SidebarMobile from "../sidebar/SidebarMobile"
import { useState, useEffect } from "react";
import TransactionRow from "./TransactionRow"
import { Calendar } from 'primereact/calendar';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { FaCalendarAlt } from "react-icons/fa";

function TransactionHistory() {

    const [dates, setDates] = useState();

  return (
    <>

        <div className='w-full h-screen bg-[#F2F2F2] flex'>
            <Sidebar active={'history'}/>
            <SidebarMobile active={'history'}/>

            <div className='flex-1 p-5'>
                <div className='flex flex-col bg-[#ffffff] w-full h-full rounded-xl p-10 gap-5'>

                    <h1 className='text-4xl font-akagi font-bold tracking-wide text-blue'>Transaction History</h1>

                    <div className='flex flex-col justify-between'>
                        <Calendar 
                        value={dates} 
                        onChange={(e) => setDates(e.value)} 
                        selectionMode="range" 
                        readOnlyInput 
                        hideOnRangeSelection 
                        placeholder="Select date range" 
                        showOtherMonths
                        selectOtherMonths
                        className="w-full" 
                        appendTo={document.body} 
                        inputClassName="w-full rounded-xl bg-[#D9D9D9] cursor-pointer font-akagi font-bold text-[#505050] border border-[#D9D9D9] px-4 py-3 focus:outline-none" 
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
                                className: "w-full cursor-pointer border-separate border-spacing-y-2 border-spacing-x-4 text-center"
                            } 
                            }} 
                            />
                    </div>

                    <div className='flex-1 overflow-y-scroll scrollbar-thin scrollbar-thumb-[#B9B9B9] scrollbar-track-[#E2E2E2] pr-7 flex flex-col gap-3'>

                        <div className='flex flex-col gap-2'>

                            <div className='grid grid-cols-[40px_1fr_1fr_1fr_1fr_1fr_20px] items-center text-center p-2'>
                                <div className=''></div>
                                <div className='flex justify-center font-akagi font-medium text-[#9E9E9E]'>
                                    ID
                                </div>

                                <div className='flex justify-center font-akagi font-medium text-[#9E9E9E]'>
                                    Name
                                </div>

                                <div className='flex justify-center font-akagi font-medium text-[#9E9E9E]'>
                                    Type
                                </div>

                                <div className='flex justify-center font-akagi font-medium text-[#9E9E9E]'>
                                    Time Added
                                </div>

                                <div className='flex justify-center font-akagi font-medium text-[#9E9E9E]'>
                                    Status
                                </div>
                            </div>
                            
                            <TransactionRow />
                            <TransactionRow />
                            <TransactionRow />
                            <TransactionRow />
                            <TransactionRow />
                            <TransactionRow />
                            <TransactionRow />
                            <TransactionRow />
                            <TransactionRow />
                            <TransactionRow />
                            <TransactionRow />
                            <TransactionRow />
                            <TransactionRow />
                            <TransactionRow />
                            <TransactionRow />
                            <TransactionRow />
                            <TransactionRow />
                            <TransactionRow />
                            <TransactionRow />
                            <TransactionRow />
                        </div>
                        
                        
                    </div>

                </div>

            </div>
        </div>
    </>
  )
}

export default TransactionHistory
