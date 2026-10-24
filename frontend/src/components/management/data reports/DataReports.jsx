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
import { FaPrint } from "react-icons/fa6";
import MaintenanceRow from "../inventory/Bikes/Maintenance/MaintenanceRow"
import BikeRowDataReports from "./BikeRowDataReports"

function DataReports() {

    const [dashboardData, setDashboardData] = useState([]);

    const [reservationGross, setReservationGross] = useState("...");
    const [walkInGross , setWalkInGross] = useState("...");
    const [extensionsGross, setExtensionsGross] = useState("...");
    const [changeGross, setChangeGross] = useState("...");
    const [overtimeGross, setOvertimeGross] = useState("...");
    const [deductions, setDeductions] = useState([]);

    const [maintenanceInfo, setMaintenanceInfo] = useState([]);

    const [bikeTypes, setBikeTypes] = useState([]);

    const [inventoryCounts, setInventoryCounts] = useState({
        total_bikes: 0,
        available_bikes: 0,
        rented_bikes: 0,
        maintenance_bikes: 0,
    });

    const [loading, setLoading] = useState(true);

    const fetchBikeInventoryCounts = async () => {
        const { data, error } = await supabase.rpc(
            "get_bike_inventory_counts"
        );

        if (error) {
            console.error("Error fetching bike inventory counts:", error);
            return null;
        }

        return data?.[0] ?? {
            total_bikes: 0,
            available_bikes: 0,
            rented_bikes: 0,
            maintenance_bikes: 0,
        };
    };

    useEffect(() => {
        let isMounted = true;

        const loadInventoryCounts = async () => {
            setLoading(true);

            const counts = await fetchBikeInventoryCounts();

            if (isMounted) {
                if (counts) {
                    setInventoryCounts(counts);
                }

                setLoading(false);
            }
        };

        loadInventoryCounts();

        return () => {
            isMounted = false;
        };
    }, []);


    //NET SALES
    const [gross, setGross] = useState("...");
    const [netSales, setNetSales] = useState({
        gross_sales: 0,
        total_deductions: 0,
        net_sales: 0
    });

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

    const fetchDateDeductions = async (startDate, endDate) => {
        try {
            const { data, error } = await supabase.rpc(
                "get_date_deductions",
                {
                    start_date: startDate,
                    end_date: endDate
                }
            );

            if (error) {
                console.error("Error fetching deductions:", error);
                setDeductions([]);
                return;
            }

            console.log("Deductions:", data);

            setDeductions(data || []);

        } catch (error) {
            console.error("Unexpected error:", error);
            setDeductions([]);
        }
    };

    const fetchNetSales = async () => {

        const { data, error } = await supabase.rpc(
            "get_date_net_sales",
            {
                start_date: formatDate(dates[0]),
                end_date: formatDate(dates[1])
            }
        );

        if (error) {
            console.error("Net sales error:", error);
            return;
        }

        console.log("Net Sales:", data);

        setNetSales(data);
    };

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

    const [selectedTypes, setSelectedTypes] = useState([
        "walk-in",
        "reservation",
        "extend",
        "change",
        "overtime",
    ]);

    const handleTypeCheckbox = (type) => {
        setSelectedTypes((current) =>
            current.includes(type)
                ? current.filter((item) => item !== type)
                    : [...current, type]
        );
    };

    const fetchBikes = async () => {
        const { data, error } = await supabase
            .from("bike_types_mod")
            .select(`
                *,
                bikes_mod (
                    id,
                    code,
                    bike_type_id,
                    status
                )
            `);

        if (!error) {
            setBikeTypes(data || []);
        } else {
            console.error("Error fetching bikes:", error);
        }
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

        const fetchOvertime = async () => {
            const { data, error } = await supabase.rpc(
                "get_date_overtime_gross_revenue",
                {
                    start_date: formatDate(dates[0]),
                    end_date: formatDate(dates[1])
                }
            );

            if (error) {
                console.error(error);
                return;
            }

            console.log("overtime",data);

            setOvertimeGross(data);
        };

        fetchData();
        fetchGross();
        fetchReservationGross();
        fetchWalkInGross();
        fetchExtensions();
        fetchChange();
        fetchNetSales();
        fetchOvertime();

        fetchDateDeductions(
            formatDate(dates[0]),
            formatDate(dates[1])
        );

        fetchBikes();
    }, [dates]);

    useEffect(() => {
        const fetchMaintenanceBikes = async () => {
            if (!dates?.[0] || !dates?.[1]) {
                setMaintenanceInfo([]);
                return;
            }

            const startDate = new Date(dates[0]);
            startDate.setHours(0, 0, 0, 0);

            const endDate = new Date(dates[1]);
            endDate.setHours(23, 59, 59, 999);

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
                        transaction:transactions_mod (*),
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
                .gte("created_at", startDate.toISOString())
                .lte("created_at", endDate.toISOString())
                .order("created_at", { ascending: false });

            if (error) {
                console.error("Error fetching maintenance bikes:", error);
                setMaintenanceInfo([]);
                return;
            }

            setMaintenanceInfo(data || []);
        };

        fetchMaintenanceBikes();
    }, [dates]);

    console.log("Maintenance", maintenanceInfo);

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
                        bikes_mod!orders_mod_bike_id_fkey (*),
                        gps_mod (*)
                    ),
                    extensions_mod!extensions_mod_transaction_id_fkey (
                        *,
                        bikes_mod (
                            *
                        ),
                        bike_types_mod (
                            *
                        ),
                        original_transaction:transactions_mod!extensions_mod_original_transaction_id_fkey (
                            *,
                            profile:profiles_mod!transactions_mod_user_id_fkey1 (*),
                            walk_in:walk_ins_users_mod (*)
                        ),
                        orders_mod (
                            *,
                            bikes_mod!orders_mod_bike_id_fkey (
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
                            bikes_mod!orders_mod_bike_id_fkey (
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
                    change_bikes_mod!change_bikes_mod_trans_id_fkey (
                        *,
                        original_transaction:transactions_mod!change_bikes_mod_original_transaction_id_fkey (
                            *,
                            profile:profiles_mod!transactions_mod_user_id_fkey1 (*),
                            walk_in:walk_ins_users_mod (*)
                        ),

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
                            current_bike:bikes_mod!orders_mod_bike_id_fkey (
                                *,
                                bike_types_mod (*)
                            ),
                            original_bike:bikes_mod!orders_mod_initial_bike_id_fkey (
                                *,
                                bike_types_mod (*)
                            ),
                            transaction:transactions_mod (
                                *,
                                profile:profiles_mod!transactions_mod_user_id_fkey1 (*),
                                walk_in:walk_ins_users_mod (*)
                            )
                        )
                    ),
                    overtime_mod!overtime_mod_transaction_id_fkey (
                        *,
                        original_transaction:transactions_mod!overtime_mod_original_transaction_id_fkey (
                            *,
                            profile:profiles_mod!transactions_mod_user_id_fkey1 (
                                *
                            ),
                            walk_in:walk_ins_users_mod (
                                *
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

                        <h1
                            onClick={() => setActiveTab("Bikes")}
                            className={`font-akagi font-medium cursor-pointer flex-shrink-0 ${
                                activeTab === "Bikes"
                                    ? "text-blue hover:underline"
                                    : "text-gray"
                            }`}
                        >
                            Bikes
                        </h1>

                        <h1
                            onClick={() => setActiveTab("GPS")}
                            className={`font-akagi font-medium cursor-pointer flex-shrink-0 ${
                                activeTab === "GPS"
                                    ? "text-blue hover:underline"
                                    : "text-gray"
                            }`}
                        >
                            GPS
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
                        <div className='bg-[#ffffff] w-full rounded-xl p-5 flex flex-col gap-3 shadow-md'>
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
                            <div className='bg-[#ffffff] p-5 font-akagi font-bold text-gray rounded-xl flex flex-col gap-2 shadow-md'>
                                <h1 className='font-medium'>Gross Revenue</h1>
                                <h1 className='lg:text-4xl text-2xl'>P{gross}</h1>
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

                            <div className='bg-[#ffffff] p-5 font-akagi font-bold text-gray rounded-xl flex flex-col gap-2 shadow-md'>
                                <div className='flex flex-row justify-between items-center'>
                                    <h1 className='font-medium'>Net Revenue</h1>
                                    <IoIosInformationCircleOutline className='text-xl cursor-pointer'/>
                                </div>
                                <h1 className='lg:text-4xl text-2xl'>P{Number(netSales.net_sales).toLocaleString()}</h1>
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

                            <div className='bg-[#ffffff] p-5 font-akagi font-bold text-gray rounded-xl flex flex-col gap-2 shadow-md'>
                                <h1 className='font-medium'>Walk-In Gross Revenue</h1>
                                <h1 className='lg:text-4xl text-2xl'>P{walkInGross}</h1>
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

                            <div className='bg-[#ffffff] p-5 font-akagi font-bold text-gray rounded-xl flex flex-col gap-2 shadow-md'>
                                <h1 className='font-medium'>Reservation Gross Revenue</h1>
                                <h1 className='lg:text-4xl text-2xl'>P{reservationGross}</h1>
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

                            <div className='bg-[#ffffff] p-5 font-akagi font-bold text-gray rounded-xl flex flex-col gap-2 shadow-md'>
                                <h1 className='font-medium'>Extensions Gross Revenue</h1>
                                <h1 className='lg:text-4xl text-2xl'>P{extensionsGross}</h1>
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

                            <div className='bg-[#ffffff] p-5 font-akagi font-bold text-gray rounded-xl flex flex-col gap-2 shadow-md'>
                                <h1 className='font-medium'>Changed Bikes Gross Revenue</h1>
                                <h1 className='lg:text-4xl text-2xl'>P{changeGross}</h1>
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

                            <div className='bg-[#ffffff] p-5 font-akagi font-bold text-gray rounded-xl flex flex-col gap-2 shadow-md'>
                                <h1 className='font-medium'>Overtime Bikes Gross Revenue</h1>
                                <h1 className='lg:text-4xl text-2xl'>P{overtimeGross}</h1>
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

                                            {/* Overtime */}
                                            <label className="flex flex-row gap-2 font-akagi font-bold text-gray cursor-pointer items-center">
                                                <input
                                                    type="checkbox"
                                                    className="cursor-pointer"
                                                    checked={selectedTypes.includes("overtime")}
                                                    onChange={() => handleTypeCheckbox("overtime")}
                                                />
                                                <h1>Overtime</h1>
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

                                            const overtimeTransaction =
                                                transaction.type === "overtime"
                                                    ? transaction.overtime_mod?.[0]?.original_transaction
                                                    : null;

                                            const profile =
                                                transaction.type === "extend"
                                                    ? extensionTransaction?.profile
                                                    : transaction.type === "change"
                                                        ? changeTransaction?.profile
                                                        : transaction.type === "maintenance"
                                                            ? maintenanceTransaction?.profile
                                                            : transaction.type === "overtime"
                                                                ? overtimeTransaction?.profile
                                                                : transaction.profile;

                                            const walkIn =
                                                transaction.type === "extend"
                                                    ? extensionTransaction?.walk_in
                                                    : transaction.type === "change"
                                                        ? changeTransaction?.walk_in
                                                        : transaction.type === "maintenance"
                                                            ? maintenanceTransaction?.walk_in
                                                            : transaction.type === "overtime"
                                                                ? overtimeTransaction?.walk_in
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
                                            } else if (transaction.type === "overtime") {
                                                totalBikes = "OT";
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

                {activeTab === "Net Sales" &&
                    <>
                    <div className='xl:grid-cols-3 grid grid-cols-2 gap-5'>
                        <div className='bg-gradient-to-t from-blue to-blue/65  shadow-md  rounded-xl px-4 py-4 flex flex-col gap-2 font-akagi font-bold text-[#ffffff]'>
                            <div className='w-full h-full lg:h-27 flex flex-col justify-between'>
                                <div className='flex flex-row justify-between'>
                                    <h1 className='font-medium text-sm md:text-lg'>Gross Sales</h1>
                                </div>

                                <div className='flex flex-col'>
                                    <h1 className='text-xl lg:text-3xl'>
                                        ₱{Number(netSales.gross_sales).toLocaleString()}
                                    </h1>
                                    <h1 className='text-xs lg:text-sm font-medium'>Sales before deductions</h1>
                                </div>
                            </div>
                        </div>  

                        <div className='bg-[#ffffff] shadow-md rounded-xl px-4 py-4 flex flex-col gap-2 font-akagi font-bold text-gray'>
                            <div className='w-full h-full flex flex-col justify-between'>
                                <div className='flex flex-row justify-between'>
                                    <h1 className='font-medium text-sm md:text-lg'>Total Deductions</h1>
                                </div>

                                <div className='flex flex-col'>
                                    <h1 className='text-xl lg:text-3xl'>
                                        ₱{Number(netSales.total_deductions).toLocaleString()}
                                    </h1>
                                    <h1 className='text-xs lg:text-sm font-medium'>Deductions</h1>
                                </div>
                            </div>
                        </div>

                        <div className='bg-gradient-to-t from-blue to-blue/65  shadow-md  rounded-xl px-4 py-4 flex flex-col gap-2 font-akagi font-bold text-[#ffffff]'>
                            <div className='w-full h-full flex flex-col justify-between'>
                                <div className='flex flex-row justify-between'>
                                    <h1 className='font-medium text-sm md:text-lg'>Net Sales</h1>
                                </div>

                                <div className='flex flex-col'>
                                    <h1 className='text-xl lg:text-3xl'>
                                        ₱{Number(netSales.net_sales).toLocaleString()}
                                    </h1>
                                    <h1 className='text-xs lg:text-sm font-medium'>Sales after deductions</h1>
                                </div>
                            </div>
                        </div>


                    </div>

                    <div className='bg-[#ffffff] shadow-md rounded-xl p-5 flex flex-col gap-4'>

                        <div className='flex flex-row justify-between items-center gap-5'>
                            <h1 className='font-akagi font-bold text-lg text-gray'>
                                Deductions
                            </h1>

                            <h1 className='font-akagi font-medium text-sm text-gray'>
                                {dates?.[0] && dates?.[1]
                                    ? `${formatDisplayDate(dates[0])} – ${formatDisplayDate(dates[1])}`
                                    : ""
                                }
                            </h1>
                        </div>

                        {deductions.length === 0 ? (

                            <div className='flex justify-center py-6'>
                                <h1 className='font-akagi text-gray'>
                                    No deductions for the selected dates.
                                </h1>
                            </div>

                        ) : (

                            <div className='flex flex-col divide-y divide-[#E5E5E5]'>

                                {deductions.map((deduction) => (

                                    <div
                                        key={deduction.id}
                                        className='py-4 flex flex-row justify-between items-center gap-5'
                                    >

                                        <div className='flex flex-col'>

                                            <h1 className='font-akagi font-bold text-gray'>
                                                {deduction.type}
                                            </h1>

                                            <h1 className='font-akagi text-sm text-[#777777]'>
                                                {deduction.calculation} • {deduction.value}
                                                {deduction.calculation?.toLowerCase() === "percentage"
                                                    ? "%"
                                                    : ""
                                                }
                                            </h1>

                                            {deduction.occurence ? (

                                                <h1 className='font-akagi text-xs text-[#999999]'>
                                                    {deduction.occurence}
                                                </h1>

                                            ) : deduction.deadline ? (

                                                <h1 className='font-akagi text-xs text-[#999999]'>
                                                    Deadline:{" "}
                                                    {new Date(deduction.deadline).toLocaleDateString(
                                                        "en-US",
                                                        {
                                                            month: "long",
                                                            day: "numeric",
                                                            year: "numeric"
                                                        }
                                                    )}
                                                </h1>

                                            ) : null}

                                        </div>

                                        <h1 className='font-akagi font-bold text-gray text-lg whitespace-nowrap'>
                                            − ₱
                                            {Number(
                                                deduction.deduction_amount
                                            ).toLocaleString("en-PH", {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                            })}
                                        </h1>

                                    </div>

                                ))}

                            </div>

                        )}
                        

                    </div>
                    </>
                }

                {activeTab === "Maintenance" &&
                    <>
                    <div className='xl:grid-cols-3 grid grid-cols-2 gap-5'>
                        <div className='bg-gradient-to-t from-blue to-blue/65 shadow-md rounded-xl px-4 py-4 flex flex-col gap-2 font-akagi font-bold text-[#ffffff]'>
                            <div className='w-full h-full lg:h-27 flex flex-col justify-between'>
                                <div className='flex flex-row justify-between'>
                                    <h1 className='font-medium text-sm md:text-lg'>Total Maintenance</h1>
                                </div>

                                <div className='flex flex-col'>
                                    <h1 className='text-xl lg:text-3xl'>
                                        ₱{Number(netSales.gross_sales).toLocaleString()}
                                    </h1>
                                    <h1 className='text-xs lg:text-sm font-medium'>Maintenance from management and customer</h1>
                                </div>
                            </div>
                        </div>  

                        <div className='bg-[#ffffff] shadow-md rounded-xl px-4 py-4 flex flex-col gap-2 font-akagi font-bold text-gray'>
                            <div className='w-full h-full flex flex-col justify-between'>
                                <div className='flex flex-row justify-between'>
                                    <h1 className='font-medium text-sm md:text-lg'>Management Maintenance</h1>
                                </div>

                                <div className='flex flex-col'>
                                    <h1 className='text-xl lg:text-3xl'>
                                        ₱{Number(netSales.total_deductions).toLocaleString()}
                                    </h1>
                                    <h1 className='text-xs lg:text-sm font-medium'>Maintenance paid by management</h1>
                                </div>
                            </div>
                        </div>

                        <div className='bg-[#ffffff] shadow-md  rounded-xl px-4 py-4 flex flex-col gap-2 font-akagi font-bold text-gray'>
                            <div className='w-full h-full flex flex-col justify-between'>
                                <div className='flex flex-row justify-between'>
                                    <h1 className='font-medium text-sm md:text-lg'>Customer Maintenance</h1>
                                </div>

                                <div className='flex flex-col'>
                                    <h1 className='text-xl lg:text-3xl'>
                                        ₱{Number(netSales.net_sales).toLocaleString()}
                                    </h1>
                                    <h1 className='text-xs lg:text-sm font-medium'>Maintenance paid by management</h1>
                                </div>
                            </div>
                        </div>


                    </div>

                    <div className='bg-[#ffffff] shadow-md rounded-xl p-5 flex flex-col gap-4'>

                        <div className='flex flex-row justify-between items-center gap-5'>
                            <h1 className='font-akagi font-bold text-lg text-gray'>
                                Maintenance
                            </h1>

                            <h1 className='font-akagi font-medium text-sm text-gray'>
                                {dates?.[0] && dates?.[1]
                                    ? `${formatDisplayDate(dates[0])} – ${formatDisplayDate(dates[1])}`
                                    : ""
                                }
                            </h1>
                        </div>

                        <div className="flex flex-col gap-6">

                            {/* Customer-Paid Maintenance */}
                            <div className="flex flex-col gap-3 bg-gray/15 rounded-lg p-3 shadow-lg py-5">
                                <h2 className="font-akagi font-medium text-md text-gray">
                                    Customer
                                </h2>

                                <div className="flex flex-col gap-2">
                                    {maintenanceInfo
                                        .filter(
                                            (maintenance) =>
                                                maintenance.payment_by?.toLowerCase() === "customer"
                                        )
                                        .map((maintenance) => (
                                            <MaintenanceRow
                                                key={maintenance.id}
                                                bikeId={maintenance?.orders_mod?.current_bike?.code}
                                                bikeTypeId={maintenance?.orders_mod?.current_bike?.bike_types_mod?.name}
                                                reason={maintenance?.reason}
                                                status={maintenance?.status}
                                                price={maintenance?.price}
                                                paidBy={maintenance?.payment_by}
                                                payment={maintenance?.transactions_mod?.total_amount}
                                                change={maintenance?.transactions_mod?.change_amount}
                                                method={maintenance?.transactions_mod?.payment_method}
                                                bikeCode={maintenance?.orders_mod?.code}
                                                maintenanceId={maintenance?.id}
                                                date={convertToPhilippineDate(maintenance?.created_at)}
                                                time={convertToPhilippineTime(maintenance?.created_at)}
                                                managementBikeId={maintenance?.bike_id}
                                                managementBikeCode={maintenance?.bikes_mod?.code}
                                                managementBikeTypeId={maintenance?.bikes_mod?.bike_types_mod?.name}
                                                inventoryBikeCode={maintenance?.bikes_mod?.code}
                                                inventoryBikeId={maintenance?.bike_id}
                                            />
                                        ))}
                                </div>
                            </div>

                            {/* Management-Paid Maintenance */}
                            <div className="flex flex-col gap-3 bg-gray/15 rounded-lg p-3 shadow-lg py-5">
                                <h2 className="font-akagi font-medium text-md text-gray">
                                    Management
                                </h2>

                                <div className="flex flex-col gap-2">
                                    {maintenanceInfo
                                        .filter(
                                            (maintenance) =>
                                                maintenance.payment_by?.toLowerCase() === "management"
                                        )
                                        .map((maintenance) => (
                                            <MaintenanceRow
                                                key={maintenance.id}
                                                bikeId={maintenance?.orders_mod?.current_bike?.code}
                                                bikeTypeId={maintenance?.orders_mod?.current_bike?.bike_types_mod?.name}
                                                reason={maintenance?.reason}
                                                status={maintenance?.status}
                                                price={maintenance?.price}
                                                paidBy={maintenance?.payment_by}
                                                payment={maintenance?.transactions_mod?.total_amount}
                                                change={maintenance?.transactions_mod?.change_amount}
                                                method={maintenance?.transactions_mod?.payment_method}
                                                bikeCode={maintenance?.orders_mod?.code}
                                                maintenanceId={maintenance?.id}
                                                date={convertToPhilippineDate(maintenance?.created_at)}
                                                time={convertToPhilippineTime(maintenance?.created_at)}
                                                managementBikeId={maintenance?.bike_id}
                                                managementBikeCode={maintenance?.bikes_mod?.code}
                                                managementBikeTypeId={maintenance?.bikes_mod?.bike_types_mod?.name}
                                                inventoryBikeCode={maintenance?.bikes_mod?.code}
                                                inventoryBikeTypeId={maintenance?.bikes_mod?.bike_types_mod?.name}
                                            />
                                        ))}
                                </div>
                            </div>

                        </div>
                    </div>
                    </>
                }

                {activeTab === "Bikes" &&
                    <>
                    <div className='xl:grid-cols-4 grid grid-cols-2 gap-5'>
                        <div className='bg-gradient-to-t from-blue to-blue/65 shadow-md rounded-xl px-4 py-4 flex flex-col gap-2 font-akagi font-bold text-[#ffffff]'>
                            <div className='w-full h-full lg:h-27 flex flex-col justify-between'>
                                <div className='flex flex-row justify-between'>
                                    <h1 className='font-medium text-sm md:text-lg'>Total Bikes</h1>
                                </div>

                                <div className='flex flex-col'>
                                    <h1 className='text-xl lg:text-3xl'>
                                        {loading ? "Loading..." : inventoryCounts.total_bikes}
                                    </h1>
                                    <h1 className='text-xs lg:text-sm font-medium'>All bikes</h1>
                                </div>
                            </div>
                        </div>  

                        <div className='bg-[#ffffff] shadow-md rounded-xl px-4 py-4 flex flex-col gap-2 font-akagi font-bold text-gray'>
                            <div className='w-full h-full flex flex-col justify-between'>
                                <div className='flex flex-row justify-between'>
                                    <h1 className='font-medium text-sm md:text-lg'>Rented</h1>
                                </div>

                                <div className='flex flex-col'>
                                    <h1 className='text-xl lg:text-3xl'>
                                        {loading ? "Loading..." : inventoryCounts.rented_bikes}
                                    </h1>
                                    <h1 className='text-xs lg:text-sm font-medium'>Currently in use</h1>
                                </div>
                            </div>
                        </div>

                        <div className='bg-[#ffffff] shadow-md  rounded-xl px-4 py-4 flex flex-col gap-2 font-akagi font-bold text-gray'>
                            <div className='w-full h-full flex flex-col justify-between'>
                                <div className='flex flex-row justify-between'>
                                    <h1 className='font-medium text-sm md:text-lg'>Available</h1>
                                </div>

                                <div className='flex flex-col'>
                                    <h1 className='text-xl lg:text-3xl'>
                                        {loading ? "Loading..." : inventoryCounts.available_bikes}
                                    </h1>
                                    <h1 className='text-xs lg:text-sm font-medium'>Available bikes</h1>
                                </div>
                            </div>
                        </div>

                        <div className='bg-[#ffffff] shadow-md  rounded-xl px-4 py-4 flex flex-col gap-2 font-akagi font-bold text-gray'>
                            <div className='w-full h-full flex flex-col justify-between'>
                                <div className='flex flex-row justify-between'>
                                    <h1 className='font-medium text-sm md:text-lg'>Under Maintenance</h1>
                                </div>

                                <div className='flex flex-col'>
                                    <h1 className='text-xl lg:text-3xl'>
                                        {loading ? "Loading..." : inventoryCounts.maintenance_bikes}
                                    </h1>
                                    <h1 className='text-xs lg:text-sm font-medium'>Maintenance bikes</h1>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='bg-[#ffffff] shadow-md rounded-xl p-5 flex flex-col gap-4'>

                        <div className='flex flex-row justify-between items-center gap-5'>
                            <h1 className='font-akagi font-bold text-lg text-gray'>
                                Bikes
                            </h1>

                            <h1 className='font-akagi font-medium text-sm text-gray'>
                                {dates?.[0] && dates?.[1]
                                    ? `${formatDisplayDate(dates[0])} – ${formatDisplayDate(dates[1])}`
                                    : ""
                                }
                            </h1>
                        </div>

                        <div className='flex flex-col gap-2'>
                            {bikeTypes.map((bikes) => (

                                
                                <BikeRowDataReports 
                                    bikeType={bikes?.name}
                                    capacity={bikes?.capacity}
                                    price={bikes?.price}
                                    image={bikes?.image_url}
                                    bikes={bikes?.bikes_mod}
                                    bikeTypeId={bikes?.id}
                                    startDate={formatDate(dates[0])}
                                    endDate={formatDate(dates[1])}
                                />
                                
                            ))}
                        </div>
                    </div>
                    </>
                }

                {activeTab === "GPS" &&
                    <>
                    <div className='xl:grid-cols-4 grid grid-cols-2 gap-5'>
                        <div className='bg-gradient-to-t from-blue to-blue/65 shadow-md rounded-xl px-4 py-4 flex flex-col gap-2 font-akagi font-bold text-[#ffffff]'>
                            <div className='w-full h-full lg:h-27 flex flex-col justify-between'>
                                <div className='flex flex-row justify-between'>
                                    <h1 className='font-medium text-sm md:text-lg'>Total GPS</h1>
                                </div>

                                <div className='flex flex-col'>
                                    <h1 className='text-xl lg:text-3xl'>
                                        {loading ? "Loading..." : inventoryCounts.total_bikes}
                                    </h1>
                                    <h1 className='text-xs lg:text-sm font-medium'>All GPS</h1>
                                </div>
                            </div>
                        </div>  

                        <div className='bg-[#ffffff] shadow-md rounded-xl px-4 py-4 flex flex-col gap-2 font-akagi font-bold text-gray'>
                            <div className='w-full h-full flex flex-col justify-between'>
                                <div className='flex flex-row justify-between'>
                                    <h1 className='font-medium text-sm md:text-lg'>Assigned</h1>
                                </div>

                                <div className='flex flex-col'>
                                    <h1 className='text-xl lg:text-3xl'>
                                        {loading ? "Loading..." : inventoryCounts.rented_bikes}
                                    </h1>
                                    <h1 className='text-xs lg:text-sm font-medium'>Currently assigned</h1>
                                </div>
                            </div>
                        </div>

                        <div className='bg-[#ffffff] shadow-md  rounded-xl px-4 py-4 flex flex-col gap-2 font-akagi font-bold text-gray'>
                            <div className='w-full h-full flex flex-col justify-between'>
                                <div className='flex flex-row justify-between'>
                                    <h1 className='font-medium text-sm md:text-lg'>Available</h1>
                                </div>

                                <div className='flex flex-col'>
                                    <h1 className='text-xl lg:text-3xl'>
                                        {loading ? "Loading..." : inventoryCounts.available_bikes}
                                    </h1>
                                    <h1 className='text-xs lg:text-sm font-medium'>Available GPS</h1>
                                </div>
                            </div>
                        </div>

                        <div className='bg-[#ffffff] shadow-md  rounded-xl px-4 py-4 flex flex-col gap-2 font-akagi font-bold text-gray'>
                            <div className='w-full h-full flex flex-col justify-between'>
                                <div className='flex flex-row justify-between'>
                                    <h1 className='font-medium text-sm md:text-lg'>Under Maintenance</h1>
                                </div>

                                <div className='flex flex-col'>
                                    <h1 className='text-xl lg:text-3xl'>
                                        {loading ? "Loading..." : inventoryCounts.maintenance_bikes}
                                    </h1>
                                    <h1 className='text-xs lg:text-sm font-medium'>Maintenance GPS</h1>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='bg-[#ffffff] shadow-md rounded-xl p-5 flex flex-col gap-4'>

                        <div className='flex flex-row justify-between items-center gap-5'>
                            <h1 className='font-akagi font-bold text-lg text-gray'>
                                Bikes
                            </h1>

                            <h1 className='font-akagi font-medium text-sm text-gray'>
                                {dates?.[0] && dates?.[1]
                                    ? `${formatDisplayDate(dates[0])} – ${formatDisplayDate(dates[1])}`
                                    : ""
                                }
                            </h1>
                        </div>

                        <div className='flex flex-col gap-2'>
                            {bikeTypes.map((bikes) => (

                                
                                <BikeRowDataReports 
                                    bikeType={bikes?.name}
                                    capacity={bikes?.capacity}
                                    price={bikes?.price}
                                    image={bikes?.image_url}
                                    bikes={bikes?.bikes_mod}
                                    bikeTypeId={bikes?.id}
                                    startDate={formatDate(dates[0])}
                                    endDate={formatDate(dates[1])}
                                />
                                
                            ))}
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

export default DataReports
