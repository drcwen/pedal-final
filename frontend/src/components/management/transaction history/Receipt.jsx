
import { IoIosArrowBack } from "react-icons/io";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "motion/react"
import { printReceipt } from "./printReceipt"

function Receipt({ setReceipt, startedBikes, transaction, maintenanceData, fullName, extensionsData, changeBikesData }) {

    function formatDate(dateString) {
        if (!dateString) return "-";

        const date = new Date(`${dateString}T00:00:00`);

        return date.toLocaleDateString("en-PH", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    }

    function formatTime12Hour(time) {
        if (!time) return "-";

        const [hours, minutes, seconds] = time.split(":").map(Number);

        const date = new Date();
        date.setHours(hours, minutes, seconds || 0);

        return date.toLocaleTimeString("en-PH", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    }

    function getEndTimePH(range) {
        if (!range) return "-";

        // Get the end timestamp from the range
        const endTimestamp = range
            .replace("[", "")
            .replace(")", "")
            .split(",")[1];

        if (!endTimestamp) return "-";

        const date = new Date(endTimestamp);

        return date.toLocaleTimeString("en-PH", {
            timeZone: "Asia/Manila",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    }

    function getStartTimePH(range) {
        if (!range) return "-";

        // Get the first/start timestamp from the range
        const startTimestamp = range
            .replace("[", "")
            .replace(")", "")
            .split(",")[0];

        if (!startTimestamp) return "-";

        const date = new Date(startTimestamp);

        return date.toLocaleTimeString("en-PH", {
            timeZone: "Asia/Manila",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    }

    function formatDatePH(timestamp) {
        if (!timestamp) return "-";

        const date = new Date(timestamp);

        return date.toLocaleDateString("en-PH", {
            timeZone: "Asia/Manila",
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    }

    function formatTimePH(timestamp) {
        if (!timestamp) return "-";

        const date = new Date(timestamp);

        return date.toLocaleTimeString("en-PH", {
            timeZone: "Asia/Manila",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    }

    const groupedBikes = Object.values(
        (startedBikes ?? []).reduce((groups, bike) => {
            const key = `${bike.bike_type_id}-${bike.reservation_date}-${bike.start_time}`;

            if (!groups[key]) {
                groups[key] = {
                    ...bike,
                    quantity: 1,
                };
            } else {
                groups[key].quantity += 1;
            }

            return groups;
        }, {})
    );

    console.log(startedBikes)

    return (
    <>

        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-100 p-5">
            <div className="
                bg-[#ffffff]
                p-5 md:p-10
                rounded-xl
                w-full
                max-w-2xl
                max-h-[90vh]
                overflow-y-auto
                scrollbar-thin
                scrollbar-thumb-[#B9B9B9]
                scrollbar-track-[#E2E2E2] flex flex-col gap-5
            ">
                <div className='w-full flex flex-col gap-5 bg-gray/10 border border-gray/30 p-2 py-10 rounded-lg'>
                    <div className='flex flex-col items-center justify-center font-akagi font-bold text-gray'>
                        <h1 className='text-lg text-blue'>3Jremy's Rent A Bike!</h1>
                        <h1 className='font-medium text-sm'>La Mesa Eco Park, Quezon City</h1>
                    </div>

                    <div className='font-akagi font-medium text-gray text-sm md:text-md lg:px-10 px-2'>
                        

                        {/*Receipt No*/}
                        <div className='flex flex-row justify-between'>
                            <h1>Receipt No:</h1>
                            <h1>#{transaction.id}</h1>
                        </div>

                        {/*Customer*/}
                        <div className='flex flex-row justify-between'>
                            <h1>Customer:</h1>
                            <h1>{fullName}</h1>
                        </div>

                        {/*Type*/}
                        <div className='flex flex-row justify-between'>
                            <h1>Type:</h1>
                            <h1>{transaction.type}</h1>
                        </div>

                        {/*Date and Time*/}
                        <div className='flex flex-col py-2'>
                            <div className='flex flex-row justify-between'>
                                <h1>Transaction Date:</h1>
                                <h1>{formatDatePH(transaction.created_at)}</h1>
                            </div>

                            <div className='flex flex-row justify-between'>
                                <h1>Transaction Time:</h1>
                                <h1>{formatTimePH(transaction.created_at)}</h1>
                            </div>
                        </div>

                        <div className='flex flex-col py-5'>
                            <div className='w-full bg-gray/40 h-0.5 rounded-xl'></div>
                        </div>

                        {/*Walk-in and Reservation rents*/}
                        {(transaction?.type === "reservation" || transaction?.type === "walk-in" || transaction?.type === null) && 
                            <div className='flex flex-col'>
                                {groupedBikes.map((bike, index) => (
                                    <div
                                        key={bike.id ?? index}
                                        className='flex flex-row justify-between py-2 items-center'
                                    >
                                        <div className='flex flex-col'>
                                            <div className='flex flex-row gap-2'>
                                                <h1>
                                                    {bike.bike_types_mod?.name ?? "Unknown Bike"}
                                                </h1>

                                                <h1>
                                                    x{bike.quantity}
                                                </h1>
                                            </div>

                                            <h1>
                                                {formatDate(bike.reservation_date) ?? "--"}
                                            </h1>

                                            <div className='flex flex-row gap-1'>
                                                <h1>
                                                    {formatTime12Hour(bike.start_time) ?? "--"}
                                                </h1>

                                                -

                                                <h1>
                                                    {getEndTimePH(bike.reservation_range) ?? "--"}
                                                </h1>
                                            </div>

                                            <h1>
                                                {bike.duration_hours === 1 ? bike.duration_hours + " hour" : bike.duration_hours + " hours"}
                                            </h1>
                                        </div>

                                        <h1>
                                            P{(bike.bike_types_mod?.price ?? 0) * bike.quantity}
                                        </h1>
                                    </div>
                                ))}
                            </div>
                        }

                        {/*Maintenance */}
                        {transaction.type === "maintenance" &&
                            <div
                                className='flex flex-row justify-between py-2 items-center'
                            >
                                <div className='flex flex-col'>
                                    <div className='flex flex-row gap-3'>
                                        <h1>
                                            {maintenanceData?.orders_mod?.bikes_mod?.bike_types_mod?.name}
                                        </h1>

                                        <h1>
                                            {maintenanceData?.orders_mod?.bikes_mod?.code}
                                        </h1>
                                    </div>

                                    <h1>
                                        {maintenanceData?.reason}
                                    </h1>

                                    <h1>
                                        {fullName}
                                    </h1>
                                </div>

                                <h1>
                                    P{transaction.total_amount}
                                </h1>
                            </div>
                        }

                        {/*Extension */}
                        {transaction.type === "extend" &&
                            <div
                                className='flex flex-row justify-between py-2 items-center'
                            >
                                <div className='flex flex-col'>
                                    <div className='flex flex-row gap-2'>
                                        <h1>
                                            {extensionsData?.bike_types_mod?.name}
                                        </h1>

                                        <h1>
                                            {extensionsData?.bikes_mod?.code}
                                        </h1>
                                    </div>

                                    <h1>
                                        +{extensionsData?.extension_duration === 1 ? extensionsData?.extension_duration + " hour" : extensionsData?.extension_duration + " hours"}
                                    </h1>

                                    <div className='flex flex-row gap-1'>
                                        <h1>
                                            {getStartTimePH(extensionsData?.new_reservation_range) ?? "--"}
                                        </h1>

                                        -

                                        <h1>
                                            {getEndTimePH(extensionsData?.new_reservation_range) ?? "--"}
                                        </h1>
                                    </div>
                                </div>

                                <h1>
                                    P{transaction.total_amount}
                                </h1>
                            </div>
                        }

                        {/*Changed Bikes */}
                        {transaction.type === "change" &&
                        <>
                            <div
                                className='flex flex-row justify-between py-2 items-center'
                            >
                                <div className='flex flex-col'>
                                    <h1>
                                        ORIGINAL BIKE
                                    </h1>
                                    <div className='flex flex-row gap-2'>
                                        <h1>
                                            {changeBikesData?.[0]?.original_bike_type?.name}
                                        </h1>

                                        <h1>
                                            {changeBikesData?.[0]?.original_bike?.code}
                                        </h1>
                                    </div>

                                    <div className='flex flex-row gap-1'>
                                        <h1>
                                            {formatTime12Hour(changeBikesData?.[0]?.orders_mod?.start_time)}
                                        </h1>

                                        -

                                        <h1>
                                            {getEndTimePH(changeBikesData?.[0]?.orders_mod?.reservation_range) ?? "--"}
                                        </h1>
                                    </div>

                                </div>

                            </div>

                            <div
                                className='flex flex-row justify-between py-2 items-center'
                            >
                                <div className='flex flex-col'>
                                    <h1>
                                        CHANGED BIKE
                                    </h1>
                                    <div className='flex flex-row gap-2'>
                                        <h1>
                                            {changeBikesData?.[0]?.changed_bike_type?.name}
                                        </h1>

                                        <h1>
                                            {changeBikesData?.[0]?.changed_bike?.code}
                                        </h1>
                                    </div>

                                    <div className='flex flex-row gap-1'>
                                        <h1>
                                            {formatTime12Hour(changeBikesData?.[0]?.orders_mod?.start_time)}
                                        </h1>

                                        -

                                        <h1>
                                            {getEndTimePH(changeBikesData?.[0]?.orders_mod?.reservation_range) ?? "--"}
                                        </h1>
                                    </div>

                                </div>

                                <h1>
                                    P{transaction.total_amount}
                                </h1>

                            </div>
                        </>
                        }


                        <div className='flex flex-col py-5'>
                            <div className='w-full bg-gray/40 h-0.5 rounded-xl'></div>
                        </div>

                        <div className='flex flex-row justify-between'>
                            <h1>Total:</h1>
                            <h1>P{transaction.total_amount}</h1>
                        </div>

                        <div className='flex flex-row justify-between'>
                            <h1>Tendered Amount:</h1>
                            <h1>P{transaction.amount_paid}</h1>
                        </div>

                        <div className='flex flex-row justify-between'>
                            <h1>Change:</h1>
                            <h1>P{transaction.change_amount}</h1>
                        </div>

                        <div className='flex flex-row justify-between'>
                            <h1>Method:</h1>
                            <h1>{transaction.payment_method}</h1>
                        </div>

                        <div className='flex flex-row justify-between'>
                            <h1>Assisted by:</h1>
                            <h1>{transaction?.assisted_by_profile?.full_name}</h1>
                        </div>
                    </div>
                </div>

                <div className='flex justify-between'>
                    <div 
                        onClick={() => setReceipt(false)}
                        className='flex gap-2 border border-gray text-gray px-2 py-1 rounded-lg font-akagi font-semibold cursor-pointer text-sm'>
                            Close
                    </div>

                    <div  
                        onClick={() => {
                            printReceipt({
                                transaction,
                                startedBikes,
                                maintenanceData,
                                fullName,
                                extensionsData,
                                changeBikesData
                            });
                        }}
                        className='flex gap-2 bg-blue text-[#ffffff] px-2 py-1 rounded-lg font-akagi font-semibold cursor-pointer text-sm'
                    >
                        Print
                    </div>
                </div>
            </div>
        </div>
    </>
)
}

export default Receipt
