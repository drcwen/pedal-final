import { supabase } from "../../lib/supabase"
import Sidebar from "./sidebar/Sidebar"
import { MdDirectionsBike } from "react-icons/md";
import { motion } from "motion/react"

function Dashboard() {

  return (
    <>

        <div className='w-full h-screen bg-[#F2F2F2] flex'>
            <Sidebar active={'dashboard'}/>

            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }} 
                className='flex flex-col flex-1 py-15 px-10 gap-5'>

                {/*Upper Boards*/}
                <div className='flex flex-row gap-5'>
                    <div className='bg-blue rounded-xl px-5 pl-6 py-5 flex flex-col gap-2'>
                        <div className='flex flex-row justify-between'>
                            <h1 className='font-akagi font-semibold text-md text-[#ffffff]'>Ongoing Rentals</h1>
                            <div className='bg-white rounded-lg px-5 py-2'>
                                <MdDirectionsBike className='text-xl text-[#1C1B1F]'/>
                            </div>

                        </div>

                        <div className='px-2'>
                            <div className='h-full flex flex-row justify-between gap-2'>
                                <div className='flex flex-col gap-2 items-center'>
                                    <h1 className='text-3xl font-akagi font-bold text-[#ffffff]'>236</h1>
                                    <h1 className='text-sm font-akagi font-light text-[#ffffff] text-center'>* from Walk-ins</h1>
                                </div>
                                
                                <div className='h-full w-0.5 bg-white/20'/>

                                <div className='flex flex-col gap-2 items-center'>
                                    <h1 className='text-3xl font-akagi font-bold text-[#ffffff]'>236</h1>
                                    <h1 className='text-sm font-akagi font-light text-[#ffffff] text-center'>* from Walk-ins</h1>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='bg-blue rounded-xl px-5 pl-6 py-5 flex flex-col gap-2'>
                        
                        <div className='flex flex-row justify-between'>
                            <h1 className='font-akagi font-semibold text-md text-[#ffffff]'>Ongoing Rentals</h1>
                            <div className='bg-white rounded-lg px-5 py-2'>
                                <MdDirectionsBike className='text-xl text-[#1C1B1F]'/>
                            </div>

                        </div>

                        <div className='px-2'>
                            <div className='h-full flex flex-row justify-between gap-2'>
                                <div className='flex flex-col gap-2 items-center'>
                                    <h1 className='text-3xl font-akagi font-bold text-[#ffffff]'>236</h1>
                                    <h1 className='text-sm font-akagi font-light text-[#ffffff] text-center'>* from Walk-ins</h1>
                                </div>
                                
                                <div className='h-full w-0.5 bg-white/20'/>

                                <div className='flex flex-col gap-2 items-center'>
                                    <h1 className='text-3xl font-akagi font-bold text-[#ffffff]'>236</h1>
                                    <h1 className='text-sm font-akagi font-light text-[#ffffff] text-center'>* from Walk-ins</h1>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='bg-blue rounded-xl px-5 pl-6 py-5 flex flex-col gap-2'>
                        
                        <div className='flex flex-row justify-between'>
                            <h1 className='font-akagi font-semibold text-md text-[#ffffff]'>Ongoing Rentals</h1>
                            <div className='bg-white rounded-lg px-5 py-2'>
                                <MdDirectionsBike className='text-xl text-[#1C1B1F]'/>
                            </div>

                        </div>

                        <div className='px-2'>
                            <div className='h-full flex flex-row justify-between gap-2'>
                                <div className='flex flex-col gap-2 items-center'>
                                    <h1 className='text-3xl font-akagi font-bold text-[#ffffff]'>236</h1>
                                    <h1 className='text-sm font-akagi font-light text-[#ffffff] text-center'>* from Walk-ins</h1>
                                </div>
                                
                                <div className='h-full w-0.5 bg-white/20'/>

                                <div className='flex flex-col gap-2 items-center'>
                                    <h1 className='text-3xl font-akagi font-bold text-[#ffffff]'>236</h1>
                                    <h1 className='text-sm font-akagi font-light text-[#ffffff] text-center'>* from Walk-ins</h1>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/*Grid*/}
                <div className='flex-1 grid grid-cols-2 grid-rows-2 gap-8'>
                    <div className='bg-[#ffffff] rounded-2xl p-7'>
                        <h1 className='text-lg font-akagi text-[#505050] font-bold'>Ongoing Rentals</h1>

                        <div className=''>

                        </div>
                    </div>

                    <div className='bg-[#ffffff] rounded-2xl p-7'>
                        <h1 className='text-lg font-akagi text-[#505050] font-bold'>Ongoing Rentals</h1>
                    </div>

                    <div className='bg-[#ffffff] rounded-2xl p-7'>
                        <h1 className='text-lg font-akagi text-[#505050] font-bold'>Ongoing Rentals</h1>
                    </div>

                    <div className='bg-[#ffffff] rounded-2xl p-7'>
                        <h1 className='text-lg font-akagi text-[#505050] font-bold'>Ongoing Rentals</h1>
                    </div>
                </div>
            </motion.div>
        </div>
    </>
  )
}

export default Dashboard
