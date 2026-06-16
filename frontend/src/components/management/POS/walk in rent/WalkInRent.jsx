import { supabase } from "../../../../lib/supabase"
import Sidebar from "../../sidebar/Sidebar"
import SidebarMobile from "../../sidebar/SidebarMobile"
import { FaPlus } from "react-icons/fa6";
import ReservationRow from "../ReservationRow"
import { useState, useEffect } from 'react';
import { motion } from "motion/react"
import { IoChevronBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import BikesTile from "./BikesTile"


function WalkInRent() {
    
    const navigate = useNavigate();
    const [info, setInfo] = useState([]);

    useEffect(() => {
        const fetchBikes = async () => {
            const { data, error } = await supabase
                .from("bike_types_mod")
                .select("*")

            console.log("DATA:", data)
            console.log("ERROR:", error)

            setInfo(data || [])
        }

        fetchBikes()
    }, [])

  return (
    <>

        <div className='w-full h-screen bg-[#F2F2F2] flex'>
            <Sidebar active={'pos'}/>
            <SidebarMobile active={'pos'}/>

            <div className='flex-1 p-4 pb-30 overflow-y-scroll scrollbar-thin scrollbar-thumb-[#B9B9B9] scrollbar-track-[#E2E2E2] min-[1330px]:pr-48'>
                <div className='flex flex-col gap-5'>
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }} 

                        className='md:p-10 p-2 py-8 bg-[#ffffff] rounded-xl flex flex-col gap-12'
                    >
                        <div 
                            onClick={() => navigate("/pos")}
                            className='flex flex-row items-center gap-2 cursor-pointer'
                        >
                            <IoChevronBack className='text-3xl text-gray'/>
                            <h1 className='text-4xl font-akagi font-black tracking-wide text-blue'>Bikes</h1>
                        </div>

                        <div className='h-full flex flex-col gap-7 md:px-5 px-3'>
                            
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
                                
                                {info.map((bike) => (
                                    <BikesTile 
                                        name={bike.name}
                                        image={bike.image_url}
                                    />
                                ))}

                                <BikesTile  
                                    name="Mountain Bike"
                                    image="https://res.cloudinary.com/dp3vkgxtb/image/upload/v1775884918/solo_bike_mhxxvb.png"
                                    
                                />

                                <BikesTile  
                                    name="Mountain Bike"
                                    image="https://res.cloudinary.com/dp3vkgxtb/image/upload/v1775884918/solo_bike_mhxxvb.png"
                                    
                                />

                                <BikesTile  
                                    name="Mountain Bike"
                                    image="https://res.cloudinary.com/dp3vkgxtb/image/upload/v1775884918/solo_bike_mhxxvb.png"
                                    
                                />
                                
                            </div>
                        </div>                    
                    </motion.div>

                    <div className='flex bg-[#ffffff] p-10 rounded-xl flex-col gap-6'>
                        <h1 className='font-akagi text-3xl font-black text-blue'>Walk-in Rent</h1>

                        <div className='min-h-70 md:grid md:grid-cols-2 flex flex-col gap-10'>
                            <div className='flex flex-col gap-4'>
                                <div className='flex flex-row justify-between items-center'>
                                    
                                    <div className='flex flex-row gap-4 items-center'>
                                        <div className='bg-yellow p-2 rounded-lg'>
                                            <img 
                                                src='https://res.cloudinary.com/dp3vkgxtb/image/upload/v1775884918/solo_bike_mhxxvb.png'
                                                className='w-10'
                                            />
                                        </div>
                                        <h1 className='text-lg font-bold font-akagi text-[#6D7172]'>Hello</h1>
                                    </div>

                                    <h1 className='text-lg font-bold font-akagi text-[#6D7172]'>P200</h1>
                                </div>

    
                            </div>
                            <div className='flex flex-col gap-6 justify-between'>
                                <div className='bg-white p-6 rounded-xl flex flex-col gap-3'>
                                    <h1 className='text-2xl font-bold font-akagi text-[#6D7172]'>Payment</h1>

                                    <div className='grid grid-cols-2 gap-3'>
                                        <div className='border-2 border-gray rounded-lg text-center py-2'>
                                            <h1 className='text-xl font-bold font-akagi text-gray'>GCash</h1>
                                        </div>

                                        <div className='border-2 border-gray rounded-lg text-center py-2'>
                                            <h1 className='text-xl font-bold font-akagi text-gray'>Cash</h1>
                                        </div>
                                    </div>
                                </div>

                                <div className='w-fit self-end bg-yellow rounded-xl px-8 py-3 text-center'>
                                    <h1 className='text-xl font-bold font-akagi text-darkblue'>Payment</h1>
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

export default WalkInRent
