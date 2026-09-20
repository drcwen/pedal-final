
import { useState, useEffect } from "react";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import { motion, AnimatePresence } from "motion/react"
import TransactionBikes from "./TransactionBikes"
import { MdOutlineKeyboardArrowRight } from "react-icons/md";

function TransactionRow({totalBikes, transactionId, fullName, transactionType, timeAdded, status, transactionData, transactionPayment, extensionsData, changeBikesData, maintenanceData}) {

    const [dropDown, setDropDown] = useState(false);

    function formatTimeTo12Hour(time) {
        const [hours, minutes, seconds] = time.split(":").map(Number);

        const date = new Date();
        date.setHours(hours, minutes, seconds);

        return date.toLocaleTimeString("en-PH", {
            hour: "2-digit",
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

  return (
    <>
        <div className='flex flex-col gap-6 bg-[#F0F0F0] p-2 rounded-lg border border-[#C9C9C9]'>
            
            <div className={`md:grid md:grid-cols-[40px_1fr_1fr_1fr_1fr_1fr_20px] flex flex-row justify-between items-center`}>
                <div className='bg-blue rounded-lg p-1 w-fit px-3 text-[#ffffff] font-bold font-akagi'>{totalBikes}</div>

                <div className='hidden md:flex justify-center font-akagi font-bold text-gray text-md lg:text-lg'>
                    {transactionId}
                </div>

                <div className='flex justify-center font-akagi font-medium text-gray text-md lg:text-lg'>
                    {fullName}
                </div>
                <div className='flex justify-center font-akagi font-medium text-gray text-md lg:text-lg'>
                    {transactionType}
                </div>
                <div className='hidden md:flex justify-center font-akagi font-medium text-gray text-md lg:text-lg'>
                    {timeAdded}
                </div>
                <div className='hidden md:flex justify-center font-akagi font-medium text-gray text-md lg:text-lg'>
                    {status}
                </div>


                <AnimatePresence initial={false}>
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }} 
                        className='flex justify-center text-3xl text-gray'
                    >
                        {dropDown == true ? <RiArrowDropUpLine onClick={() => setDropDown(false)}/> : <RiArrowDropDownLine onClick={() => setDropDown(true)}/>}
                    </motion.div>
                </AnimatePresence>
            </div>

            <AnimatePresence initial={false}>
                {dropDown && 
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className='md:px-10 px-2 flex flex-col gap-3'
                    >
                        <div className='w-full flex flex-col gap-1 font-akagi font-bold text-gray'>
                            <div className='grid grid-cols-[100px_1fr] gap-2'>
                                <h1>Total:</h1>
                                <h1 className='font-medium'>P{transactionPayment.total_amount}</h1>
                            </div>

                            <div className='grid grid-cols-[100px_1fr] gap-2'>
                                <h1>Tendered:</h1>
                                <h1 className='font-medium'>P{transactionPayment.amount_paid}</h1>
                            </div>

                            <div className='grid grid-cols-[100px_1fr] gap-2'>
                                <h1>Change:</h1>
                                <h1 className='font-medium'>P{transactionPayment.change_amount}</h1>
                            </div>

                            <div className='grid grid-cols-[100px_1fr] gap-2'>
                                <h1>Method:</h1>
                                <h1 className='font-medium'>{transactionPayment.payment_method}</h1>
                            </div>

                            <div className={`${transactionPayment.payment_method === "GCash" ? "block" : "hidden"} grid grid-cols-[100px_1fr] gap-2`}>
                                <h1>Reference:</h1>
                                <h1 className='font-medium'>{transactionPayment.reference_number}</h1>
                            </div>
                        </div>

                        
                        <div className='md:hidden w-fit pb-4 flex flex-row items-center'>
                            <h1 className='text-md font-akagi font-bold text-gray '>All Details</h1>
                            <MdOutlineKeyboardArrowRight className='text-xl font-bold text-gray'/>
                        </div>

                            <div className={`${transactionType === "reservation" || transactionType === "walk-in" ? "md:grid md:grid-cols-2 xl:grid-cols-3" : "hidden"} flex flex-col gap-3 pb-5`}>
                                
                                {transactionData.map((orders) => {

                                    const originalBike =
                                        orders.original_bike ?? orders.bikes_mod;

                                    const originalBikeType =
                                        orders.original_bike_type ?? orders.bike_types_mod;

                                    return (
                                        <TransactionBikes 
                                            key={orders.id}

                                            image={originalBikeType?.image_url}

                                            bikeType={originalBikeType?.name}

                                            price={"P" + originalBikeType?.price}

                                            unitId={
                                                originalBike?.code ?? "NOT STARTED"
                                            }

                                            gpsId={
                                                orders.gps_id === null
                                                    ? "NOT STARTED"
                                                    : orders.gps_mod?.code
                                            }

                                            duration={orders.duration_hours + " hour"}

                                            start={orders.start_time}

                                            end={orders.start_time}
                                        />
                                    );
                                })}

                            </div>

                            {transactionType === "extend" && (
                                <div className="grid md:grid-cols-3 gap-2 pb-5">

                                    <TransactionBikes 
                                        image={extensionsData?.bike_types_mod.image_url}
                                        bikeType={extensionsData?.bike_types_mod.name}
                                        price={""}
                                        unitId={extensionsData?.bikes_mod.code}
                                        gpsId={"-"}
                                        duration={extensionsData?.orders_mod.duration_hours + " hour"}
                                        start={formatTimeTo12Hour(extensionsData?.orders_mod.start_time)}
                                        end={getEndTimeOnly(extensionsData?.new_reservation_range)}
                                        extension={"+" + extensionsData?.extension_duration + " hour"}
                                        />
                                </div>
                            )}

                        {transactionType === "change" && (
                            <div className="grid md:grid-cols-3 gap-2 pb-5">

                                <div className='w-full border shadow-md border-[#DBDBDB] p-3 rounded-lg flex flex-col gap-4 font-akagi font-bold text-gray'>
                                    <h1>Previous Bike</h1>

                                    <div className='flex flex-row justify-between'>
                                        <div className='flex flex-row gap-3 items-center'>
                                            <div className='items-center bg-yellow p-1 rounded-lg'>
                                                <img 
                                                    src={changeBikesData?.[0]?.original_bike_type?.image_url}
                                                    className='w-6'
                                                />

                                            </div>

                                            <h1 className='text-md font-akagi font-bold text-gray'>{changeBikesData?.[0]?.original_bike_type?.name}</h1>
                                        </div>
                                    </div>

                                    <div className='w-full grid grid-cols-3 gap-2'>
                                        <div className='flex flex-col'>
                                            <h1 className='text-sm font-akagi font-bold text-gray'>UNIT ID</h1>
                                            <h1 className='text-sm font-akagi font-medium text-gray'>{changeBikesData?.[0]?.original_bike?.code}</h1>
                                        </div>

                                        <div className='flex flex-col'>
                                            <h1 className='text-sm font-akagi font-bold text-gray'>START</h1>
                                            <h1 className='text-sm font-akagi font-medium text-gray'>{formatTimeTo12Hour(changeBikesData?.[0]?.orders_mod?.start_time)}</h1>
                                        </div>

                                        <div className='flex flex-col'>
                                            <h1 className='text-sm font-akagi font-bold text-gray'>END</h1>
                                            <h1 className='text-sm font-akagi font-medium text-gray'>{getEndTimeOnly(changeBikesData?.[0]?.orders_mod?.reservation_range)}</h1>
                                        </div>
                                    </div>
                                </div>

                                <div className='w-full border shadow-md border-[#DBDBDB] p-3 rounded-lg flex flex-col gap-4 font-akagi font-bold text-gray'>
                                    <h1>Changed Bike</h1>

                                    <div className='flex flex-row justify-between'>
                                        <div className='flex flex-row gap-3 items-center'>
                                            <div className='items-center bg-yellow p-1 rounded-lg'>
                                                <img
                                                    src={changeBikesData?.[0]?.changed_bike_type?.image_url}
                                                    className="w-6"
                                                />

                                            </div>

                                            <h1 className='text-md font-akagi font-bold text-gray'>{changeBikesData?.[0]?.changed_bike_type?.name}</h1>
                                        </div>
                                    </div>

                                    <div className='w-full grid grid-cols-3 gap-2'>
                                        <div className='flex flex-col'>
                                            <h1 className='text-sm font-akagi font-bold text-gray'>UNIT ID</h1>
                                            <h1 className='text-sm font-akagi font-medium text-gray'>{changeBikesData?.[0]?.changed_bike?.code}</h1>
                                        </div>

                                        <div className='flex flex-col'>
                                            <h1 className='text-sm font-akagi font-bold text-gray'>START</h1>
                                            <h1 className='text-sm font-akagi font-medium text-gray'>{formatTimeTo12Hour(changeBikesData?.[0]?.orders_mod?.start_time)}</h1>
                                        </div>

                                        <div className='flex flex-col'>
                                            <h1 className='text-sm font-akagi font-bold text-gray'>END</h1>
                                            <h1 className='text-sm font-akagi font-medium text-gray'>{getEndTimeOnly(changeBikesData?.[0]?.orders_mod?.reservation_range)}</h1>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {transactionType === "maintenance" && (
                            <div className="grid md:grid-cols-3 gap-2 pb-5">

                                <div className='w-full border shadow-md border-[#DBDBDB] p-3 rounded-lg flex flex-col gap-4 font-akagi font-bold text-gray'>

                                    <div className='flex flex-row justify-between'>
                                        <div className='flex flex-row gap-3 items-center'>
                                            <div className='items-center bg-yellow p-1 rounded-lg'>
                                                <img
                                                    src={maintenanceData?.orders_mod?.bikes_mod?.bike_types_mod?.image_url}
                                                    className="w-6"
                                                />

                                            </div>

                                            <h1 className='text-md font-akagi font-bold text-gray'>{maintenanceData?.orders_mod?.bikes_mod?.bike_types_mod?.name}</h1>
                                        </div>
                                    </div>

                                    <div className='w-full grid grid-cols-3 gap-2'>
                                        <div className='flex flex-col'>
                                            <h1 className='text-sm font-akagi font-bold text-gray'>UNIT ID</h1>
                                            <h1 className='text-sm font-akagi font-medium text-gray'>{maintenanceData?.orders_mod?.bikes_mod?.code}</h1>
                                        </div>

                                        <div className='flex flex-col'>
                                            <h1 className='text-sm font-akagi font-bold text-gray'>GPS ID</h1>
                                            <h1 className='text-sm font-akagi font-medium text-gray'>{maintenanceData?.orders_mod?.gps_mod?.code}</h1>
                                        </div>

                                        <div className='flex flex-col'>
                                            <h1 className='text-sm font-akagi font-bold text-gray'>START</h1>
                                            <h1 className='text-sm font-akagi font-medium text-gray'>{formatTimeTo12Hour(maintenanceData?.orders_mod?.start_time)}</h1>
                                        </div>

                                        <div className='flex flex-col'>
                                            <h1 className='text-sm font-akagi font-bold text-gray'>END</h1>
                                            <h1 className='text-sm font-akagi font-medium text-gray'>{getEndTimeOnly(maintenanceData?.orders_mod?.reservation_range)}</h1>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                    </motion.div>   
                }
            </AnimatePresence>
        </div>
                        
    </>
  )
}

export default TransactionRow
