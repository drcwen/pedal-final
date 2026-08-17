
import { RiArrowDropDownLine } from "react-icons/ri";
import { RiArrowDropUpLine } from "react-icons/ri";
import { motion, AnimatePresence } from "motion/react"
import { useState, useEffect } from 'react';
import OngoingBikesOrders from "./OngoingBikesOrders"
import { supabase } from "../../../../lib/supabase"
import Payment from "./three dots/Payment"
import ChangeBike from "./ChangeBike"
import MaintenancePayment from "./MaintenancePayment"

function OngoingRow({ name, ordercount, start, bikeDetails, refreshOngoing, transaction }) {

    const [extendOrder, setExtendOrder] = useState(null);
    const [changeOrder, setChangeOrder] = useState(null);
    const [maintenancePayment, setMaintenancePayment] = useState(null);

    const [dropdown, setDropdown] = useState(false);

    const [updatedTime, setUpdatedTime] = useState(null);
    const [extensionClicked, setExtensionClicked] = useState(null);
    const [payment, setPayment] = useState(null);

    const [extendedTotal, setExtendedTotal] = useState(0);

    const startedBikes = bikeDetails.filter(
        (bike) => bike.status === "started"
    );

    async function updateStatus() {
        const transactionId = bikeDetails[0].transaction_id;

        const { error } = await supabase
            .from("transactions_mod")
            .update({
                status: "completed",
            })
            .eq("id", transactionId); 

        if (error) {
            console.error(error);
        }

        
        await refreshOngoing();
    }

    // convert 13:00:00 to 1:00PM
    function formatTime12Hour(time) {
        const [hours, minutes] = time.split(":").map(Number);

        const date = new Date();
        date.setHours(hours, minutes, 0);

        return date.toLocaleTimeString("en-PH", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    }

    function getEndTimeOnly(tstzrange) {
        const match = tstzrange.match(/\["[^"]+","([^"]+)"\)/);

        if (!match) return null;

        const utcDate = new Date(
            match[1]
                .replace(" ", "T")
                .replace("+00", "Z")
        );

        return utcDate.toLocaleTimeString("en-PH", {
            timeZone: "Asia/Manila",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    }

    //add hour on tstzrange
    function addHoursToTstzrange(range, hoursToAdd) {
        const match = range.match(/\["([^"]+)","([^"]+)"\)/);

        if (!match) {
            throw new Error("Invalid tstzrange format.");
        }

        const [, start, end] = match;

        const endDate = new Date(end);
        endDate.setHours(endDate.getHours() + hoursToAdd);

        const formattedEnd = endDate
            .toISOString()
            .replace("T", " ")
            .replace(".000Z", "+00");

        return `["${start}","${formattedEnd}")`;
    }

    useEffect(() => {
        
        if (bikeDetails.length === 0) return;
        if (startedBikes.length !== 0) return;

        updateStatus();
        
    }, [startedBikes.length]);

  return (
    <>
        <div 
            className='w-full flex flex-col rounded-lg bg-[#F0F0F0] md:px-10 px-4 py-2 border border-[#DBDBDB]'>

            <div className='w-full flex flex-row justify-between items-center'>
                <div className='w-full md:grid md:grid-cols-4 gap-5 items-center md:text-center flex flex-row'>
                    <h1 className='font-akagi font-bold text-gray text-lg'>{name}</h1>
                    <h1 className={`${dropdown === true ? "hidden md:block" : "block"} font-akagi font-semibold text-gray text-lg`}>{ordercount}</h1>
                    <h1 className='hidden md:block font-akagi font-semibold text-gray text-lg'>{start}</h1>

                    <AnimatePresence initial={false}>
                        <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }} 
                                className={`md:py-0 ${dropdown === true ? "block py-4" : "hidden"}`}>
                            <div
                                className={`w-fit rounded-xl bg-red-500 transition-all duration-300 
                                    `}
                            >
                                <h1 className='font-akagi font-black text-[#ffffff] px-5 py-1 cursor-pointer'>END</h1>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
                <div 
                    onClick={() => setDropdown(!dropdown)}
                    className='cursor-pointer'
                >
                    {dropdown ? (
                        <RiArrowDropUpLine className='text-3xl text-gray'/>
                    ): (
                        <RiArrowDropDownLine className='text-3xl text-gray'/>
                    )}
                    
                </div>
            </div>

            <AnimatePresence initial={false}>
                {dropdown && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className='w-full flex flex-col py-5'>
                        <div className='w-full md:grid md:grid-cols-2 xl:grid-cols-3 flex flex-col gap-3'>

                            {startedBikes
                                .map((bikes) => (
                                    <OngoingBikesOrders
                                        bikeTypeId={bikes.bike_types_mod.id}
                                        bikeCode={bikes.bikes_mod?.code}
                                        gpsId={bikes.gps_mod?.code}
                                        gpsCode={bikes.gps_mod?.id}
                                        type={bikes.bike_types_mod.name}
                                        image={bikes.bike_types_mod.image_url}
                                        price={bikes.bike_type_id.price}
                                        duration={bikes.duration_hours === 1 ? bikes.duration_hours + " hour" : bikes.duration_hours + " hours"}
                                        start={bikes.start_time}
                                        end={bikes.reservation_range}
                                        orderId={bikes.id}
                                        setExtendOrder={setExtendOrder}
                                        setChangeOrder={setChangeOrder}
                                        setMaintenancePayment={setMaintenancePayment}
                                        pricePerHour={bikes.bike_types_mod.price}
                                        transactionId={transaction}
                                        bikeTypeId={bikes.bike_types_mod.id}
                                        bikeId={bikes.bikes_mod?.id}
                                        extensionsDuration={bikes.extensions_mod?.map(
                                            extension => extension.extension_duration
                                        )}                       
                                    />
                                ))
                            }

                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

        { changeOrder && 
            <ChangeBike 
                setChangeOrder={setChangeOrder}
                changeOrder={changeOrder}

            />
        }

        { maintenancePayment && 
            <MaintenancePayment 
                setMaintenancePayment={setMaintenancePayment}
                maintenancePayment={maintenancePayment}

            />
        }
        {/*Extend Rent*/}
        {extendOrder && (
            <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 sm:px-10 px-5 md:px-20 lg:px-60 xl:px-100">
                <div className="w-full bg-[#F0F0F0] p-6 rounded-xl font-akagi font-bold text-lg text-gray flex flex-col gap-5">
                    <h1 className='text-3xl text-navyblue'>Extend Bike</h1>

                    <div className='border border-[#DBDBDB] p-2 rounded-lg shadow-lg flex items-center flex-row gap-3'>
                        <div className='bg-yellow p-1 rounded-lg w-fit'>
                            <img src={extendOrder.image} className='w-15'/>
                        </div>

                        <div className='flex flex-row gap-2 items-center'>
                            <h1>{extendOrder.type}</h1>
                            <div className='bg-navyblue px-3 py-0.5 rounded-lg'>
                                <h1 className='text-[#ffffff]'>{extendOrder.bikeCode}</h1>
                            </div>
                        </div>
                    </div>
                    
                    <div className='flex flex-col gap-5 px-10'>
                        <h1>Current End: {getEndTimeOnly(extendOrder.end)}</h1>

                        <div className='grid grid-cols-4 md:gap-5 gap-2'>
                            <div 
                                onClick={() => {setUpdatedTime(addHoursToTstzrange(extendOrder.end, 1)), setExtensionClicked(1), setExtendedTotal(extendOrder.pricePerHour * 1)}}
                                value={1}
                                className={`border-2 ${extensionClicked === 1 ? "bg-blue text-[#ffffff] border-blue" : undefined} border-[#DBDBDB] rounded-lg flex py-3 justify-center items-center`}>
                                +1
                            </div>

                            <div 
                                onClick={() => {setUpdatedTime(addHoursToTstzrange(extendOrder.end, 2)), setExtensionClicked(2), setExtendedTotal(extendOrder.pricePerHour * 2)}}
                                value={2}
                                className={`border-2 ${extensionClicked === 2 ? "bg-blue text-[#ffffff] border-blue" : undefined} border-[#DBDBDB] rounded-lg flex py-3 justify-center items-center`}>
                                +2
                            </div>

                            <div 
                                onClick={() => {setUpdatedTime(addHoursToTstzrange(extendOrder.end, 3)), setExtensionClicked(3), setExtendedTotal(extendOrder.pricePerHour * 3)}}
                                value={3}
                                className={`border-2 ${extensionClicked === 3 ? "bg-blue text-[#ffffff] border-blue" : undefined} cursor-pointer border-[#DBDBDB] rounded-lg flex py-3 justify-center items-center`}>
                                +3
                            </div>

                            <div 
                                onClick={() => {setUpdatedTime(addHoursToTstzrange(extendOrder.end, 4)), setExtensionClicked(4), setExtendedTotal(extendOrder.pricePerHour * 4)}}
                                value={4}
                                className={`border-2 ${extensionClicked === 4 ? "bg-blue text-[#ffffff] border-blue" : undefined} border-[#DBDBDB] cursor-pointer rounded-lg flex py-3 justify-center items-center`}>
                                +4
                            </div>
                        
                        </div>
                        <h1>Updated End: {updatedTime ? getEndTimeOnly(updatedTime) : "--:--"}</h1>

                        <div className='flex flex-row gap-2 items-center'>
                            <h1>Total: </h1>
                            <h1 className='text-2xl text-blue'>P{extendedTotal}</h1>
                        </div>
                    </div>

    
                    <div className='flex justify-between'>
                        <button 
                            className='bg-red-500 rounded-lg text-[#ffffff] px-3 py-1 cursor-pointer'
                            onClick={() => setExtendOrder(null)}
                        >
                            Close
                        </button>

                        <button 
                            className={`${extendedTotal === 0 ? "pointer-events-none opacity-20" : undefined} bg-green-500 rounded-lg text-[#ffffff] px-3 py-1 cursor-pointer`}
                            onClick={() => setPayment(true)}
                        >
                            Payment
                        </button>

                        {payment === true &&
                            <Payment 
                                total={extendedTotal}
                                setPayment={setPayment}
                                bikeId={extendOrder.bikeId}
                                bikeType={extendOrder.type}
                                orderId={extendOrder.orderId}
                                extensionClicked={extensionClicked}
                                updatedTime={updatedTime}
                                bikeCode={extendOrder.bikeCode}
                            />
                        }
                    </div>
                </div>
            </div>
        )}
                                
    </>
  )
}

export default OngoingRow
