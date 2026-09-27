
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react"
import { MdModeEditOutline } from "react-icons/md";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import { IoCloseSharp } from "react-icons/io5";
import { FaCheck } from "react-icons/fa";
import { supabase } from "../../../../lib/supabase";

function GPSRow({name, battery, status, simNumber, availableData, gpsId, fetchGPS}) {

    const [dropDown, setDropDown] = useState(false);
    const [edit, setEdit] = useState(false);

    const [editName, setEditName] = useState(name);
    const [editSimNumber, setEditSimNumber] = useState(simNumber);

    const [editError, setEditError] = useState("");
    const [editLoading, setEditLoading] = useState(false);

    const handleEditGPS = async () => {
        setEditError("");

        const trimmedName = editName.trim();
        const trimmedSimNumber = editSimNumber.trim();

        // Basic validation
        if (!trimmedName) {
            setEditError("Please enter a GPS name.");
            return;
        }

        if (!/^09\d{9}$/.test(trimmedSimNumber)) {
            setEditError("SIM number must be exactly 11 digits and start with 09.");
            return;
        }

        setEditLoading(true);

        try {
            const { data: existingName, error: nameError } = await supabase
                .from("gps_mod")
                .select("id")
                .ilike("code", trimmedName)
                .neq("id", gpsId);

            if (nameError) {
                console.error("ERROR CHECKING GPS NAME:", nameError);
                setEditError("Unable to check GPS name.");
                return;
            }

            if (existingName && existingName.length > 0) {
                setEditError("This GPS name already exists.");
                return;
            }

            const { data: existingSim, error: simError } = await supabase
                .from("gps_mod")
                .select("id")
                .eq("sim_number", trimmedSimNumber)
                .neq("id", gpsId);

            if (simError) {
                console.error("ERROR CHECKING SIM NUMBER:", simError);
                setEditError("Unable to check SIM number.");
                return;
            }

            if (existingSim && existingSim.length > 0) {
                setEditError("This SIM number is already registered.");
                return;
            }

            const { data, error } = await supabase
                .from("gps_mod")
                .update({
                    code: trimmedName,
                    sim_number: trimmedSimNumber
                })
                .eq("id", gpsId)
                .select();

            if (error) {
                console.error("ERROR UPDATING GPS:", error);

                if (error.code === "23505") {
                    setEditError("GPS name or SIM number already exists.");
                } else {
                    setEditError("Failed to update GPS.");
                }

                return;
            }

            await fetchGPS();

            setEditName(trimmedName);
            setEditSimNumber(trimmedSimNumber);

            setEdit(false);

        } catch (error) {
            console.error("EDIT GPS ERROR:", error);
            setEditError("Something went wrong. Please try again.");

        } finally {
            setEditLoading(false);
        }
    };

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

                            {editError && (
                                <div className="px-3 mt-2">
                                    <p className="text-red-500 font-akagi font-medium text-sm">
                                        {editError}
                                    </p>
                                </div>
                            )}

                            {/*Mobile Edit, Cancel, and Submit button*/}
                            <div className='flex justify-end'>
                                <div className='flex gap-2 items-center'>
                                    <div 
                                        onClick={() => {setEdit(!edit)}}
                                        className={`px-2 py-2 rounded-lg py-0.5 ${!edit ? "bg-blue text-[#ffffff]" : "border border-gray text-gray"} font-akagi font-bold text-md`}>
                                        {edit ? <IoCloseSharp className='text-md'/> : <MdModeEditOutline className='text-md'/>}
                                    </div>
                                    { edit ?
                                    <div
                                        onClick={!editLoading ? handleEditGPS : undefined}
                                        className={`px-2 py-2 rounded-lg text-[#ffffff] py-0.5 bg-blue font-akagi font-bold text-md ${
                                            editLoading
                                                ? "opacity-50 cursor-not-allowed"
                                                : "cursor-pointer"
                                        }`}
                                    >
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
