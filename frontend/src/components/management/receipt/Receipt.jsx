
import { IoIosArrowBack } from "react-icons/io";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "motion/react"

function Receipt({setReceipt}) {

    return (
    <>

        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-100 p-5">
            <div className="
                bg-[#ffffff]
                p-5 md:p-10
                rounded-xl
                w-full
                max-w-2xl
                max-h-[90vh]
                overflow-y-auto
                scrollbar-thin
                scrollbar-thumb-[#B9B9B9]
                scrollbar-track-[#E2E2E2] flex flex-col gap-5
            ">
                <div className='w-full flex flex-col gap-5 bg-gray/10 border border-gray/30 p-2 py-10 rounded-lg'>
                    <div className='flex flex-col items-center justify-center font-akagi font-bold text-gray'>
                        <h1 className='text-lg text-blue'>3Jremy's Rent A Bike!</h1>
                        <h1 className='font-medium text-sm'>La Mesa Eco Park, Quezon City</h1>
                    </div>

                    <div className='font-akagi font-medium text-gray text-sm md:text-md lg:px-10 px-2'>
                        

                        {/*Receipt No*/}
                        <div className='flex flex-row justify-between'>
                            <h1>Receipt No:</h1>
                            <h1>#405</h1>
                        </div>

                        {/*Date and Time*/}
                        <div className='flex flex-col py-2'>
                            <div className='flex flex-row justify-between'>
                                <h1>Transaction Date:</h1>
                                <h1>Sep 13, 2026</h1>
                            </div>

                            <div className='flex flex-row justify-between'>
                                <h1>Transaction Time:</h1>
                                <h1>10:00 AM</h1>
                            </div>
                        </div>

                        {/*Type*/}
                        <div className='flex flex-row justify-between'>
                            <h1>Type:</h1>
                            <h1>Walk-in</h1>
                        </div>

                        <div className='flex flex-col py-5'>
                            <div className='w-full bg-gray/40 h-0.5 rounded-xl'></div>
                        </div>

                        {/*Orders*/}
                        <div className='flex flex-row justify-between py-2 items-center'>
                            <div className='flex flex-col'>
                                <div className='flex flex-row gap-2'>
                                    <h1>Mountain Bike</h1>
                                    <h1>x2</h1>
                                </div>

                                <h1>Sep 22, 2054</h1>
                                <h1>10:00 AM</h1>
                            </div>

                            <h1>P500</h1>
                        </div>

                        <div className='flex flex-row justify-between py-2 items-center'>
                            <div className='flex flex-col'>
                                <div className='flex flex-row gap-2'>
                                    <h1>Mountain Bike</h1>
                                    <h1>x2</h1>
                                </div>

                                <h1>Sep 22, 2054</h1>
                                <h1>10:00 AM</h1>
                            </div>

                            <h1>P500</h1>
                        </div>

                        <div className='flex flex-col py-5'>
                            <div className='w-full bg-gray/40 h-0.5 rounded-xl'></div>
                        </div>

                        <div className='flex flex-row justify-between'>
                            <h1>Total:</h1>
                            <h1>P600</h1>
                        </div>

                        <div className='flex flex-row justify-between'>
                            <h1>Tendered Amount:</h1>
                            <h1>P600</h1>
                        </div>

                        <div className='flex flex-row justify-between'>
                            <h1>Change:</h1>
                            <h1>P600</h1>
                        </div>

                        <div className='flex flex-row justify-between'>
                            <h1>Method:</h1>
                            <h1>Cash</h1>
                        </div>

                        <div className='flex flex-row justify-between'>
                            <h1>Assisted by:</h1>
                            <h1>Hazel Bisnar</h1>
                        </div>
                    </div>
                </div>

                <div className='flex justify-between'>
                    <div 
                        onClick={() => setReceipt(false)}
                        className='flex gap-2 border border-gray text-gray px-2 py-1 rounded-lg font-akagi font-semibold cursor-pointer text-sm'>
                            Close
                    </div>

                    <div 
                        className='flex gap-2 bg-blue text-[#ffffff] px-2 py-1 rounded-lg font-akagi font-semibold cursor-pointer text-sm'>
                            Print
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default Receipt
