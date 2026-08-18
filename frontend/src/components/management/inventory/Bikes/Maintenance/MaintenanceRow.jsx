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
    method
}) {

    const [dropDown, setDropDown] = useState(false);
    const [statusDropDown, setStatusDropDown] = useState(false);

    return (
        <div className='bg-[#F2F2F2] w-full rounded-lg px-3 py-2 border border-[#c9c9c9]'>

            <div className='flex flex-row justify-between font-akagi font-bold text-gray items-center'>

                <div className='bg-blue py-0.5 px-2 rounded-lg text-[#ffffff] flex items-center'>
                    {bikeId}
                </div>

                <div className='w-full grid md:grid-cols-[1fr_1fr_1fr] grid-cols-[1fr_1fr] items-center'>

                    <div className='w-full justify-center text-center'>
                        <div>
                            {bikeTypeId}
                        </div>
                    </div>

                    <div className='hidden md:block w-full justify-center text-center'>
                        <div>
                            {reason}
                        </div>
                    </div>

                    <div className='w-full flex justify-center'>

                        <div className='relative'>

                            <div
                                onClick={() =>
                                    setStatusDropDown(!statusDropDown)
                                }
                                className={`w-fit ${
                                    status === "Ongoing"
                                        ? 'bg-red-400'
                                        : 'bg-green-400'
                                } rounded-full text-xs flex flex-row gap-2 items-center text-[#ffffff] px-3 py-2 cursor-pointer select-none`}
                            >

                                {status}

                                {statusDropDown ? (
                                    <RiArrowDropUpLine className='text-lg' />
                                ) : (
                                    <RiArrowDropDownLine className='text-lg' />
                                )}

                            </div>

                            {statusDropDown && (
                                <div className='absolute top-full left-1/2 -translate-x-1/2 mt-2 min-w-[120px] bg-gray rounded-lg shadow-lg z-[100] overflow-hidden'>

                                    <div
                                        onClick={() => {
                                            setStatusDropDown(false);
                                        }}
                                        className='text-[#ffffff] px-3 py-2 cursor-pointer hover:bg-blue transition-colors'
                                    >
                                        Ongoing
                                    </div>

                                    <div
                                        onClick={() => {
                                            setStatusDropDown(false);
                                        }}
                                        className='text-[#ffffff] px-3 py-2 cursor-pointer hover:bg-yellow transition-colors'
                                    >
                                        Settled
                                    </div>

                                </div>
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

                            <div className='flex flex-col gap-3 bg-[#ffffff]  p-4 rounded-lg border border-[#c9c9c9] font-akagi font-bold text-md text-black/50'>

                                <h1 className='text-gray text-lg'>
                                    Customer Details
                                </h1>

                                <div className='flex flex-col gap-1 px-5'>

                                    <div className='grid grid-cols-[100px_1fr]'>
                                        <h1>Name:</h1>
                                        <h1>Wendel Derraco</h1>
                                    </div>

                                    <div className='grid grid-cols-[100px_1fr]'>
                                        <h1>Type:</h1>
                                        <h1>Walk-in</h1>
                                    </div>

                                    <div className='grid grid-cols-[100px_1fr]'>
                                        <h1>Name:</h1>
                                        <h1>Wendel Derraco</h1>
                                    </div>

                                </div>
                            </div>


                            <div className='flex flex-col gap-3 bg-[#ffffff] p-4 rounded-lg border border-[#c9c9c9] font-akagi font-bold text-md text-black/50'>

                                <h1 className='text-gray text-lg'>
                                    Maintenance Details
                                </h1>

                                <div className='flex flex-col gap-1 px-5'>

                                    <div className='grid grid-cols-[80px_1fr]'>
                                        <h1>Reason:</h1>
                                        <h1>{reason}</h1>
                                    </div>

                                    <div className='grid grid-cols-[80px_1fr]'>
                                        <h1>Price:</h1>
                                        <h1>P{price}</h1>
                                    </div>

                                    <div className='grid grid-cols-[80px_1fr]'>
                                        <h1>Paid by:</h1>
                                        <h1>{paidBy}</h1>
                                    </div>

                                </div>
                            </div>


                            <div className='flex flex-col gap-3 bg-[#ffffff] p-4 rounded-lg border border-[#c9c9c9] font-akagi font-bold text-md text-black/50'>

                                <h1 className='text-gray text-lg'>
                                    Transaction Details
                                </h1>

                                <div className='flex flex-col gap-1 px-5'>

                                    <div className='grid grid-cols-[100px_1fr]'>
                                        <h1>Total:</h1>
                                        <h1>P{price}</h1>
                                    </div>

                                    <div className='grid grid-cols-[100px_1fr]'>
                                        <h1>Payment:</h1>
                                        <h1>P{payment}</h1>
                                    </div>

                                    <div className='grid grid-cols-[100px_1fr]'>
                                        <h1>Change:</h1>
                                        <h1>P{change}</h1>
                                    </div>

                                    <div className='grid grid-cols-[100px_1fr]'>
                                        <h1>Method:</h1>
                                        <h1>{method}</h1>
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