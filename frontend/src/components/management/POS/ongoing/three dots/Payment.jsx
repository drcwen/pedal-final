import { useState, useEffect } from 'react';
import {supabase } from "../../../../../lib/supabase"
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

function Payment({total, setPayment, bikeId, bikeType, orderId, extensionClicked, updatedTime, bikeCode, bikeTypeId}) {

    const [active, setActive] = useState("Cash");
    const [cashAmount, setCashAmount] = useState(null);

    const [assisted, setAssisted] = useState();

    const [confirm, setConfirm] = useState(false);

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setCashAmount(e.target.value);

        if (!isNaN(value)) {
            setCashAmount(value);
        }
    };

    const [referenceNo, setReferenceNo] = useState(null);

    const [gcashStatus, setGcashStatus] = useState("waiting");

    const simulatePayment = () => {
        const random = Math.floor(100000 + Math.random() * 900000);
        const reference = `GC-${random}`;

        setCashAmount(total);
        setReferenceNo(reference);

        setGcashStatus("processing");

        setTimeout(() => {
            setGcashStatus("success");
        }, 2000);
    };

    async function handleSubmit() {

        setLoading(true);

        try {

            const { data: transaction, error: transactionError } = await supabase
                .from("transactions_mod")
                .insert({
                    payment_method: active,
                    total_amount: total,
                    amount_paid: cashAmount,
                    change_amount: cashAmount - total,
                    type: "extend",
                    status: "completed",
                    reference_number: referenceNo,
                    assisted_by: assisted,
                })
                .select("id")
                .single();

            if (transactionError) {
                console.error(transactionError);
                return;
            }

            const transactionId = transaction.id

            const { error: orderError } = await supabase
                .from("extensions_mod")
                .insert({
                    order_id: orderId,
                    extension_duration: extensionClicked,
                    transaction_id: transactionId,
                    new_reservation_range: updatedTime,
                    bikes_id: bikeId,
                    bikes_type_id: bikeTypeId
                });

            if (orderError) {
                console.error(orderError);
                return;
            }

            const { error } = await supabase
                .from("orders_mod")
                .update({
                    reservation_range: updatedTime
                })
                .eq("id", orderId)
            if(error){
                console.log(error);
            }

        } catch(error) {
            console.error(error);
        } finally {
            setLoading(false);
            //window.location.reload();
        }

    }

    console.log(bikeId)
    console.log(bikeTypeId)

    useEffect(() => {

        const getCurrentUser = async () => {
            const { data, error } = await supabase.auth.getUser();

            const user = data.user;

            setAssisted(user.id);
        }
        getCurrentUser();

    },[]);

  return (
    <>
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 sm:px-10 px-5 md:px-20 lg:px-60 xl:px-100">
            <div className="w-full bg-[#F0F0F0] p-6 rounded-xl font-akagi font-bold text-lg text-gray flex flex-col gap-5">
                <h1 className='text-3xl text-navyblue'>Payment</h1>

                <div className='border-2 border-blue rounded-xl w-fit'>
                    <div className='grid grid-cols-2'>
                        <div 
                            onClick={() => {setActive("Cash")}}
                            className={`${active === "Cash" ? "bg-blue text-[#ffffff]" : "text-blue"} rounded-tl-md rounded-bl-md text-center px-3 py-1 cursor-pointer`}>
                            Cash
                        </div>

                        <div 
                            onClick={() => {setActive("GCash")}}
                            className={`${active === "GCash" ? "bg-blue text-[#ffffff]" : "text-blue"} rounded-br-md rounded-tr-md text-center px-3 py-1 cursor-pointer`}>
                            GCash
                        </div>
                    </div>
                </div>

                <div className='flex flex-col gap-2'>
                    <div className='flex flex-row gap-2 items-center'>
                        <h1>Payment:</h1>
                        <h1 className='text-blue'>P{total}</h1>
                    </div>

                    <div className={`flex flex-row gap-2 items-center ${cashAmount === null || 0 ? "hidden" : undefined} ${active === "GCash" ? "hidden" : undefined}`}>
                        <h1>Change:</h1>
                        <h1 className={`text-blue`}>P{cashAmount === null || 0 ? undefined : cashAmount - total}</h1>
                    </div>
                </div>

                {active === "Cash" &&
                    <div className='w-full rounded-xl p-3 font-akagi font-bold text-gray text-xl'>
                        
                        <div className='pb-5'>
                            <input 
                                placeholder="Amount"
                                value={cashAmount}
                                onChange={handleChange}
                                className='bg-gray border-2 border-gray w-full text-[#ffffff] rounded-xl focus:outline-none px-3 py-2 font-bold'/>
                        </div>
                        
                        <div className='grid grid-cols-3 gap-3'>
                            
                            <div
                                onClick={150 < total ? undefined : () => setCashAmount(150)}
                                className={`
                                    rounded-lg p-3 border-2 border-gray text-center items-center justify-center
                                    ${cashAmount === 150 ? "bg-gray text-[#ffffff]" : "text-gray"}
                                    ${150 < total ? "pointer-events-none opacity-20" : "cursor-pointer"}
                                `}
                            >
                                150
                            </div>

                            <div
                                onClick={() => setCashAmount(200)}
                                className={`
                                    rounded-lg p-3 border-2 border-gray text-center items-center justify-center
                                    ${cashAmount === 200 ? "bg-gray text-[#ffffff]" : "text-gray"}
                                    ${200 < total ? "pointer-events-none opacity-20" : "cursor-pointer"}
                                `}
                            >
                                200
                            </div>

                            <div
                                onClick={250 < total ? undefined : () => setCashAmount(250)}
                                className={`
                                    rounded-lg p-3 border-2 border-gray text-center items-center justify-center
                                    ${cashAmount === 250 ? "bg-gray text-[#ffffff]" : "text-gray"}
                                    ${250 < total ? "pointer-events-none opacity-20" : "cursor-pointer"}
                                `}
                            >
                                250
                            </div>

                            <div
                                onClick={300 < total ? undefined : () => setCashAmount(300)}
                                className={`
                                    rounded-lg p-3 border-2 border-gray text-center items-center justify-center
                                    ${cashAmount === 300 ? "bg-gray text-[#ffffff]" : "text-gray"}
                                    ${300 < total ? "pointer-events-none opacity-20" : "cursor-pointer"}
                                `}
                            >
                                300
                            </div>

                            <div
                                onClick={350 < total ? undefined : () => setCashAmount(350)}
                                className={`
                                    rounded-lg p-3 border-2 border-gray text-center items-center justify-center
                                    ${cashAmount === 350 ? "bg-gray text-[#ffffff]" : "text-gray"}
                                    ${350 < total ? "pointer-events-none opacity-20" : "cursor-pointer"}
                                `}
                            >
                                350
                            </div>
                            
                            <div
                                onClick={450 < total ? undefined : () => setCashAmount(450)}
                                className={`
                                    rounded-lg p-3 border-2 border-gray text-center items-center justify-center
                                    ${cashAmount === 450 ? "bg-gray text-[#ffffff]" : "text-gray"}
                                    ${450 < total ? "pointer-events-none opacity-20" : "cursor-pointer"}
                                `}
                            >
                                450
                            </div>

                            <div
                                onClick={500 < total ? undefined : () => setCashAmount(500)}
                                className={`
                                    rounded-lg p-3 border-2 border-gray text-center items-center justify-center
                                    ${cashAmount === 500 ? "bg-gray text-[#ffffff]" : "text-gray"}
                                    ${500 < total ? "pointer-events-none opacity-20" : "cursor-pointer"}
                                `}
                            >
                                500
                            </div>

                            <div
                                onClick={1000 < total ? undefined : () => setCashAmount(1000)}
                                className={`
                                    rounded-lg p-3 border-2 border-gray text-center items-center justify-center
                                    ${cashAmount === 1000 ? "bg-gray text-[#ffffff]" : "text-gray"}
                                    ${1000 < total ? "pointer-events-none opacity-20" : "cursor-pointer"}
                                `}
                            >
                                1000
                            </div>

                            <div 
                                onClick={() => {setCashAmount(null)}}
                                className={`rounded-lg p-3 border-2 border-gray text-center items-center justify-center ${cashAmount === null ? `bg-gray text-[#ffffff]` : `text-gray   `}`}>
                                Custom
                            </div>

                        </div>

                    </div>
                                    
                }

                    {active === "GCash" && (
                        <div
                            onClick={(e) => {
                                // Close only when clicking the dark background
                                if (e.target === e.currentTarget) {
                                    setGcash(false);
                                    setGcashStatus("waiting");
                                }
                            }}
                            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
                        >
                            <div
                                className="bg-white rounded-2xl px-10 py-10 flex flex-col gap-5 items-center justify-center text-center"
                            >

                                {gcashStatus === "waiting" && (
                                    <>
                                        <h1 className="font-akagi font-bold text-[#505050] text-2xl">
                                            Pay with GCash
                                        </h1>

                                        <div className="flex flex-col gap-2">
                                            <h1 className="font-akagi font-bold text-[#505050] text-md">
                                                Scan the QR below using the GCash app
                                            </h1>
                                        </div>

                                        <div className="flex flex-col gap-5 items-center justify-center">

                                            {/* QR CODE */}
                                            <img
                                                onClick={simulatePayment}
                                                src="https://res.cloudinary.com/dp3vkgxtb/image/upload/v1779959866/qrcode_envfyr.png"
                                                className="w-52 h-52 cursor-pointer hover:scale-105 transition-all duration-300"
                                            />

                                            <div className="flex flex-col gap-1">
                                                <h1 className="font-akagi font-bold text-[#505050] text-md">
                                                    Amount to pay:
                                                </h1>

                                                <h1 className="font-akagi font-bold text-blue text-xl">
                                                    ₱{total}
                                                </h1>
                                            </div>

                                            <div className="flex flex-col gap-5">

                                                <h1 className="font-akagi font-light text-[#505050] text-md">
                                                    Waiting for payment...
                                                </h1>

                                                <div className="flex flex-col gap-4">

                                                    {/* DEMO BUTTON */}
                                                    <div
                                                        onClick={simulatePayment}
                                                        className="px-5 py-2 rounded-full bg-blue cursor-pointer hover:scale-105 transition-all duration-300"
                                                    >
                                                        <h1 className="font-akagi font-bold text-white text-md">
                                                            Pay
                                                        </h1>
                                                    </div>

                                                    <h1
                                                        onClick={() => {
                                                            setActive("Cash");
                                                            setGcashStatus("waiting");
                                                        }}
                                                        className="text-sm font-akagi text-black/30 hover:underline duration-300 cursor-pointer transition-all"
                                                    >
                                                        Cancel
                                                    </h1>

                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {gcashStatus === "processing" && (
                                    <div className="flex flex-col items-center gap-5 py-10">

                                        <div className="w-14 h-14 border-4 border-gray/20 border-t-blue rounded-full animate-spin"></div>

                                        <h1 className="font-akagi font-bold text-[#505050] text-2xl">
                                            Processing Payment
                                        </h1>

                                        <h1 className="font-akagi text-[#505050]/60 text-md">
                                            Verifying GCash payment...
                                        </h1>

                                        <h1 className="font-akagi font-bold text-blue text-xl">
                                            ₱{total}
                                        </h1>

                                    </div>
                                )}


                                {gcashStatus === "success" && (
                                    <div className="flex flex-col items-center gap-5 py-10">

                                        <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center">
                                            <h1 className="text-white text-3xl font-bold">
                                                ✓
                                            </h1>
                                        </div>

                                        <h1 className="font-akagi font-bold text-[#505050] text-2xl">
                                            Payment Successful
                                        </h1>

                                        <div className="flex flex-col gap-1">
                                            <h1 className="font-akagi font-bold text-[#505050] text-md">
                                                Amount Paid
                                            </h1>

                                            <h1 className="font-akagi font-bold text-blue text-2xl">
                                                ₱{total}
                                            </h1>
                                        </div>

                                        <h1 className="font-akagi text-[#505050]/60 text-sm">
                                            GCash payment has been verified.
                                        </h1>

                                        <div
                                            onClick={() => {
                                                setGcashStatus("waiting");
                                                setConfirm(true);
                                            }}
                                            className="px-8 py-3 rounded-full bg-blue cursor-pointer hover:scale-105 transition-all duration-300"
                                        >
                                            <h1 className="font-akagi font-bold text-white text-md">
                                                Continue
                                            </h1>
                                        </div>

                                    </div>
                                )}

                            </div>
                        </div>
                    )}

                <div className='flex flex-row justify-between'>
                    <div 
                        onClick={() => setPayment(false)}
                        className='rounded-lg px-2 py-1 border cursor-pointer '>
                        Close
                    </div>

                    <div 
                        onClick={() => {setConfirm(true)}}
                        className={`${cashAmount < total ? "pointer-events-none opacity-20" : undefined} rounded-lg px-2 py-1 cursor-pointer bg-blue text-[#ffffff]`}>
                        Continue
                    </div>
                </div>

                {confirm === true &&
                    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 sm:px-10 px-5 md:px-20 lg:px-60 xl:px-100">
                        <div className='w-120 bg-[#ffffff] p-5 rounded-lg flex flex-col'>
                            <h1 className='text-2xl text-blue'>Confirm Payment</h1>

                            <div className='py-5 px-5 flex flex-col'>

                                <div className='grid md:grid-cols-[160px_1fr] grid-cols-[120px_1fr] gap-2 items-center'>
                                    <h1>Transaction:</h1>
                                    <h1>Extend</h1>
                                </div>
                                
                                <div className='grid md:grid-cols-[160px_1fr] grid-cols-[120px_1fr] gap-2 items-center'>
                                    <h1>Bike:</h1>
                                    <div className="flex items-center gap-2">
                                        <h1>{bikeType}</h1>

                                        <span className="bg-blue px-3 py-1 rounded-lg text-[#ffffff]">
                                            {bikeCode}
                                        </span>
                                    </div>
                                </div>

                                <div className='grid md:grid-cols-[160px_1fr] grid-cols-[120px_1fr] gap-2 items-center'>
                                    <h1>Total:</h1>
                                    <h1>P{total}</h1>
                                </div>

                                <div className='grid md:grid-cols-[160px_1fr] grid-cols-[120px_1fr] gap-2 items-center'>
                                    <h1>Payment:</h1>
                                    <h1>P{cashAmount}</h1>
                                </div>

                                <div className='grid md:grid-cols-[160px_1fr] grid-cols-[120px_1fr] gap-2 items-center'>
                                    <h1>Change:</h1>
                                    <h1>P{cashAmount - total}</h1>
                                </div>

                                <div className='grid md:grid-cols-[160px_1fr] grid-cols-[120px_1fr] gap-2 items-center'>
                                    <h1>Method:</h1>
                                    <h1>{active}</h1>

                                    
                                </div>

                            </div>

                            <div className='flex flex-row justify-between'>

                                <div 
                                    onClick={() => {setConfirm(false)}}
                                    className='border cursor-pointer border-gray text-sm rounded-lg text-gray px-2 py-1'>
                                    Back
                                </div>

                                <div
                                    onClick={!loading ? handleSubmit : undefined}
                                    className={`
                                        bg-blue text-white text-sm rounded-lg px-2 py-1
                                        ${loading ? "opacity-50 pointer-events-none" : "cursor-pointer"}
                                    `}
                                >
                                    {loading ? "Processing..." : "Confirm"}
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

export default Payment
