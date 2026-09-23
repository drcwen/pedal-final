import Sidebar from "../sidebar/Sidebar"
import SidebarMobile from "../sidebar/SidebarMobile"
import { useState, useEffect } from "react";
import TransactionRow from "./TransactionRow"
import { Calendar } from 'primereact/calendar';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { motion } from "motion/react"
import { supabase } from "../../../lib/supabase"

function TransactionHistory() {

    const today = new Date();

    const firstDayOfMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        1
    );

    const lastDayOfMonth = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0
    );

    const [dates, setDates] = useState([
        firstDayOfMonth,
        lastDayOfMonth
    ]);

    const [transactionData, setTransactionData] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const getAssistedByFullName = async (userId) => {
        if (!userId) return "Unknown";

        const { data, error } = await supabase
            .from("profiles_mod")
            .select("full_name")
            .eq("id", userId)
            .single();

        if (error) {
            console.error("Error getting user full name:", error);
            return "Unknown";
        }

        return data?.full_name ?? "Unknown";
    };

    function formatDate(timestamp) {
        return new Intl.DateTimeFormat("en-PH", {
            timeZone: "Asia/Manila",
            month: "short",
            day: "numeric",
            year: "numeric",
        }).format(new Date(timestamp));
        }

        useEffect(() => {
            const getTransactions = async () => {

                if (!dates || dates.length < 2 || !dates[0] || !dates[1]) {
                    setTransactionData([]);
                    setLoading(false);
                    return;
                }

                setLoading(true);

                const startDate = dates[0];
                const endDate = dates[1];

                const start = new Date(startDate);
                start.setHours(0, 0, 0, 0);

                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);

                const { data, error } = await supabase
                    .from("transactions_mod")
                    .select(`
                        *,
                        profile:profiles_mod!transactions_mod_user_id_fkey1 (
                            *
                        ),
                        walk_in:walk_ins_users_mod (
                            *
                        ),
                        assisted_by_profile:profiles_mod!transactions_mod_assisted_by_fkey (
                            *
                        ),
                        orders_mod (
                            *,
                            bike_types_mod (*),
                            bikes_mod (*),
                            gps_mod (*)
                        ),
                        extensions_mod (
                            *,
                            bikes_mod(
                            *
                            ),
                            bike_types_mod (
                            *
                            ),
                            orders_mod (
                                *,
                                bikes_mod (
                                    *,
                                    bike_types_mod (
                                        *
                                    )
                                ),
                                transaction:transactions_mod (
                                    *,
                                    profile:profiles_mod!transactions_mod_user_id_fkey1 (*),
                                    walk_in:walk_ins_users_mod (*)
                                )
                            )
                        ),
                        maintenance_mod (
                            *,
                            orders_mod (
                                *,
                                bikes_mod (
                                    *,
                                    bike_types_mod (
                                        *
                                    )
                                ),
                                gps_mod (
                                    *
                                ),
                                transaction:transactions_mod (
                                    profile:profiles_mod!transactions_mod_user_id_fkey1 (*),
                                    walk_in:walk_ins_users_mod (*)
                                )
                            ),
                            bikes_mod (
                                *,
                                bike_types_mod(
                                    *
                                )
                            )
                        ),
                        change_bikes_mod (
                            *,
                            original_bike:bikes_mod!change_bikes_mod_bike_id_fkey (
                                *,
                                bike_type:bike_types_mod (*)
                            ),

                            changed_bike:bikes_mod!change_bikes_mod_changed_bike_id_fkey (
                                *,
                                bike_type:bike_types_mod (*)
                            ),

                            original_bike_type:bike_types_mod!change_bikes_mod_bike_type_id_fkey (*),

                            changed_bike_type:bike_types_mod!change_bikes_mod_changed_bike_type_id_fkey (*),

                            orders_mod (
                                *,
                                bikes_mod (
                                    *,
                                    bike_types_mod (*)
                                ),
                                transaction:transactions_mod (
                                    *,
                                    profile:profiles_mod!transactions_mod_user_id_fkey1 (*),
                                    walk_in:walk_ins_users_mod (*)
                                )
                            )
                        )
                    `)
                    .gte("created_at", start.toISOString())
                    .lte("created_at", end.toISOString())
                    .order("created_at", { ascending: false });

                if (error) {
                    console.error("Transaction error:", error);
                    setLoading(false);
                    return;
                }

                const orderIds = (data ?? []).flatMap((transaction) =>
                    (transaction.orders_mod ?? []).map((order) => order.id)
                );

                let allChangeBikes = [];

                if (orderIds.length > 0) {

                    const {
                        data: changeData,
                        error: changeError
                    } = await supabase
                        .from("change_bikes_mod")
                        .select(`
                            *,

                            original_bike:bikes_mod!change_bikes_mod_bike_id_fkey (
                                *,
                                bike_type:bike_types_mod (*)
                            ),

                            changed_bike:bikes_mod!change_bikes_mod_changed_bike_id_fkey (
                                *,
                                bike_type:bike_types_mod (*)
                            ),

                            original_bike_type:bike_types_mod!change_bikes_mod_bike_type_id_fkey (*),

                            changed_bike_type:bike_types_mod!change_bikes_mod_changed_bike_type_id_fkey (*)
                        `)
                        .in("order_id", orderIds)
                        .order("id", { ascending: true });

                    if (changeError) {
                        console.error("Change bike error:", changeError);
                    } else {
                        allChangeBikes = changeData ?? [];
                    }
                }

                const finalTransactions = (data ?? []).map((transaction) => {

                    const ordersWithOriginalBike =
                        (transaction.orders_mod ?? []).map((order) => {

                            // Find ALL change records for this order
                            const changesForOrder = allChangeBikes
                                .filter(
                                    (change) =>
                                        Number(change.order_id) === Number(order.id)
                                )
                                .sort(
                                    (a, b) =>
                                        Number(a.id) - Number(b.id)
                                );

                            if (changesForOrder.length === 0) {

                                return {
                                    ...order,

                                    original_bike_id: order.bike_id,
                                    original_bike_type_id: order.bike_type_id,

                                    original_bike: order.bikes_mod,
                                    original_bike_type: order.bike_types_mod
                                };
                            }

                            const firstChange = changesForOrder[0];

                            return {
                                ...order,

                                original_bike_id: firstChange.bike_id,
                                original_bike_type_id: firstChange.bike_type_id,

                                original_bike: firstChange.original_bike,

                                original_bike_type:
                                    firstChange.original_bike_type ??
                                    firstChange.original_bike?.bike_type
                            };
                        });

                    return {
                        ...transaction,
                        orders_mod: ordersWithOriginalBike
                    };
                });

                setTransactionData(finalTransactions);
                setLoading(false);
            };

            getTransactions();

        }, [dates]);

  return (
    <>

        <div className='w-full h-screen md:bg-[#F2F2F2] flex'>
            <Sidebar active={'history'}/>

            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }} 
                className='flex-1 p-5'>

                <SidebarMobile active={'history'}/>
                
                <div className='flex flex-col bg-[#ffffff] w-full h-full rounded-xl md:p-10 px-3 py-7 gap-5 overflow-y-scroll scrollbar-thin scrollbar-thumb-[#B9B9B9] scrollbar-track-[#E2E2E2]'>

                    <h1 className='md:text-4xl text-2xl font-akagi font-bold tracking-wide text-blue'>Transaction History</h1>

                    <div className='flex md:flex-row flex-col justify-between md:items-center py-3 gap-3'>
                        <Calendar 
                            value={dates} 
                            onChange={(e) => setDates(e.value)} 
                            selectionMode="range" 
                            readOnlyInput 
                            hideOnRangeSelection 
                            placeholder="Select date range" 
                            showOtherMonths
                            selectOtherMonths
                            className="w-fit" 
                            appendTo={document.body} 
                            inputClassName="w-fit rounded-xl bg-[#D9D9D9] cursor-pointer font-akagi font-bold text-[#505050] border border-[#D9D9D9] md:px-4 md:py-3 px-2 py-2 focus:outline-none" 
                            pt={{ 
                                panel: 
                                { 
                                    className: "mt-2 rounded-2xl border border-[#E2E2E2] bg-white p-6 shadow-xl" 
                                }, 
                                header: 
                                { 
                                    className: "flex items-center justify-between border-none bg-transparent pb-4" 
                                }, 
                                title: 
                                { 
                                    className: "font-akagi text-lg font-bold text-blue w-full text-center" 
                                }, 
                                previousButton: 
                                { 
                                    className: "h-9 w-9 rounded-full text-[#505050] transition hover:bg-[#F0F0F0] flex items-center justify-center" 
                                }, 
                                nextButton: 
                                { 
                                    className: "h-9 w-9 rounded-full text-[#505050] transition hover:bg-[#F0F0F0] flex items-center justify-center" 
                                }, 
                                table: 
                                {
                                    className: "w-full font-akagi text-[#505050] cursor-pointer border-separate border-spacing-y-2 border-spacing-x-4 text-center"
                                }
                            }} 
                        />

                        <div className='pr-10'>
                            <input 
                                placeholder='Search'
                                className='bg-[#DBDBDB] focus:outline-none rounded-xl px-2 py-2 font-akagi font-bold text-[#505050]'/>
                            
                        </div>
                    </div>

                    <div className='flex-1 md:pr-7 pr-2 flex flex-col gap-3'>

                        <div className='flex flex-col gap-2'>

                            <div className='hidden md:grid md:grid-cols-[40px_1fr_1fr_1fr_1fr_1fr_20px] items-center text-center p-2'>
                                <div className=''></div>
                                <div className='flex justify-center font-akagi font-medium text-[#9E9E9E]'>
                                    ID
                                </div>

                                <div className='flex justify-center font-akagi font-medium text-[#9E9E9E]'>
                                    Name
                                </div>

                                <div className='flex justify-center font-akagi font-medium text-[#9E9E9E]'>
                                    Type
                                </div>

                                <div className='flex justify-center font-akagi font-medium text-[#9E9E9E]'>
                                    Time Added
                                </div>

                                <div className='flex justify-center font-akagi font-medium text-[#9E9E9E]'>
                                    Status
                                </div>
                            </div>
                            
                            {loading ? (
                                <div className="flex justify-center py-10">
                                    <h1 className="font-akagi text-lg text-[#6D7172]">
                                        Loading transactions...
                                    </h1>
                                </div>
                            ) : (
                                transactionData.map((transaction) => {

                                    const extensionTransaction =
                                        transaction.type === "extend"
                                            ? transaction.extensions_mod?.[0]?.orders_mod?.transaction
                                            : null;

                                    const changeTransaction =
                                        transaction.type === "change"
                                            ? transaction.change_bikes_mod?.[0]?.orders_mod?.transaction
                                            : null;
                                    
                                    const maintenanceTransaction =
                                        transaction.type === "maintenance"
                                            ? transaction.maintenance_mod?.[0]?.orders_mod?.transaction
                                            : null;

                                    const profile =
                                        transaction.type === "extend"
                                            ? extensionTransaction?.profile
                                            : transaction.type === "change"
                                                ? changeTransaction?.profile
                                                : transaction.type === "maintenance"
                                                    ? maintenanceTransaction?.profile
                                                    : transaction.profile;

                                    const walkIn =
                                        transaction.type === "extend"
                                            ? extensionTransaction?.walk_in
                                            : transaction.type === "change"
                                                ? changeTransaction?.walk_in
                                                : transaction.type === "maintenance"
                                                    ? maintenanceTransaction?.walk_in
                                                    : transaction.walk_in;

                                    const customerName =
                                        transaction.type === "maintenance"
                                            ? profile
                                                ? (
                                                    profile.full_name ??
                                                    `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim()
                                                )
                                                : walkIn?.[0]?.full_name ?? "Management"
                                            : profile
                                                ? (
                                                    profile.full_name ??
                                                    `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim()
                                                )
                                                : walkIn?.[0]?.full_name ?? "Unknown Customer";

                                    const extensionData =
                                        transaction.extensions_mod?.[0];

                                    const changedBikesData =
                                        transaction.change_bikes_mod ?? [];

                                    const maintenanceData =
                                        transaction.maintenance_mod?.[0];

                                    return (
                                        <TransactionRow
                                        key={transaction.id}
                                        totalBikes={
                                            transaction.type === "walk-in" ||
                                            transaction.type === "reservation"
                                                ? transaction.orders_mod.length
                                                : transaction.type === "change"
                                                    ? "C"
                                                    : "E"
                                        }
                                        transactionId={transaction.id}
                                        fullName={customerName}
                                        transactionType={transaction.type}
                                        timeAdded={formatDate(transaction.created_at)}
                                        status={transaction.status}
                                        transactionData={transaction.orders_mod}
                                        transactionPayment={transaction}
                                        extensionsData={extensionData}
                                        changeBikesData={changedBikesData}
                                        maintenanceData={maintenanceData}
                                        assistedBy={transaction?.assisted_by_profile?.full_name ?? "Unknown"}
                                    />
                                    );
                                })


                            )}

                        </div>
                        
                        
                    </div>

                </div>

            </motion.div>
        </div>
    </>
  )
}

export default TransactionHistory
