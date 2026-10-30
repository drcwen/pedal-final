import { supabase } from "../../../lib/supabase"
import Sidebar from "../sidebar/Sidebar"
import SidebarMobile from "../sidebar/SidebarMobile"
import { FaPlus } from "react-icons/fa6";
import ReservationRow from "./reservation/ReservationRow"
import OngoingRow from "./ongoing/OngoingRow"
import { useState, useEffect, useRef } from 'react';
import { motion } from "motion/react"
import { useNavigate } from "react-router-dom";
import { TbHistory } from "react-icons/tb";
import { IoMdClose } from "react-icons/io";

function POS({ role }) {

    const [activeTab, setActiveTab] = useState("ongoing");
    const navigate = useNavigate();

    const [transactions, setTransactions] = useState([]);
    const [reservationHistory, setReservationHistory] = useState([]);
    const [ongoing, setOngoing] = useState([]);

    const [currentTime, setCurrentTime] = useState(new Date());

    const [history, setHistory] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");
    const [highlightedTransactionId, setHighlightedTransactionId] = useState(null);
    const [searchMessage, setSearchMessage] = useState("");

    const ongoingRowRefs = useRef({});

    const handleSearch = () => {
        const search = searchTerm.trim().toLowerCase();

        if (!search) {
            setSearchMessage("Please enter a name or bike ID.");
            setHighlightedTransactionId(null);
            return;
        }

        // Search through ongoing transactions
        const matchedTransaction = ongoing.find((trans) => {
            const customerName = trans.profile
                ? (
                    trans.profile.full_name ||
                    `${trans.profile.first_name || ""} ${trans.profile.last_name || ""}`
                )
                : (
                    trans.walk_in?.[0]?.full_name || ""
                );

            // Search customer name
            const nameMatches = customerName
                .toLowerCase()
                .includes(search);

            // Search bike IDs/codes attached to the transaction
            const bikeMatches = trans.orders_mod?.some((order) => {
                const bike = order.bikes_mod;

                const bikeIdentifiers = [
                    bike?.code,
                    bike?.id,
                    order.bike_id,
                ];

                return bikeIdentifiers.some((identifier) =>
                    String(identifier ?? "")
                        .toLowerCase()
                        .includes(search)
                );
            });

            return nameMatches || bikeMatches;
        });

        if (!matchedTransaction) {
            setHighlightedTransactionId(null);
            setSearchMessage("No matching ongoing transaction found.");
            return;
        }

        setSearchMessage("");
        setActiveTab("ongoing");
        setHighlightedTransactionId(matchedTransaction.id);
    };

    const fetchTransactions = async () => {
        // Get reservations that have not reached their end time.
        const { data: activeReservations, error: rpcError } =
            await supabase.rpc("get_active_pending_reservations");

        if (rpcError) {
            console.error("Error fetching active reservations:", rpcError);
            return;
        }

        const transactionIds = (activeReservations || []).map(
            (transaction) => transaction.id
        );

        if (transactionIds.length === 0) {
            setTransactions([]);
            return;
        }

        // Fetch the full reservation details for the active transactions.
        const { data, error } = await supabase
            .from("transactions_mod")
            .select(`
                *,
                customer:profiles_mod!transactions_mod_user_id_fkey1 (
                    *
                ),
                walk_in:walk_ins_users_mod (*),
                orders_mod!inner (
                    *,
                    current_bike:bikes_mod!orders_mod_bike_id_fkey (
                        *,
                        bike_types_mod (*)
                    ),
                    original_bike:bikes_mod!orders_mod_initial_bike_id_fkey (
                        *,
                        bike_types_mod (*)
                    ),
                    bike_types_mod (
                        *
                    )
                )
            `)
            .in("id", transactionIds);

        if (error) {
            console.error("Error fetching reservation details:", error);
            return;
        }

        if (error) {
            console.error("Error fetching reservation details:", error);
            return;
        }

        setTransactions(data || []);
    };

    const fetchHistory = async () => {
        const { data: expiredReservations, error: rpcError } =
            await supabase.rpc("get_expired_pending_reservations");

        if (rpcError) {
            console.error("Error fetching expired reservations:", rpcError);
            return;
        }

        const transactionIds = (expiredReservations || []).map(
            (transaction) => transaction.id
        );

        if (transactionIds.length === 0) {
            setReservationHistory([]);
            return;
        }

        const { data, error } = await supabase
            .from("transactions_mod")
            .select(`
                *,
                customer:profiles_mod!transactions_mod_user_id_fkey1 (
                    *
                ),
                orders_mod!inner (
                    *,
                    bike_types_mod (
                        *
                    )
                )
            `)
            .in("id", transactionIds);

        if (error) {
            console.error("Error fetching reservation history details:", error);
            return;
        }

        setReservationHistory(data || []);
    };

    
    useEffect(() => {
        if (activeTab !== "reservation") return;

        // Fetch both lists immediately.
        fetchTransactions();
        fetchHistory();

        // Keep both lists updated while Reservations is selected.
        const interval = setInterval(() => {
            fetchTransactions();
            fetchHistory();
        }, 15000);

        return () => clearInterval(interval);
    }, [activeTab]);

    useEffect(() => {
        fetchTransactions();
        fetchOngoing();
    }, [])

    //for time and date
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const fetchOngoing = async () => {
        const { data, error } = await supabase
            .from("transactions_mod")
            .select(`
                *,
                profile:profiles_mod!transactions_mod_user_id_fkey1 (*),
                walk_in:walk_ins_users_mod (*),
                orders_mod (
                    *,
                    bike_types_mod (*),
                    current_bike:bikes_mod!orders_mod_bike_id_fkey (
                        *,
                        bike_types_mod (*)
                    ),
                    original_bike:bikes_mod!orders_mod_initial_bike_id_fkey (
                        *,
                        bike_types_mod (*)
                    ),
                    gps_mod (*),
                    extensions_mod (*)
                ),
                assisted_by_profile:profiles_mod!transactions_mod_assisted_by_fkey (*)
            `)
            .eq("status", "started");

        if (error) {
            console.error("Error fetching ongoing transactions:", error);
            return;
        }

        setOngoing(data ?? []);
    };

    const handleTabChange = async (tab) => {
        setActiveTab(tab);

        if (tab === "reservation") {
            await fetchTransactions();
            await fetchHistory();
        } else {
            await fetchOngoing();
        }
    };

    const groupedReservations = transactions.reduce((groups, trans) => {
        const startTime = trans.orders_mod?.[0]?.reservation_date;

        if (!startTime) return groups;

        const date = new Date(startTime + "T00:00:00").toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });

        if (!groups[date]) {
            groups[date] = [];
        }

        groups[date].push(trans);

        return groups;
    }, {});

    const groupedHistory = reservationHistory.reduce((groups, trans) => {
        const startTime = trans.orders_mod?.[0]?.reservation_date;

        if (!startTime) return groups;

        const date = new Date(startTime + "T00:00:00").toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });

        if (!groups[date]) {
            groups[date] = [];
        }

        groups[date].push(trans);

        return groups;
    }, {});

    const formatTime = (time) => {
        if (!time) return "";

        const [hour, minute] = time.split(":");

        let hours = Number(hour);
        const ampm = hours >= 12 ? "PM" : "AM";

        hours = hours % 12;
        if (hours === 0) hours = 12;

        return `${hours}:${minute} ${ampm}`;
    };

    useEffect(() => {
        if (!highlightedTransactionId) return;

        const timeout = setTimeout(() => {
            setHighlightedTransactionId(null);
        }, 5000);

        return () => clearTimeout(timeout);
    }, [highlightedTransactionId]);


  return (
    <>


        <div className='w-full h-screen bg-[#F2F2F2] flex'>
            <Sidebar active={'pos'} userRole={role} />
            

            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }} 
                className='flex-1 lg:p-5'>

                <SidebarMobile active={'pos'}/>
                
                    
                <div className='w-full h-full p-10 bg-[#ffffff] rounded-xl flex flex-col gap-12 overflow-y-scroll scrollbar-thin scrollbar-none scrollbar-thumb-[#B9B9B9] scrollbar-track-[#E2E2E2]'>
                    
                    <div className='flex flex-col gap-12'>
                        <div className='flex flex-row gap-5'>
                            {/* Search */}
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2 rounded-xl bg-gray/20 px-3 py-2">
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                handleSearch();
                                            }
                                        }}
                                        placeholder="Search name or bike ID"
                                        className="min-w-0 flex-1 bg-transparent text-md lg:text-lg font-akagi font-medium text-gray outline-none"
                                    />

                                    <button
                                        type="button"
                                        onClick={handleSearch}
                                        className="rounded-lg bg-blue px-4 py-1 font-akagi font-bold text-[#ffffff] transition hover:opacity-80"
                                    >
                                        Search
                                    </button>
                                </div>

                                {searchMessage && (
                                    <p className="font-akagi text-sm text-red-500">
                                        {searchMessage}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className='flex flex-col gap-5'>
                            {/*Date*/}
                            <div className=''>
                                <h1 className='text-lg lg:text-2xl font-akagi font-bold text-[#9E9E9E]'>
                                    {currentTime.toLocaleDateString("en-US", {
                                        weekday: "long",
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </h1>

                                <p className="text-md font-akagi text-[#9E9E9E]">
                                    {currentTime.toLocaleTimeString("en-US", {
                                        hour: "numeric",
                                        minute: "2-digit",
                                        hour12: true,
                                    })}
                                </p>
                            </div>

                            <div className='w-fit lg:w-full flex lg:flex-row flex-col gap-5 lg:justify-between'>
                                {/*Transaction Types*/}
                                <div className='rounded-2xl border-3 border-blue grid grid-cols-2'>
                                    <div 
                                        onClick={() => handleTabChange("ongoing")}
                                        className={`md:p-2 py-2 flex justify-center px-5 cursor-pointer rounded-tl-xl rounded-bl-xl transition-all
                                            ${activeTab === "ongoing" ? "bg-blue" : "bg-transparent"}
                                        `}
                                    >
                                        <h1 
                                            className={`text-md lg:text-lg font-akagi font-bold transition-all
                                            ${activeTab === "ongoing" ? "text-[#ffffff]" : "text-blue"}
                                            `}
                                        >
                                            Ongoing
                                        </h1>
                                    </div>

                                    <div 
                                        onClick={() => handleTabChange("reservation")}
                                        className={`md:p-2 py-2 rounded-tr-xl rounded-br-xl flex justify-center px-5 cursor-pointer
                                            ${activeTab === "reservation" ? "bg-blue" : "bg-transparent"}
                                        `}
                                    >
                                        <h1 className={`text-md lg:text-lg font-akagi font-bold px-5 transition-all
                                            ${activeTab === "reservation" ? "text-[#ffffff]" : "text-blue"}
                                            `}>Reservations</h1>
                                    </div>
                                </div>


                                {/*Add Transactions*/}
                                <div className='flex flex-row gap-3'>
                                    {activeTab === "reservation" &&
                                        <div 
                                            onClick={() => {setHistory(!history)}}
                                            className='bg-blue rounded-xl px-3 py-1 flex items-center'>
                                            <TbHistory className='text-[#ffffff] text-2xl'/>
                                        </div>
                                    }
                                <div 
                                    onClick={() => navigate("/pos/create")}
                                    className='w-fit rounded-xl lg:rounded-2xl bg-yellow items-center flex flex-row gap-3 lg:px-6 p-2 cursor-pointer'
                                >
                                    <FaPlus className='lg:text-2xl text-lg text-darkblue'/>
                                    <h1 className='lg:text-xl text-md font-akagi font-bold text-darkblue tracking-wider'>ADD</h1>
                                </div>
                                </div>

                            </div>

                        </div>
                    </div>

                    
                    <div className='flex-1'>

                        {activeTab === "reservation" && (

                            <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.25, ease: "easeInOut" }} 
                                className='flex flex-col gap-3'
                            >
                                
                                {transactions.length === 0 ? (
                                    <div className="py-10 text-center">
                                        <h1 className="font-akagi text-lg text-gray-500">
                                            No reservations yet.
                                        </h1>
                                    </div>
                                ) : (
                                    Object.entries(groupedReservations).map(([date, reservations]) => (
                                        <div key={date} className="flex flex-col gap-3 pb-8">

                                            {/* Date heading */}
                                            <h2 className="font-akagi text-xl font-bold text-gray">
                                                {date}
                                            </h2>

                                            {/* Reservations for this date */}
                                            {reservations.map((trans) => (
                                                <ReservationRow
                                                    key={trans.id}
                                                    name={
                                                        trans.customer
                                                            ? (
                                                                trans.customer.first_name
                                                                    ? `${trans.customer.first_name} ${trans.customer.last_name}`
                                                                    : trans.customer.full_name
                                                            )
                                                            : "Unknown Customer"
                                                    }
                                                    ordercount={`${(trans.orders_mod ?? []).length} ${
                                                        (trans.orders_mod ?? []).length === 1 ? "Bike" : "Bikes"
                                                    }`}
                                                    type={trans.type}
                                                    start={formatTime(trans.orders_mod?.[0]?.start_time)}
                                                    bikeDetails={trans.orders_mod ?? []}
                                                    customer={trans.customer}
                                                    transaction={trans}
                                                    refreshTransactions={fetchTransactions}
                                                />
                                            ))}
                                        </div>
                                    ))
                                )}

                                
                            </motion.div >

                        )}

                        {activeTab === "ongoing" && (
                            <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.25, ease: "easeInOut" }} 
                                className='flex flex-col gap-3 pb-50'
                            >

                                {ongoing.length === 0 ? (
                                    <div className="py-10 text-center">
                                        <h1 className="font-akagi text-lg text-gray-500">
                                            No ongoing transactions yet.
                                        </h1>
                                    </div>
                                ) : (
                                    ongoing.map((trans) => {
                                        const customerName =
                                            trans.profile
                                                ? (
                                                    trans.profile.full_name ??
                                                    `${trans.profile.first_name} ${trans.profile.last_name}`
                                                )
                                                : trans.walk_in?.[0]?.full_name;

                                        const orders = trans.orders_mod ?? [];

                                        return (
                                            <div
                                                key={trans.id}
                                                ref={(element) => {
                                                    ongoingRowRefs.current[trans.id] = element;
                                                }}
                                                className={`rounded-lg transition-all duration-500 ${
                                                    highlightedTransactionId === trans.id
                                                        ? "ring-3 ring-blue/50 bg-blue/5 shadow-lg"
                                                        : ""
                                                }`}
                                            >
                                                <OngoingRow
                                                    name={customerName}
                                                    ordercount={`${orders.length} ${
                                                        orders.length === 1 ? "Bike" : "Bikes"
                                                    }`}
                                                    type={trans.type}
                                                    start={orders[0]?.start_time}
                                                    bikeDetails={orders}
                                                    refreshOngoing={fetchOngoing}
                                                    transaction={trans.id}
                                                    transactionDetails={trans}
                                                />
                                            </div>
                                        );
                                    })
                                )}
                                
                            </motion.div>
                        )}
                        
                    </div>
                </div>
                
            </motion.div>
                
        </div>

        {history && (
            <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-100 p-5">
                <div className="
                    bg-[#ffffff]
                    p-5 md:p-10
                    rounded-xl
                    w-full
                    max-w-6xl
                    max-h-[90vh]
                    overflow-y-auto
                    scrollbar-thin
                    scrollbar-thumb-[#B9B9B9]
                    scrollbar-track-[#E2E2E2] 
                    scrollbar-none flex flex-col gap-5
                    font-akagi
                    font-bold
                    text-blue
                ">
                    <div className='flex flex-row justify-between items-center'>
                        <h1 className='text-2xl text-blue'>Reservation History</h1>
                        <IoMdClose 
                            onClick={() => {setHistory(false)}}
                            className='text-xl text-gray'/>
                    </div>
                

                    <div className=''>
                        <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.25, ease: "easeInOut" }} 
                                className='flex flex-col gap-3'
                            >
                                
                                {reservationHistory.length === 0 ? (
                                    <div className="py-10 text-center">
                                        <h1 className="font-akagi text-lg text-gray-500">
                                            No reservations yet.
                                        </h1>
                                    </div>
                                ) : (
                                    Object.entries(groupedHistory)
                                        .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA))
                                        .map(([date, reservations]) => (
                                        <div key={date} className="flex flex-col gap-3 pb-8">

                                            {/* Date heading */}
                                            <h2 className="font-akagi text-xl font-bold text-gray">
                                                {date}
                                            </h2>

                                            {/* Reservations for this date */}
                                            {reservations.map((trans) => (
                                                <ReservationRow
                                                    key={trans.id}
                                                    name={
                                                        trans.customer
                                                            ? (
                                                                trans.customer.first_name
                                                                    ? `${trans.customer.first_name} ${trans.customer.last_name}`
                                                                    : trans.customer.full_name
                                                            )
                                                            : "Unknown Customer"
                                                    }
                                                    ordercount={`${(trans.orders_mod ?? []).length} ${
                                                        (trans.orders_mod ?? []).length === 1 ? "Bike" : "Bikes"
                                                    }`}
                                                    type={trans.type}
                                                    start={formatTime(trans.orders_mod?.[0]?.start_time)}
                                                    bikeDetails={trans.orders_mod ?? []}
                                                    customer={trans.customer}
                                                    transaction={trans}
                                                />
                                            ))}
                                        </div>
                                    ))
                                )}

                                
                            </motion.div >
                    </div>

                    <div className='flex justify-between'>
                        <div 
                            onClick={() => {setHistory(false)}}
                            className='w-fit cursor-pointer text-md rounded-lg px-3 py-1 border border-gray text-gray'>
                            Back
                        </div>
                    </div>
                </div>  
            </div>
        )}
    </>
  )
}

export default POS
