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

    const [statusFilter, setStatusFilter] = useState("Ongoing");
    const [isLoading, setIsLoading] = useState(true);

    const convertToPhilippineDate = (timestamp) => {
        return new Date(timestamp).toLocaleDateString("en-PH", {
            timeZone: "Asia/Manila",
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
        });
    };

    const convertToPhilippineTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString("en-PH", {
            timeZone: "Asia/Manila",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true
        });
    };

    const groupMaintenanceByDate = (items) => {
        const groups = {};

        items.forEach((info) => {
            const dateKey = new Intl.DateTimeFormat("en-CA", {
                timeZone: "Asia/Manila",
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
            }).format(new Date(info.created_at));

            const dateLabel = new Date(info.created_at).toLocaleDateString(
                "en-PH",
                {
                    timeZone: "Asia/Manila",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                }
            );

            if (!groups[dateKey]) {
                groups[dateKey] = {
                    dateKey,
                    dateLabel,
                    items: [],
                };
            }

            groups[dateKey].items.push(info);
        });

        // Most recent maintenance dates appear first.
        return Object.values(groups).sort((a, b) =>
            b.dateKey.localeCompare(a.dateKey)
        );
    };

    const fetchMaintenanceBikes = async () => {
        setIsLoading(true);

        const { data, error } = await supabase
            .from("maintenance_mod")
            .select(`
                *,
                bikes_mod (
                    *,
                    bike_types_mod (*)
                ),
                orders_mod (
                    *,
                    transaction:transactions_mod (
                        *,
                        profile:profiles_mod!transactions_mod_user_id_fkey1 (*),
                        walk_in:walk_ins_users_mod (*)
                    ),
                    current_bike:bikes_mod!orders_mod_bike_id_fkey (
                        *,
                        bike_types_mod (*)
                    ),
                    original_bike:bikes_mod!orders_mod_initial_bike_id_fkey (
                        *,
                        bike_types_mod (*)
                    )
                ),
                transactions_mod (*)
            `)
            .in("status", ["Ongoing", "Settled"]);

        if (error) {
            console.error("Error fetching maintenance records:", error);
            setIsLoading(false);
            return;
        }

        setMaintenanceInfo(data || []);
        setIsLoading(false);
    };

    const filteredMaintenanceInfo = maintenanceInfo.filter((info) => {
        if (statusFilter === "All") return true;

        return info.status === statusFilter;
    });

    useEffect(() => {
        fetchMaintenanceBikes();
    }, []);

    console.log("Maintenance",maintenanceInfo);

    const bikesId = settle?.bikeCode ?? settle?.managementBikeCode;

    const handleSubmit = async () => {
        if (!settle) return;

        try {
            // Update maintenance status
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

            // Update bike status
            const { error: bikeError } = await supabase
                .from("bikes_mod")
                .update({
                    status: "Available",
                })
                .eq("id", bikesId);

            if (bikeError) {
                console.error("Bike update error:", bikeError);
                alert(
                    "Maintenance was settled, but the bike status could not be updated."
                );
                return;
            }

            // Close the confirmation modal
            setSettle(null);

            // Refresh only the maintenance data
            await fetchMaintenanceBikes();

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


            <div className='flex flex-col gap-3'>

                <div className="flex flex-wrap items-center gap-2">
                    {[
                        { label: "Ongoing", value: "Ongoing" },
                        { label: "Settled", value: "Settled" },
                        { label: "All", value: "All" },
                    ].map((filter) => {
                        const count =
                            filter.value === "All"
                                ? maintenanceInfo.length
                                : maintenanceInfo.filter(
                                    (item) => item.status === filter.value
                                ).length;

                        return (
                            <button
                                key={filter.value}
                                type="button"
                                onClick={() => setStatusFilter(filter.value)}
                                className={`rounded-lg px-4 py-2 font-akagi font-medium
                                    transition-all duration-200
                                    ${
                                        statusFilter === filter.value
                                            ? "bg-blue text-[#ffffff]"
                                            : "bg-gray/10 text-gray hover:bg-gray/20"
                                    }`}
                            >
                                {filter.label}
                                <span className="ml-2 text-sm">
                                    ({count})
                                </span>
                            </button>
                        );
                    })}
                </div>
                {isLoading ? (
                    <div className="text-center py-10 font-akagi font-medium text-gray text-lg">
                        Loading maintenance records...
                    </div>
                ) : filteredMaintenanceInfo.length === 0 ? (
                    <div className="text-center py-10 font-akagi font-medium text-gray text-lg">
                        No {statusFilter === "All" ? "" : statusFilter.toLowerCase() + " "}maintenance records found
                    </div>
                ) : (
                    groupMaintenanceByDate(filteredMaintenanceInfo).map((group) => (
                        <div
                            key={group.dateKey}
                            className="flex flex-col gap-3"
                        >
                            {/* Date heading */}
                            <div className="flex items-center gap-2 mt-4 mb-1">
                                <div className="h-6 w-1.5 rounded-full bg-blue" />

                                <h2 className="font-akagi font-bold text-blue text-lg">
                                    {group.dateLabel}
                                </h2>

                                <span className="text-sm text-gray font-akagi">
                                    ({group.items.length})
                                </span>
                            </div>

                            <div className='flex flex-row justify-between font-akagi font-medium text-gray/50 items-center px-6'>
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

                            {/* Maintenance rows for this date */}
                            {group.items.map((info) => {
                                // Get the original rental transaction
                                const originalTransaction = info.orders_mod?.transaction;

                                const walkInCustomer = Array.isArray(originalTransaction?.walk_in)
                                    ? originalTransaction.walk_in[0]
                                    : originalTransaction?.walk_in;

                                const customer = originalTransaction?.profile ?? walkInCustomer;

                                const customerName =
    (
                                    walkInCustomer?.full_name ??
                                    (
                                        customer
                                            ? `${customer.first_name ?? ""} ${customer.last_name ?? ""}`.trim()
                                            : ""
                                    )
                                ) || "Customer details unavailable";

                                return (
                                    <MaintenanceRow
                                        key={info.id}
                                        bikeId={info.orders_mod?.current_bike?.code}
                                        bikeCode={info.orders_mod?.current_bike?.id}
                                        bikeTypeId={info.orders_mod?.current_bike?.bike_types_mod?.name}

                                        managementBikeId={info.bikes_mod?.code}
                                        managementBikeCode={info.bikes_mod?.id}
                                        managementBikeTypeId={info.bikes_mod?.bike_types_mod?.name}

                                        inventoryBikeCode={info.bikes_mod?.code}
                                        inventoryBikeId={info.bike_id}
                                        inventoryBikeTypeId={info.bikes_mod?.bike_types_mod?.name}

                                        date={convertToPhilippineDate(info.created_at)}
                                        time={convertToPhilippineTime(info.created_at)}
                                        reason={info.reason}
                                        status={info.status}
                                        price={info.price}
                                        paidBy={info.payment_by}
                                        payment={info.transactions_mod?.amount_paid}
                                        change={info.transactions_mod?.change_amount}
                                        method={info.transactions_mod?.payment_method}

                                        customerName={customerName}
                                        customer={customer}
                                        originalTransaction={originalTransaction}
                                        walkInCustomerIdType={walkInCustomer?.id_type}

                                        setSettle={setSettle}
                                        settle={settle}
                                        maintenanceId={info.id}
                                        assistedBy={info.transactions_mod?.assisted_by}

                                        isSettled={info.status === "Settled"}
                                    />
                                );
                            })}
                        </div>
                    ))
                )}

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
                                    {settle.bikeId ?? settle.managementBikeId}
                                </div>

                                <div className='font-akagi font-bold text-gray px-2 text-lg'>
                                    {settle.bikeTypeId ?? settle.managementBikeTypeId}
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

    </>
  )
}

export default Maintenance
