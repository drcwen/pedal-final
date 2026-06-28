import Sidebar from "../sidebar/Sidebar"
import SidebarMobile from "../sidebar/SidebarMobile"
import { useState } from "react";
import { motion } from "motion/react"
import { IoChevronBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { MdOutlineAccountCircle } from "react-icons/md";
import { RiEdit2Line } from "react-icons/ri";
import { IoPersonSharp } from "react-icons/io5";
import { MdWork } from "react-icons/md";

function AccountDetails() {

    const navigate = useNavigate();

  return (
    <>

        <div 
            className='w-full h-screen md:bg-[#F2F2F2] flex'
        >
            <Sidebar active={'accounts'}/>

            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }} 
                className='flex-1 p-5'>

                <SidebarMobile active={'accounts'}/>
                
                <div className='flex flex-col bg-[#ffffff] w-full h-full rounded-xl md:p-10 px-3 py-7 gap-6 overflow-y-scroll scrollbar-thin scrollbar-thumb-[#B9B9B9] scrollbar-track-[#E2E2E2]'>
                        
                    <IoChevronBack 
                        onClick={() => navigate("/accounts")}
                        className='text-3xl text-gray cursor-pointer'
                    />

                    <div className='hidden md:flex md:flex-row md:justify-between md:items-center'>
                        <div className='flex flex-row gap-5 items-center'>
                            <MdOutlineAccountCircle className='lg:text-8xl xl:text-9xl text-[#148BB8] '/>
                            
                            <div className='flex flex-col gap-1'>
                                {/*Name and Account Type*/}
                                <div className='flex flex-row gap-3 font-akagi font-bold text-[#505050] items-center'>
                                    <h1 className='md:text-3xl text-lg'>Wendel Derraco</h1>
                                    <div className='px-3 py-1 bg-[#148BB8] rounded-lg'>
                                        <h1 className='text-lg text-[#ffffff] uppercase tracking-wide'>cashier</h1>
                                    </div>
                                </div>
                                
                                {/*Details and Branch*/}
                                <div className='hidden md:flex md:flex-row gap-3 font-akagi font-bold tracking-wide text-[#505050] items-center'>
                                    <h1 className='text-xl font-medium'>Cashier Account</h1>
                                    <h1 className='text-xl font-medium'>•</h1>
                                    <h1 className='text-xl font-medium'>Main Branch</h1>
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-row gap-3 px-3 py-2 border-2 border-blue font-akagi font-bold text-[#148BB8] md:text-xl text-lg rounded-xl'>
                            <RiEdit2Line className='md:text-2xl text-lg'/>
                            Edit Profile
                        </div>
                    </div>

                    <div className='w-full h-0.5 bg-gray/50 rounded-full'/>
                    
                    {/*Basic Information*/}
                    <div className='w-full flex flex-col gap-5 md:px-5 tracking-wide'>
                        <div className=' flex flex-row gap-3 items-center font-akagi font-bold text-[#505050] text-xl'>
                            <IoPersonSharp className='text-[#148BB8] text-2xl'/>
                            Basic Information
                        </div>

                        <div className='flex flex-col md:grid md:grid-cols-2 gap-3 font-akagi text-lg text-[#505050]'>
                            <div className='flex flex-col'>
                                <h1 className='font-medium'>Username</h1>
                                <h1 className='font-bold'>Wendel Derraco</h1>
                            </div>

                            <div className='flex flex-col'>
                                <h1 className='font-medium'>Email Address</h1>
                                <h1 className='font-bold'>derraco.223436@caloocan.sti.edu.ph</h1>
                            </div>

                            <div className='flex flex-col'>
                                <h1 className='font-medium'>Contact Number</h1>
                                <h1 className='font-bold'>0912 345 6789</h1>
                            </div>

                            <div className='flex flex-col'>
                                <h1 className='font-medium'>Employee ID</h1>
                                <h1 className='font-bold'>cashier-12457723</h1>
                            </div>

                            <div className='flex flex-col'>
                                <h1 className='font-medium'>Date Hired</h1>
                                <h1 className='font-bold'>March 13, 2026</h1>
                            </div>
                        </div>
                    </div>

                    <div className='w-full h-0.5 bg-gray/50 rounded-full'/>

                    {/*Basic Information*/}
                    <div className='w-full flex flex-col gap-5 md:px-5 tracking-wide'>
                        <div className=' flex flex-row gap-3 items-center font-akagi font-bold text-[#505050] text-xl'>
                            <MdWork className='text-[#148BB8] text-2xl'/>
                            Work Details
                        </div>

                        <div className='flex flex-col gap-3 font-akagi text-lg text-[#505050]'>
                            <div className='flex flex-col'>
                                <h1 className='font-medium'>Position</h1>
                                <div className='w-fit border border-[#505050]/30 rounded-lg px-2 py-1'>
                                    <h1 className='font-bold'>Cashier</h1>
                                </div>
                                
                            </div>

                            <div className='flex flex-col'>
                                <h1 className='font-medium'>Branch/Location</h1>
                                <h1 className='font-bold'>La Mesa Eco Park</h1>
                            </div>

                        </div>
                    </div>
                </div>

            </motion.div>
        </div>
    </>
  )
}

export default AccountDetails
