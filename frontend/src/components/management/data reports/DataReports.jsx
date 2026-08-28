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
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";

function DataReports() {

    const [dates, setDates] = useState(null);
    const [dashboardData, setDashboardData] = useState([]);
    const formatDate = (date) => {
        if (!date) return null;

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
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

            console.log(data);

            setDashboardData(data);
        };

        const fetchHolderData = async () => {
            const { data, error } = await supabase.rpc(
                "get_daily_dashboard_data",
                {
                    start_date: '2026-08-01',
                    end_date: '2026-08-05'
                }
            );

            if (error) {
                console.error(error);
                return;
            }

            console.log(data);

            setHolderData(data);
        };

        fetchData();
        fetchHolderData();
    }, [dates]);

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
                    
                    <div className='flex flex-row justify-between gap-3 items-center'>

                        <div className='flex flex-row gap-3'>
                            <h1 className='font-akagi font-medium text-gray'>Sales</h1>
                        </div>

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
                    </div>

                    <div className='bg-[#ffffff] w-full rounded-xl p-5 flex flex-col gap-3'>
                        <h1 className='md:text-xl text-lg font-akagi font-bold tracking-wide text-gray'>Rentals for</h1>

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
                                <h1>Total Revenue</h1>
                                <h1 className='text-4xl'>P12000</h1>
                            </div>

                            <div className='bg-[#ffffff] p-5 font-akagi font-bold text-gray rounded-xl flex flex-col gap-2'>
                                <h1>Total Rentals</h1>
                                <h1 className='text-4xl'>P12000</h1>
                            </div>

                            <div className='bg-[#ffffff] p-5 font-akagi font-bold text-gray rounded-xl flex flex-col gap-2'>
                                <h1>Avg Rent per Transaction</h1>
                                <h1 className='text-4xl'>P12000</h1>
                            </div>

                            <div className='bg-[#ffffff] p-5 font-akagi font-bold text-gray rounded-xl flex flex-col gap-2'>
                                <h1>Most Payment Method</h1>
                                <h1 className='text-4xl'>P12000</h1>
                            </div>
                        </div>
                    
                </div>
            </motion.div>
        </div>
    </>
  )
}

export default DataReports
