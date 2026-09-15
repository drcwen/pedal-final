
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react"
import { MdModeEditOutline } from "react-icons/md";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import { IoCloseSharp } from "react-icons/io5";
import { FaCheck } from "react-icons/fa";

function GPSRow({name, battery, status, simNumber, availableData}) {

    const [dropDown, setDropDown] = useState(false);
    const [edit, setEdit] = useState(false);

    const [editName, setEditName] = useState(name);
    const [editSimNumber, setEditSimNumber] = useState(simNumber);

  return (
    <>

        <div className='w-full bg-[#EBEBEB] rounded-xl py-3 border border-[#C9C9C9]'>
            <div className='px-3 md:px-0 grid grid-cols-[1fr_120px_20px] md:grid md:grid-cols-[1fr_1fr_1fr_50px] gap-2 md:text-center items-center font-akagi font-bold text-[#9E9E9E]'>
                <div className=''>{name}</div>
                <div className=''>{battery}</div>
                <div className='hidden md:block'>{status}</div>

                <AnimatePresence initial={false}>
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }} 
                        className='text-xl text-[#9E9E9E]'
                    >
                        {dropDown === true ? <RiArrowDropUpLine onClick={() => {setDropDown(false), setEdit(false)}}/> : <RiArrowDropDownLine onClick={() => {setDropDown(true)}}/> }
                    </motion.div>
                </AnimatePresence>
            </div>

            <AnimatePresence initial={false}>
                {dropDown === true && 
                    
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }} 
                            className='w-full xl:px-8 px-3'
                        >
                            <div className='py-5 grid md:grid-cols-3 xl:grid-cols-3 grid-cols-2 gap-2 text-center font-akagi text-md font-bold text-gray'>
                                <div className='border border-[#c9c9c9] hover:scale-103 hover:shadow-2xl duration-300 transition-all rounded-lg shadow-lg flex flex-col gap-2 py-2 items-center'>
                                    <h1 className='font-medium'>Total Usage Today</h1>
                                    <h1 className='text-xl'>20</h1>
                                </div>

                                <div className='border border-[#c9c9c9] hover:scale-103 hover:shadow-2xl duration-300 transition-all rounded-lg shadow-lg flex flex-col gap-2 py-2 items-center'>
                                    <h1 className='font-medium'>Total Usage This Month</h1>
                                    <h1 className='text-xl'>50</h1>
                                </div>

                                <div className='border border-[#c9c9c9] hover:scale-103 hover:shadow-2xl duration-300 transition-all rounded-lg shadow-lg flex flex-col gap-2 py-2 items-center'>
                                    <h1 className='font-medium'>All Time Total Usage</h1>
                                    <h1 className='text-xl'>120</h1>
                                </div>
                            </div>

                            <div className='flex flex-col gap-2 px-3'>
                                <div className='grid grid-cols-[120px_1fr] gap-2 font-akagi font-bold text-gray items-center'>
                                    <h1>GPS Name:</h1>
                                    {!edit ? <h1 className='font-medium'>{editName}</h1> : <input value={editName} onChange={(e) => {setEditName(e.target.value)}} className='focus:outline-none w-fit md:w-50 font-medium bg-[#ffffff] border border-gray/60 px-1 py-0.5 rounded-md'/>}

                                    <h1>SIM Number:</h1>
                                    {!edit ? <h1 className='font-medium'>{editSimNumber}</h1> : <input value={editSimNumber} onChange={(e) => {setEditSimNumber(e.target.value)}} className='focus:outline-none md:w-50 font-medium bg-[#ffffff] border border-gray/60 px-1 py-0.5 rounded-md'/>}

                                    <h1>Battery:</h1>
                                    <h1 className='font-medium'>{battery}</h1>

                                    <h1>Available Data:</h1>
                                    <h1 className='font-medium'>{availableData} MB</h1>
                                </div>
                            </div>

                            {/*Submit Button for PC*/}
                            <div className=''></div>


                            {/*Mobile Edit, Cancel, and Submit button*/}
                            <div className='flex justify-end'>
                                <div className='flex gap-2 items-center'>
                                    <div 
                                        onClick={() => {setEdit(!edit)}}
                                        className={`px-2 py-2 rounded-lg py-0.5 ${!edit ? "bg-blue text-[#ffffff]" : "border border-gray text-gray"} font-akagi font-bold text-md`}>
                                        {edit ? <IoCloseSharp className='text-md'/> : <MdModeEditOutline className='text-md'/>}
                                    </div>
                                    { edit ?
                                    <div className='px-2 py-2 rounded-lg text-[#ffffff] py-0.5 bg-blue font-akagi font-bold text-md'>
                                        <FaCheck />
                                    </div>
                                    : undefined
                                    }   
                                </div>
                            </div>

                        </motion.div>
                    
                }
            </AnimatePresence>

        </div>
                            
    </>
  )
}

export default GPSRow
