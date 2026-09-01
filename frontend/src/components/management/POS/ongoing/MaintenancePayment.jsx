import { IoIosArrowBack } from "react-icons/io";
import { useState, useEffect } from 'react';
import { supabase } from "../../../../lib/supabase"
import { motion, AnimatePresence } from "motion/react"
import { RiArrowDropDownLine } from "react-icons/ri";
import { FaCalculator } from "react-icons/fa";

function MaintenancePayment({setMaintenancePayment, maintenancePayment}) {

    const [cashAmount, setCashAmount] = useState(null);

    const [gcash, setGcash] = useState(false);
    const [cash, setCash] = useState(false);
    
    const paymentMethod = 
        gcash == true ? "GCash" : "Cash";

    const [reason, setReason] = useState("Select reason");
    const [otherReason, setOtherReason] = useState(null);

    const [dropDown, setDropDown] = useState(false);

    const [payDropDown, setPayDropDown] = useState(false);
    const [paidBy, setPaidBy] = useState("Select payment by");

    const [selectPrice, setSelectPrice] = useState(false);

    const [price, setPrice] = useState(0);

    const change = cashAmount - price;

    const handleChange = (e) => {
        setCashAmount(e.target.value);

        if (!isNaN(value)) {
            setCashAmount(value);
        }
    };

    const insertToMaintenance = async (transactionId) => {
        const { data, error } = await supabase
            .from("maintenance_mod")
            .insert({
                order_id: maintenancePayment.orderId,
                reason: reason === "Other" ? otherReason : reason,
                payment_by: paidBy,
                price: price,
                status: "Ongoing",
                transaction_id: transactionId
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

    const updateBike = async () => {
        const {data, error} = await supabase
            .from("bikes_mod")
            .update({status: "Under Maintenance"})
            .eq("id", maintenancePayment.bikeId)

        const {data: user, error: err} = await supabase
            .from("orders_mod")
            .update({status: "maintenance"})
            .eq("id", maintenancePayment.orderId)

        const {data: gps, error: er} = await supabase
            .from("gps_mod")
            .update({status: "Available"})
            .eq("id", maintenancePayment.gpsCode)

        if (er) {
            console.error(er);
            alert(er.message);
            return null;
        }

        if (err) {
            console.error(err);
            alert(err.message);
            return null;
        }

        if (error) {
            console.error(error);
            alert(error.message);
            return null;
        }
    }

    const insertTransaction = async () => {
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
                amount_paid: cashAmount,
                change_amount: change,
                type: "maintenance",
                status: "completed",
                assisted_by: user.id
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
        e.preventDefault();

        const transactionId = await insertTransaction();

        if (!transactionId) {
            return;
        }

        const maintenance = await insertToMaintenance(transactionId);

        await updateBike();

        if (!maintenance) {
            return;
        }

        console.log("Transaction ID:", transactionId);
        console.log("Maintenance:", maintenance);

        setMaintenancePayment(null);
        window.location.reload();
    };

    console.log(maintenancePayment.gpsCode)
    return (
    <>

        <div className="w-full h-full fixed inset-0 bg-black/50 flex justify-center items-center z-100 md:p-5">
            <div className='bg-[#ffffff] md:p-10 p-5 py-15 md:pt-10 md:rounded-xl w-full h-full flex flex-col overflow-y-scroll scrollbar-thin scrollbar-thumb-[#B9B9B9] scrollbar-track-[#E2E2E2]'>
                <div className='flex flex-row gap-1 items-center'>
                    <div onClick={() => {setMaintenancePayment(null)}}>
                        <IoIosArrowBack className='text-gray text-3xl cursor-pointer'/>
                    </div>
                    <h1 className='text-3xl font-akagi font-bold text-blue'>Bike Maintenance</h1>
                </div>

                <div className='w-full h-full pt-10 lg:grid lg:grid-cols-3 flex flex-col gap-10'>
                        <div className="col-span-2 rounded-xl flex flex-col gap-5">

                            <div className='border border-[#c6c6c6] shadow-[-5px_15px_20px_rgba(0,0,0,0.15)] rounded-xl p-5 w-full gap-4'>
                                
                                <div className='flex flex-col gap-5'>
                                    <h1 className='text-2xl font-akagi font-bold text-gray'>Bike Details</h1>
                                    <div className='lg:px-10 px-5 flex flex-row gap-3 items-center '>
                                        <div className='bg-yellow p-2 rounded-lg'>
                                            <img src={maintenancePayment.image} className='w-10'/>
                                        </div>

                                        <div className='text-xl font-akagi font-bold text-gray'>
                                            {maintenancePayment.type}
                                        </div>

                                        <div className='bg-blue rounded-lg text-md px-2 py-0.5 font-bold text-[#ffffff] font-akagi'>
                                            {maintenancePayment.bikeCode}
                                        </div>
                                        
                                    </div>

                                    <div className="lg:px-10 px-5 grid grid-cols-[60px_minmax(0,1fr)] items-center gap-2 font-akagi font-bold text-gray">
                                        <h1 className="text-md font-medium whitespace-nowrap">
                                            Reason:
                                        </h1>

                                        <div className="relative w-full">
                                            <div
                                                onClick={() => setDropDown(prev => !prev)}
                                                className="
                                                    w-full
                                                    flex flex-row
                                                    justify-between
                                                    items-center
                                                    rounded-lg
                                                    border border-gray/70
                                                    px-3 py-2
                                                    text-md
                                                    cursor-pointer
                                                    bg-[#ffffff]
                                                "
                                            >
                                                <span className="truncate">
                                                    {reason}
                                                </span>

                                                <RiArrowDropDownLine
                                                    className={`text-2xl transition-transform duration-200 ${
                                                        dropDown ? "rotate-180" : ""
                                                    }`}
                                                />
                                            </div>

                                            <AnimatePresence>
                                                {dropDown && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: -5 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -5 }}
                                                        transition={{ duration: 0.15 }}
                                                        className="
                                                            absolute
                                                            top-full
                                                            left-0
                                                            mt-1
                                                            w-full
                                                            min-w-0
                                                            z-50
                                                            bg-white
                                                            border border-gray/70
                                                            rounded-lg
                                                            shadow-lg
                                                            overflow-hidden
                                                        "
                                                    >
                                                        {[
                                                            "Damaged",
                                                            "Flat Tire",
                                                            "Battery Problem",
                                                            "Mechanical Problem",
                                                            "Cleaning",
                                                            "Other",
                                                        ].map((option) => (
                                                            <div
                                                                key={option}
                                                                onClick={() => {
                                                                    setReason(option);
                                                                    setDropDown(false);
                                                                }}
                                                                className="
                                                                    px-3 py-2
                                                                    cursor-pointer
                                                                    hover:bg-gray/20
                                                                    transition
                                                                    truncate whitespace-nowrap overflow-hidden
                                                                    
                                                                "
                                                            >
                                                                {option}
                                                            </div>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>

                                    {/*Other input*/}
                                    {reason === "Other" &&
                                        <div className='lg:px-10 px-5 grid grid-cols-[60px_1fr] items-center gap-2 font-akagi font-bold text-gray'>
                                            <h1 className='text-md font-medium'>Specify reason:</h1>
                                            <div className="relative w-full">
                                                <input
                                                    type="text"
                                                    placeholder="Enter reason"
                                                    className="
                                                        w-full
                                                        outline-none
                                                        rounded-lg
                                                        border border-gray/70
                                                        px-3 py-2
                                                        text-md
                                                        bg-[#ffffff]
                                                    "
                                                    onChange={(e) => setOtherReason(e.target.value)}
                                                />
                                            </div>
                                            
                                        </div>
                                    }

                                    {/*Payment by*/}
                                    <div className="lg:px-10 px-5 grid grid-cols-[60px_minmax(0,1fr)] items-center gap-2 font-akagi font-bold text-gray">
                                        <h1 className='text-md font-medium'>
                                            Payment by:
                                        </h1>

                                        <div className="relative w-full">
                                            <div
                                                onClick={() => setPayDropDown(prev => !prev)}
                                                className="
                                                    w-full
                                                    flex flex-row
                                                    justify-between
                                                    items-center
                                                    rounded-lg
                                                    border border-gray/70
                                                    px-3 py-2
                                                    text-md
                                                    cursor-pointer
                                                    bg-[#ffffff]
                                                "
                                            >
                                                <span className="truncate">
                                                    {paidBy}
                                                </span>

                                                <RiArrowDropDownLine
                                                    className={`text-2xl transition-transform duration-200 ${
                                                        payDropDown ? "rotate-180" : ""
                                                    }`}
                                                />
                                            </div>

                                            <AnimatePresence>
                                                {payDropDown && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: -5 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -5 }}
                                                        transition={{ duration: 0.15 }}
                                                        className="
                                                            absolute
                                                            top-full
                                                            left-0
                                                            mt-1
                                                            w-full
                                                            min-w-0
                                                            z-50
                                                            bg-white
                                                            border border-gray/70
                                                            rounded-lg
                                                            shadow-lg
                                                            overflow-hidden
                                                        "
                                                    >
                                                        {[
                                                            "Customer",
                                                            "Management",
                                                        ].map((option) => (
                                                            <div
                                                                key={option}
                                                                onClick={() => {
                                                                    setPaidBy(option);
                                                                    setPayDropDown(false);

                                                                    if (option === "Management") {
                                                                        setPrice(0);
                                                                        setCashAmount(0);
                                                                        setCash(false);
                                                                        setGcash(false);
                                                                    }
                                                                }}
                                                                className="
                                                                    px-3 py-2
                                                                    cursor-pointer
                                                                    hover:bg-gray/20
                                                                    transition
                                                                    truncate whitespace-nowrap overflow-hidden
                                                                    
                                                                "
                                                            >
                                                                {option}
                                                            </div>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>

                                    {paidBy !== "Select payment by" && 
                                        <div className='lg:px-10 px-5 grid grid-cols-[60px_1fr] items-center gap-2 font-akagi font-bold text-gray'>
                                            <h1 className='text-md font-medium'>Price:</h1>
                                            <div className="relative w-full">
                                                <FaCalculator 
                                                    onClick={() => {setSelectPrice(true)}}
                                                    className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-gray" />

                                                <input
                                                    value={price}
                                                    onChange={(e) => {
                                                        const value = Number(e.target.value);
                                                        setPrice(value);
                                                        setCashAmount(value === 0 ? 0 : null);
                                                    }}
                                                    type="number"
                                                    placeholder="0"
                                                    className="
                                                        w-full
                                                        outline-none
                                                        rounded-lg
                                                        border border-gray/70
                                                        px-3 py-2
                                                        text-md
                                                        bg-[#ffffff]
                                                        [appearance:textfield]
                                                        [&::-webkit-inner-spin-button]:appearance-none
                                                        [&::-webkit-outer-spin-button]:appearance-none
                                                    "
                                                />
                                            </div>
                                            
                                        </div>
                                    }   

                                    {selectPrice === true &&

                                        <div className='w-full h-full fixed inset-0 bg-black/50 flex justify-center items-center z-100 md:p-5'>
                                            <div className='bg-[#ffffff] p-4 rounded-lg'>

                                                <div className='w-full justify-between flex flex-row'>
                                                    
                                                </div>

                                                <div className='grid grid-cols-3 gap-2 font-akagi font-bold text-xl text-gray text-center'>
                                                    <div 
                                                        onClick={() => {setPrice(100), setSelectPrice(false)}}
                                                        className={`${price === 100 ? 'bg-gray text-[#ffffff]' : undefined} rounded-lg px-6 py-2 border border-gray cursor-pointer`}>
                                                        100
                                                    </div>

                                                    <div 
                                                        onClick={() => {setPrice(150), setSelectPrice(false)}}
                                                        className={`${price === 150 ? 'bg-gray text-[#ffffff]' : undefined} rounded-lg px-6 py-2 border border-gray cursor-pointer`}>
                                                        150
                                                    </div>

                                                    <div 
                                                        onClick={() => {setPrice(200), setSelectPrice(false)}}
                                                        className={`${price === 200 ? 'bg-gray text-[#ffffff]' : undefined} rounded-lg px-6 py-2 border border-gray cursor-pointer`}>
                                                        200
                                                    </div>

                                                    <div 
                                                        onClick={() => {setPrice(250), setSelectPrice(false)}}
                                                        className={`${price === 250 ? 'bg-gray text-[#ffffff]' : undefined} rounded-lg px-6 py-2 border border-gray cursor-pointer`}>
                                                        250
                                                    </div>

                                                    <div 
                                                        onClick={() => {setPrice(300), setSelectPrice(false)}}
                                                        className={`${price === 300 ? 'bg-gray text-[#ffffff]' : undefined} rounded-lg px-6 py-2 border border-gray cursor-pointer`}>
                                                        300
                                                    </div>
                                                    <div 
                                                        onClick={() => {setPrice(350), setSelectPrice(false)}}
                                                        className={`${price === 350 ? 'bg-gray text-[#ffffff]' : undefined} rounded-lg px-6 py-2 border border-gray cursor-pointer`}>
                                                        350
                                                    </div>
                                                    
                                                    <div 
                                                        onClick={() => {setPrice(400), setSelectPrice(false)}}
                                                        className={`${price === 400 ? 'bg-gray text-[#ffffff]' : undefined} rounded-lg px-6 py-2 border border-gray cursor-pointer`}>
                                                        400
                                                    </div>

                                                    <div 
                                                        onClick={() => {setPrice(500), setSelectPrice(false)}}
                                                        className={`${price === 500 ? 'bg-gray text-[#ffffff]' : undefined} rounded-lg px-6 py-2 border border-gray cursor-pointer`}>
                                                        500
                                                    </div>

                                                    <div 
                                                        onClick={() => {setPrice(1000), setSelectPrice(false)}}
                                                        className={`${price === 1000 ? 'bg-gray text-[#ffffff]' : undefined} rounded-lg px-6 py-2 border border-gray cursor-pointer`}>
                                                        1000
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    }

                                </div>
                                
                            </div>
                        </div>

                        <div className="col-span-1 border border-[#C8C8C8] rounded-xl p-5 flex flex-col gap-7 shadow-[-5px_15px_20px_rgba(0,0,0,0.15)]">
                            <h1 className='text-2xl font-akagi font-bold text-blue'>Maintenance Summary</h1>

                            <div className='flex flex-col gap-3'>
                                <div className='flex flex-row justify-between items-center'>
                                    
                                    <div className='flex flex-row gap-3 items-center '>
                                        <div className='bg-yellow p-2 rounded-lg'>
                                            <img src={maintenancePayment.image} className='w-10'/>
                                        </div>

                                        <div className='text-xl font-akagi font-bold text-gray'>
                                            {maintenancePayment.type}
                                        </div>

                                        <div className='bg-blue rounded-lg text-md px-2 py-0.5 font-bold text-[#ffffff] font-akagi'>
                                            {maintenancePayment.bikeCode}
                                        </div>
                                        
                                    </div>

                                </div>

                                <div className='flex flex-col gap-2 px-5 font-akagi md:text-lg text-md'>
                                    {/*Reason*/}
                                    {reason !== "Select reason" &&
                                        <div className='grid md:grid-cols-[120px_minmax(0,1fr)] grid-cols-[110px_minmax(0,1fr)] gap-2 font-bold text-gray items-center'>
                                            <h1 className='font-medium'>Reason:</h1>
                                            <h1>{reason !== "Other" ? reason : otherReason}</h1>
                                        </div>
                                    }

                                    {/*Payment by*/}
                                    {paidBy !== "Select payment by" &&
                                        <div className='grid md:grid-cols-[120px_minmax(0,1fr)] grid-cols-[110px_minmax(0,1fr)] gap-2 font-bold text-gray items-center'>
                                            <h1 className='font-medium'>Payment by:</h1>
                                            <h1>{paidBy}</h1>
                                        </div>
                                    }

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
                                    {(paidBy === "Customer") || (paidBy === "Management") && 
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

                                                    {gcash === true && 
                                                        <div
                                                            onClick={price === 0 ? () => setGcash(!gcash) : undefined} 
                                                            className='w-full rounded-xl bg-gray p-2'>
                                                            
                                                        </div>
                                                    }

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
                                }

                                {/*Payment Button*/}
                                <AnimatePresence initial={false}>
                                    {(
                                        (paidBy === "Management") ||
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
                                            onClick={onSubmit}
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
        </div>


       
              
    </>
  )
}

export default MaintenancePayment
