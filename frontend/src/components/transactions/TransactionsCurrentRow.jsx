import { FaArrowRight } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { useState, useEffect } from 'react';
import { IoCloseSharp } from "react-icons/io5";
import { IoReceiptSharp } from "react-icons/io5";
import Receipt from "../management/transaction history/Receipt"
import { printReceipt } from "../management/transaction history/printReceipt"

function TransactionCurrentRow({ bikeCount, date, method, total, status, transactions, startedBikes }) {

    const [openReceipt, setOpenReceipt] = useState(false);
    console.log(startedBikes)

    function formatTime(time) {
        const [hours, minutes] = time.split(":");

        const date = new Date();
        date.setHours(hours, minutes);

        return date.toLocaleTimeString("en-PH", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        });
    }

    function getReservationDatePH(range) {
        if (!range) return null;

        const match = range.match(/^\["([^"]+)/);
        if (!match) return null;

        const startDate = new Date(
            match[1]
                .replace(" ", "T")
                .replace("+00", "Z")
        );

        return startDate.toLocaleDateString("en-US", {
            timeZone: "Asia/Manila",
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
        });
    }

    function getEndTimePH(range) {
        if (!range) return null;

        const match = range.match(/,"([^"]+)"\)/);

        if (!match) return null;

        const endDate = new Date(
            match[1]
                .replace(" ", "T")
                .replace("+00", "Z")
        );

        return endDate.toLocaleTimeString("en-US", {
            timeZone: "Asia/Manila",
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        });
    }
    const [showTransaction, setShowTransaction] = useState(false);
    return (
        <>
        <div
            onClick={() => {setShowTransaction(!showTransaction)}}
            className='rounded-xl p-2 flex flex-col lg:gap-7 gap-4 cursor-pointer'>
            <div className='hidden lg:grid lg:grid-cols-6 justify-between items-center'>
                <div className='w-fit rounded-lg px-4 py-2 bg-yellow'>
                    <h1 className='text-xl font-akagi font-black text-navyblue'>{bikeCount}</h1>
                </div>

                    <div className='flex justify-center'>
                        <h1 className='text-xl font-akagi font-bold text-[#6D7172]'>{date}</h1>
                    </div>

                <div className='flex justify-center'>
                    <h1 className='text-xl font-akagi font-bold text-[#6D7172]'>{method}</h1>
                </div>

                <div className='flex justify-center'>
                    <h1 className='text-xl font-akagi font-bold text-[#6D7172]'>{total}</h1>
                </div>

                <div className='flex justify-center rounded-lg'>
                    
                    <div className='rounded-lg py-1 px-3 bg-yellow'>
                        <h1 className='text-md font-akagi font-bold text-navyblue'>{status}</h1>
                    </div>
                </div>

                <div className='flex justify-end'>
                    <FaArrowRight className='text-2xl text-[#6D7172]'/>
                </div>
            </div>

            <div className='lg:hidden grid grid-cols-4 justify-between items-center'>
                <div className='w-fit rounded-lg px-3 py-1 bg-yellow'>
                    <h1 className='text-lg font-akagi font-black text-navyblue'>{bikeCount}</h1>
                </div>

                <div className=''>
                    <div className='flex justify-center'>
                        <h1 className='text-md font-akagi font-bold text-[#6D7172]'>{date}</h1>
                    </div>
                </div>

                <div className='flex justify-center'>
                    <h1 className='text-md font-akagi font-bold text-[#6D7172]'>{method}</h1>
                </div>

                <div className='flex justify-end'>
                    <FaArrowRight className='text-lg text-[#6D7172]'/>
                </div>

            </div>

            <div className='h-0.5 w-full bg-black/10 rounded-lg'/>

        </div>

        {showTransaction && 
            <div className='fixed inset-0 bg-black/50 flex justify-center items-center z-100 p-5'>
                <div className="
                        bg-[#ffffff]
                        py-5
                        p-5 md:p-10
                        rounded-2xl
                        w-full
                        max-w-2xl
                        max-h-[90vh]
                        overflow-y-auto
                        scrollbar-none
                        scrollbar-thumb-[#B9B9B9]
                        scrollbar-track-[#E2E2E2] flex flex-col gap-5
                        font-akagi
                        font-bold
                        text-gray
                    "
                >
                    <div className='flex justify-between'>
                        <h1 className='text-xl'>Transaction Information</h1>
                        <IoCloseSharp 
                            onClick={() => {setShowTransaction(!showTransaction)}}
                            className='text-xl cursor-pointer'/>
                    </div>

                    <div className='flex flex-col gap-2'>
                        <div className='grid grid-cols-[120px_1fr]'>
                            <h1>Payment Date:</h1>
                            <h1>{date}</h1>
                        </div>
                        <div className='grid grid-cols-[120px_1fr]'>
                            <h1>Status:</h1>
                            <h1>{status}</h1>
                        </div>

                    </div>

                    <div className='grid grid-cols-1 lg:grid-cols-2 lg:gap-4 gap-2'>
                        {transactions?.orders_mod?.map((orders) => (
                            
                            <div className='w-full flex flex-col gap-4  rounded-lg border border-gray/30 bg-gray/20 p-3'>
                                <div className='flex flex-row gap-3 items-center'>
                                    <img src={orders?.bike_types_mod?.image_url} className='w-10 bg-yellow rounded-lg p-1'/>
                                    <h1 className='text-sm'>{orders?.bike_types_mod?.name}</h1>
                                </div>

                                <div className='w-full grid grid-cols-3 gap-2'>

                                    <div className='flex flex-col'>
                                        <h1 className='text-sm font-akagi font-bold text-gray'>BIKE ID</h1>
                                        <h1 className='text-sm font-akagi font-medium text-gray'>{orders?.bikes_mod?.code ?? "WAITING"}</h1>
                                    </div>

                                    <div className='flex flex-col'>
                                        <h1 className='text-sm font-akagi font-bold text-gray'>GPS ID</h1>
                                        <h1 className='text-sm font-akagi font-medium text-gray'>{orders?.gps_mod?.code ?? "WAITING"}</h1>
                                    </div>

                                    <div className='flex flex-col'>
                                        <h1 className='text-sm font-akagi font-bold text-gray'>DURATION</h1>
                                        <h1 className='text-sm font-akagi font-medium text-gray'>{orders?.duration_hours === 1 ? orders?.duration_hours + " hour" : orders?.duration_hours + " hours"}</h1>
                                    </div>

                                    <div className='flex flex-col'>
                                        <h1 className='text-sm font-akagi font-bold text-gray'>DATE</h1>
                                        <h1 className='text-sm font-akagi font-medium text-gray'>{getReservationDatePH(orders?.reservation_range)}</h1>
                                    </div>

                                    <div className='flex flex-col'>
                                        <h1 className='text-sm font-akagi font-bold text-gray'>START</h1>
                                        <h1 className='text-sm font-akagi font-medium text-gray'>{formatTime(orders?.start_time)}</h1>
                                    </div>

                                    <div className='flex flex-col'>
                                        <h1 className='text-sm font-akagi font-bold text-gray'>END</h1>
                                        <h1 className='text-sm font-akagi font-medium text-gray'>{getEndTimePH(orders?.reservation_range)}</h1>
                                    </div>
                                    
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className='flex justify-end'>
                        <div 
                            onClick={() => setOpenReceipt(!openReceipt)}
                            className='bg-blue px-2 py-1 rounded-lg flex gap-2 items-center text-[#ffffff] text-sm'>
                            <IoReceiptSharp className='text-md'/>
                            Receipt
                        </div>
                    </div>

                    {openReceipt &&
                        <Receipt 
                            setReceipt={() => {setOpenReceipt(!openReceipt)}}
                            startedBikes={startedBikes}
                            transaction={transactions}
                            maintenanceData={null}
                            fullName={null}
                            extensionsData={null}
                            changeBikesData={null}
                        />
                    }
                </div>
            </div>
        }
        </>
    );
}

export default TransactionCurrentRow;