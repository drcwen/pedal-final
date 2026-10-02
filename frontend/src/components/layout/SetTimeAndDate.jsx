
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState, useEffect, useMemo } from "react";
import { motion } from "motion/react";
import { fade } from "../../animations/fade";
import "../css/boxModel.css";
import AdjustHours from "../ui/AdjustHours";
import { supabase } from "../../lib/supabase";

function SetTimeAndDate({ setReservationData, onClose, reservationData }) {
    const [operatingHours, setOperatingHours] = useState([]);
    const [hoursLoading, setHoursLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(
        reservationData?.date
            ? new Date(`${reservationData.date}T00:00:00`)
            : null
    );

    const [selectedStart, setSelectedStart] = useState(() => {
        if (!reservationData?.startTime) return null;

        const [hours, minutes] = reservationData.startTime.split(":");
        const date = new Date();
        date.setHours(Number(hours), Number(minutes), 0, 0);
        return date;
    });

    const [selectedHours, setSelectedHours] = useState(
        reservationData?.hours ?? 0
    );

    const [validationError, setValidationError] = useState("");

    // Get current date in Philippine time
    const getPHDateString = () => {
        return new Intl.DateTimeFormat("en-CA", {
            timeZone: "Asia/Manila",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        }).format(new Date());
    };

    const getPHNow = () => {
        const parts = new Intl.DateTimeFormat("en-GB", {
            timeZone: "Asia/Manila",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hourCycle: "h23",
        }).formatToParts(new Date());

        const getPart = (type) =>
            Number(parts.find((part) => part.type === type)?.value || 0);

        const now = new Date();
        now.setHours(
            getPart("hour"),
            getPart("minute"),
            getPart("second"),
            0
        );
        return now;
    };

    const phNow = getPHNow();

    const getLocalDateFromString = (dateString) => {
        if (!dateString) return null;
        const [year, month, day] = dateString.split("-").map(Number);
        return new Date(year, month - 1, day);
    };

    const minDate = getLocalDateFromString(getPHDateString());
    minDate.setDate(minDate.getDate() + 1);
    minDate.setHours(0, 0, 0, 0);

    // Fetch operating hours from Supabase
    useEffect(() => {
        const getOperatingHours = async () => {
            setHoursLoading(true);

            const { data, error } = await supabase
                .from("operating_hours_mod")
                .select("id, day, opening, closing, is_whole_day, availability");

            if (error) {
                console.error("Error fetching operating hours:", error);
                setValidationError(
                    "Unable to load operating hours. Please try again."
                );
                setHoursLoading(false);
                return;
            }

            setOperatingHours(data || []);
            setHoursLoading(false);
        };

        getOperatingHours();
    }, []);

    const formatDate = (date) => {
        if (!date) return null;

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    const formatTime = (date) => {
        if (!date) return null;

        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");

        return `${hours}:${minutes}:00`;
    };

    const timeToMinutes = (time) => {
        if (!time) return null;

        const [hours, minutes] = time.split(":").map(Number);
        return hours * 60 + minutes;
    };

    // Get the selected day's operating hours
    const selectedDayHours = useMemo(() => {
        if (!selectedDate || !operatingHours.length) return null;

        const dayName = selectedDate.toLocaleDateString("en-US", {
            weekday: "long",
        });

        return operatingHours.find(
            (item) => item.day === dayName
        ) || null;
    }, [selectedDate, operatingHours]);

    // Check whether the selected day is available
    const isDayAvailable = (date) => {
        const dayName = date.toLocaleDateString("en-US", {
            weekday: "long",
        });

        const day = operatingHours.find(
            (item) => item.day === dayName
        );

        return day?.availability === true;
    };

    // Opening and closing time in minutes
    const openingMinutes = selectedDayHours
        ? timeToMinutes(selectedDayHours.opening)
        : 0;

    const closingMinutes = selectedDayHours
        ? timeToMinutes(selectedDayHours.closing)
        : 0;

    const maxAvailableHours = selectedDayHours?.availability
        ? Math.min(
            9,
            Math.floor((closingMinutes - openingMinutes) / 60)
        )
        : 0;

    // Maximum duration based on selected starting time
    const maxRentalHours = selectedStart && selectedDayHours?.availability
        ? Math.min(
            9,
            Math.floor(
                (
                    closingMinutes -
                    (selectedStart.getHours() * 60 + selectedStart.getMinutes())
                ) / 60
            )
        )
        : maxAvailableHours;

    // Generate available hourly start times
    // A rental must finish by closing time.
    // Starting exactly one hour before closing is allowed.
    const availableTimes = useMemo(() => {
        if (
            !selectedDayHours ||
            !selectedDayHours.availability ||
            !selectedHours ||
            selectedHours < 1
        ) {
            return [];
        }

        const times = [];
        const startMinutes = timeToMinutes(selectedDayHours.opening);
        const endMinutes = timeToMinutes(selectedDayHours.closing);

        for (
            let minutes = startMinutes;
            minutes + selectedHours * 60 <= endMinutes;
            minutes += 60
        ) {
            const hour = Math.floor(minutes / 60);
            const minute = minutes % 60;

            const date = new Date(selectedDate);
            date.setHours(hour, minute, 0, 0);

            times.push(date);
        }

        return times;
    }, [selectedDayHours, selectedHours, selectedDate]);

    // Check if a selected start time is valid
    const isValidStartTime = (start, duration) => {
        if (!start || !selectedDayHours?.availability) return false;

        const startMinutes =
            start.getHours() * 60 + start.getMinutes();

        const opening = timeToMinutes(selectedDayHours.opening);
        const closing = timeToMinutes(selectedDayHours.closing);

        return (
            startMinutes >= opening &&
            startMinutes < closing &&
            startMinutes + duration * 60 <= closing &&
            startMinutes % 60 === 0
        );
    };

    // Filter available days in the date picker
    const filterAvailableDates = (date) => {
        return isDayAvailable(date);
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
        setSelectedStart(null);
        setSelectedHours(0);
        setValidationError("");
    };

    const handleHoursChange = (hours) => {
        setSelectedHours(hours);
        setSelectedStart(null);
        setValidationError("");
    };

    const handleStartChange = (date) => {
        setSelectedStart(date);
        setValidationError("");

        if (date) {
            const startMinutes =
                date.getHours() * 60 + date.getMinutes();

            const closing = timeToMinutes(selectedDayHours?.closing);
            const maxHours = Math.min(
                9,
                Math.floor((closing - startMinutes) / 60)
            );

            if (selectedHours > maxHours) {
                setSelectedHours(maxHours);
            }
        }
    };

    const handleSubmit = () => {
        setValidationError("");

        if (!setReservationData) {
            console.error("setReservationData is missing");
            return;
        }

        if (hoursLoading) {
            setValidationError("Please wait while operating hours load.");
            return;
        }

        if (!selectedDate) {
            setValidationError("Please select a reservation date.");
            return;
        }

        if (!selectedDayHours || !selectedDayHours.availability) {
            setValidationError("The shop is closed on this day.");
            return;
        }

        if (
            selectedHours < 1 ||
            selectedHours > maxAvailableHours
        ) {
            setValidationError(
                `Please select a rental duration between 1 and ${maxAvailableHours} hours.`
            );
            return;
        }

        if (!selectedStart) {
            setValidationError("Please select a starting time.");
            return;
        }

        if (!isValidStartTime(selectedStart, selectedHours)) {
            setValidationError(
                "The selected time and rental duration exceed the shop's operating hours."
            );
            return;
        }

        setReservationData({
            date: formatDate(selectedDate),
            startTime: formatTime(selectedStart),
            hours: selectedHours,
        });

        if (onClose) {
            onClose();
        }
    };

    const isSubmitDisabled =
        hoursLoading ||
        !selectedDate ||
        !selectedDayHours?.availability ||
        !selectedHours ||
        !selectedStart ||
        !isValidStartTime(selectedStart, selectedHours);

    return (
        <>
            <div className="box-model fixed inset-0 z-100 bg-black/60 flex items-center justify-center p-4">
                <motion.div
                    initial={fade.initial}
                    animate={fade.animate}
                    transition={fade.transition}
                    className="bg-navyblue rounded-2xl px-6 md:px-10 py-8 md:py-10 flex flex-col gap-7 md:gap-10 items-center justify-center text-center w-full max-w-sm"
                >
                    <h1 className="font-akagi font-black text-yellow text-3xl">
                        SET RESERVATION
                    </h1>

                    {hoursLoading ? (
                        <p className="font-akagi text-[#ffffff]">
                            Loading operating hours...
                        </p>
                    ) : (
                        <div className="grid grid-cols-[60px_1fr] gap-x-3 gap-y-5 items-center justify-center">
                            {/* Date */}
                            <h1 className="font-akagi font-bold text-[#ffffff] text-xl">
                                Date
                            </h1>

                            <div className="bg-[#f7f7f7] px-5 py-2 rounded-xl flex justify-between min-w-0">
                                <DatePicker
                                    selected={selectedDate}
                                    onChange={handleDateChange}
                                    dateFormat="MM / dd / yyyy"
                                    minDate={minDate}
                                    filterDate={filterAvailableDates}
                                    placeholderText="Select date"
                                    className="w-full py-1 text-md lg:text-xl font-akagi font-bold text-center text-navyblue cursor-pointer outline-none"
                                />
                            </div>

                            {/* Closed day message */}
                            {selectedDate && selectedDayHours && !selectedDayHours.availability && (
                                <>
                                    <div />
                                    <p className="text-red-300 text-sm font-akagi text-left">
                                        The shop is closed on this day.
                                    </p>
                                </>
                            )}

                            {/* Opening hours info */}
                            {selectedDayHours?.availability && (
                                <>
                                    <div />
                                    <div className="text-left font-akagi text-[#ffffff] text-sm">
                                        <p>
                                            Operating hours:{" "}
                                            {selectedDayHours.opening} -{" "}
                                            {selectedDayHours.closing}
                                        </p>
                                        <p className="text-[#ffffff]/70">
                                            Last rental start:{" "}
                                            {(() => {
                                                const lastStart = closingMinutes - 60;
                                                const hour = Math.floor(lastStart / 60);
                                                const minute = lastStart % 60;
                                                const time = new Date();
                                                time.setHours(hour, minute, 0, 0);
                                                return time.toLocaleTimeString(
                                                    "en-US",
                                                    {
                                                        hour: "numeric",
                                                        minute: "2-digit",
                                                        hour12: true,
                                                    }
                                                );
                                            })()}
                                        </p>
                                    </div>
                                </>
                            )}

                            {/* Hours */}
                            <h1 className="font-akagi font-bold text-[#ffffff] text-xl">
                                Hour
                            </h1>

                            <div className="flex justify-start">
                                <AdjustHours
                                    value={selectedHours}
                                    setValue={handleHoursChange}
                                    min={1}
                                    max={maxAvailableHours}
                                />
                            </div>

                            {/* Time */}
                            {selectedHours > 0 && (
                                <>
                                    <h1 className="font-akagi font-bold text-[#ffffff] text-xl">
                                        Time
                                    </h1>

                                    <div className="bg-[#f7f7f7] px-5 py-2 rounded-xl flex justify-between min-w-0">
                                        <DatePicker
                                            selected={selectedStart}
                                            onChange={handleStartChange}
                                            showTimeSelect
                                            showTimeSelectOnly
                                            timeIntervals={60}
                                            dateFormat="h:mm aa"
                                            includeTimes={availableTimes}
                                            placeholderText="Select time"
                                            className="w-full py-1 text-md lg:text-xl font-akagi font-bold text-center text-navyblue cursor-pointer outline-none"
                                        />
                                    </div>
                                </>
                            )}

                            {/* Rental validation info */}
                            {selectedStart && selectedHours > 0 && (
                                <>
                                    <div />
                                    <p className="text-[#ffffff]/80 text-sm font-akagi text-left">
                                        Rental ends at{" "}
                                        {(() => {
                                            const end = new Date(selectedStart);
                                            end.setHours(
                                                end.getHours() + selectedHours
                                            );
                                            return end.toLocaleTimeString(
                                                "en-US",
                                                {
                                                    hour: "numeric",
                                                    minute: "2-digit",
                                                    hour12: true,
                                                }
                                            );
                                        })()}
                                    </p>
                                </>
                            )}

                            {/* Validation error */}
                            {validationError && (
                                <>
                                    <div />
                                    <p className="text-red-300 text-sm font-akagi text-left">
                                        {validationError}
                                    </p>
                                </>
                            )}
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="w-full flex justify-between">
                        <button
                            type="button"
                            className="bg-lightgray rounded-lg px-5 py-1 cursor-pointer"
                            onClick={onClose}
                        >
                            <h1 className="font-akagi text-sm font-semibold text-navyblue">
                                Back
                            </h1>
                        </button>

                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isSubmitDisabled}
                            className={`rounded-lg px-5 py-1 transition ${
                                isSubmitDisabled
                                    ? "bg-yellow/40 opacity-50 cursor-not-allowed"
                                    : "bg-yellow cursor-pointer hover:opacity-80"
                            }`}
                        >
                            <h1 className="font-akagi text-sm font-semibold text-navyblue">
                                Submit
                            </h1>
                        </button>
                    </div>
                </motion.div>
            </div>
        </>
    );
}

export default SetTimeAndDate;