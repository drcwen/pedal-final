import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    RiArrowDropDownLine,
    RiArrowDropUpLine,
} from "react-icons/ri";

function GPSRowDataReports({
    name,
    status,
    battery,
    todayRents = 0,
    selectedDateRents = 0,
    allTimeRents = 0,
    statsLoading = false,
}) {
    const [dropDown, setDropDown] = useState(false);

    const formatCount = (value) =>
        Number(value ?? 0).toLocaleString();

    return (
        <div className="w-full bg-[#EBEBEB] rounded-xl py-3 border border-[#C9C9C9]">
            {/* GPS Summary */}
            <div className="px-3 md:pl-5 grid grid-cols-[1fr_120px_20px] md:grid-cols-[1fr_1fr_1fr_50px] gap-2 md:text-center items-center font-akagi font-bold text-[#9E9E9E]">
                <div className="text-start">{name}</div>

                <div className="text-start">
                    {battery ?? 0}%
                </div>

                <div className="hidden md:block text-start">
                    {status}
                </div>

                <div className="text-xl text-[#9E9E9E]">
                    {dropDown ? (
                        <RiArrowDropUpLine
                            className="cursor-pointer"
                            onClick={() => setDropDown(false)}
                        />
                    ) : (
                        <RiArrowDropDownLine
                            className="cursor-pointer"
                            onClick={() => setDropDown(true)}
                        />
                    )}
                </div>
            </div>

            {/* GPS Rental Statistics */}
            <AnimatePresence initial={false}>
                {dropDown && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                            duration: 0.3,
                            ease: "easeInOut",
                        }}
                        className="w-full xl:px-8 px-3 overflow-hidden"
                    >
                        <div className="py-5 grid md:grid-cols-3 grid-cols-2 gap-2 text-center font-akagi text-md font-bold text-gray">
                            {/* Today's Rentals */}
                            <div className="border border-[#c9c9c9] hover:scale-[1.02] hover:shadow-xl duration-300 transition-all rounded-lg shadow-md flex flex-col gap-2 py-3 items-center">
                                <h1 className="font-medium">
                                    Total Usage Today
                                </h1>

                                <h1 className="text-xl">
                                    {statsLoading
                                        ? "Loading..."
                                        : formatCount(todayRents)}
                                </h1>
                            </div>

                            {/* Selected Date Range Rentals */}
                            <div className="border border-[#c9c9c9] hover:scale-[1.02] hover:shadow-xl duration-300 transition-all rounded-lg shadow-md flex flex-col gap-2 py-3 items-center">
                                <h1 className="font-medium">
                                    Total Usage On Selected Date
                                </h1>

                                <h1 className="text-xl">
                                    {statsLoading
                                        ? "Loading..."
                                        : formatCount(selectedDateRents)}
                                </h1>
                            </div>

                            {/* All-Time Rentals */}
                            <div className="border border-[#c9c9c9] hover:scale-[1.02] hover:shadow-xl duration-300 transition-all rounded-lg shadow-md flex flex-col gap-2 py-3 items-center">
                                <h1 className="font-medium">
                                    All Time Total Usage
                                </h1>

                                <h1 className="text-xl">
                                    {statsLoading
                                        ? "Loading..."
                                        : formatCount(allTimeRents)}
                                </h1>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default GPSRowDataReports;