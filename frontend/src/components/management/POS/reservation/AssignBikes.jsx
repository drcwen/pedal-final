import { useEffect, useState } from "react";
import OrderRow from "./OrderRow"
import { supabase } from "../../../../lib/supabase"

function AssignBikes({onClose, fullName, bikeDetails, transaction}) {

    const [selectedItems, setSelectedItems] = useState({});
    const [confirmProceed, setConfirmProceed] = useState(false);
    const [confirmBack, setConfirmBack] = useState(false);

    useEffect(() => {
        console.log("Selected Items:", selectedItems);
    }, [selectedItems]);

    const assignBikes = async () => {
        for (const [orderId, selection] of Object.entries(selectedItems)) {
            const {error} = await supabase
                .from("orders_mod")
                .update({
                    bike_id: selection.bikeId,
                    gps_id: selection.gpsId,
                })
                .eq("id", orderId);

            if(error) {
                console.log(error);
            }
        }
    }

  return (
    <>
        <div className='xl:px-70 lg:px-30 md:px-10 py-10 px-5 fixed inset-0 bg-black/60 flex items-center justify-center'>
            <div className='bg-[#ffffff] w-full h-full overflow-y-scroll scrollbar-thin scrollbar-thumb-[#B9B9B9] scrollbar-track-[#E2E2E2] rounded-xl md:p-10 p-5 py-10 flex flex-col gap-8 '>

                <div className='flex flex-col gap-6'>
                    <h1 className='text-3xl font-akagi font-bold text-navyblue'>Assign Bikes</h1>

                    <div className='flex flex-col gap-2'>
                        <div className='grid lg:grid-cols-[150px_1fr] grid-cols-[90px_1fr] items-center'>
                            <h1 className='md:text-md text-sm font-akagi font-bold text-[#6D7172]'>Full Name:</h1>
                            <div className='bg-[#D9D9D9] rounded-lg px-3 py-1 flex items-center'>
                                <h1 className='w-full md:text-md text-sm font-akagi font-bold text-[#6D7172]'>{fullName}</h1>
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

                <div className='w-full md:px-10 flex flex-col gap-5'>
                    <div className='md:grid md:grid-cols-[100px_1fr_1fr_1fr_120px] md:text-center md:items-center gap-2 px-3'>
                        <div className='hidden md:block text-md font-akagi font-bold text-[#6D7172]'>Model</div>
                        <div className='hidden md:block text-md font-akagi font-bold text-[#6D7172]'>Duration</div>
                        <div className='hidden md:block text-md font-akagi font-bold text-[#6D7172]'>Bike ID</div>
                        <div className='hidden md:block text-md font-akagi font-bold text-[#6D7172]'>GPS ID</div>
                        <div className='hidden md:block text-md font-akagi font-bold text-[#6D7172]'>Amount</div>
                    
                    </div>

                    <div className='flex flex-col gap-3'>
                        {bikeDetails.map((order) => (
                            <OrderRow
                                key={order.id}
                                duration={order.duration_hours}
                                model={order.bike_types_mod.name}
                                price={"P" + order.bike_types_mod.price * order.duration_hours}
                                image={order.bike_types_mod.image_url}
                                selectedBikeId={selectedItems[order.id]?.bikeId}
                                selectedGpsId={selectedItems[order.id]?.gpsId}
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

                <div className='flex flex-col gap-3 md:px-30 '>
                    <div className='flex flex-row justify-between items-center'>
                        <h1 className='text-lg font-bold font-akagi text-[#6D7172]'>Total</h1>
                        <h1 className='text-xl font-bold font-akagi text-[#6D7172]'>{"P" + transaction.total_amount}</h1>
                    </div>

                    <div className='flex flex-row justify-between items-center'>
                        <h1 className='lg:text-lg font-bold font-akagi text-[#6D7172]'>Amount Tendered</h1>
                        <h1 className='lg:text-lg font-medium font-akagi text-[#6D7172]'>{"P" + transaction.amount_paid}</h1>
                    </div>

                    <div className={`${transaction.change_amount === null ? "hidden" : "block"} flex flex-row justify-between items-center`}>
                        <h1 className='lg:text-lg font-bold font-akagi text-[#6D7172]'>Change</h1>
                        <h1 className='lg:text-lg font-medium font-akagi text-[#6D7172]'>{transaction.change_amount === null ? "-" : transaction.change_amount}</h1>
                    </div>

                    <div className='flex flex-row justify-between items-center'>
                        <h1 className='lg:text-lg font-bold font-akagi text-[#6D7172]'>Payment Method</h1>
                        <h1 className='lg:text-lg font-medium font-akagi text-[#6D7172]'>{transaction.payment_method}</h1>
                    </div>

                    <div className='flex flex-row justify-between items-center md:pl-10'>
                        <h1 className='lg:text-lg font-medium font-akagi text-[#6D7172]'>Reference No:</h1>
                        <h1 className='lg:text-lg font-medium font-akagi text-[#6D7172]'>{transaction.reference_number}</h1>
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

export default AssignBikes
