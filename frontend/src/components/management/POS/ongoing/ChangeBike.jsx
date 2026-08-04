import { IoIosArrowBack } from "react-icons/io";
import BikesTile from "../walk in rent/BikesTile"
import { useState, useEffect } from 'react';
import { supabase } from "../../../../lib/supabase"
import { motion } from "motion/react"

function ChangeBike({setChangeOrder}) {

    const [info, setInfo] = useState([]);
    const [isOpen, setIsOpen] = useState([]);

    useEffect(() => {
        const fetchBikes = async () => {
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

                <div className='pt-10 md:grid md:grid-cols-3 flex flex-col gap-5'>
                        <div className="col-span-2 rounded-xl">
                            <div className='grid md:grid-cols-3 grid-cols-2 gap-3'>
                                
                                {info.map((bike) => (
                                    <>
                                        
                                        <motion.div
                                            key={bike.id}
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                        >
                                            <div 
                                                onClick={() => {setIsOpen(true)}}
                                                className={`rounded-xl bg-[#EBEBEB] p-4 flex flex-col items-center text-center justify-center gap-4 border border-[#C8C8C8] cursor-pointer
                                                ${isOpen == true ? `bg-blue` : `bg-[#EBEBEB]`}`}>
                                                <img 
                                                    className='w-30'
                                                    src={bike.image_url}/>
                                                <h1 className={`text-lg font-akagi font-bold tracking-wide
                                                    ${isOpen == true ? `text-[#ffffff]` : `text-[#505050] `}
                                                    `}
                                                >
                                                    {bike.name}
                                                </h1>
                                            </div>
                                        </motion.div>
                                    </>
                                ))}
                                
                            </div>
                        </div>

                        <div className="col-span-1 bg-blue-200 rounded-lg p-5">
                            Right Content
                        </div>
                    </div>
            </div>
        </div>
                      
    </>
  )
}

export default ChangeBike
