
import { supabase } from "../../lib/supabase";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import Sidebar from "./sidebar/Sidebar";
import SidebarMobile from "./sidebar/SidebarMobile";
import { IoMdLocate } from "react-icons/io";
import { RiArrowDropDownLine } from "react-icons/ri";

function Alerts() {
    const [activeAlerts, setActiveAlerts] = useState([]);
    const [selectedAlert, setSelectedAlert] = useState(null);
    const [showResolveDropdown, setShowResolveDropdown] = useState(false);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const formatRelativeDate = (timestamp) => {
        if (!timestamp) return "";

        const date = new Date(timestamp);
        if (Number.isNaN(date.getTime())) return "";

        const getPHDate = (value) =>
            new Intl.DateTimeFormat("en-CA", {
                timeZone: "Asia/Manila",
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
            }).format(value);

        const givenDate = getPHDate(date);
        const todayDate = getPHDate(new Date());

        const yesterday = new Date(`${todayDate}T00:00:00Z`);
        yesterday.setUTCDate(yesterday.getUTCDate() - 1);
        const yesterdayDate = yesterday.toISOString().slice(0, 10);

        if (givenDate === todayDate) return "Today";
        if (givenDate === yesterdayDate) return "Yesterday";

        const [year, month, day] = givenDate.split("-");
        return `${month}/${day}/${year}`;
    };

    const formatTime = (timestamp) => {
        if (!timestamp) return "";

        const date = new Date(timestamp);
        if (Number.isNaN(date.getTime())) return "";

        return new Intl.DateTimeFormat("en-US", {
            timeZone: "Asia/Manila",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        }).format(date);
    };

    const getActiveAlerts = async () => {
        setLoading(true);
        setErrorMessage("");

        const { data, error } = await supabase
            .from("alerts_mod")
            .select(`
                *,
                bike_types_mod (*),
                bikes_mod (*)
            `)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error getting alerts:", error);
            setErrorMessage("Failed to load alerts. Please try again.");
            setLoading(false);
            return;
        }

        setActiveAlerts(data || []);
        setLoading(false);
    };

    useEffect(() => {
        getActiveAlerts();
    }, []);

    const updateAlertStatus = async (alertId, status) => {
        if (!alertId || updating) return;

        setUpdating(true);
        setErrorMessage("");

        const { error } = await supabase
            .from("alerts_mod")
            .update({ status })
            .eq("id", alertId);

        if (error) {
            console.error("Error updating alert:", error);
            setErrorMessage("Failed to update alert status.");
            setUpdating(false);
            return;
        }

        setActiveAlerts((prev) =>
            prev.map((alert) =>
                alert.id === alertId
                    ? { ...alert, status }
                    : alert
            )
        );

        setSelectedAlert((prev) =>
            prev?.id === alertId
                ? { ...prev, status }
                : prev
        );

        setShowResolveDropdown(false);
        setUpdating(false);
    };

    const openDetails = (alert) => {
        setSelectedAlert(alert);
        setShowResolveDropdown(false);
        setErrorMessage("");
    };

    const closeDetails = () => {
        setSelectedAlert(null);
        setShowResolveDropdown(false);
        setErrorMessage("");
    };

    return (
        <>
            <div className="w-full min-h-screen bg-[#F2F2F2] flex">
                <Sidebar active="" />
                <SidebarMobile active="" />

                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{
                        duration: 0.25,
                        ease: "easeInOut",
                    }}
                    className="flex flex-col flex-1 min-w-0 lg:h-screen lg:py-15 lg:px-10 p-5 md:p-7 gap-5"
                >
                    <div className="flex flex-col gap-1 font-akagi">
                        <h1 className="md:text-4xl text-2xl font-bold tracking-wide text-blue">
                            Alerts
                        </h1>
                        <h1 className="text-md font-medium text-gray">
                            Only emergency incidents reported by customers via QR code.
                        </h1>
                    </div>

                    <div className="w-full h-full bg-[#ffffff] rounded-xl p-5 overflow-y-auto flex flex-col">
                        <div className="flex flex-col gap-3">
                            {loading && (
                                <div className="flex justify-center items-center py-10 font-akagi text-gray">
                                    Loading alerts...
                                </div>
                            )}

                            {errorMessage && !selectedAlert && (
                                <div className="text-center text-red-500 font-akagi py-3">
                                    {errorMessage}
                                    <button
                                        onClick={getActiveAlerts}
                                        className="ml-2 underline cursor-pointer"
                                    >
                                        Retry
                                    </button>
                                </div>
                            )}

                            {!loading && !errorMessage && activeAlerts.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-16 text-center font-akagi text-gray gap-2">
                                    <h1 className="text-xl font-bold text-blue">
                                        No Alerts
                                    </h1>
                                    <p className="font-medium">
                                        There are currently no reported incidents.
                                    </p>
                                </div>
                            )}

                            {!loading && activeAlerts.map((active) => (
                                <div
                                    key={active.id}
                                    className="grid grid-cols-2 border border-gray/15 md:grid-cols-[1fr_1fr_1fr_120px_120px] bg-gray/10 p-3 rounded-lg gap-2"
                                >
                                    <div className="flex gap-3 items-center min-w-0">
                                        <div className="bg-yellow rounded-lg p-1 shrink-0">
                                            <img
                                                src="https://res.cloudinary.com/dp3vkgxtb/image/upload/v1775884918/family_bike_hkm9lu.png"
                                                className="w-10"
                                                alt="Bike"
                                            />
                                        </div>

                                        <div className="flex flex-col font-akagi font-bold text-gray justify-center min-w-0">
                                            <h1 className="text-blue">
                                                {active?.bikes_mod?.code || "Unknown Bike"}
                                            </h1>
                                            <h1 className="font-medium truncate">
                                                {active?.bike_types_mod?.name || "Unknown Type"}
                                            </h1>
                                        </div>
                                    </div>

                                    <div className="hidden md:flex w-full text-center flex-col font-akagi font-bold text-gray justify-center min-w-0">
                                        <h1 className="text-blue truncate">
                                            {active?.concern || "No concern specified"}
                                        </h1>
                                    </div>

                                    <div className="hidden md:flex w-full justify-center text-center flex-col font-akagi font-bold text-gray">
                                        <h1 className="text-blue">
                                            {formatTime(active?.created_at)}
                                        </h1>
                                        <h1 className="font-medium">
                                            {formatRelativeDate(active?.created_at)}
                                        </h1>
                                    </div>

                                    <div className="justify-end w-full flex items-center md:justify-center">
                                        <button
                                            type="button"
                                            onClick={() => openDetails(active)}
                                            className={`cursor-pointer rounded-lg px-3 py-1 font-akagi font-bold text-[#ffffff] transition hover:opacity-80 ${
                                                active.status === "Resolved"
                                                    ? "bg-green-500"
                                                    : active.status === "Dismissed"
                                                    ? "bg-gray"
                                                    : "bg-red-400"
                                            }`}
                                        >
                                            {active.status || "Resolve"}
                                        </button>
                                    </div>

                                    <div className="hidden md:flex w-full items-center justify-end">
                                        <button
                                            type="button"
                                            onClick={() => openDetails(active)}
                                            className="cursor-pointer rounded-lg px-3 py-1 border border-gray font-akagi font-bold text-gray hover:bg-gray/10 transition"
                                        >
                                            View Details
                                        </button>
                                    </div>

                                    <div className="flex md:hidden items-center justify-end col-span-2">
                                        <button
                                            type="button"
                                            onClick={() => openDetails(active)}
                                            className="cursor-pointer rounded-lg px-3 py-1 border border-gray font-akagi font-bold text-gray text-sm hover:bg-gray/10 transition"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>

            {selectedAlert && (
                <div
                    className="fixed inset-0 bg-black/50 flex justify-center items-center z-[100] p-5"
                    onClick={closeDetails}
                >
                    <div
                        className="bg-[#ffffff] p-5 md:p-5 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-[#B9B9B9] scrollbar-track-[#E2E2E2] flex flex-col gap-5"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="w-full bg-gray/15 border border-gray/20 p-3 rounded-lg flex justify-between items-center font-akagi font-bold text-gray gap-2">
                            <div className="flex gap-3 items-center min-w-0">
                                <div className="bg-yellow rounded-lg p-1 shrink-0">
                                    <img
                                        src="https://res.cloudinary.com/dp3vkgxtb/image/upload/v1775884918/family_bike_hkm9lu.png"
                                        className="w-10"
                                        alt="Bike"
                                    />
                                </div>

                                <div className="flex flex-col justify-center min-w-0">
                                    <h1 className="text-blue">
                                        {selectedAlert?.bikes_mod?.code || "Unknown Bike"}
                                    </h1>
                                    <h1 className="font-medium truncate">
                                        {selectedAlert?.bike_types_mod?.name || "Unknown Type"}
                                    </h1>
                                </div>
                            </div>

                            <div className="relative shrink-0">
                                <button
                                    type="button"
                                    onClick={() => setShowResolveDropdown(!showResolveDropdown)}
                                    disabled={updating}
                                    className={`cursor-pointer flex items-center gap-2 w-fit px-3 py-1 text-[#ffffff] rounded-lg disabled:opacity-50 ${
                                        selectedAlert.status === "Resolved"
                                            ? "bg-green-500"
                                            : selectedAlert.status === "Dismissed"
                                            ? "bg-gray"
                                            : "bg-red-400"
                                    }`}
                                >
                                    {selectedAlert.status || "Resolve"}
                                    <RiArrowDropDownLine
                                        className={`text-xl transition-transform ${
                                            showResolveDropdown ? "rotate-180" : ""
                                        }`}
                                    />
                                </button>

                                {showResolveDropdown && (
                                    <div className="absolute right-0 top-full mt-2 w-36 bg-[#ffffff] border border-gray/20 rounded-lg shadow-lg overflow-hidden z-50">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                updateAlertStatus(selectedAlert.id, "Resolved")
                                            }
                                            disabled={updating}
                                            className="w-full text-left px-3 py-2 font-akagi font-bold text-gray hover:bg-gray/10 cursor-pointer disabled:opacity-50"
                                        >
                                            Resolved
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                updateAlertStatus(selectedAlert.id, "Dismissed")
                                            }
                                            disabled={updating}
                                            className="w-full text-left px-3 py-2 font-akagi font-bold text-gray hover:bg-gray/10 cursor-pointer disabled:opacity-50"
                                        >
                                            Dismissed
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                updateAlertStatus(selectedAlert.id, "Pending")
                                            }
                                            disabled={updating}
                                            className="w-full text-left px-3 py-2 font-akagi font-bold text-gray hover:bg-gray/10 cursor-pointer disabled:opacity-50"
                                        >
                                            Pending
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {errorMessage && (
                            <p className="text-sm text-red-500 font-akagi">
                                {errorMessage}
                            </p>
                        )}

                        {updating && (
                            <p className="text-sm text-gray font-akagi">
                                Updating status...
                            </p>
                        )}

                        <div className="px-3 flex flex-col font-akagi font-bold text-gray gap-2">
                            <div className="grid grid-cols-[80px_1fr]">
                                <h1>Date:</h1>
                                <h1 className="font-medium">
                                    {formatRelativeDate(selectedAlert?.created_at)}
                                </h1>
                            </div>

                            <div className="grid grid-cols-[80px_1fr]">
                                <h1>Time:</h1>
                                <h1 className="font-medium">
                                    {formatTime(selectedAlert?.created_at)}
                                </h1>
                            </div>

                            <div className="grid grid-cols-[80px_1fr]">
                                <h1>Concern:</h1>
                                <h1 className="font-medium break-words">
                                    {selectedAlert?.concern || "No concern specified"}
                                </h1>
                            </div>

                            <div className="grid grid-cols-[80px_1fr]">
                                <h1>Status:</h1>
                                <h1 className="font-medium">
                                    {selectedAlert?.status || "Pending"}
                                </h1>
                            </div>
                        </div>

                        <div className="flex justify-between font-akagi font-bold text-gray items-center">
                            <button
                                type="button"
                                onClick={closeDetails}
                                className="border border-gray rounded-lg px-3 py-1 font-medium cursor-pointer hover:bg-gray/10 transition"
                            >
                                Close
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    // Add your bike location functionality here.
                                }}
                                className="w-fit px-3 py-1 bg-green-500 rounded-lg flex gap-2 items-center text-[#ffffff] cursor-pointer hover:opacity-80 transition"
                            >
                                <IoMdLocate className="text-[#ffffff]" />
                                Locate
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Alerts;