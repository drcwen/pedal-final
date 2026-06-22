import { supabase } from "../../../lib/supabase"
import Sidebar from "../sidebar/Sidebar"
import SidebarMobile from "../sidebar/SidebarMobile"
import { useState, useEffect } from "react";
import TransactionRow from "./TransactionRow"


function TransactionHistory() {

  return (
    <>

        <div className='w-full h-screen bg-[#F2F2F2] flex'>
            <Sidebar active={'history'}/>
            <SidebarMobile active={'history'}/>

            <div className='flex-1 p-5'>
                <div className='flex flex-col bg-[#ffffff] w-full h-full rounded-xl p-10 gap-5'>

                    <h1 className='text-4xl font-akagi font-bold tracking-wide text-blue'>Transaction History</h1>

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
