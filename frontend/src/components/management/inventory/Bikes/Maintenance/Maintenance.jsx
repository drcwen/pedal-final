import { MdModeEditOutline } from "react-icons/md";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react"
import BikeInventoryInfo from "../BikeInventoryInfo"
import { FaPlus } from "react-icons/fa";
import { RiImageAddFill } from "react-icons/ri";
import { IoChevronBack } from "react-icons/io5";
import MaintenanceRow from "../Maintenance/MaintenanceRow"
function Maintenance( {setMaintenance }) {


  return (
    <>
        <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}  
            className='flex-1 p-5'>
            <div className='flex flex-col bg-[#ffffff] w-full h-full rounded-xl md:p-10 px-3 py-7 gap-10 overflow-y-scroll scrollbar-thin scrollbar-thumb-[#B9B9B9] scrollbar-track-[#E2E2E2]'> 
                <div className='flex flex-row gap-3 font-akagi font-bold items-center'>
                    <IoChevronBack 
                        onClick={() => setMaintenance(false)}
                        className='text-3xl text-gray'
                    />
                    <h1 className='md:text-4xl text-2xl text-blue font-bold'>Maintenance</h1>
                </div>

                <div className='flex flex-col gap-5'>

                    <div className='hidden lg:grid lg:grid-cols-[90px_1fr_1fr_1fr_1fr_90px] gap-2 text-center items-center px-3'>
                        <div className='flex flex-row justify-center items-center'>

                        </div>

                        <div className='text-md font-akagi font-bold text-gray'>
                            Bike ID
                        </div>

                        <div className='text-md font-akagi font-bold text-gray'>
                            Bike Type
                        </div>

                        <div className='text-md font-akagi font-bold text-gray'>
                            Reason
                        </div>

                        <div className='text-md font-akagi font-bold text-gray'>
                            Status
                        </div>

                        <div>
                            
                        </div>

                    </div>
                    
                    <MaintenanceRow />
                </div>
                
            </div>
        </motion.div> 

    </>
  )
}

export default Maintenance
