import { IoIosArrowBack } from "react-icons/io";
import BikesTile from "../walk in rent/BikesTile"
import { useState, useEffect } from 'react';
import { supabase } from "../../../../lib/supabase"
import { motion } from "motion/react"
import { RiArrowLeftRightLine } from "react-icons/ri";

function ChangeBike({setChangeOrder, changeOrder}) {

    const [info, setInfo] = useState([]);
    const [isOpen, setIsOpen] = useState();

    const [openBikeId, setOpenBikeId] = useState(null);

    const [loading, setLoading] = useState(true);    

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

  return (
    <>

        <div className="w-full h-full fixed inset-0 bg-black/50 flex justify-center items-center z-50 md:p-5">
            <div className='bg-[#ffffff] md:p-10 p-5 pt-15 md:pt-10 md:rounded-xl w-full h-full flex flex-col overflow-y-scroll scrollbar-thin scrollbar-thumb-[#B9B9B9] scrollbar-track-[#E2E2E2]'>
                <div className='flex flex-row gap-1 items-center'>
                    <div onClick={() => {setChangeOrder(null)}}>
                        <IoIosArrowBack className='text-gray text-3xl cursor-pointer'/>
                    </div>
                    <h1 className='text-3xl font-akagi font-bold text-blue'>Change Bike</h1>
                </div>

                <div className='w-full h-full pt-10 md:grid md:grid-cols-3 flex flex-col gap-5'>
                        <div className="col-span-2 rounded-xl flex flex-col gap-5">

                            <div className='grid md:grid-cols-3 grid-cols-1 gap-3'>
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

                            <div className='grid md:grid-cols-3 grid-cols-2 gap-3'>
                                
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

                                                onClick={() => {setOpenBikeId(bike.id)}}
                                                className={`rounded-xl bg-[#EBEBEB] p-4 flex flex-col items-center text-center justify-center gap-4 border border-[#C8C8C8] cursor-pointer
                                                ${openBikeId == bike.id ? `bg-blue` : `bg-[#EBEBEB]`}
                                                ${bike.bikes_mod.length === 0 ? `opacity-50 bg-black pointer-events-none` : ``}`}>
                                                <img 
                                                    className='w-30'
                                                    src={bike.image_url}/>
                                                <h1 className={`text-lg font-akagi font-bold tracking-wide
                                                    ${openBikeId == bike.id ? `text-[#ffffff]` : `text-[#505050] `}
                                                    `}
                                                >
                                                    {bike.name}
                                                </h1>

                                                {openBikeId == bike.id &&
                                                    <motion.div
                                                        key="content"
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.3, ease: "easeInOut" }}className='flex flex-col w-full gap-3'
                                                        className='bg-yellow rounded-lg px-3 py-1 font-akagi font-bold text-navyblue'
                                                    >
                                                            CHANGE
                                                    </motion.div>
                                                }
                                            </div>
                                        </motion.div>
                                    </>
                                )
                                ))}
                                
                            </div>
                        </div>

                        <div className="col-span-1 border border-[#C8C8C8] rounded-xl p-5 flex flex-col gap-7">
                            <h1 className='text-2xl font-akagi font-bold text-blue'>Change Bike</h1>

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

                                    <div className='text-xl font-akagi font-bold text-blue'>
                                        P{changeOrder.pricePerHour}
                                    </div>
                                </div>

                                <div className='flex flex-row justify-between gap-5 items-center pl-5'>
                                    <RiArrowLeftRightLine className='text-2xl text-darkblue'/>
                                    <div className='w-full flex flex-row justify-between items-center'>
                                    
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

                                        <div className='text-xl font-akagi font-bold text-blue'>
                                            P{changeOrder.pricePerHour}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            </div>
        </div>
                      
    </>
  )
}

export default ChangeBike
