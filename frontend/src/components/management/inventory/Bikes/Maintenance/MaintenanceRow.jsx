import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

function MaintenanceRow({
    bikeId,
    bikeTypeId,
    reason,
    status,
    price,
    paidBy,
    payment,
    change,
    method,
    setSettle,
    settle,
    bikeCode,
    maintenanceId,
    assistedBy,
    date,
    time,
    managementBikeId,
    managementBikeTypeId,
    managementBikeCode,

    inventoryBikeCode,
    inventoryBikeTypeId,
    inventoryBikeId,
    
    customerName,
    customer,
    originalTransaction,
    walkInCustomerIdType,

    isSettled
}) {

    const [dropDown, setDropDown] = useState(false);
    const [statusDropDown, setStatusDropDown] = useState(false);

    return (
        <div className='bg-[#F2F2F2] w-full rounded-lg px-3 py-2 border border-gray/30'>

            <div className='flex flex-row justify-between font-akagi font-bold text-gray items-center'>

                <div className='bg-blue py-0.5 px-2 rounded-lg text-[#ffffff] flex items-center'>
                    {bikeId === undefined ? inventoryBikeCode : bikeId}
                </div>

                <div className='w-full grid md:grid-cols-[1fr_1fr_1fr] grid-cols-[1fr_1fr] items-center'>

                    <div className='w-full justify-center text-center'>
                        <div>
                            {bikeTypeId === undefined ? inventoryBikeTypeId : bikeTypeId}
                        </div>
                    </div>

                    <div className='hidden md:block w-full justify-center text-center'>
                        <div>
                            {reason}
                        </div>
                    </div>

                    <div className='w-full flex justify-center'>

                        <div className="relative">
                            {isSettled ? (
                                // Settled records display a status label only.
                                <div className="w-fit bg-green-400 rounded-full text-xs flex items-center text-[#ffffff] px-3 py-2 select-none">
                                    Settled
                                </div>
                            ) : (
                                <>
                                    <div
                                        onClick={() => setStatusDropDown(!statusDropDown)}
                                        className="w-fit bg-red-400 rounded-full text-xs flex flex-row gap-2 items-center text-[#ffffff] px-3 py-2 cursor-pointer select-none"
                                    >
                                        Ongoing

                                        {statusDropDown ? (
                                            <RiArrowDropUpLine className="text-lg" />
                                        ) : (
                                            <RiArrowDropDownLine className="text-lg" />
                                        )}
                                    </div>

                                    {statusDropDown && (
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 min-w-[120px] bg-gray rounded-lg shadow-lg z-[100] overflow-hidden">
                                            <div
                                                onClick={() => setStatusDropDown(false)}
                                                className="text-[#ffffff] px-3 py-2 cursor-pointer hover:bg-blue transition-colors"
                                            >
                                                Ongoing
                                            </div>

                                            <div
                                                onClick={() => {
                                                    setStatusDropDown(false);

                                                    setSettle({
                                                        bikeId,
                                                        bikeTypeId,
                                                        reason,
                                                        status,
                                                        settle,
                                                        bikeCode,
                                                        maintenanceId,
                                                        managementBikeId,
                                                        managementBikeCode,
                                                        managementBikeTypeId,
                                                    });
                                                }}
                                                className="text-[#ffffff] px-3 py-2 cursor-pointer hover:bg-yellow transition-colors"
                                            >
                                                Settled
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div>
                    <RiArrowDropDownLine
                        onClick={() => setDropDown(!dropDown)}
                        className='text-2xl cursor-pointer'
                    />
                </div>

            </div>


            {/* EXPANDED INFORMATION */}
            <AnimatePresence initial={false}>

                {dropDown && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                            duration: 0.3,
                            ease: "easeInOut"
                        }}
                        className='flex flex-col gap-3 overflow-hidden'
                    >

                        <div className='md:grid xl:grid-cols-3 mt-5 md:grid-cols-2 flex flex-col gap-3'>

                            <div className={`${bikeId === undefined ? "hidden" : "block"} flex flex-col gap-3 bg-[#ffffff]  p-4 rounded-lg border border-gray/30 font-akagi font-bold text-md text-gray`}>

                                <h1 className='text-gray text-lg'>
                                    Customer Details
                                </h1>

                                <div className="flex flex-col gap-1 px-5">

                                    <div className="grid grid-cols-[100px_1fr]">
                                        <h1>Name:</h1>
                                        <h1 className='font-medium'>{customerName}</h1>
                                    </div>

                                    <div className="grid grid-cols-[100px_1fr]">
                                        <h1>Type:</h1>
                                        <h1 className='font-medium'>
                                            {originalTransaction?.profile
                                                ? "Reservation Customer"
                                                : originalTransaction?.walk_in
                                                    ? "Walk-in Customer"
                                                    : "Customer type unavailable"}
                                        </h1>
                                    </div>

                                </div>
                            </div>


                            <div className='flex flex-col gap-3 bg-[#ffffff] p-4 rounded-lg border border-gray/30 font-akagi font-bold text-md text-gray'>

                                <h1 className='text-gray text-lg'>
                                    Maintenance Details
                                </h1>

                                <div className='flex flex-col gap-1 px-5'>

                                    <div className='grid grid-cols-[80px_1fr]'>
                                        <h1>Reason:</h1>
                                        <h1 className='font-medium'>{reason}</h1>
                                    </div>

                                    <div className='grid grid-cols-[80px_1fr]'>
                                        <h1>Price:</h1>
                                        <h1 className='font-medium'>P{price}</h1>
                                    </div>

                                    <div className='grid grid-cols-[80px_1fr]'>
                                        <h1>Paid by:</h1>
                                        <h1 className='font-medium'>{paidBy}</h1>
                                    </div>

                                </div>
                            </div>


                            <div className='flex flex-col gap-3 bg-[#ffffff] p-4 rounded-lg border border-gray/30 font-akagi font-bold text-md text-gray'>

                                <h1 className='text-gray text-lg'>
                                    Transaction Details
                                </h1>

                                <div className='flex flex-col gap-1 px-5'>

                                    <div className='grid grid-cols-[100px_1fr]'>
                                        <h1>Total:</h1>
                                        <h1 className='font-medium'>P{price}</h1>
                                    </div>

                                    <div className='grid grid-cols-[100px_1fr]'>
                                        <h1>Payment:</h1>
                                        <h1 className='font-medium'>P{payment}</h1>
                                    </div>

                                    <div className='grid grid-cols-[100px_1fr]'>
                                        <h1>Change:</h1>
                                        <h1 className='font-medium'>P{change}</h1>
                                    </div>

                                    <div className='grid grid-cols-[100px_1fr]'>
                                        <h1>Method:</h1>
                                        <h1 className='font-medium'>{method}</h1>
                                    </div>

                                    <div className='grid grid-cols-[100px_1fr]'>
                                        <h1>Date:</h1>
                                        <h1 className='font-medium'>{date}</h1>
                                    </div>

                                    <div className='grid grid-cols-[100px_1fr]'>
                                        <h1>Time:</h1>
                                        <h1 className='font-medium'>{time}</h1>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </motion.div>
                )}

            </AnimatePresence>

        </div>
    );
}

export default MaintenanceRow;