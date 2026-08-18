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

                            />
                        ))}

                    </div>


                </div>
                
            </div>
        </motion.div> 

    </>
  )
}

export default Maintenance
