import { MdModeEditOutline } from "react-icons/md";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react"
import BikeInventoryInfo from "./BikeInventoryInfo"
import { FaPlus } from "react-icons/fa";
import { RiImageAddFill } from "react-icons/ri";
import { supabase } from "../../../../lib/supabase"

function BikeRow({bikeType, capacity, price, image, bikes, bikeTypeId}) {

    const [dropDown, setDropDown] = useState(false);
    const [addBike, setAddBike] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [bikeId, setBikeId] = useState("");

    const totalBikes = bikes.length;
    
    const availableCount = bikes.filter(
        bike => bike.status === "Available"
    ).length;

    const rentedCount = bikes.filter(
        bike => bike.status === "Rented"
    ).length;

    const maintenanceCount = bikes.filter(
        bike => bike.status === "Under Maintenance"
    ).length;

    const lostCount = bikes.filter(
        bike => bike.status === "Lost"
    ).length;

    const handleNewBikeSubmit = async () => {
        if (!bikeId) return; // Prevent empty submissions
    
        setIsLoading(true); 

        try {
            const { data, error } = await supabase
                .from("bikes_mod")
                .insert({
                    code: bikeId,
                    bike_type_id: bikeTypeId,
                    status: "Available"
                });

            if (error) {
                console.error("Error adding bike:", error);

            } else {
                setAddBike(false); 
                setBikeId("");

            }
        } finally {
            setIsLoading(false); 
            window.location.reload();
        }
    }


  return (
    <>
            <div className='bg-[#EBEBEB] w-full rounded-lg px-3 py-2 border border-[#c9c9c9]'>
                <div className='grid md:grid-cols-[70px_1fr_1fr_1fr_1fr_20px] grid-cols-[1fr_1fr_20px] gap-4 items-center md:text-center font-akagi text-md lg:text-lg font-bold text-gray'>
                    <div className='hidden md:flex items-center justify-center'>
                        <img 
                            className=' w-10'
                            src={image}
                        />
                    </div>

                    <h1>{bikeType}</h1>

                    <h1 className='hidden md:block'>{capacity}</h1>

                    <h1 className='hidden md:block'>{price}</h1>

                    <div className={`w-full flex flex-row justify-center items-center`}>
                        <div className={`bg-blue flex flex-row gap-2 px-5 py-1 rounded-lg items-center cursor-pointer ${dropDown === true ? 'block' : 'hidden'}`}>
                            <MdModeEditOutline className='text-md text-[#ffffff]'/>
                            <h1 className='text-[#ffffff] text-md'>Edit</h1>
                        </div>
                    </div>

                    <AnimatePresence initial={false}>
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }} 
                            className='flex items-center justify-center cursor-pointer'
                        >
                            {dropDown === true ? <RiArrowDropUpLine onClick={() => {setDropDown(false)}}/> : <RiArrowDropDownLine onClick={() => {setDropDown(true)}}/>}
                        </motion.div>
                    </AnimatePresence>
                </div>

                <AnimatePresence initial={false}>
                    {dropDown === true &&
                        <>
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className='flex flex-col gap-7 py-5'
                            >
                                <div className='flex flex-col gap-3'>
                                    <div className='xl:px-8 grid md:grid-cols-3 xl:grid-cols-5 grid-cols-2 gap-2 text-center font-akagi text-md font-bold text-gray'>
                                        <div className='border border-[#c9c9c9] hover:scale-103 hover:shadow-2xl duration-300 transition-all rounded-lg shadow-lg flex flex-col gap-2 py-2 items-center'>
                                            <h1>Total Qty</h1>
                                            <h1 className='text-xl'>{totalBikes}</h1>
                                        </div>

                                        <div className='border border-[#c9c9c9] hover:scale-103 hover:shadow-2xl duration-300 transition-all rounded-lg shadow-lg flex flex-col gap-2 py-2 items-center'>
                                            <h1>Available</h1>
                                            <h1 className='text-xl'>{availableCount}</h1>
                                        </div>

                                        <div className='border border-[#c9c9c9] hover:scale-103 hover:shadow-2xl duration-300 transition-all rounded-lg shadow-lg flex flex-col gap-2 py-2 items-center'>
                                            <h1>Currently Rented</h1>
                                            <h1 className='text-xl'>{rentedCount}</h1>
                                        </div>

                                        <div className='border border-[#c9c9c9] hover:scale-103 hover:shadow-2xl duration-300 transition-all rounded-lg shadow-lg flex flex-col gap-2 py-2 items-center'>
                                            <h1>Under Maintenance</h1>
                                            <h1 className='text-xl'>{maintenanceCount}</h1>
                                        </div>

                                        <div className='border border-[#c9c9c9] hover:scale-103 hover:shadow-2xl duration-300 transition-all rounded-lg shadow-lg flex flex-col gap-2 py-2 items-center'>
                                            <h1>Lost</h1>
                                            <h1 className='text-xl'>{lostCount}</h1>
                                        </div>
                                    </div>
                                </div>

                                <div className='flex flex-col gap-3'>
                                    <div className='hidden px-3 md:grid md:grid-cols-[1fr_1fr_1fr_1fr_1fr_30px] gap-2 font-akagi font-bold text-gray/50 text-md text-center'>
                                        <div className=''>
                                            ID
                                        </div>

                                        <div className=''>
                                            Times Rented
                                        </div>

                                        <div className=''>
                                            Date Added
                                        </div>

                                        <div className=''>
                                            Earnings
                                        </div>

                                        <div className=''>
                                            Status
                                        </div>

                                        <div className='flex items-center justify-center'>
                                            
                                        </div>
                                    </div>

                                    <div className='flex flex-col gap-2'>
                                        {
                                            bikes.map((bike) => (
                                                <BikeInventoryInfo 
                                                    key={bike.id}
                                                    bikeCode={bike.code}
                                                    status={bike.status}
                                                />
                                            ))
                                        }
                                    </div>

                                    <div className='w-full flex items-center justify-center'>
                                        <div 
                                            onClick={() => {setAddBike(true)}}
                                            className='bg-blue text-md font-akagi py-2 items-center cursor-pointer px-3 font-bold text-[#ffffff] rounded-lg flex flex-row gap-3'>
                                            <FaPlus className='text-[#ffffff] text-md'/>
                                            Add New Bike
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    }
                </AnimatePresence>
                </div>

                {addBike === true &&
                    <div className='fixed inset-0 bg-black/60 flex items-center justify-center'>
                        <div className='bg-[#ffffff] p-5 rounded-xl flex md:flex-row flex-col gap-5'>
                            <div className='flex flex-col cursor-pointer gap-2 items-center justify-center'>
                                <div className='bg-[#EBEBEB] p-3 rounded-xl'>
                                    <img src={image} className='w-30 text-gray'/>
                                </div>

                                <h1 className='text-lg font-akagi font-medium cursor-pointer hover:underline text-gray'>{bikeType}</h1>
                            </div>

                            <div className='flex flex-col gap-4 font-akagi font-bold text-gray justify-between'>

                                <h1 className='hidden md:block text-xl text-blue'>Add Bike</h1>
                                <div className='flex flex-col gap-1'>
                                    <h1>Add Bike ID</h1>
                                    <input 
                                        value={bikeId}
                                        onChange={(e) => setBikeId(e.target.value)}
                                        className='focus:outline-none font-medium bg-[#EBEBEB] text-[#505050]/50 rounded-lg py-1 px-2'
                                        placeholder='Enter bike type name'/>
                                </div>

                                <div className='w-full flex flex-row gap-2 justify-end'>
                                    <div 
                                        onClick={() => {setAddBike(false)}}
                                        className='bg-red-500 rounded-lg px-2 py-1 text-[#ffffff] transition-all duration-300 hover:scale-103 cursor-pointer'>
                                        Cancel
                                    </div>

                                    <div 
                                        onClick={isLoading ? undefined : handleNewBikeSubmit}
                                        className={`${isLoading ? 'bg-green-300 cursor-not-allowed' : 'bg-green-500 hover:scale-103 cursor-pointer'} rounded-lg px-2 py-1 text-[#ffffff] transition-all duration-300`}
                                    >
                                        {isLoading ? 'Saving...' : 'Save'}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>    
                }

    </>
  )
}

export default BikeRow
