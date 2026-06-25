import Sidebar from "../sidebar/Sidebar"
import SidebarMobile from "../sidebar/SidebarMobile"
import { useState } from "react";
import TransactionRow from "./TransactionRow"
import { Calendar } from 'primereact/calendar';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { motion } from "motion/react"

function TransactionHistory() {

    const [dates, setDates] = useState();

  return (
    <>

        <div className='w-full h-screen md:bg-[#F2F2F2] flex'>
            <Sidebar active={'history'}/>
            <SidebarMobile active={'history'}/>

            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}  
                className='flex-1 p-5'>
                <div className='flex flex-col bg-[#ffffff] w-full h-full rounded-xl md:p-10 px-3 py-7 gap-5 overflow-y-scroll scrollbar-thin scrollbar-thumb-[#B9B9B9] scrollbar-track-[#E2E2E2]'>

                    <h1 className='md:text-4xl text-2xl font-akagi font-bold tracking-wide text-blue'>Transaction History</h1>

                    <div className='flex md:flex-row flex-col justify-between md:items-center py-3 gap-3'>
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
                            inputClassName="w-fit rounded-xl bg-[#D9D9D9] cursor-pointer font-akagi font-bold text-[#505050] border border-[#D9D9D9] md:px-4 md:py-3 px-2 py-2 focus:outline-none" 
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

                        <div className='pr-10'>
                            <input 
                                placeholder='Search'
                                className='bg-[#DBDBDB] focus:outline-none rounded-xl px-2 py-2 font-akagi font-bold text-[#505050]'/>
                            
                        </div>
                    </div>

                    <div className='flex-1 md:pr-7 pr-2 flex flex-col gap-3'>

                        <div className='flex flex-col gap-2'>

                            <div className='hidden md:grid md:grid-cols-[40px_1fr_1fr_1fr_1fr_1fr_20px] items-center text-center p-2'>
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

            </motion.div>
        </div>
    </>
  )
}

export default TransactionHistory
