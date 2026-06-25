import Sidebar from "../sidebar/Sidebar"
import SidebarMobile from "../sidebar/SidebarMobile"
import { useState } from "react";
import { motion } from "motion/react"
import { FaPlus } from "react-icons/fa";
import { FaTools } from "react-icons/fa";
import BikeRow from "./BikeRow"

function Inventory() {

    const [activeTab, setActiveTab] = useState("Bike");

  return (
    <>

        <div className='w-full h-screen md:bg-[#F2F2F2] flex'>
            <Sidebar active={'inventory'}/>
            <SidebarMobile active={'inventory'}/>

            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}  
                className='flex-1 p-5'>
                <div className='flex flex-col bg-[#ffffff] w-full h-full rounded-xl md:p-10 px-3 py-7 gap-5 overflow-y-scroll scrollbar-thin scrollbar-thumb-[#B9B9B9] scrollbar-track-[#E2E2E2]'>

                    <h1 className='md:text-4xl text-2xl font-akagi font-bold tracking-wide text-blue'>Inventory</h1>

                    <div className='md:flex md:flex-row md:justify-between flex flex-col gap-5 '>
                        {/*Transaction Types*/}
                            <div className='w-fit rounded-2xl border-3 border-blue grid grid-cols-2'>
                                <div 
                                    onClick={() => setActiveTab("Bike")}
                                    className={`md:p-2 py-2 flex justify-center px-5 cursor-pointer rounded-tl-xl rounded-bl-xl transition-all
                                        ${activeTab === "Bike" ? "bg-blue" : "bg-transparent hover:bg-blue/50 transition-all duration-300"}
                                    `}
                                >
                                    <h1 
                                        className={`text-md lg:text-lg font-akagi font-bold transition-all
                                        ${activeTab === "Bike" ? "text-[#ffffff]" : "text-blue hover:text-[#ffffff] transition-all duration-300"}
                                        `}
                                    >
                                        Bike
                                    </h1>
                                </div>

                                <div 
                                    onClick={() => setActiveTab("gps")}
                                    className={`md:p-2 py-2 rounded-tr-xl rounded-br-xl flex justify-center px-5 cursor-pointer
                                        ${activeTab === "gps" ? "bg-blue" : "bg-transparent hover:bg-blue/50 transition-all duration-300"}
                                    `}
                                >
                                    <h1 className={`text-md lg:text-lg font-akagi font-bold px-5 transition-all
                                        ${activeTab === "gps" ? "text-[#ffffff]" : "text-blue hover:text-[#ffffff] transition-all duration-300"}
                                        `}>GPS</h1>
                                </div>
                            </div>

                        {activeTab === "Bike" &&

                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.25, ease: "easeInOut" }}   
                                className='flex md:flex-row gap-3'
                            >
                                <div className='bg-gray/20 rounded-xl flex items-center px-3 cursor-pointer'>
                                    <FaTools className='text-lg md:text-xl text-red-500'/>
                                </div>
                                <div className='w-fit cursor-pointer bg-blue hover:bg-blue/70 hover:text-[#ffffff] duration-300 transition-all items-center text-center rounded-xl flex flex-row justify-between gap-3 px-3 py-2 md:text-lg text-md font-akagi font-bold text-[#ffffff]'>
                                    <FaPlus className='text-md md:text-bold text-[#ffffff]'/>
                                    Bike Type
                                </div>
                            </motion.div>
                        }
                    </div>

                    {activeTab === "gps" &&

                        <div className='flex md:flex-row gap-3'>
                            <h1>tite</h1>
                        </div>
                    }

                    {activeTab === "Bike" &&

                        <div className='flex flex-col gap-3'>
                            <div className='grid grid-cols-[70px_1fr_1fr_1fr_1fr_20px] gap-4 items-center text-center font-akagi font-bold text-gray'>
                                <h1/>

                                <h1>Type</h1>

                                <h1>Max Capacity</h1>

                                <h1>Rent Per Hour</h1>

                                <h1></h1>

                                <h1></h1>
                            </div>

                            <div className='flex flex-col gap-2'>
                                <BikeRow />
                                <BikeRow />
                                <BikeRow />
                                <BikeRow />
                                <BikeRow />
                            </div>
                        </div>
                    }
                </div>

            </motion.div>
        </div>
    </>
  )
}

export default Inventory
