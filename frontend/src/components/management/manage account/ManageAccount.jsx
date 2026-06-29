import Sidebar from "../sidebar/Sidebar"
import SidebarMobile from "../sidebar/SidebarMobile"
import { useState } from "react";
import { motion } from "motion/react"
import { IoArchive } from "react-icons/io5";
import { BsPersonPlusFill } from "react-icons/bs";
import AccountCard from "./AccountCard"
import { useNavigate } from "react-router-dom";
import { IoChevronBack } from "react-icons/io5";

function ManageAccount() {

    const [activeTab, setActiveTab] = useState("Cashier");
    const navigate = useNavigate();

    const [archive, setArchive] = useState(false);
  return (
    <>

        <div className='w-full h-screen md:bg-[#F2F2F2] flex'>
            <Sidebar active={'accounts'}/>

            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }} 
                className='flex-1 p-5'>

                <SidebarMobile active={'accounts'}/>
                
                <div className='flex flex-col bg-[#ffffff] w-full h-full rounded-xl md:p-10 px-3 py-7 gap-6 overflow-y-scroll scrollbar-thin scrollbar-thumb-[#B9B9B9] scrollbar-track-[#E2E2E2]'>

                    <h1 className='md:text-4xl text-2xl font-akagi font-bold tracking-wide text-blue'>Manage Accounts</h1>
                    
                    <div className='flex md:flex-row flex-col gap-5 md:justify-between'>

                        {/*Account Types*/}
                        <div className='w-fit rounded-2xl border-3 border-blue grid grid-cols-2'>
                            <div 
                                onClick={() => setActiveTab("Cashier")}
                                className={`md:p-2 py-2 flex justify-center px-5 cursor-pointer rounded-tl-xl rounded-bl-xl transition-all
                                    ${activeTab === "Cashier" ? "bg-blue" : "bg-transparent hover:bg-blue/50 transition-all duration-300"}
                                `}
                            >
                                <h1 
                                    className={`text-md lg:text-lg font-akagi font-bold transition-all
                                    ${activeTab === "Cashier" ? "text-[#ffffff]" : "text-blue hover:text-[#ffffff] transition-all duration-300"}
                                    `}
                                >
                                    Cashier
                                </h1>
                            </div>

                            <div 
                                onClick={() => setActiveTab("Admin")}
                                className={`md:p-2 py-2 rounded-tr-xl rounded-br-xl flex justify-center px-5 cursor-pointer
                                    ${activeTab === "Admin" ? "bg-blue" : "bg-transparent hover:bg-blue/50 transition-all duration-300"}
                                `}
                            >
                                <h1 className={`text-md lg:text-lg font-akagi font-bold px-5 transition-all
                                    ${activeTab === "Admin" ? "text-[#ffffff]" : "text-blue hover:text-[#ffffff] transition-all duration-300"}
                                    `}>Admin</h1>
                            </div>
                        </div>

                        {/*Search, Archive, and Add*/}
                        <div className='flex flex-row gap-4 items-center cursor-pointer'>
                            {/*Search*/}
                            <input className='bg-[#DBDBDB] focus:outline-none px-2 py-1 text-lg font-akagi font-bold text-[#9E9E9E] rounded-xl' placeholder='Search'/>
                            
                            {/*Archive Button*/}
                            <IoArchive 
                                onClick={() => setArchive(true)}
                                className='text-blue text-4xl hover:text-blue/70 transition-all duration-300'/>

                            {/*Add Account Button*/}
                            <BsPersonPlusFill className='text-blue text-4xl hover:text-blue/70 transition-all duration-300'/>
                        </div>
                    </div>

                    <div className=''>
        
                        {activeTab === "Cashier" && 
                            <>
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.25, ease: "easeInOut" }}  
                                    className='w-full grid grid-cols-2 xl:grid-cols-5 lg:grid-grid-cols-4 md:grid-cols-3 gap-5 text-center'
                                >
                                    <AccountCard onClick={() => navigate('/accounts/02000223436')}/>
                                    <AccountCard />
                                    <AccountCard />
                                    <AccountCard />
                                    <AccountCard />
                                    
                                </motion.div>
                            </>
                        }

                        {activeTab === "Admin" && 
                            <>
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.25, ease: "easeInOut" }}  
                                    className='w-full grid grid-cols-2 xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 gap-5 text-center'
                                >
                                    <AccountCard onClick={() => navigate('/accounts/02000223436')}/>
                                    <AccountCard />
                                    <AccountCard />
                                    <AccountCard />
                                    
                                </motion.div>
                            </>
                        }

                    </div>

                    {/*Archive*/}
                    {archive === true &&
                        <>
                            <div className='fixed inset-0 bg-black/60 flex flex-col items-center justify-center p-10 xl:p-30'>

                                <div className='w-full h-full rounded-xl p-5 bg-[#ffffff] pt-7'>
                                    <div className='flex flex-row gap-1'>
                                        <IoChevronBack 
                                            onClick={() => setArchive(false)}
                                            className='text-3xl text-gray cursor-pointer'
                                        />
                                        {activeTab === 'Cashier' ? <h1 className='md:text-4xl text-2xl font-akagi font-bold tracking-wide text-blue'>Cashier Archive</h1> : <h1 className='md:text-4xl text-2xl font-akagi font-bold tracking-wide text-blue'>Admin Archive</h1>}
                                    </div>
                                </div>
                                
                                
                            </div>
                        </>
                    }
                </div>

            </motion.div>
        </div>
    </>
  )
}

export default ManageAccount
