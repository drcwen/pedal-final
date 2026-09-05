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

function DataReports() {

    const [dashboardData, setDashboardData] = useState([]);
    const [gross, setGross] = useState("...");
    const [reservationGross, setReservationGross] = useState("...");
    const [walkInGross , setWalkInGross] = useState("...");
    const [extensionsGross, setExtensionsGross] = useState("...");
    const [changeGross, setChangeGross] = useState("...");

    const formatDate = (date) => {
        if (!date) return null;

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

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

            console.log(data);

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

                        <div className='pt-10 flex flex-col gap-2'>
                            <div className='pb-5 flex flex-row justify-between gap-5 items-center'>

                                <div className="flex-1 min-w-0 overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-[#B9B9B9] scrollbar-track-transparent">
                                    <div className="flex flex-row lg:gap-8 gap-5 w-max">
                                        <div className='flex flex-row gap-2 font-akagi font-bold text-gray'>
                                            <input type='checkbox' className='cursor-pointer'/>
                                            <h1>Walk-ins</h1>
                                        </div>

                                        <div className='flex flex-row gap-2 font-akagi font-bold text-gray'>
                                            <input type='checkbox' className='cursor-pointer'/>
                                            <h1>Reservations</h1>
                                        </div>

                                        <div className='flex flex-row gap-2 font-akagi font-bold text-gray'>
                                            <input type='checkbox' className='cursor-pointer'/>
                                            <h1>Extensions</h1>
                                        </div>

                                        <div className='flex flex-row gap-2 font-akagi font-bold text-gray'>
                                            <input type='checkbox' className='cursor-pointer'/>
                                            <h1>Changed Bikes</h1>
                                        </div>
                                    </div>
                                </div>

                                <div className='flex flex-row cursor-pointer gap-2 rounded-lg bg-blue font-akagi font-bold text-md px-3 py-1 items-center text-[#ffffff]'>
                                    <FaPrint className='text-sm'/>
                                    Get Excel 
                                </div>
                            </div>
                            <div className='w-full h-[50px] rounded-xl p-2 bg-[#ffffff] border border-gray/50'>
                            
                            </div>
                            <div className='w-full h-[50px] rounded-xl p-2 bg-[#ffffff] border border-gray/50'>
                            
                            </div>
                            <div className='w-full h-[50px] rounded-xl p-2 bg-[#ffffff] border border-gray/50'>
                            
                            </div>
                            <div className='w-full h-[50px] rounded-xl p-2 bg-[#ffffff] border border-gray/50'>
                            
                            </div>
                            <div className='w-full h-[50px] rounded-xl p-2 bg-[#ffffff] border border-gray/50'>
                            
                            </div>
                            <div className='w-full h-[50px] rounded-xl p-2 bg-[#ffffff] border border-gray/50'>
                            
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
