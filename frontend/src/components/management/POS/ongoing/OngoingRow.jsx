import { RiArrowDropDownLine } from "react-icons/ri";
import { RiArrowDropUpLine } from "react-icons/ri";
import { motion, AnimatePresence } from "motion/react"
import { useState, useEffect } from 'react';
import OngoingBikesOrders from "./OngoingBikesOrders"
import { supabase } from "../../../../lib/supabase"
import Payment from "./three dots/Payment"
import ChangeBike from "./ChangeBike"
import MaintenancePayment from "./MaintenancePayment"
import { MdOutlineReceiptLong } from "react-icons/md";
import Receipt from "../../receipt/Receipt"
import { MdDeleteForever } from "react-icons/md";
import { useRef } from "react";
import { IoMdClose } from "react-icons/io";
import RentalOverdue from "./RentalOverdue"

function OngoingRow({ name, ordercount, start, bikeDetails, refreshOngoing, transaction, transactionDetails }) {

    const [receipt, setReceipt] = useState(false);

    const [extendOrder, setExtendOrder] = useState(null);
    const [changeOrder, setChangeOrder] = useState(null);
    const [maintenancePayment, setMaintenancePayment] = useState(null);
    const [rentalOverdue, setRentalOverdue] = useState(null);

    const [dropdown, setDropdown] = useState(false);

    const [updatedTime, setUpdatedTime] = useState(null);
    const [extensionClicked, setExtensionClicked] = useState(null);
    const [payment, setPayment] = useState(null);

    const [extendedTotal, setExtendedTotal] = useState(0);
    
    const [voidConfirmation, setVoidConfirmation] = useState(false);

    const [adminPin, setAdminPin] = useState("");
    const [pinLoading, setPinLoading] = useState(false);
    const [pinError, setPinError] = useState("");

    const [maxExtensionHours, setMaxExtensionHours] = useState(0);
    const [extensionHoursLoading, setExtensionHoursLoading] = useState(false);
    const [extensionHoursError, setExtensionHoursError] = useState("");

    async function fetchAvailableExtensionHours(endRange) {
        setExtensionHoursLoading(true);
        setExtensionHoursError("");
        setMaxExtensionHours(0);

        try {
            const match = endRange?.match(/\["([^"]+)","([^"]+)"\)/);

            if (!match) {
            console.error("Invalid reservation range:", endRange);
            throw new Error("Invalid rental end time.");
            }

            const endTimestamp = match[2].trim();

            let normalizedTimestamp = endTimestamp.replace(" ", "T");
            normalizedTimestamp = normalizedTimestamp.replace(
            /([+-]\d{2})$/,
            "$1:00"
            );

            normalizedTimestamp = normalizedTimestamp.replace(
            /\.(\d{3})\d+(?=(?:Z|[+-]\d{2}:\d{2})?$)/,
            ".$1"
            );

            if (!/(Z|[+-]\d{2}:\d{2})$/i.test(normalizedTimestamp)) {
            normalizedTimestamp += "Z";
            }

            const rentalEnd = new Date(normalizedTimestamp);

            if (Number.isNaN(rentalEnd.getTime())) {
            console.error("Invalid end timestamp:", endTimestamp);
            throw new Error("Unable to read the rental end time.");
            }

            const weekday = new Intl.DateTimeFormat("en-US", {
            timeZone: "Asia/Manila",
            weekday: "long",
            }).format(rentalEnd);

            const endHour = Number(
            new Intl.DateTimeFormat("en-US", {
                timeZone: "Asia/Manila",
                hour: "2-digit",
                hourCycle: "h23",
            }).format(rentalEnd)
            );

            const endMinute = Number(
            new Intl.DateTimeFormat("en-US", {
                timeZone: "Asia/Manila",
                minute: "2-digit",
            }).format(rentalEnd)
            );

            const { data: schedule, error } = await supabase
            .from("operating_hours_mod")
            .select("day, opening, closing, availability, is_whole_day")
            .eq("day", weekday)
            .maybeSingle();

            if (error) throw error;

            if (!schedule) {
            throw new Error(`No operating-hours record found for ${weekday}.`);
            }

            if (schedule.availability !== true) {
            setMaxExtensionHours(0);
            setExtensionHoursError(
                `The park is closed on ${weekday}. Extensions are unavailable.`
            );
            return;
            }

            const [closingHour, closingMinute] = schedule.closing
            .split(":")
            .map(Number);

            const currentEndMinutes = endHour * 60 + endMinute;
            const closingMinutes = closingHour * 60 + closingMinute;

            const remainingMinutes = closingMinutes - currentEndMinutes;

            const availableHours = Math.max(
            0,
            Math.floor(remainingMinutes / 60)
            );

            const allowedHours = availableHours;

            setMaxExtensionHours(allowedHours);

            if (allowedHours === 0) {
            setExtensionHoursError(
                `No additional rental hours are available. The park closes at ${schedule.closing}.`
            );
            }
        } catch (error) {
            console.error("Error checking extension hours:", error);
            setMaxExtensionHours(0);
            setExtensionHoursError(
            error.message || "Unable to check available extension hours."
            );
        } finally {
            setExtensionHoursLoading(false);
        }
        }

    const handlePinChange = (e, index) => {
        const value = e.target.value;

        if (!/^\d?$/.test(value)) return;

        const currentPin = pinRefs.current.map(
            (input) => input?.value || ""
        );

        currentPin[index] = value;

        const newPin = currentPin.join("");

        setAdminPin(newPin);
        setPinError("");

        if (value && index < 5) {
            pinRefs.current[index + 1]?.focus();
        }

        if (newPin.length === 6) {
            checkAdminPin(newPin);
        }
    };

    const checkAdminPin = async (pinCode) => {
        setPinLoading(true);
        setPinError("");

        const { data, error } = await supabase
            .from("pin_mod")
            .select("id, admin_id")
            .eq("pin", Number(pinCode))
            .maybeSingle();

        if (error) {
            console.error("Error checking admin PIN:", error);
            setPinError("Something went wrong. Please try again.");
            setPinLoading(false);
            return;
        }

        if (!data) {
            setPinError("Incorrect admin PIN.");
            setPinLoading(false);
            return;
        }

        // PIN is correct
        console.log("Correct admin PIN:", data);

        await voidTransaction();

        setPinLoading(false);
    };

    const startedBikes = bikeDetails.filter(
        (bike) => bike.status === "started"
    );

    const pinRefs = useRef([]);

    const handlePinKeyDown = (e, index) => {
        // Move to previous input when backspacing an empty input
        if (
            e.key === "Backspace" &&
            !e.target.value &&
            index > 0
        ) {
            pinRefs.current[index - 1]?.focus();
        }
    };

    const voidTransaction = async () => {
        try {
            const orderIds = startedBikes.map((bike) => bike.id);

            const walkInUserId = transactionDetails?.walk_in?.[0]?.id;

            for (const bike of startedBikes) {

                if (bike.bikes_mod?.id) {
                    const { error: bikeError } = await supabase
                        .from("bikes_mod")
                        .update({
                            status: "Available",
                        })
                        .eq("id", bike.bikes_mod.id);

                    if (bikeError) {
                        console.error("Error updating bike:", bikeError);
                        return;
                    }
                }

                if (bike.gps_mod?.id) {
                    const { error: gpsError } = await supabase
                        .from("gps_mod")
                        .update({
                            status: "Available",
                        })
                        .eq("id", bike.gps_mod.id);

                    if (gpsError) {
                        console.error("Error updating GPS:", gpsError);
                        return;
                    }
                }
            }

            if (orderIds.length > 0) {
                const { error: ordersError } = await supabase
                    .from("orders_mod")
                    .delete()
                    .in("id", orderIds);

                if (ordersError) {
                    console.error("Error deleting orders:", ordersError);
                    return;
                }
            }

            if (walkInUserId) {
                const { error: walkInError } = await supabase
                    .from("walk_ins_users_mod")
                    .delete()
                    .eq("id", walkInUserId);

                if (walkInError) {
                    console.error("Error deleting walk-in user:", walkInError);
                    return;
                }
            }

            const { error: transactionError } = await supabase
                .from("transactions_mod")
                .delete()
                .eq("id", transaction);

            if (transactionError) {
                console.error("Error deleting transaction:", transactionError);
                return;
            }

            await refreshOngoing();

            setAdminPin("");
            setPinError("");
            setVoidConfirmation(false);

            console.log("Transaction voided successfully.");

        } catch (error) {
            console.error("Error voiding transaction:", error);
        }
        
    };

    async function updateStatus() {
        const transactionId = bikeDetails[0].transaction_id;

        const { error } = await supabase
            .from("transactions_mod")
            .update({
                status: "completed",
            })
            .eq("id", transactionId); 

        if (error) {
            console.error(error);
        }

        
        await refreshOngoing();
    }

    // convert 13:00:00 to 1:00PM
    function formatTime12Hour(time) {
        const [hours, minutes] = time.split(":").map(Number);

        const date = new Date();
        date.setHours(hours, minutes, 0);

        return date.toLocaleTimeString("en-PH", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    }

    function getEndTimeOnly(tstzrange) {
        const match = tstzrange.match(/\["[^"]+","([^"]+)"\)/);

        if (!match) return null;

        const utcDate = new Date(
            match[1]
                .replace(" ", "T")
                .replace("+00", "Z")
        );

        return utcDate.toLocaleTimeString("en-PH", {
            timeZone: "Asia/Manila",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    }

    //add hour on tstzrange
    function addHoursToTstzrange(range, hoursToAdd) {
        const match = range.match(/\["([^"]+)","([^"]+)"\)/);

        if (!match) {
            throw new Error("Invalid tstzrange format.");
        }

        const [, start, end] = match;

        const endDate = new Date(end);
        endDate.setHours(endDate.getHours() + hoursToAdd);

        const formattedEnd = endDate
            .toISOString()
            .replace("T", " ")
            .replace(".000Z", "+00");

        return `["${start}","${formattedEnd}")`;
    }

    useEffect(() => {
        
        if (bikeDetails.length === 0) return;
        if (startedBikes.length !== 0) return;

        updateStatus();
        
    }, [startedBikes.length]);

    useEffect(() => {
        if (!extendOrder) {
            setMaxExtensionHours(0);
            setExtensionHoursError("");
            setUpdatedTime(null);
            setExtensionClicked(null);
            setExtendedTotal(0);
            return;
        }

        fetchAvailableExtensionHours(extendOrder.end);
    }, [extendOrder]);

  return (
    <>
        <div 
            className='w-full flex flex-col rounded-lg bg-[#F0F0F0] md:px-10 px-4 py-2 border border-[#DBDBDB]'>

            <div className='w-full flex flex-row justify-between items-center'>
                <div className='w-full md:grid md:grid-cols-4 gap-5 items-center md:text-center flex flex-row'>
                    <h1 className='font-akagi font-bold text-gray text-lg'>{name}</h1>
                    <h1 className={`${dropdown === true ? "hidden md:block" : "block"} font-akagi font-semibold text-gray text-lg`}>{ordercount}</h1>
                    <h1 className='hidden md:block font-akagi font-semibold text-gray text-lg'>{start ? formatTime12Hour(start) : "--:--"}</h1>

                </div>

                <div 
                    onClick={() => setDropdown(!dropdown)}
                    className='cursor-pointer'
                >
                    {dropdown ? (
                        <RiArrowDropUpLine className='text-3xl text-gray'/>
                    ): (
                        <RiArrowDropDownLine className='text-3xl text-gray'/>
                    )}
                    
                </div>
            </div>

            <AnimatePresence initial={false}>
                {dropdown && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className='w-full flex flex-col py-5'>
                        <div className='w-full md:grid md:grid-cols-2 xl:grid-cols-3 flex flex-col gap-3'>

                            {startedBikes
                                .map((bikes) => (
                                    <OngoingBikesOrders
                                        bikeTypeId={bikes.bike_types_mod.id}
                                        bikeCode={bikes.bikes_mod?.code}
                                        gpsId={bikes.gps_mod?.code}
                                        gpsCode={bikes.gps_mod?.id}
                                        type={bikes.bike_types_mod.name}
                                        image={bikes.bike_types_mod.image_url}
                                        price={bikes.bike_types_mod?.price ?? 0}
                                        duration={
                                            bikes.duration_hours === 1
                                                ? bikes.duration_hours + " hour"
                                                : bikes.duration_hours + " hours"
                                        }
                                        start={bikes.start_time}
                                        end={bikes.reservation_range}
                                        orderId={bikes.id}
                                        setExtendOrder={setExtendOrder}
                                        setChangeOrder={setChangeOrder}
                                        setMaintenancePayment={setMaintenancePayment}
                                        pricePerHour={bikes.bike_types_mod.price}
                                        transactionId={transaction}
                                        bikeId={bikes.bikes_mod?.id}
                                        extensionsDuration={bikes.extensions_mod?.map(
                                            extension => extension.extension_duration
                                        )}
                                        refreshOngoing={refreshOngoing}
                                        setRentalOverdue={setRentalOverdue}
                                    />
                                ))
                            }

                        </div>

                        <div className='flex gap-3 justify-end items-center'>

                             <div 
                                onClick={() => setVoidConfirmation(!voidConfirmation)}
                                className='flex gap-2 bg-red-400 px-2 py-1 rounded-lg font-akagi font-semibold cursor-pointer text-[#ffffff] text-sm'>
                                <MdDeleteForever className='text-lg'/>Void
                            </div>

                            <div 
                                onClick={() => setReceipt(!receipt)}
                                className='flex gap-2 bg-blue px-2 py-1 rounded-lg font-akagi font-semibold cursor-pointer text-[#ffffff] text-sm'>
                                <MdOutlineReceiptLong className='text-lg'/>Receipt
                            </div>

                            {voidConfirmation &&
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
                                        <div className='flex justify-end'>
                                            <IoMdClose
                                                onClick={() => {
                                                    setVoidConfirmation(false);
                                                    setAdminPin("");
                                                    setPinError("");
                                                }}
                                                className='text-xl text-gray cursor-pointer'
                                            />
                                        </div>
                                        <div className='w-full flex flex-col gap-5 bg-gray/10 border border-gray/30 p-2 py-10 rounded-lg justify-center items-center text-center font-akagi text-2xl font-bold text-blue'>
                                            Enter admin PIN to void transaction.

                                            <div className='flex gap-3 justify-center'>
                                                {[0, 1, 2, 3, 4, 5].map((index) => (
                                                    <input
                                                        key={index}
                                                        ref={(el) => (pinRefs.current[index] = el)}
                                                        type='password'
                                                        maxLength={1}
                                                        inputMode='numeric'
                                                        value={adminPin[index] || ""}
                                                        onChange={(e) => handlePinChange(e, index)}
                                                        onKeyDown={(e) => handlePinKeyDown(e, index)}
                                                        className='
                                                            w-12 h-14
                                                            border-2 border-gray/30
                                                            rounded-lg
                                                            bg-white
                                                            text-center
                                                            text-2xl
                                                            font-bold
                                                            text-blue
                                                            outline-none
                                                            focus:border-blue
                                                            focus:ring-2
                                                            focus:ring-blue/20
                                                        '
                                                    />
                                                ))}
                                            </div>

                                            <div className='h-8 flex items-center justify-center'>
                                                {pinLoading && (
                                                    <p className='text-gray font-akagi text-lg'>
                                                        Checking PIN...
                                                    </p>
                                                )}

                                                {!pinLoading && pinError && (
                                                    <p className='text-red-500 font-akagi text-lg'>
                                                        {pinError}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                            
                        </div>

                        {receipt &&
                            <Receipt 
                                setReceipt={setReceipt}
                                startedBikes={startedBikes}
                                transaction={transactionDetails}
                            />
                        }
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

        { changeOrder && 
            <ChangeBike 
                setChangeOrder={setChangeOrder}
                changeOrder={changeOrder}

            />
        }

        { rentalOverdue && 
            <RentalOverdue 
                setRentalOverdue={setRentalOverdue}
                rentalOverdue={rentalOverdue}

            />
        }

        { maintenancePayment && 
            <MaintenancePayment 
                setMaintenancePayment={setMaintenancePayment}
                maintenancePayment={maintenancePayment}

            />
        }
        {/*Extend Rent*/}
        {extendOrder && (
            <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 sm:px-10 px-5 md:px-20 lg:px-60 xl:px-100">
                <div className="w-full bg-[#F0F0F0] p-6 rounded-xl font-akagi font-bold text-lg text-gray flex flex-col gap-5">
                    <h1 className='text-3xl text-navyblue'>Extend Bike</h1>

                    <div className='border border-[#DBDBDB] p-2 rounded-lg shadow-lg flex items-center flex-row gap-3'>
                        <div className='bg-yellow p-1 rounded-lg w-fit'>
                            <img src={extendOrder.image} className='w-15'/>
                        </div>

                        <div className='flex flex-row gap-2 items-center'>
                            <h1>{extendOrder.type}</h1>
                            <div className='bg-navyblue px-3 py-0.5 rounded-lg'>
                                <h1 className='text-[#ffffff]'>{extendOrder.bikeCode}</h1>
                            </div>
                        </div>
                    </div>
                    
                    <div className='flex flex-col gap-5 px-10'>
                        <h1>Current End: {getEndTimeOnly(extendOrder.end)}</h1>

                        {extensionHoursLoading ? (
                            <p className="col-span-4 text-center text-gray">
                                Loading park operating hours...
                            </p>
                        ) : (
                            <div className="col-span-4 grid grid-cols-4 gap-2 md:gap-5">
                                {Array.from(
                                    { length: maxExtensionHours },
                                    (_, index) => index + 1
                                ).map((hours) => (
                                    <button
                                        key={hours}
                                        type="button"
                                        onClick={() => {
                                            setUpdatedTime(
                                                addHoursToTstzrange(
                                                    extendOrder.end,
                                                    hours
                                                )
                                            );

                                            setExtensionClicked(hours);

                                            setExtendedTotal(
                                                Number(extendOrder.pricePerHour) * hours
                                            );
                                        }}
                                        className={`border-2 rounded-lg flex py-3 justify-center items-center cursor-pointer
                                            ${
                                                extensionClicked === hours
                                                    ? "bg-blue text-white border-blue"
                                                    : "border-[#DBDBDB]"
                                            }`}
                                    >
                                        +{hours}
                                    </button>
                                ))}
                            </div>
                        )}

                        {!extensionHoursLoading &&
                            maxExtensionHours === 0 && (
                                <p className="col-span-4 text-center text-red-500">
                                    {extensionHoursError ||
                                        "No extension hours are available."}
                                </p>
                            )}
                        <h1>Updated End: {updatedTime ? getEndTimeOnly(updatedTime) : "--:--"}</h1>

                        <div className='flex flex-row gap-2 items-center'>
                            <h1>Total: </h1>
                            <h1 className='text-2xl text-blue'>P{extendedTotal}</h1>
                        </div>
                    </div>

    
                    <div className='flex justify-between'>
                        <button 
                            className='bg-red-500 rounded-lg text-[#ffffff] px-3 py-1 cursor-pointer'
                            onClick={() => setExtendOrder(null)}
                        >
                            Close
                        </button>

                        <button
                            type="button"
                            disabled={
                                extensionHoursLoading ||
                                maxExtensionHours === 0 ||
                                !extensionClicked ||
                                extendedTotal <= 0
                            }
                            className={`bg-green-500 rounded-lg text-white px-3 py-1
                                ${
                                    extensionHoursLoading ||
                                    maxExtensionHours === 0 ||
                                    !extensionClicked ||
                                    extendedTotal <= 0
                                        ? "opacity-30 cursor-not-allowed"
                                        : "cursor-pointer"
                                }`}
                            onClick={() => setPayment(true)}
                        >
                            Payment
                        </button>

                        {payment === true &&
                            <Payment 
                                total={extendedTotal}
                                setPayment={setPayment}
                                bikeId={extendOrder.bikeId}
                                bikeType={extendOrder.type}
                                orderId={extendOrder.orderId}
                                extensionClicked={extensionClicked}
                                updatedTime={updatedTime}
                                bikeCode={extendOrder.bikeCode}
                                bikeTypeId={extendOrder.bikeTypeId}
                            />
                        }
                    </div>
                </div>
            </div>
        )}
                                
    </>
  )
}

export default OngoingRow