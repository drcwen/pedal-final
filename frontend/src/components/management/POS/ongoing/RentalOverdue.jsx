import { IoIosArrowBack } from "react-icons/io";
import { useState, useEffect } from 'react';
import { supabase } from "../../../../lib/supabase"
import { motion, AnimatePresence } from "motion/react"
import { MdOutlineCancel } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { useRef } from "react";

function RentalOverdue({setRentalOverdue, rentalOverdue}) {

    const [adminPin, setAdminPin] = useState("");
    const [pinLoading, setPinLoading] = useState(false);
    const [pinError, setPinError] = useState("");

    const [cashAmount, setCashAmount] = useState(null);

    const [gcash, setGcash] = useState(false);
    const [cash, setCash] = useState(false);

    const [gcashStatus, setGcashStatus] = useState("waiting");
    const [method, setMethod] = useState(null);
    const [referenceNo, setReferenceNo] = useState(null);
    
    const [voidOvertime, setVoidOvertime] = useState(false);

    const paymentMethod = 
        gcash == true ? "GCash" : "Cash";

    const [reason, setReason] = useState("Select reason");

    const [paidBy, setPaidBy] = useState("Select payment by");

    const [isLoading, setIsLoading] = useState(false);

    const [confirmation, setConfirmation] = useState(false);

    const [price, setPrice] = useState(
        Number(rentalOverdue?.overtimePayment) || 0
    );

    useEffect(() => {
        setPrice(Number(rentalOverdue?.overtimePayment) || 0);
    }, [rentalOverdue?.overtimePayment]);

    const change = cashAmount - price;

    const handleChange = (e) => {
        setCashAmount(e.target.value);

        if (!isNaN(value)) {
            setCashAmount(value);
        }
    };

    const handlePinChange = (e, index) => {
        const value = e.target.value;

        if (!/^\d?$/.test(value)) return;

        const currentPin = pinRefs.current.map(
            (input) => input?.value || ""
        );

        currentPin[index] = value;

        const newPin = currentPin.join("");

        setAdminPin(newPin);
        setPinError("");

        if (value && index < 5) {
            pinRefs.current[index + 1]?.focus();
        }

        if (newPin.length === 6) {
            checkAdminPin(newPin);
        }
    };

    const checkAdminPin = async (pinCode) => {
        setPinLoading(true);
        setPinError("");

        const { data, error } = await supabase
            .from("pin_mod")
            .select("id, admin_id")
            .eq("pin", Number(pinCode))
            .maybeSingle();

        if (error) {
            console.error("Error checking admin PIN:", error);
            setPinError("Something went wrong. Please try again.");
            setPinLoading(false);
            return;
        }

        if (!data) {
            setPinError("Incorrect admin PIN.");
            setPinLoading(false);
            return;
        }

        // PIN is correct
        console.log("Correct admin PIN:", data);

        await handleVoidOvertime();

        setPinLoading(false);
    };

    const handleVoidOvertime = async () => {
        try {
            const { error: bikeError } = await supabase
                .from("bikes_mod")
                .update({ status: "Available" })
                .eq("id", rentalOverdue?.bikeId);

            if (bikeError) {
                console.error("Error updating bike:", bikeError);
                return;
            }

            const { error: gpsError } = await supabase
                .from("gps_mod")
                .update({ status: "Available" })
                .eq("id", rentalOverdue?.gpsCode);

            if (gpsError) {
                console.error("Error updating GPS:", gpsError);
                return;
            }

            const { error: orderError } = await supabase
                .from("orders_mod")
                .update({ status: "returned" })
                .eq("id", rentalOverdue?.orderId);

            if (orderError) {
                console.error("Error updating order:", orderError);
                return;
            }

            if (rentalOverdue?.onVoidSettled) {
                await rentalOverdue.onVoidSettled();
            }

            // Close PIN modal and reset PIN
            setVoidOvertime(false);
            setAdminPin("");
            setPinError("");
            setPinLoading(false);

            // Close the overtime modal
            setConfirmation(false);
            setRentalOverdue(null);

        } catch (error) {
            console.error("Error voiding overtime:", error);
        }
    };

    const pinRefs = useRef([]);
    
    const handlePinKeyDown = (e, index) => {
        if (
            e.key === "Backspace" &&
            !e.target.value &&
            index > 0
        ) {
            pinRefs.current[index - 1]?.focus();
        }
    };

    const insertToRentalOverdue = async (transactionId) => {
        const { data, error } = await supabase
            .from("overtime_mod")
            .insert({
                order_id: rentalOverdue.orderId,
                transaction_id: transactionId,
                overtime_duration: rentalOverdue.overtimeHours,
                overtime_price: rentalOverdue.overtimePayment,
                original_transaction_id: rentalOverdue.transactionId
                
            })
            .select()
            .single();

        if (error) {
            console.error(error);
            alert(error.message);
            return null;
        }

        return data;
    };

    const insertTransaction = async (
        amountPaid = cashAmount,
        referenceNumber = referenceNo
    ) => {
        const {
            data: { user },
            error: userError
        } = await supabase.auth.getUser();

        if (userError || !user) {
            console.error(userError);
            return null;
        }

        const { data, error } = await supabase
            .from("transactions_mod")
            .insert({
                payment_method: paymentMethod,
                total_amount: price,
                amount_paid: amountPaid,
                change_amount: amountPaid - price,
                type: "overtime",
                status: "completed",
                assisted_by: user.id,
                reference_number: referenceNumber
            })
            .select()
            .single();

        if (error) {
            console.error(error);
            alert(error.message);
            return null;
        }

        return data.id;
    };

    const onSubmit = async (e) => {
        if (e) e.preventDefault();

        setIsLoading(true);

        try {

            const transactionId = await insertTransaction();

            if (!transactionId) {
                return;
            }

            const overdue = await insertToRentalOverdue(transactionId);

            if (!overdue) {
                return;
            }

            if (rentalOverdue.onOvertimeSettled) {
                await rentalOverdue.onOvertimeSettled();
            }

            console.log("Transaction ID:", transactionId);
            console.log("Overtime record:", overdue);

            setRentalOverdue(null);
        } catch (error) {
            console.error("Overtime submission failed:", error);
            alert(error.message || "Failed to settle overtime.");
        } finally {
            setIsLoading(false);
        }
    };

    const GCashonSubmit = async (reference) => {
        try {
            const transactionId = await insertTransaction(price, reference);

            if (!transactionId) {
                return false;
            }

            const overdue = await insertToRentalOverdue(transactionId);

            if (!overdue) {
                return false;
            }

            if (rentalOverdue.onOvertimeSettled) {
                await rentalOverdue.onOvertimeSettled();
            }

            setRentalOverdue(null);

            return true;
        } catch (error) {
            console.error("GCash overtime submission failed:", error);
            alert(error.message || "Failed to process GCash overtime payment.");
            return false;
        }
    };

    const simulatePayment = async () => {
        const random = Math.floor(100000 + Math.random() * 900000);
        const reference = `GC-${random}`;

        setMethod("GCash");
        setGcash(true);
        setCash(false);
        setCashAmount(price);
        setReferenceNo(reference);

        setGcashStatus("processing");

        const success = await GCashonSubmit(reference);

        if (!success) {
            setGcashStatus("waiting");
            return;
        }

        setTimeout(() => {
            setGcashStatus("success");
        }, 2000);
    };

    console.log(price)

    return (
    <>

        <div className="w-full h-full fixed inset-0 bg-black/50 flex justify-center items-center z-100 md:p-5">
            <div className='bg-[#ffffff] md:p-10 p-5 py-15 md:pt-10 md:rounded-xl w-full h-full flex flex-col overflow-y-scroll scrollbar-none scrollbar-thin scrollbar-thumb-[#B9B9B9] scrollbar-track-[#E2E2E2]'>
                <div className='flex flex-row gap-1 items-center'>
                    {!rentalOverdue?.isMaintenance && (
                        <div onClick={() => setRentalOverdue(null)}>
                            <IoIosArrowBack className="text-gray text-3xl cursor-pointer" />
                        </div>
                    )}
                    <h1 className='text-3xl font-akagi font-bold text-blue'>Bike Overtime</h1>
                </div>

                <div className='w-full h-full pt-10 lg:grid lg:grid-cols-3 flex flex-col gap-10'>
                        <div className="col-span-2 rounded-xl flex flex-col gap-5">

                            <div className='border border-[#c6c6c6] shadow-[-5px_15px_20px_rgba(0,0,0,0.15)] rounded-xl p-5 w-full gap-4'>
                                
                                <div className='flex flex-col gap-5'>
                                    <h1 className='text-2xl font-akagi font-bold text-gray'>Bike Overtime Details</h1>
                                    <div className='lg:px-10 px-5 flex flex-row gap-3 items-center '>
                                        <div className='bg-yellow p-2 rounded-lg'>
                                            <img src={rentalOverdue.image} className='w-10'/>
                                        </div>

                                        <div className='text-xl font-akagi font-bold text-gray'>
                                            {rentalOverdue.type}
                                        </div>

                                        <div className='bg-blue rounded-lg text-md px-2 py-0.5 font-bold text-[#ffffff] font-akagi'>
                                            {rentalOverdue.bikeCode}
                                        </div>
                                        
                                    </div>

                                    <div className='lg:px-10 px-5 grid grid-cols-[60px_1fr] items-center gap-2 font-akagi font-bold text-gray'>
                                        <h1 className='text-md font-medium'>Hours:</h1>
                                        <div className="relative w-full outline-none
                                            rounded-lg
                                            border border-gray/70
                                            px-3 py-2
                                            text-md
                                            bg-[#ffffff]"
                                        >
                                            {rentalOverdue.overtimeHours === 1 ? rentalOverdue.overtimeHours + " hour" : rentalOverdue.overtimeHours + " hours"}
                                        </div>
                                    </div>
                                    <div className='lg:px-10 px-5 grid grid-cols-[60px_1fr] items-center gap-2 font-akagi font-bold text-gray'>
                                        <h1 className='text-md font-medium'>Price:</h1>
                                        <div className="relative w-full outline-none
                                            rounded-lg
                                            border border-gray/70
                                            px-3 py-2
                                            text-md
                                            bg-[#ffffff]"
                                        >
                                            ₱{rentalOverdue.overtimePayment}
                                        </div>
                                    </div>

                                    <div className='px-5 lg:px-10'>
                                        <div 
                                            onClick={() => {setVoidOvertime(!voidOvertime)}}
                                            className='rounded-lg bg-red-400 text-[#ffffff] px-3 py-0.5 cursor-pointer w-fit flex flex-row gap-1 items-center font-akagi font-bold'>
                                            <MdOutlineCancel/>
                                            <h1>Void Overtime</h1>
                                        </div> 
                                    </div>

                                </div>
                                
                            </div>
                        </div>

                        <div className="col-span-1 border border-[#C8C8C8] rounded-xl p-5 flex flex-col gap-7 shadow-[-5px_15px_20px_rgba(0,0,0,0.15)]">
                            <h1 className='text-2xl font-akagi font-bold text-blue'>Overtime Summary</h1>

                            <div className='flex flex-col gap-3'>
                                <div className='flex flex-row justify-between items-center'>
                                    
                                    <div className='flex flex-row gap-3 items-center '>
                                        <div className='bg-yellow p-2 rounded-lg'>
                                            <img src={rentalOverdue.image} className='w-10'/>
                                        </div>

                                        <div className='text-xl font-akagi font-bold text-gray'>
                                            {rentalOverdue.type}
                                        </div>

                                        <div className='bg-blue rounded-lg text-md px-2 py-0.5 font-bold text-[#ffffff] font-akagi'>
                                            {rentalOverdue.bikeCode}
                                        </div>
                                        
                                    </div>

                                </div>

                                <div className='flex flex-col gap-2 px-5 font-akagi md:text-lg text-md'>


                                    <div className='grid md:grid-cols-[120px_minmax(0,1fr)] grid-cols-[110px_minmax(0,1fr)] gap-2 font-bold text-gray items-center'>
                                        <h1 className='font-medium'>Overtime Hour:</h1>
                                        <h1>{rentalOverdue.overtimeHours === 1 ? rentalOverdue.overtimeHours + " hour" : rentalOverdue.overtimeHours + " hours"}</h1>
                                    </div>

                                    {/*Price*/}
                                    {price !== 0 &&
                                    <div className='grid md:grid-cols-[120px_minmax(0,1fr)] grid-cols-[110px_minmax(0,1fr)] gap-2 font-bold text-gray items-center'>
                                        <h1 className='font-medium'>Payment Total:</h1>
                                        <h1>P{price}</h1>
                                    </div>
                                    }
                                    

                                </div>

                            </div>

                            <div className='w-full h-0.5 bg-black/30 rounded-lg'/>

                            <div className='flex flex-row justify-between px-10 font-akagi font-bold text-blue text-2xl'>
                                <div className='text-gray'>
                                    Total
                                </div>

                                <div className=''>
                                    P{price}
                                </div>
                                
                            </div>

                            {/*Payment*/}

                                <div className='mt-auto flex flex-col gap-5'>
                                    <AnimatePresence initial={false}>
                                        {price > 0 && 
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.25, ease: "easeInOut" }}  
                                                className={`bg-white p-6 rounded-xl flex flex-col gap-3 mt-auto w-full ${price === 0 ? "hidden" : ""}`}
                                            >
                                                <h1 className={`text-2xl font-bold font-akagi text-[#6D7172]`}>Payment</h1>

                                                <div className='grid grid-cols-2 gap-3 pb-5'>
                                                    <div 
                                                        onClick={price === 0 ? undefined : () => {setGcash(true), cash === true ? setCash(!cash) : ""}}
                                                        className={`border-2 border-gray rounded-lg text-center py-2 ${gcash === true ? `bg-gray text-[#ffffff]` : `bg-transparent `}`}>
                                                        <h1 className={`xl:text-xl lg:text-lg font-bold font-akagi ${gcash === true ? `text-[#fffffff]` : `text-gray`}`}>GCash</h1>
                                                    </div>

                                                    <div 
                                                        onClick={() => {price === 0 ? undefined : setCash(true), gcash === true ? setGcash(!gcash) : ""}}
                                                        className={`border-2 border-gray rounded-lg text-center py-2 ${cash === true ? `bg-gray text-[#ffffff]` : `bg-transparent`}`}>
                                                        <h1 className={`xl:text-xl lg:text-lg font-bold font-akagi ${cash === true ? `text-[#fffffff]` : `text-gray`}`}>Cash</h1>
                                                    </div>
                                                </div>

                                                {gcash === true && (
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
                                                                                ₱{price}
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
                                                                                        setGcash(false);
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
                                                                        ₱{price}
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
                                                                            ₱{price}
                                                                        </h1>
                                                                    </div>

                                                                    <h1 className="font-akagi text-[#505050]/60 text-sm">
                                                                        GCash payment has been verified.
                                                                    </h1>

                                                                    <div
                                                                        onClick={() => {
                                                                            setGcash(false);
                                                                            setGcashStatus("waiting");
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

                                                {cash === true && 
                                                    <div
                                                        className='w-full rounded-xl bg-gray p-3 font-akagi font-bold text-gray lg:text-md xl:text-xl'>
                                                        <div className='grid grid-cols-3 gap-3'>
                                                            <div
                                                                onClick={50 < price ? undefined : () => setCashAmount(50)}
                                                                className={`
                                                                    rounded-lg p-1 border border-[#ffffff] text-center items-center justify-center
                                                                    ${cashAmount === 50 ? "bg-[#ffffff] text-[gray]" : "text-[#ffffff]"}
                                                                    ${50 < price ? "pointer-events-none opacity-20" : "cursor-pointer"}
                                                                `}
                                                            >
                                                                50
                                                            </div>

                                                            <div
                                                                onClick={100 < price ? undefined : () => setCashAmount(100)}
                                                                className={`
                                                                    rounded-lg p-1 border border-[#ffffff] text-center items-center justify-center
                                                                    ${cashAmount === 100 ? "bg-[#ffffff] text-[gray]" : "text-[#ffffff]"}
                                                                    ${100 < price ? "pointer-events-none opacity-20" : "cursor-pointer"}
                                                                `}
                                                            >
                                                                100
                                                            </div>

                                                            <div
                                                                onClick={200 < price ? undefined : () => setCashAmount(200)}
                                                                className={`
                                                                    rounded-lg p-1 border border-[#ffffff] text-center items-center justify-center
                                                                    ${cashAmount === 200 ? "bg-[#ffffff] text-[gray]" : "text-[#ffffff]"}
                                                                    ${200 < price ? "pointer-events-none opacity-20" : "cursor-pointer"}
                                                                `}
                                                            >
                                                                200
                                                            </div>

                                                            <div
                                                                onClick={300 < price ? undefined : () => setCashAmount(300)}
                                                                className={`
                                                                    rounded-lg p-1 border border-[#ffffff] text-center items-center justify-center
                                                                    ${cashAmount === 300 ? "bg-[#ffffff] text-[gray]" : "text-[#ffffff]"}
                                                                    ${300 < price ? "pointer-events-none opacity-20" : "cursor-pointer"}
                                                                `}
                                                            >
                                                                300
                                                            </div>

                                                            <div
                                                                onClick={350 < price ? undefined : () => setCashAmount(350)}
                                                                className={`
                                                                    rounded-lg p-1 border border-[#ffffff] text-center items-center justify-center
                                                                    ${cashAmount === 350 ? "bg-[#ffffff] text-[gray]" : "text-[#ffffff]"}
                                                                    ${350 < price ? "pointer-events-none opacity-20" : "cursor-pointer"}
                                                                `}
                                                            >
                                                                350
                                                            </div>
                                                            
                                                            <div
                                                                onClick={450 < price ? undefined : () => setCashAmount(450)}
                                                                className={`
                                                                    rounded-lg p-1 border border-[#ffffff] text-center items-center justify-center
                                                                    ${cashAmount === 450 ? "bg-[#ffffff] text-[gray]" : "text-[#ffffff]"}
                                                                    ${450 < price ? "pointer-events-none opacity-20" : "cursor-pointer"}
                                                                `}
                                                            >
                                                                450
                                                            </div>

                                                            <div
                                                                onClick={500 < price ? undefined : () => setCashAmount(500)}
                                                                className={`
                                                                    rounded-lg p-1 border border-[#ffffff] text-center items-center justify-center
                                                                    ${cashAmount === 500 ? "bg-[#ffffff] text-[gray]" : "text-[#ffffff]"}
                                                                    ${500 < price ? "pointer-events-none opacity-20" : "cursor-pointer"}
                                                                `}
                                                            >
                                                                500
                                                            </div>

                                                            <div
                                                                onClick={1000 < price ? undefined : () => setCashAmount(1000)}
                                                                className={`
                                                                    rounded-lg p-1 border border-[#ffffff] text-center items-center justify-center
                                                                    ${cashAmount === 1000 ? "bg-[#ffffff] text-[gray]" : "text-[#ffffff]"}
                                                                    ${1000 < price ? "pointer-events-none opacity-20" : "cursor-pointer"}
                                                                `}
                                                            >
                                                                1000
                                                            </div>

                                                            <div 
                                                                onClick={() => {setCashAmount("")}}
                                                                className={`rounded-lg p-1 border border-[#ffffff] text-center items-center justify-center ${cashAmount === null ? `bg-[#ffffff] text-gray` : `text-[#ffffff]`}`}>
                                                                Set
                                                            </div>

                                                        </div>
                                                        <div className='pt-5'>
                                                            <input 
                                                                type="number"
                                                                placeholder="Amount"
                                                                value={cashAmount}
                                                                onChange={handleChange}
                                                                className='bg-[#fffffff] border-2 border-white w-full text-[#ffffff] rounded-xl focus:outline-none px-3 py-1 font-bold [appearance:textfield]
                                                                    [&::-webkit-inner-spin-button]:appearance-none
                                                                    [&::-webkit-outer-spin-button]:appearance-none'/>
                                                        </div>

                                                    </div>
                                                    
                                                }
                                            </motion.div>
                                        }
                                </AnimatePresence>
                                

                                {/*Payment Button*/}
                                <AnimatePresence initial={false}>
                                    {(
                                        (paidBy === "Management" &&
                                            cashAmount !== 0 &&
                                            Number(cashAmount) >= Number(price) && Number(cashAmount) !== 0) ||
                                        (paidBy === "Customer" &&
                                            cashAmount !== 0 &&
                                            Number(cashAmount) >= Number(price) && Number(cashAmount) !== 0)
                                    ) && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{
                                                duration: 0.25,
                                                ease: "easeInOut"
                                            }}
                                            className="
                                                w-fit
                                                self-end
                                                bg-yellow
                                                rounded-lg
                                                px-3
                                                py-1
                                                cursor-pointer
                                                text-center
                                            "
                                            onClick={() => setConfirmation(true)}
                                        >
                                            <h1 className="text-lg font-bold font-akagi text-darkblue">
                                                Proceed
                                            </h1>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        
                    </div>
                </div>
            </div>

            {confirmation &&
                <div className='w-full h-full fixed inset-0 bg-black/50 flex justify-center items-center z-100 p-10'>
                    <div className=' bg-[#ffffff] rounded-lg p-10 font-akagi font-bold text-gray flex flex-col gap-5'>
                        <h1 className='text-blue text-3xl'>Maintenance Confirmation</h1>

                        <div className='flex flex-row gap-2 rounded-lg p-2 items-center '>
                            <img src={rentalOverdue.image} className='w-15 bg-yellow rounded-lg p-2' />
                            <h1 className='text-md'>{rentalOverdue.type}</h1>
                            <div className='bg-blue rounded-lg px-3 py-1'>
                                <h1 className='text-md text-[#ffffff]'>{rentalOverdue.bikeCode}</h1>
                            </div>
                        </div>

                        <div className='flex flex-col gap-2'>
                            <div className='grid grid-cols-[120px_1fr]'>
                                <h1>Reason:</h1>
                                <h1 className='font-medium'>{reason}</h1>
                            </div>

                            <div className='grid grid-cols-[120px_1fr]'>
                                <h1>Payment by:</h1>
                                <h1 className='font-medium'>{paidBy}</h1>
                            </div>

                            <div className='grid grid-cols-[120px_1fr]'>
                                <h1>Price:</h1>
                                <h1 className='font-medium'>P{price}</h1>
                            </div>

                            <div className='grid grid-cols-[120px_1fr]'>
                                <h1>Tendered:</h1>
                                <h1 className='font-medium'>P{cashAmount}</h1>
                            </div>

                            <div className='grid grid-cols-[120px_1fr]'>
                                <h1>Change:</h1>
                                <h1 className='font-medium'>P{change}</h1>
                            </div>
                        </div> 

                        <div className='flex flex-row justify-between'>
                            <div 
                                onClick={isLoading ? undefined : () => {setConfirmation(false)}}
                                className={`rounded-lg border border-gray px-3 py-1 transition-all ${
                                    isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                                }`}>
                                Back
                            </div>

                            <div 
                                onClick={isLoading ? undefined : onSubmit}
                                className={`rounded-lg bg-green-500 text-[#ffffff] px-3 py-1 transition-all ${
                                    isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-103'
                                }`}>
                                {isLoading ? 'Processing...' : 'Proceed'}
                            </div>
                        </div>

                    </div>
                </div>
            }

            {voidOvertime &&
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
                        <div className='flex justify-end'>
                            <IoMdClose
                                onClick={() => {
                                    setVoidOvertime(false);
                                    setAdminPin("");
                                    setPinError("");
                                }}
                                className='text-xl text-gray cursor-pointer'
                            />
                        </div>
                        <div className='w-full flex flex-col gap-5 bg-gray/10 border border-gray/30 p-2 py-10 rounded-lg justify-center items-center text-center font-akagi text-2xl font-bold text-blue'>
                            Enter admin PIN to void overtime.

                            <div className='flex gap-3 justify-center'>
                                {[0, 1, 2, 3, 4, 5].map((index) => (
                                    <input
                                        key={index}
                                        ref={(el) => (pinRefs.current[index] = el)}
                                        type='password'
                                        maxLength={1}
                                        inputMode='numeric'
                                        value={adminPin[index] || ""}
                                        onChange={(e) => handlePinChange(e, index)}
                                        onKeyDown={(e) => handlePinKeyDown(e, index)}
                                        className='
                                            lg:w-12 lg:h-14 h-8 w-6
                                            border-2 border-gray/30
                                            rounded-lg
                                            bg-white
                                            text-center
                                            lg:text-2xl text-md
                                            font-bold
                                            text-blue
                                            outline-none
                                            focus:border-blue
                                            focus:ring-2
                                            focus:ring-blue/20
                                        '
                                    />
                                ))}
                            </div>

                            <p className='text-sm text-gray font-akagi font-medium'>This will void overtime payment and will set the bike status to "Available" upon admin's approval.
                            </p>

                            <div className='h-8 flex items-center justify-center'>
                                {pinLoading && (
                                    <p className='text-gray font-akagi text-lg'>
                                        Checking PIN...
                                    </p>
                                )}

                                {!pinLoading && pinError && (
                                    <p className='text-red-500 font-akagi text-lg'>
                                        {pinError}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>


       
              
    </>
  )
}

export default RentalOverdue
