import { MdModeEditOutline } from "react-icons/md";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react"
import { supabase } from "../../../../../lib/supabase"
import { IoChevronBack } from "react-icons/io5";
import MaintenanceRow from "../Maintenance/MaintenanceRow"

function Maintenance( {setMaintenance }) {

    const [maintenanceInfo, setMaintenanceInfo] = useState([]);
    const [settle, setSettle] = useState(null);

    const [reload, setReload] = useState(false);

    useEffect(() => {
        const fetchMaintenanceBikes = async () => {
            const { data, error } = await supabase
                .from("maintenance_mod")
                .select(`
                    *,
                    orders_mod (
                        *,
                        transactions_mod(*),
                        bikes_mod (
                            *,
                            bike_types_mod (*)
                        )
                    ),
                    transactions_mod (*)
                `)
                .eq('status', 'Ongoing')

                setMaintenanceInfo(data || []);
            
            if(error) {
                alert(error);
            }
        }
        fetchMaintenanceBikes();
    }, []);

    const handleSubmit = async () => {
        if (!settle) return;

        try {
            const { error: maintenanceError } = await supabase
                .from("maintenance_mod")
                .update({
                    status: "Settled",
                })
                .eq("id", settle.maintenanceId);

            if (maintenanceError) {
                console.error("Maintenance update error:", maintenanceError);
                alert("Failed to update maintenance status.");
                return;
            }

            const { error: bikeError } = await supabase
                .from("bikes_mod")
                .update({
                    status: "Available",
                })
                .eq("id", settle.bikeCode);

            if (bikeError) {
                console.error("Bike update error:", bikeError);
                alert("Maintenance was settled, but the bike status could not be updated.");
                return;
            }

            setMaintenanceInfo((prev) =>
                prev.filter((item) => item.id !== settle.maintenanceId)
            );

            setSettle(null);
            setReload(true);

        } catch (error) {
            console.error("Unexpected error:", error);
            alert("Something went wrong while settling the maintenance.");
        }
    };


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

                    <div className='flex flex-row justify-between font-akagi font-medium text-gray items-center px-6'>
                        <div className=''>
                            ID
                        </div>

                        <div className='w-full grid md:grid-cols-[1fr_1fr_1fr] grid-cols-[1fr_1fr]'>
                            <div className='w-full justify-center text-center'>
                                <div className=''>
                                    Bike ID
                                </div>
                            </div>

                            <div className='hidden md:block w-full justify-center text-center'>
                                <div className=''>
                                    Reason
                                </div>
                            </div>

                            <div className='w-full justify-center flex'>
                                <div className=''>
                                    Status
                                </div>
                            </div>
                        </div>

                        <div className='w-3'>
                            
                        </div>
                    </div>
                    <div className='flex flex-col gap-3'>
                        {maintenanceInfo.map((info) => (
                            <MaintenanceRow 
                                key={info.id}
                                bikeId={info.orders_mod?.bikes_mod?.code}
                                bikeCode={info.orders_mod?.bikes_mod?.id}
                                bikeTypeId={info.orders_mod?.bikes_mod?.bike_types_mod?.name}
                                reason={info.reason}
                                status={info.status}
                                price={info.price}
                                paidBy={info.payment_by}
                                payment={info.transactions_mod?.amount_paid}
                                change={info.transactions_mod?.change_amount}
                                method={info.transactions_mod?.payment_method}
                                setSettle={setSettle}
                                settle={settle}
                                maintenanceId={info.id}

                            />
                        ))}

                    </div>


                </div>
                
            </div>
        </motion.div> 

        {settle &&
            <div className='fixed inset-0 bg-black/50 flex justify-center items-center z-50 sm:px-10 px-5 md:px-20 lg:px-60 xl:px-100'>
                <div className='w-100 bg-[#ffffff] rounded-lg p-5 flex flex-col gap-5'>
                    <h1 className='text-center font-akagi font-bold text-blue text-2xl'>Are you sure you want to settle this bike?</h1>

                    <div className='flex flex-col gap-2'>
                        <div className='bg-gray/20 p-3 rounded-lg flex flex-row justify-between items-center'>
                            <div className='flex flex-row gap-2'>
                                <div className='bg-blue rounded-lg p-1 w-fit font-akagi font-bold text-[#ffffff] px-2'>
                                    {settle.bikeId}
                                </div>

                                <div className='font-akagi font-bold text-gray px-2 text-lg'>
                                    {settle.bikeTypeId}
                                </div>
                            </div>

                            <div className='rounded-full px-2 font-akagi font-bold bg-green-400 text-[#ffffff] text-sm py-1 '>
                                Settled
                            </div>
                        </div>
                        
                    </div>

                    <h1 className=' px-6 font-akagi font-medium text-gray text-sm'>This will set the maintenance status to "SETTLED" and the bike will be available for rent.</h1>

                    <div className='flex flex-row justify-between'>

                        <div
                            onClick={() => {setSettle(null)}} 
                            className='w-fit rounded-lg cursor-pointer border border-gray text-gray font-bold py-1 text-md font-akagi px-3'>
                            Back
                        </div>

                        <div
                            onClick={handleSubmit} 
                            className='w-fit rounded-lg cursor-pointer bg-green-500 text-[#ffffff] font-bold py-1 text-md font-akagi px-3'>
                            Yes, I'm sure
                        </div>
                    </div>
                </div>
            </div>
        }

        {reload === true && 
            <div className='fixed inset-0 bg-black/50 flex justify-center items-center z-50 sm:px-10 px-5 md:px-20 lg:px-60 xl:px-100'>
                <div className='bg-[#ffffff] p-5 flex flex-col items-center rounded-xl text-xl gap-5'>
                    <div 
                        className='font-akagi font-bold text-blue'>
                        Action completed successfully.
                    </div>

                    <h1 
                        onClick={() => {window.location.reload()}}
                        className='font-akagi font-medium text-sm hover:underline hover:transition-all cursor-pointer'>Go back</h1>
                </div>
            </div>
        }

    </>
  )
}

export default Maintenance
