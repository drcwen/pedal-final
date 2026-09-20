import { supabase } from "../../lib/supabase"
import Sidebar from "./sidebar/Sidebar"
import { MdDirectionsBike } from "react-icons/md";
import { motion } from "motion/react"
import SidebarMobile from "./sidebar/SidebarMobile"
import { useState, useEffect } from 'react';
import { GrTransaction } from "react-icons/gr";
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

function Dashboard() {

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

    const [dates, setDates] = useState([firstDay, lastDay]);

    const [dashboardData, setDashboardData] = useState([]);

    const formatDate = (date) => {
        if (!date) return null;

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

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
    console.log(dashboardData)

    useEffect(() => {
        fetchData();
    }, [dates]);
    
    console.log(dashboardData)
  return (
    <>

        <div className='w-full min-h-screen bg-[#F2F2F2] flex'>
            <Sidebar active={'dashboard'}/>

            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }} 
                className='flex flex-col flex-1 min-w-0 lg:h-screen lg:py-15 lg:px-10 p-5 md:p-7 gap-5'>

                <SidebarMobile active={'dashboard'}/>

                <h1 className='md:text-4xl text-2xl font-akagi font-bold tracking-wide text-blue'>Dashboard</h1>

                {/*Upper Boards*/}
                <div className='xl:grid-cols-3 grid grid-cols-2 gap-5'>
                    <div className='bg-gradient-to-t from-blue to-blue/65 shadow-md rounded-xl px-4 py-4 flex flex-col gap-2 font-akagi font-bold text-[#ffffff]'>
                        <div className='w-full h-full lg:h-27 flex flex-col justify-between'>
                            <div className='flex flex-row justify-between'>
                                <h1 className='font-medium text-sm md:text-lg'>Total Walk-ins Today</h1>
                            </div>

                            <div className='flex flex-col'>
                                <h1 className='text-xl lg:text-3xl'>10</h1>
                                <h1 className='text-xs lg:text-sm font-medium'>From reservation and </h1>
                            </div>
                        </div>
                    </div>  

                    <div className='bg-[#ffffff] shadow-md rounded-xl px-4 py-4 flex flex-col gap-2 font-akagi font-bold text-gray'>
                        <div className='w-full h-full flex flex-col justify-between'>
                            <div className='flex flex-row justify-between'>
                                <h1 className='font-medium text-sm md:text-lg'>Total Reservations Today</h1>
                            </div>

                            <div className='flex flex-col'>
                                <h1 className='text-xl lg:text-3xl'>10</h1>
                                <h1 className='text-xs lg:text-sm font-medium'>From reservation and </h1>
                            </div>
                        </div>
                    </div>

                    <div className='bg-[#ffffff] shadow-md  rounded-xl px-5 pl-6 py-5 flex flex-col gap-2'>

                    </div>


                </div>

                {/*Graph*/}
                <div className='w-full lg:h-full flex flex-col lg:grid lg:grid-cols-3 gap-5'>
                    <div className="lg:col-span-2 w-full h-[350px] lg:h-full min-h-0 bg-[#ffffff] p-5 shadow-lg rounded-xl font-akagi font-medium text-sm flex flex-col gap-4">
                        <h1 className='font-akagi font-medium text-gray text-xl lg:text-xl'>This month</h1>
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

                    <div className='flex flex-col bg-[#ffffff] p-5 rounded-xl shadow-lg gap-4 font-akagi font-medium text-gray'>
                        <h1 className='text-gray text-xl lg:text-xl'>
                            Available Bikes
                        </h1>
                        <div className='flex flex-col gap-4'>
                            <div className='w-full flex flex-row justify-between items-center'>
                                <div className='flex flex-row gap-3 items-center'>
                                    <div className='rounded-lg bg-yellow p-2'>
                                        <img src='https://res.cloudinary.com/dp3vkgxtb/image/upload/v1775884918/solo_bike_mhxxvb.png' className='w-10'/>
                                    </div>
                                    <h1 className='font-bold text-gray text-lg'>Mountain Bike</h1>
                                </div>

                                <h1 className='text-lg text-blue'>31 bikes</h1>

                            </div>

                            <div className='w-full flex flex-row justify-between items-center'>
                                <div className='flex flex-row gap-3 items-center'>
                                    <div className='rounded-lg bg-yellow p-2'>
                                        <img src='https://res.cloudinary.com/dp3vkgxtb/image/upload/v1775884918/solo_bike_mhxxvb.png' className='w-10'/>
                                    </div>
                                    <h1 className='font-bold text-gray text-lg'>Mountain Bike</h1>
                                </div>

                                <h1 className='text-lg text-blue'>31 bikes</h1>

                            </div>

                            <div className='w-full flex flex-row justify-between items-center'>
                                <div className='flex flex-row gap-3 items-center'>
                                    <div className='rounded-lg bg-yellow p-2'>
                                        <img src='https://res.cloudinary.com/dp3vkgxtb/image/upload/v1775884918/solo_bike_mhxxvb.png' className='w-10'/>
                                    </div>
                                    <h1 className='font-bold text-gray text-lg'>Mountain Bike</h1>
                                </div>

                                <h1 className='text-lg text-blue'>31 bikes</h1>

                            </div>

                            <div className='w-full flex flex-row justify-between items-center'>
                                <div className='flex flex-row gap-3 items-center'>
                                    <div className='rounded-lg bg-yellow p-2'>
                                        <img src='https://res.cloudinary.com/dp3vkgxtb/image/upload/v1775884918/solo_bike_mhxxvb.png' className='w-10'/>
                                    </div>
                                    <h1 className='font-bold text-gray text-lg'>Mountain Bike</h1>
                                </div>

                                <h1 className='text-lg text-blue'>31 bikes</h1>

                            </div>
                        </div>
                    </div>
                </div>

                

                
            </motion.div>
        </div>
    </>
  )
}

export default Dashboard
