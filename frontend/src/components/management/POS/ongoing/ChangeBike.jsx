import { IoIosArrowBack } from "react-icons/io";
import BikesTile from "../walk in rent/BikesTile"
import { useState, useEffect } from 'react';
import { supabase } from "../../../../lib/supabase"
import { motion, AnimatePresence } from "motion/react"
import { RiArrowLeftRightLine } from "react-icons/ri";
import AssignChangeBikes from "./AssignChangeBikes"

function ChangeBike({setChangeOrder, changeOrder}) {

    const [info, setInfo] = useState([]);
    const [isOpen, setIsOpen] = useState();

    const [openBikeId, setOpenBikeId] = useState(null);

    const [loading, setLoading] = useState(true);    

    const [changedBike, setChangedBike] = useState();

    const totalPayment = changedBike
    ? Math.max(0, changedBike.price - changeOrder.pricePerHour)
    : 0;

    const [cashAmount, setCashAmount] = useState(null);

    const [gcash, setGcash] = useState(false);
    const [cash, setCash] = useState(false);

    const [confirmChange, setConfirmChange] = useState(false);

    const handleChange = (e) => {
        setCashAmount(e.target.value);

        if (!isNaN(value)) {
            setCashAmount(value);
        }
    };

    useEffect(() => {
        const fetchBikes = async () => {

            setLoading(true);

            const { data } = await supabase
                .from("bike_types_mod")
                .select(`
                    *,
                    bikes_mod (
                    id,
                    status
                    )
                `)
                .eq("bikes_mod.status", "Available")

            setInfo(data || [])

            setLoading(false);
        }

        fetchBikes()

    }, [])

    useEffect(() => {
        if (totalPayment === 0) {
            setCashAmount(0);
        } else if (cashAmount === 0) {
            setCashAmount(null); 
        }
    }, [totalPayment]);

  return (
    <>

        <div className="w-full h-full fixed inset-0 bg-black/50 flex justify-center items-center z-50 md:p-5">
            <div className='bg-[#ffffff] md:p-10 p-5 py-15 md:pt-10 md:rounded-xl w-full h-full flex flex-col overflow-y-scroll scrollbar-thin scrollbar-thumb-[#B9B9B9] scrollbar-track-[#E2E2E2]'>
                <div className='flex flex-row gap-1 items-center'>
                    <div onClick={() => {setChangeOrder(null)}}>
                        <IoIosArrowBack className='text-gray text-3xl cursor-pointer'/>
                    </div>
                    <h1 className='text-3xl font-akagi font-bold text-blue'>Change Bike</h1>
                </div>

                <div className='w-full h-full pt-10 lg:grid lg:grid-cols-3 flex flex-col gap-10'>
                        <div className="col-span-2 rounded-xl flex flex-col gap-5">

                            <div className='hidden md:grid-cols-3 grid-cols-1 gap-3'>
                                <div className='rounded-xl bg-blue px-6 py-2 text-center cursor-pointer'>
                                    <h1 className='font-akagi font-bold text-[#ffffff] '>All</h1>
                                </div>

                                <div className='rounded-xl bg-[#DBDBDB] px-6 py-2 text-center cursor-pointer'>
                                    <h1 className='font-akagi font-bold text-[#505050] '>Family Bikes</h1>
                                </div>

                                <div className='rounded-xl bg-[#DBDBDB] px-6 py-2 text-center cursor-pointer'>
                                    <h1 className='font-akagi font-bold text-[#505050] '>Solo Bikes</h1>
                                </div>
                            </div>

                            <div className='border border-[#c6c6c6] shadow-[-5px_15px_20px_rgba(0,0,0,0.15)] rounded-xl p-5 w-full grid md:grid-cols-3 grid-cols-2 gap-4'>
                                
                                {loading ? (
                                    <div className="flex justify-center items-center py-10">
                                        <h1 className="font-akagi text-gray-500">Loading bikes...</h1>
                                    </div>
                                ) : ( info.map((bike) => (
                                    <>
                                        
                                        <motion.div
                                            key={bike.id}
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                        >
                                            <div 

                                                onClick={() => {setOpenBikeId(bike.id), setChangedBike(bike)}}
                                                className={`rounded-xl bg-[#EBEBEB] w-full h-full p-4 flex flex-col items-center text-center justify-center gap-4 border cursor-pointer
                                                    ${openBikeId == bike.id ? `bg-blue border-blue-600` : `bg-[#EBEBEB]`}
                                                    ${changeOrder.bikeTypeId == bike.id ? `pointer-events-none bg-yellow border-[#d6d224]` : `border-[#C8C8C8]`}
                                                    ${bike.bikes_mod.length === 0 ? `opacity-50 bg-black pointer-events-none` : ``}`}
                                            
                                                >
                                                <img 
                                                    className='w-30'
                                                    src={bike.image_url}/>
                                                <h1 className={`text-lg font-akagi font-bold tracking-wide
                                                    ${openBikeId == bike.id ? `text-[#ffffff]` : `text-[#505050] `}
                                                    `}
                                                >
                                                    {bike.name}
                                                </h1>

                                            </div>
                                        </motion.div>
                                    </>
                                )
                                ))}
                                
                            </div>
                        </div>

                        <div className="col-span-1 border border-[#C8C8C8] rounded-xl p-5 flex flex-col gap-7 shadow-[-5px_15px_20px_rgba(0,0,0,0.15)]">
                            <h1 className='text-2xl font-akagi font-bold text-blue'>Payment</h1>

                            <div className='flex flex-col gap-3'>
                                <div className='flex flex-row justify-between items-center'>
                                    
                                    <div className='flex flex-row gap-3 items-center '>
                                        <div className='bg-yellow p-2 rounded-lg'>
                                            <img src={changeOrder.image} className='w-10'/>
                                        </div>

                                        <div className='text-xl font-akagi font-bold text-gray'>
                                            {changeOrder.type}
                                        </div>

                                        <div className='bg-blue rounded-lg text-md px-2 py-0.5 font-bold text-[#ffffff] font-akagi'>
                                            {changeOrder.bikeId}
                                        </div>
                                        
                                    </div>

                                    {changedBike && 
                                        <div className={`${changedBike.price <= changeOrder.pricePerHour ? `text-gray line-through` : `text-blue`} text-xl font-akagi font-bold`}>
                                            P{changeOrder.pricePerHour}
                                        </div>
                                    }
                                </div>

                                <AnimatePresence initial={false}>
                                    {changedBike && 
                                        
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.25, ease: "easeInOut" }}  
                                            className="flex flex-row justify-between gap-5 items-center pl-5"
                                        >
                                            <RiArrowLeftRightLine className='text-2xl text-darkblue'/>
                                            <div className='w-full flex flex-row justify-between items-center'>

                                                <div className='flex flex-row gap-3 items-center '>
                                                    <div className='bg-blue p-2 rounded-lg'>
                                                        <img src={changedBike.image_url} className='w-10'/>
                                                    </div>

                                                    <div className='text-xl font-akagi font-bold text-gray'>
                                                        {changedBike.name}
                                                    </div>
                                                    
                                                </div>

                                                <div className={`${changedBike.price <= changeOrder.pricePerHour ? `text-gray line-through` : `text-blue`} text-xl font-akagi font-bold`}>
                                                    P{changedBike.price}
                                                </div>
                                            </div>
                                        </motion.div>
                                        
                                    }  
                                </AnimatePresence>
                            </div>

                            <div className='w-full h-0.5 bg-black/30 rounded-lg'/>

                            <div className='flex flex-row justify-between px-10 font-akagi font-bold text-blue text-2xl'>
                                <div className='text-gray'>
                                    Total
                                </div>

                                {changedBike && 
                                <div className=''>
                                    P{totalPayment}
                                </div>
                                }
                            </div>

                            {/*Payment*/}
                            

                            <div className='mt-auto flex flex-col gap-5'>
                                <AnimatePresence initial={false}>
                                {totalPayment > 0 && 
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.25, ease: "easeInOut" }}  
                                        className={`bg-white p-6 rounded-xl flex flex-col gap-3 mt-auto rounded-lg w-full ${totalPayment === 0 ? "hidden" : ""}`}
                                    >
                                        <h1 className={`text-2xl font-bold font-akagi text-[#6D7172]`}>Payment</h1>

                                        <div className='grid grid-cols-2 gap-3 pb-5'>
                                            <div 
                                                onClick={totalPayment === 0 ? undefined : () => {setGcash(true), cash === true ? setCash(!cash) : ""}}
                                                className={`border-2 border-gray rounded-lg text-center py-2 ${gcash === true ? `bg-gray text-[#ffffff]` : `bg-transparent `}`}>
                                                <h1 className={`xl:text-xl lg:text-lg font-bold font-akagi ${gcash === true ? `text-[#fffffff]` : `text-gray`}`}>GCash</h1>
                                            </div>

                                            <div 
                                                onClick={() => {totalPayment === 0 ? undefined : setCash(true), gcash === true ? setGcash(!gcash) : ""}}
                                                className={`border-2 border-gray rounded-lg text-center py-2 ${cash === true ? `bg-gray text-[#ffffff]` : `bg-transparent`}`}>
                                                <h1 className={`xl:text-xl lg:text-lg font-bold font-akagi ${cash === true ? `text-[#fffffff]` : `text-gray`}`}>Cash</h1>
                                            </div>
                                        </div>

                                        {gcash === true && 
                                            <div
                                                onClick={totalPayment === 0 ? () => setGcash(!gcash) : undefined} 
                                                className='w-full rounded-xl bg-gray p-2'>
                                                
                                            </div>
                                        }

                                        {cash === true && 
                                            <div
                                                className='w-full rounded-xl bg-gray p-3 font-akagi font-bold text-gray lg:text-md xl:text-xl'>
                                                <div className='grid grid-cols-3 gap-3'>
                                                    <div
                                                        onClick={50 < totalPayment ? undefined : () => setCashAmount(50)}
                                                        className={`
                                                            rounded-lg p-1 border border-[#ffffff] text-center items-center justify-center
                                                            ${cashAmount === 50 ? "bg-[#ffffff] text-[gray]" : "text-[#ffffff]"}
                                                            ${50 < totalPayment ? "pointer-events-none opacity-20" : "cursor-pointer"}
                                                        `}
                                                    >
                                                        50
                                                    </div>

                                                    <div
                                                        onClick={100 < totalPayment ? undefined : () => setCashAmount(100)}
                                                        className={`
                                                            rounded-lg p-1 border border-[#ffffff] text-center items-center justify-center
                                                            ${cashAmount === 100 ? "bg-[#ffffff] text-[gray]" : "text-[#ffffff]"}
                                                            ${100 < totalPayment ? "pointer-events-none opacity-20" : "cursor-pointer"}
                                                        `}
                                                    >
                                                        100
                                                    </div>

                                                    <div
                                                        onClick={200 < totalPayment ? undefined : () => setCashAmount(200)}
                                                        className={`
                                                            rounded-lg p-1 border border-[#ffffff] text-center items-center justify-center
                                                            ${cashAmount === 200 ? "bg-[#ffffff] text-[gray]" : "text-[#ffffff]"}
                                                            ${200 < totalPayment ? "pointer-events-none opacity-20" : "cursor-pointer"}
                                                        `}
                                                    >
                                                        200
                                                    </div>

                                                    <div
                                                        onClick={300 < totalPayment ? undefined : () => setCashAmount(300)}
                                                        className={`
                                                            rounded-lg p-1 border border-[#ffffff] text-center items-center justify-center
                                                            ${cashAmount === 300 ? "bg-[#ffffff] text-[gray]" : "text-[#ffffff]"}
                                                            ${300 < totalPayment ? "pointer-events-none opacity-20" : "cursor-pointer"}
                                                        `}
                                                    >
                                                        300
                                                    </div>

                                                    <div
                                                        onClick={350 < totalPayment ? undefined : () => setCashAmount(350)}
                                                        className={`
                                                            rounded-lg p-1 border border-[#ffffff] text-center items-center justify-center
                                                            ${cashAmount === 350 ? "bg-[#ffffff] text-[gray]" : "text-[#ffffff]"}
                                                            ${350 < totalPayment ? "pointer-events-none opacity-20" : "cursor-pointer"}
                                                        `}
                                                    >
                                                        350
                                                    </div>
                                                    
                                                    <div
                                                        onClick={450 < totalPayment ? undefined : () => setCashAmount(450)}
                                                        className={`
                                                            rounded-lg p-1 border border-[#ffffff] text-center items-center justify-center
                                                            ${cashAmount === 450 ? "bg-[#ffffff] text-[gray]" : "text-[#ffffff]"}
                                                            ${450 < totalPayment ? "pointer-events-none opacity-20" : "cursor-pointer"}
                                                        `}
                                                    >
                                                        450
                                                    </div>

                                                    <div
                                                        onClick={500 < totalPayment ? undefined : () => setCashAmount(500)}
                                                        className={`
                                                            rounded-lg p-1 border border-[#ffffff] text-center items-center justify-center
                                                            ${cashAmount === 500 ? "bg-[#ffffff] text-[gray]" : "text-[#ffffff]"}
                                                            ${500 < totalPayment ? "pointer-events-none opacity-20" : "cursor-pointer"}
                                                        `}
                                                    >
                                                        500
                                                    </div>

                                                    <div
                                                        onClick={1000 < totalPayment ? undefined : () => setCashAmount(1000)}
                                                        className={`
                                                            rounded-lg p-1 border border-[#ffffff] text-center items-center justify-center
                                                            ${cashAmount === 1000 ? "bg-[#ffffff] text-[gray]" : "text-[#ffffff]"}
                                                            ${1000 < totalPayment ? "pointer-events-none opacity-20" : "cursor-pointer"}
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
                                                        placeholder="Amount"
                                                        value={cashAmount}
                                                        onChange={handleChange}
                                                        className='bg-[#fffffff] border-2 border-white w-full text-[#ffffff] rounded-xl focus:outline-none px-3 py-1 font-bold'/>
                                                </div>

                                            </div>
                                            
                                        }
                                    </motion.div>
                                }
                            </AnimatePresence>

                            {/*Payment Button*/}
                            <AnimatePresence initial={false}>
                                {changedBike && 
                                
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.25, ease: "easeInOut" }}   
                                        onClick={() => {setConfirmChange(true)}}
                                        className={`
                                            ${cashAmount === null || cashAmount < totalPayment ? `hidden` : `block`}
                                            w-fit self-end bg-yellow rounded-lg px-3 py-1 cursor-pointer text-center`}>
                                        <h1 className='text-lg font-bold font-akagi text-darkblue'>Proceed</h1>
                                    </motion.div>
                                    
                                }

                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {confirmChange && changedBike && (
            <AssignChangeBikes
                beforeType={changeOrder.type}
                changedType={changedBike.name}
                setConfirmChange={setConfirmChange}
                changedImage={changedBike.image_url}
                gpsAssigned={changeOrder.gpsId}
            />
        )}
              
    </>
  )
}

export default ChangeBike
