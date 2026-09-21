import { supabase } from "../../../lib/supabase"
import Sidebar from "../sidebar/Sidebar"
import SidebarMobile from "../sidebar/SidebarMobile"
import { FaPlus } from "react-icons/fa6";
import { useState, useEffect } from 'react';
import { motion } from "motion/react"
import { useNavigate } from "react-router-dom";
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { IoMdArrowDropdown } from "react-icons/io";
import { Calendar } from 'primereact/calendar';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import TransactionRow from "../transaction history/TransactionRow"
import { IoIosInformationCircleOutline } from "react-icons/io";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar
} from "recharts";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import { FaPrint } from "react-icons/fa6";

function DataReports() {

    const [dashboardData, setDashboardData] = useState([]);
    const [gross, setGross] = useState("...");
    const [reservationGross, setReservationGross] = useState("...");
    const [walkInGross , setWalkInGross] = useState("...");
    const [extensionsGross, setExtensionsGross] = useState("...");
    const [changeGross, setChangeGross] = useState("...");

    const formatDate = (date) => {
        if (!date) return "";

        const parsedDate = date instanceof Date
            ? date
            : new Date(date);

        if (isNaN(parsedDate.getTime())) {
            return "";
        }

        const year = parsedDate.getFullYear();
        const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
        const day = String(parsedDate.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;

        };

    const [activeTab, setActiveTab] = useState("Sales");

    const today = new Date();

    const firstDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        1
    );

    const lastDay = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0
    );

    const formatDisplayDate = (date) => {
        if (!date) return "";

        return date.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric"
        });
    };

    const [dates, setDates] = useState([firstDay, lastDay]);
    const [transactionData, setTransactionData] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedTypes, setSelectedTypes] = useState([
        "walk-in",
        "reservation",
        "extend",
        "change"
    ]);

    const handleTypeCheckbox = (type) => {
        setSelectedTypes((current) =>
            current.includes(type)
                ? current.filter((item) => item !== type)
                    : [...current, type]
        );
    };

    useEffect(() => {
        const fetchData = async () => {
            const { data, error } = await supabase.rpc(
                "get_daily_dashboard_data",
                {
                    start_date: formatDate(dates[0]),
                    end_date: formatDate(dates[1])
                }
            );

            if (error) {
                console.error(error);
                return;
            }

            console.log("datas", data);

            setDashboardData(data);
        };

        const fetchGross = async () => {
            const { data, error } = await supabase.rpc(
                "get_date_gross_revenue",
                {
                    start_date: formatDate(dates[0]),
                    end_date: formatDate(dates[1])
                }
            );

            if (error) {
                console.error(error);
                return;
            }

            console.log(data);

            setGross(data);
        };

        const fetchReservationGross = async () => {
            const { data, error } = await supabase.rpc(
                "get_date_reservation_gross_revenue",
                {
                    start_date: formatDate(dates[0]),
                    end_date: formatDate(dates[1])
                }
            );

            if (error) {
                console.error(error);
                return;
            }

            console.log(data);

            setReservationGross(data);
        };

        const fetchWalkInGross = async () => {
            const { data, error } = await supabase.rpc(
                "get_date_walkin_gross_revenue",
                {
                    start_date: formatDate(dates[0]),
                    end_date: formatDate(dates[1])
                }
            );

            if (error) {
                console.error(error);
                return;
            }

            console.log(data);

            setWalkInGross(data);
        };

        const fetchExtensions = async () => {
            const { data, error } = await supabase.rpc(
                "get_date_extensions_gross_revenue",
                {
                    start_date: formatDate(dates[0]),
                    end_date: formatDate(dates[1])
                }
            );

            if (error) {
                console.error(error);
                return;
            }

            console.log(data);

            setExtensionsGross(data);
        };

        const fetchChange = async () => {
            const { data, error } = await supabase.rpc(
                "get_date_change_gross_revenue",
                {
                    start_date: formatDate(dates[0]),
                    end_date: formatDate(dates[1])
                }
            );

            if (error) {
                console.error(error);
                return;
            }

            console.log(data);

            setChangeGross(data);
        };

        fetchData();
        fetchGross();
        fetchReservationGross();
        fetchWalkInGross();
        fetchExtensions();
        fetchChange();
    }, [dates]);

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

        <div className='w-full h-screen bg-[#F2F2F2] flex'>
            <Sidebar active={'datareports'}/>
            

            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }} 
                className='flex-1 lg:p-10 px-8 py-10 overflow-y-scroll scrollbar-thin scrollbar-thumb-[#B9B9B9] scrollbar-track-[#E2E2E2]'>

                <SidebarMobile active={'datareports'}/>

                <div className='flex flex-col gap-5'>
                    <h1 className='md:text-4xl text-2xl font-akagi font-bold tracking-wide text-blue'>Data Reports</h1>
                    
                    <div className="flex flex-row justify-between gap-3 items-center">

                {/* Scrollable tabs */}
                <div className="flex-1 min-w-0 overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-[#B9B9B9] scrollbar-track-transparent">
                    
                    <div className="flex flex-row lg:gap-8 gap-5 w-max">
                        
                        <h1
                            onClick={() => setActiveTab("Sales")}
                            className={`font-akagi font-medium cursor-pointer flex-shrink-0 ${
                                activeTab === "Sales"
                                    ? "text-blue hover:underline"
                                    : "text-gray"
                            }`}
                        >
                            All Sales
                        </h1>

                        <h1
                            onClick={() => setActiveTab("Net Sales")}
                            className={`font-akagi font-medium cursor-pointer flex-shrink-0 ${
                                activeTab === "Net Sales"
                                    ? "text-blue hover:underline"
                                    : "text-gray"
                            }`}
                        >
                            Net Sales
                        </h1>



                        <h1
                            onClick={() => setActiveTab("Maintenance")}
                            className={`font-akagi font-medium cursor-pointer flex-shrink-0 ${
                                activeTab === "Maintenance"
                                    ? "text-blue hover:underline"
                                    : "text-gray"
                            }`}
                        >
                            Maintenance
                        </h1>

                    </div>

                </div>

                {/* Calendar */}
                <div className="flex-shrink-0">
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
                        inputClassName="w-fit rounded-xl bg-[#D9D9D9] cursor-pointer font-akagi font-bold text-[#505050] border border-[#D9D9D9] md:px-4 md:py-2 px-2 py-2 focus:outline-none" 
                        pt={{ 
                            panel: { 
                                className: "mt-2 rounded-2xl border border-[#E2E2E2] bg-white p-6 shadow-xl" 
                            }, 
                            header: { 
                                className: "flex items-center justify-between border-none bg-transparent pb-4" 
                            }, 
                            title: { 
                                className: "font-akagi text-lg font-bold text-blue w-full text-center" 
                            }, 
                            previousButton: { 
                                className: "h-9 w-9 rounded-full text-[#505050] transition hover:bg-[#F0F0F0] flex items-center justify-center" 
                            }, 
                            nextButton: { 
                                className: "h-9 w-9 rounded-full text-[#505050] transition hover:bg-[#F0F0F0] flex items-center justify-center" 
                            }, 
                            table: {
                                className: "w-full font-akagi text-[#505050] cursor-pointer border-separate border-spacing-y-2 border-spacing-x-4 text-center"
                            }
                        }} 
                    />
                </div>

            </div>

                    {/*Sales*/}
                    {activeTab === "Sales" &&

                    <>
                        <div className='bg-[#ffffff] w-full rounded-xl p-5 flex flex-col gap-3'>
                            <h1 className='md:text-xl text-lg font-akagi font-bold tracking-wide text-gray'>
                                Gross Revenue for {dates?.[0] && dates?.[1]
                                    ? `${formatDisplayDate(dates[0])} – ${formatDisplayDate(dates[1])}`
                                    : "selected dates"
                                }
                            </h1>

                            {/*Graph*/}
                            <div className="w-full h-[250px] font-akagi font-medium text-sm">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart
                                        data={dashboardData}
                                        margin={{
                                            top: 10,
                                            right: 20,
                                            left: 0,
                                            bottom: 0
                                        }}
                                    >
                                        <defs>
                                            <linearGradient
                                                id="revenueGradient"
                                                x1="0"
                                                y1="0"
                                                x2="0"
                                                y2="1"
                                            >
                                                <stop
                                                    offset="0%"
                                                    stopColor="#078bf4"
                                                    stopOpacity={0.4}
                                                />

                                                <stop
                                                    offset="100%"
                                                    stopColor="#078bf4"
                                                    stopOpacity={0}
                                                />
                                            </linearGradient>
                                        </defs>

                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            vertical={false}
                                            stroke="#E5E7EB"
                                        />

                                        <XAxis
                                            dataKey="date"
                                            tickFormatter={(date) =>
                                                new Date(date).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric"
                                                })
                                            }
                                            axisLine={false}
                                            tickLine={false}
                                        />

                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tickFormatter={(value) =>
                                                `₱${value.toLocaleString()}`
                                            }
                                        />

                                        <Tooltip
                                            formatter={(value) =>
                                                [`₱${Number(value).toLocaleString()}`, "Revenue"]
                                            }
                                            labelFormatter={(date) =>
                                                new Date(date).toLocaleDateString("en-US", {
                                                    month: "long",
                                                    day: "numeric",
                                                    year: "numeric"
                                                })
                                            }
                                        />

                                        <Area
                                            type="monotone"
                                            dataKey="revenue"
                                            stroke="#078bf4"
                                            strokeWidth={3}
                                            fill="url(#revenueGradient)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>

                        </div>
                    

                        <div className='w-full grid lg:grid-cols-4 grid-cols-2 gap-5'>
                            <div className='bg-[#ffffff] p-5 font-akagi font-bold text-gray rounded-xl flex flex-col gap-2'>
                                <h1 className=''>Gross Revenue</h1>
                                <h1 className='text-4xl'>P{gross}</h1>
                                    <div className="w-full h-[70px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart
                                                data={dashboardData}
                                                margin={{ top: 5, right: 0, left: 0, bottom: 0 }}
                                            >
                                                <Bar
                                                    dataKey="revenue"
                                                    radius={[3, 3, 3, 3]}
                                                    fill="#E4E017"
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                            </div>

                            <div className='bg-[#ffffff] p-5 font-akagi font-bold text-gray rounded-xl flex flex-col gap-2'>
                                <div className='flex flex-row justify-between items-center'>
                                    <h1>Net Revenue</h1>
                                    <IoIosInformationCircleOutline className='text-xl cursor-pointer'/>
                                </div>
                                <h1 className='text-4xl'>P12000</h1>
                                <div className="w-full h-[70px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={dashboardData}
                                            margin={{ top: 5, right: 0, left: 0, bottom: 0 }}
                                        >
                                            <Bar
                                                dataKey="revenue"
                                                radius={[3, 3, 3, 3]}
                                                fill="#104459"
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className='bg-[#ffffff] p-5 font-akagi font-bold text-gray rounded-xl flex flex-col gap-2'>
                                <h1>Walk-In Gross Revenue</h1>
                                <h1 className='text-4xl'>P{walkInGross}</h1>
                                <div className="w-full h-[70px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={dashboardData}
                                            margin={{ top: 5, right: 0, left: 0, bottom: 0 }}
                                        >
                                            <Bar
                                                dataKey="revenue"
                                                radius={[3, 3, 3, 3]}
                                                fill="#2F5B7E"
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                                
                            </div>

                            <div className='bg-[#ffffff] p-5 font-akagi font-bold text-gray rounded-xl flex flex-col gap-2'>
                                <h1>Reservation Gross Revenue</h1>
                                <h1 className='text-4xl'>P{reservationGross}</h1>
                                <div className="w-full h-[70px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={dashboardData}
                                            margin={{ top: 5, right: 0, left: 0, bottom: 0 }}
                                        >
                                            <Bar
                                                dataKey="revenue"
                                                radius={[3, 3, 3, 3]}
                                                fill="#979B9D"
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className='bg-[#ffffff] p-5 font-akagi font-bold text-gray rounded-xl flex flex-col gap-2'>
                                <h1>Extensions Gross Revenue</h1>
                                <h1 className='text-4xl'>P{extensionsGross}</h1>
                                <div className="w-full h-[70px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={dashboardData}
                                            margin={{ top: 5, right: 0, left: 0, bottom: 0 }}
                                        >
                                            <Bar
                                                dataKey="revenue"
                                                radius={[3, 3, 3, 3]}
                                                fill="#979B9D"
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className='bg-[#ffffff] p-5 font-akagi font-bold text-gray rounded-xl flex flex-col gap-2'>
                                <h1>Changed Bikes Gross Revenue</h1>
                                <h1 className='text-4xl'>P{changeGross}</h1>
                                <div className="w-full h-[70px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={dashboardData}
                                            margin={{ top: 5, right: 0, left: 0, bottom: 0 }}
                                        >
                                            <Bar
                                                dataKey="revenue"
                                                radius={[3, 3, 3, 3]}
                                                fill="#979B9D"
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                        </div>

                        <div className='pt-10 flex flex-col gap-4'>
                            <div className='pb-5 flex flex-row justify-between gap-5 items-center'>

                                <div className="flex-1 min-w-0 overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-[#B9B9B9] scrollbar-track-transparent">
                                    <div className="flex flex-row lg:gap-8 gap-5 w-max">
                                        <div className="flex-1 min-w-0 overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-[#B9B9B9] scrollbar-track-transparent"> <div className="flex flex-row lg:gap-8 gap-5 w-max">

                                            {/* Walk-ins */}
                                            <label className="flex flex-row gap-2 font-akagi font-bold text-gray cursor-pointer items-center">
                                                <input
                                                    type="checkbox"
                                                    className="cursor-pointer"
                                                    checked={selectedTypes.includes("walk-in")}
                                                    onChange={() => handleTypeCheckbox("walk-in")}
                                                />
                                                <h1>Walk-ins</h1>
                                            </label>

                                            {/* Reservations */}
                                            <label className="flex flex-row gap-2 font-akagi font-bold text-gray cursor-pointer items-center">
                                                <input
                                                    type="checkbox"
                                                    className="cursor-pointer"
                                                    checked={selectedTypes.includes("reservation")}
                                                    onChange={() => handleTypeCheckbox("reservation")}
                                                />
                                                <h1>Reservations</h1>
                                            </label>

                                            {/* Extensions */}
                                            <label className="flex flex-row gap-2 font-akagi font-bold text-gray cursor-pointer items-center">
                                                <input
                                                    type="checkbox"
                                                    className="cursor-pointer"
                                                    checked={selectedTypes.includes("extend")}
                                                    onChange={() => handleTypeCheckbox("extend")}
                                                />
                                                <h1>Extensions</h1>
                                            </label>

                                            {/* Changed Bikes */}
                                            <label className="flex flex-row gap-2 font-akagi font-bold text-gray cursor-pointer items-center">
                                                <input
                                                    type="checkbox"
                                                    className="cursor-pointer"
                                                    checked={selectedTypes.includes("change")}
                                                    onChange={() => handleTypeCheckbox("change")}
                                                />
                                                <h1>Changed Bikes</h1>
                                            </label>

                                            {/* Maintenance */}
                                            <label className="flex flex-row gap-2 font-akagi font-bold text-gray cursor-pointer items-center">
                                                <input
                                                    type="checkbox"
                                                    className="cursor-pointer"
                                                    checked={selectedTypes.includes("maintenance")}
                                                    onChange={() => handleTypeCheckbox("maintenance")}
                                                />
                                                <h1>Maintenance</h1>
                                            </label>

                                        </div>

                                        </div>
                                    </div>
                                </div>

                                <div className='flex flex-row cursor-pointer gap-2 rounded-lg bg-blue font-akagi font-bold text-md px-3 py-1 items-center text-[#ffffff]'>
                                    <FaPrint className='text-sm'/>
                                    Export
                                </div>
                            </div>

                            {/* All Transactions */}
                                {loading ? (
                                    <div className="flex justify-center py-10">
                                        <h1 className="font-akagi text-lg text-[#6D7172]">
                                            Loading transactions...
                                        </h1>
                                    </div>
                                ) : transactionData.length === 0 ? (
                                    <div className="flex justify-center py-10">
                                        <h1 className="font-akagi text-lg text-[#6D7172]">
                                            No transactions found for the selected dates.
                                        </h1>
                                    </div>
                                ) : (

                                    <div className="flex flex-col gap-3">
                                    {transactionData
                                        .filter((transaction) =>
                                            selectedTypes.includes(transaction.type)
                                        )
                                        .map((transaction) => {

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
                                                transaction.extensions_mod?.[0] ?? null;

                                            const changedBikesData =
                                                transaction.change_bikes_mod ?? [];

                                            const maintenanceData =
                                                transaction.maintenance_mod?.[0] ?? null;

                                            let totalBikes;

                                            if (
                                                transaction.type === "walk-in" ||
                                                transaction.type === "reservation"
                                            ) {
                                                totalBikes = transaction.orders_mod?.length ?? 0;
                                            } else if (transaction.type === "change") {
                                                totalBikes = "C";
                                            } else if (transaction.type === "extend") {
                                                totalBikes = "E";
                                            } else if (transaction.type === "maintenance") {
                                                totalBikes = "M";
                                            } else {
                                                totalBikes = 0;
                                            }

                                            return (
                                                <TransactionRow
                                                    key={transaction.id}

                                                    totalBikes={totalBikes}

                                                    transactionId={transaction.id}

                                                    fullName={customerName}

                                                    transactionType={transaction.type}

                                                    timeAdded={formatDate(transaction.created_at)}

                                                    status={transaction.status}

                                                    transactionData={transaction.orders_mod ?? []}

                                                    transactionPayment={transaction}

                                                    extensionsData={extensionData}

                                                    changeBikesData={changedBikesData}

                                                    maintenanceData={maintenanceData}

                                                    assistedBy={
                                                        transaction?.assisted_by_profile?.full_name ??
                                                        "Unknown"
                                                    }
                                                />
                                            );
                                        })}
                                    </div>

                                )}

                            


                        </div>
                        
                    </>
                    }
                    
                </div>
            </motion.div>
        </div>
    </>
  )
}

export default DataReports
