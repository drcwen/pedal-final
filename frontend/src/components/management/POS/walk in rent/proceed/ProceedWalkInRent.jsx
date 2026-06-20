import { supabase } from "../../../../../lib/supabase"
import { useEffect, useState } from "react";
import OrderRow from "./OrderRow"

function ProceedWalkInRent({onClose}) {

    const [selectedItems, setSelectedItems] = useState({});
    const [confirmProceed, setConfirmProceed] = useState(false);
    const [confirmBack, setConfirmBack] = useState(false);

    const orders = [
        { id: 1, quantity: 2, model: "Solo Kiddie Bike", price: 120 },
        { id: 2, quantity: 1, model: "Mountain Bike", price: 200 },
        { id: 3, quantity: 1, model: "Road Bike", price: 180 },
        { id: 3, quantity: 1, model: "Road Bike", price: 180 },
    ];

    useEffect(() => {
    console.log("Selected Items:", selectedItems);
    }, [selectedItems]);

  return (
    <>
        <div className='xl:px-70 lg:px-30 md:px-10 py-10 fixed inset-0 bg-black/60 flex items-center justify-center'>
            <div className='bg-[#ffffff] w-full h-full overflow-y-scroll scrollbar-thin scrollbar-thumb-[#B9B9B9] scrollbar-track-[#E2E2E2] rounded-xl p-10 flex flex-col gap-8 '>

                <div className='flex flex-col gap-6'>
                    <h1 className='text-3xl font-akagi font-bold text-navyblue'>Walk-in Rent</h1>

                    <div className='flex flex-col gap-2'>
                        <div className='grid lg:grid-cols-[150px_1fr] grid-cols-[90px_1fr] items-center'>
                            <h1 className='md:text-md text-sm font-akagi font-bold text-[#6D7172]'>First Name:</h1>
                            <div className='bg-[#D9D9D9] rounded-lg px-3 py-1 flex items-center'>
                                <input className='w-full md:text-md text-sm font-akagi font-bold text-[#6D7172]'></input>
                            </div>
                        </div>

                        <div className='grid lg:grid-cols-[150px_1fr] grid-cols-[90px_1fr] items-center'>
                            <h1 className='md:text-md text-sm font-akagi font-bold text-[#6D7172]'>Last Name:</h1>
                            <div className='bg-[#D9D9D9] rounded-lg px-3 py-1 flex items-center'>
                                <input className='w-full md:text-md text-sm font-akagi font-bold text-[#6D7172]'></input>
                            </div>
                            
                        </div>

                        <div className='grid lg:grid-cols-[150px_1fr] grid-cols-[90px_1fr] items-center'>
                            <h1 className='md:text-md text-sm font-akagi font-bold text-[#6D7172]'>ID Type:</h1>
                            <div className='bg-[#D9D9D9] rounded-lg px-3 py-1 flex items-center'>
                                <input className='w-full md:text-md text-sm font-akagi font-bold text-[#6D7172]'></input>
                            </div>
                        </div>

                    </div>
                </div>

                <div className='w-full px-10'>
                    <div className='grid grid-cols-[100px_1fr_1fr_1fr_120px] text-center items-center gap-2'>
                        <div className='text-md font-akagi font-bold text-[#6D7172]'>Qty</div>
                        <div className='text-md font-akagi font-bold text-[#6D7172]'>Model</div>
                        <div className='text-md font-akagi font-bold text-[#6D7172]'>Bike ID</div>
                        <div className='text-md font-akagi font-bold text-[#6D7172]'>GPS ID</div>
                        <div className='text-md font-akagi font-bold text-[#6D7172]'>Amount</div>

                        {orders.map((order) => (
                            <OrderRow
                                key={order.id}
                                quantity={order.quantity}
                                model={order.model}
                                price={order.price}
                                selectedBikeId={selectedItems[order.id]?.bikeId || ""}
                                selectedGpsId={selectedItems[order.id]?.gpsId || ""}
                                onBikeChange={(bikeId) =>
                                setSelectedItems((prev) => ({
                                    ...prev,
                                    [order.id]: {
                                    ...prev[order.id],
                                    bikeId,
                                    },
                                }))
                                }
                                onGpsChange={(gpsId) =>
                                setSelectedItems((prev) => ({
                                    ...prev,
                                    [order.id]: {
                                    ...prev[order.id],
                                    gpsId,
                                    },
                                }))
                                }
                            />
                            ))}

                    </div>
                </div>

                <div className='h-0.5 w-full rounded-lg bg-black/30'/>

                <div className='flex flex-col gap-3 px-30 '>
                    <div className='flex flex-row justify-between items-center'>
                        <h1 className='text-lg font-bold font-akagi text-[#6D7172]'>Total</h1>
                        <h1 className='text-xl font-bold font-akagi text-[#6D7172]'>P240</h1>
                    </div>

                    <div className='flex flex-row justify-between items-center'>
                        <h1 className='lg:text-lg font-bold font-akagi text-[#6D7172]'>Amount Tendered</h1>
                        <h1 className='lg:text-lg font-medium font-akagi text-[#6D7172]'>P240</h1>
                    </div>

                    <div className='flex flex-row justify-between items-center'>
                        <h1 className='lg:text-lg font-bold font-akagi text-[#6D7172]'>Change</h1>
                        <h1 className='lg:text-lg font-medium font-akagi text-[#6D7172]'>P240</h1>
                    </div>

                    <div className='flex flex-row justify-between items-center'>
                        <h1 className='lg:text-lg font-bold font-akagi text-[#6D7172]'>Payment Method</h1>
                        <h1 className='lg:text-lg font-medium font-akagi text-[#6D7172]'>GCash</h1>
                    </div>

                    <div className='flex flex-row justify-between items-center pl-10'>
                        <h1 className='lg:text-lg font-medium font-akagi text-[#6D7172]'>Reference No:</h1>
                        <input className='rounded-lg px-2 py-1 border border-[#c4c6c7] text-xl font-medium font-akagi text-[#6D7172]'/>
                    </div>
                </div>

                <div className='flex flex-row justify-between px-10'>
                    <div 
                        onClick={() => {setConfirmBack(true)}}
                        className='bg-red-500 rounded-xl px-7 py-2 cursor-pointer'>
                        <h1 className='text-lg font-akagi font-bold text-[#ffffff]'>Back</h1>
                    </div>

                    <div 
                        onClick={() => {setConfirmProceed(true)}}
                        className='bg-green-500 rounded-xl px-7 py-2 cursor-pointer'>
                        <h1 className='text-lg font-akagi font-bold text-[#ffffff]'>Proceed</h1>
                    </div>
                </div>

                {confirmBack && 
                    <div
                        onClick={() => {setConfirmBack(false)}} 
                        className='fixed inset-0 bg-black/60 flex items-center justify-center'>
                        <div className='bg-white'>
                            <h1>Back</h1>
                        </div>
                    </div>
                }

                {confirmProceed && 
                    <div
                        className='fixed inset-0 bg-black/60 flex items-center justify-center'
                    >
                        <div className='p-5 pt-10 px-10 bg-white rounded-xl flex flex-col gap-10'>

                            <h1 className='text-xl font-akagi font-bold text-darkblue'>Are you sure you want to proceed?</h1>

                            <div className='flex flex-row justify-between'>
                                <div
                                    onClick={() => {setConfirmProceed(false)}}   
                                    className='bg-red-500 rounded-xl px-7 py-2 cursor-pointer'>
                                    <h1 className='text-lg font-akagi font-bold text-[#ffffff]'>No</h1>
                                </div>

                                <div
                                    onClick={() => {setConfirmProceed(false)}}   
                                    className='bg-green-500 rounded-xl px-7 py-2 cursor-pointer'>
                                    <h1 className='text-lg font-akagi font-bold text-[#ffffff]'>Yes</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                }

                {confirmBack && 
                    <div
                        className='fixed inset-0 bg-black/60 flex items-center justify-center'
                    >
                        <div className='p-5 pt-10 px-10 bg-white rounded-xl flex flex-col gap-10'>

                            <h1 className='text-xl font-akagi font-bold text-darkblue'>Are you sure you want to exit?</h1>

                            <div className='flex flex-row justify-between'>
                                <div
                                    onClick={() => {setConfirmBack(false)}}   
                                    className='bg-red-500 rounded-xl px-7 py-2 cursor-pointer'>
                                    <h1 className='text-lg font-akagi font-bold text-[#ffffff]'>No</h1>
                                </div>

                                <div
                                    onClick={() => {
                                        setConfirmBack(false)
                                        onClose();
                                    }}   
                                    className='bg-green-500 rounded-xl px-7 py-2 cursor-pointer'>
                                    <h1 className='text-lg font-akagi font-bold text-[#ffffff]'>Yes</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                    }
            </div>
        </div>
        
    </>
  )
}

export default ProceedWalkInRent
