
import { supabase } from "../../lib/supabase";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import Sidebar from "./sidebar/Sidebar";
import SidebarMobile from "./sidebar/SidebarMobile";
import { IoMdLocate } from "react-icons/io";
import { RiArrowDropDownLine } from "react-icons/ri";
import { HiOutlineBell, HiOutlineClock } from "react-icons/hi";

function Alerts({role}) {
    const [activeAlerts, setActiveAlerts] = useState([]);
    const [selectedAlert, setSelectedAlert] = useState(null);
    const [showResolveDropdown, setShowResolveDropdown] = useState(false);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [activeTab, setActiveTab] = useState("Pending");

    const [activeMainTab, setActiveMainTab] = useState("Alert");
    const [adminNotifications, setAdminNotifications] = useState([]);
    const [notificationLoading, setNotificationLoading] = useState(true);
    const [notificationError, setNotificationError] = useState("");
    const [adminUserId, setAdminUserId] = useState(null);

    const tabs = [
        {
            key: "Pending",
            label: "Pending",
            count: activeAlerts.filter(
                (alert) => (alert.status || "Pending") === "Pending"
            ).length,
        },
        {
            key: "Resolved",
            label: "Resolved",
            count: activeAlerts.filter(
                (alert) => alert.status === "Resolved"
            ).length,
        },
        {
            key: "Dismissed",
            label: "Dismissed",
            count: activeAlerts.filter(
                (alert) => alert.status === "Dismissed"
            ).length,
        },
        {
            key: "All",
            label: "All",
            count: activeAlerts.length,
        },
    ];

    const filteredAlerts = activeAlerts.filter((alert) => {
        if (activeTab === "All") return true;

        return (alert.status || "Pending") === activeTab;
    });


    const getAlertDateGroup = (timestamp) => {
        if (!timestamp) return "Unknown Date";

        const date = new Date(timestamp);
        if (Number.isNaN(date.getTime())) return "Unknown Date";

        const dateString = new Intl.DateTimeFormat("en-CA", {
            timeZone: "Asia/Manila",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        }).format(date);

        const today = new Intl.DateTimeFormat("en-CA", {
            timeZone: "Asia/Manila",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        }).format(new Date());

        const yesterdayDate = new Date(`${today}T00:00:00Z`);
        yesterdayDate.setUTCDate(yesterdayDate.getUTCDate() - 1);
        const yesterday = yesterdayDate.toISOString().slice(0, 10);

        if (dateString === today) return "Today";
        if (dateString === yesterday) return "Yesterday";

        const [year, month, day] = dateString.split("-");
        return `${month}/${day}/${year}`;
    };

    const groupedAlerts = Object.entries(
        [...filteredAlerts]
            .sort((a, b) => {
                // Dismissed alerts always go to the bottom.
                const aDismissed = a.status === "Dismissed";
                const bDismissed = b.status === "Dismissed";

                if (aDismissed !== bDismissed) {
                    return aDismissed ? 1 : -1;
                }

                // Within each status group, newest alerts first.
                return new Date(b.created_at) - new Date(a.created_at);
            })
            .reduce((groups, alert) => {
                const dateGroup = getAlertDateGroup(alert.created_at);

                if (!groups[dateGroup]) {
                    groups[dateGroup] = [];
                }

                groups[dateGroup].push(alert);
                return groups;
            }, {})
    );

    const formatRelativeDate = (timestamp) => {
        if (!timestamp) return "";

        const createdAt = new Date(timestamp);
        if (Number.isNaN(createdAt.getTime())) return "";

        const now = new Date();
        const diffMs = Math.max(0, now.getTime() - createdAt.getTime());

        const seconds = Math.floor(diffMs / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (seconds < 60) return `${seconds}s`;
        if (minutes < 60) return `${minutes}m`;
        if (hours < 24) return `${hours}h`;
        if (days < 7) return `${days}d`;

        // For alerts older than 7 days, show the actual date in Philippine time.
        return new Intl.DateTimeFormat("en-US", {
            timeZone: "Asia/Manila",
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
        }).format(createdAt);
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

    const getAdminNotifications = async (recipientId) => {
        if (!recipientId) return;

        try {
            setNotificationLoading(true);
            setNotificationError("");

            const { data, error } = await supabase
                .from("notifications_mod")
                .select("*")
                .eq("recipient_id", recipientId)
                .order("created_at", { ascending: false });

            if (error) throw error;

            setAdminNotifications(data || []);
        } catch (error) {
            console.error("Error fetching admin notifications:", error);
            setNotificationError("Failed to load notifications. Please try again.");
        } finally {
            setNotificationLoading(false);
        }
    };

    const markNotificationAsRead = async (notification) => {
        if (notification.is_read || !adminUserId) return;

        setAdminNotifications((prev) =>
            prev.map((item) =>
                item.id === notification.id
                    ? { ...item, is_read: true }
                    : item
            )
        );

        const { error } = await supabase
            .from("notifications_mod")
            .update({
                is_read: true,
                read_at: new Date().toISOString(),
            })
            .eq("id", notification.id)
            .eq("recipient_id", adminUserId);

        if (error) {
            console.error("Error marking notification as read:", error);

            setAdminNotifications((prev) =>
                prev.map((item) =>
                    item.id === notification.id
                        ? { ...item, is_read: false }
                        : item
                )
            );
        }
    };

    useEffect(() => {
        getActiveAlerts();
    }, []);

    useEffect(() => {
        let channel;
        let isMounted = true;

        const initializeAdminNotifications = async () => {
            try {
                const {
                    data: { user },
                    error,
                } = await supabase.auth.getUser();

                if (error) throw error;

                if (!user) {
                    if (isMounted) {
                        setNotificationLoading(false);
                    }
                    return;
                }

                if (!isMounted) return;

                setAdminUserId(user.id);

                channel = supabase
                    .channel(`admin-notifications-${user.id}`)
                    .on(
                        "postgres_changes",
                        {
                            event: "*",
                            schema: "public",
                            table: "notifications_mod",
                            filter: `recipient_id=eq.${user.id}`,
                        },
                        () => {
                            getAdminNotifications(user.id);
                        }
                    )
                    .subscribe();

                await getAdminNotifications(user.id);
            } catch (error) {
                console.error("Error initializing admin notifications:", error);

                if (isMounted) {
                    setNotificationError("Failed to load notifications.");
                    setNotificationLoading(false);
                }
            }
        };

        initializeAdminNotifications();

        return () => {
            isMounted = false;

            if (channel) {
                supabase.removeChannel(channel);
            }
        };
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
            <div className="w-full h-screen overflow-hidden bg-[#F2F2F2] flex">
                <Sidebar active="" userRole={role} />
                <SidebarMobile active="" />

                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{
                        duration: 0.25,
                        ease: "easeInOut",
                    }}
                    className="flex flex-col flex-1 min-w-0 min-h-0 lg:h-screen lg:py-15 lg:px-10 p-5 md:p-7 gap-5"
                >
                    {/* Main Tabs */}
                    <div className="flex gap-2 border-b border-gray/20 pb-3 font-akagi">
                        <button
                            type="button"
                            onClick={() => {
                                setActiveMainTab("Alert");
                                setSelectedAlert(null);
                            }}
                            className={`px-5 py-2 rounded-lg font-bold transition flex items-center gap-2 ${
                                activeMainTab === "Alert"
                                    ? "bg-blue text-[#ffffff]"
                                    : "bg-gray/10 text-gray hover:bg-gray/20"
                            }`}
                        >
                            Alerts

                            {activeAlerts.filter(
                                (alert) => (alert.status || "Pending") === "Pending"
                            ).length > 0 && (
                                <span
                                    className={`text-xs rounded-full px-2 py-0.5 ${
                                        activeMainTab === "Alert"
                                            ? "bg-[#ffffff] text-blue"
                                            : "bg-red-500 text-[#ffffff]"
                                    }`}
                                >
                                    {activeAlerts.filter(
                                        (alert) => (alert.status || "Pending") === "Pending"
                                    ).length}
                                </span>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setActiveMainTab("Notification");
                                setSelectedAlert(null);
                            }}
                            className={`px-5 py-2 rounded-lg font-bold transition flex items-center gap-2 ${
                                activeMainTab === "Notification"
                                    ? "bg-blue text-[#ffffff]"
                                    : "bg-gray/10 text-gray hover:bg-gray/20"
                            }`}
                        >
                            Notifications

                            {adminNotifications.filter((item) => !item.is_read).length > 0 && (
                                <span className={`text-xs rounded-full px-2 py-0.5 ${
                                    activeMainTab === "Notification"
                                        ? "bg-[#ffffff] text-blue"
                                        : "bg-blue text-[#ffffff]"
                                }`}>
                                    {adminNotifications.filter((item) => !item.is_read).length}
                                </span>
                            )}
                        </button>
                    </div>

                    {activeMainTab === "Alert" ? (
                    <>
                    <div className="flex flex-col gap-1 font-akagi">
                        <h1 className="md:text-4xl text-2xl font-bold tracking-wide text-blue">
                            Alerts
                        </h1>
                        <h1 className="text-md font-medium text-gray">
                            Only emergency incidents reported by customers via QR code.
                        </h1>
                    </div>

                    <div className="w-full flex-1 min-h-0 min-w-0 bg-[#ffffff] rounded-xl p-5 overflow-y-auto flex flex-col">
                        <div className="flex flex-col gap-3">
                
                            <div className="flex gap-2 overflow-x-auto pb-1">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.key}
                                        type="button"
                                        onClick={() => setActiveTab(tab.key)}
                                        className={`shrink-0 rounded-lg px-4 py-2 text-sm font-akagi font-medium transition ${
                                            activeTab === tab.key
                                                ? "bg-blue text-[#ffffff]"
                                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        }`}
                                    >
                                        {tab.label} ({tab.count})
                                    </button>
                                ))}
                            </div>
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
                            {!loading && groupedAlerts.map(([dateGroup, alerts]) => (
                                <div key={dateGroup} className="flex flex-col gap-3">
                                    {/* Date heading */}
                                    <h2 className="font-akagi font-medium text-gray/70 text-lg mt-3">
                                        {dateGroup}
                                    </h2>

                                    {alerts.map((active) => (
                                        <div
                                            key={active.id}
                                            className={`grid grid-cols-2 border border-gray/15 md:grid-cols-[1fr_1fr_1fr_120px_120px] p-3 rounded-lg gap-2 ${
                                                active.status === "Dismissed"
                                                    ? "bg-gray/5 opacity-70"
                                                    : "bg-gray/10"
                                            }`}
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
                                                    {active.status || "Pending"}
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
                            ))}
                        </div>
                                        </div>
                    </>
                    ) : (
                        /* Notifications Tab */
                        <div className="w-full flex-1 min-h-0 min-w-0 bg-[#ffffff] rounded-xl p-5 overflow-y-auto flex flex-col gap-4 font-akagi">

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div>
                                    <h2 className="text-xl font-bold text-blue">
                                        Notifications
                                    </h2>

                                    <p className="text-sm text-gray font-medium mt-1">
                                        Updates and announcements for administrators and cashiers.
                                    </p>
                                </div>

                                <span className="text-sm font-bold text-gray">
                                    {adminNotifications.filter((item) => !item.is_read).length} unread
                                </span>
                            </div>

                            {notificationLoading ? (
                                <div className="flex justify-center items-center py-16 text-gray">
                                    Loading notifications...
                                </div>
                            ) : notificationError ? (
                                <div className="text-center text-red-500 py-10">
                                    <p>{notificationError}</p>

                                    <button
                                        type="button"
                                        onClick={() => getAdminNotifications(adminUserId)}
                                        className="mt-2 underline font-bold"
                                    >
                                        Try again
                                    </button>
                                </div>
                            ) : adminNotifications.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 text-center gap-2">
                                    <HiOutlineBell className="text-5xl text-gray-300" />

                                    <h2 className="text-xl font-bold text-blue">
                                        No Notifications
                                    </h2>

                                    <p className="text-gray font-medium">
                                        You don't have any notifications yet.
                                    </p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    {adminNotifications.map((notification) => (
                                        <button
                                            key={notification.id}
                                            type="button"
                                            onClick={() => markNotificationAsRead(notification)}
                                            className={`w-full text-left flex gap-4 items-start p-4 rounded-xl border transition ${
                                                notification.is_read
                                                    ? "bg-[#ffffff] border-gray-200 hover:bg-gray-50"
                                                    : "bg-blue/5 border-blue/30 hover:bg-blue/10"
                                            }`}
                                        >
                                            <div
                                                className={`shrink-0 rounded-full p-3 ${
                                                    notification.is_read
                                                        ? "bg-gray-100 text-gray-500"
                                                        : "bg-blue/10 text-blue"
                                                }`}
                                            >
                                                <HiOutlineBell className="text-xl" />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-wrap items-center justify-between gap-2">
                                                    <h3 className="font-bold text-blue">
                                                        {notification.title || "Notification"}
                                                    </h3>

                                                    {!notification.is_read && (
                                                        <span className="bg-blue text-[#ffffff] text-xs font-bold px-3 py-1 rounded-full">
                                                            NEW
                                                        </span>
                                                    )}
                                                </div>

                                                <p className="text-sm text-gray font-medium mt-2 leading-relaxed">
                                                    {notification.message}
                                                </p>

                                                <div className="flex flex-wrap gap-2 items-center mt-3 text-xs text-gray-500">
                                                    <HiOutlineClock className="text-base" />

                                                    <span>
                                                        {formatTime(notification.created_at)}
                                                    </span>

                                                    <span>•</span>

                                                    <span>
                                                        {formatRelativeDate(notification.created_at)}
                                                    </span>

                                                    {notification.type && (
                                                        <>
                                                            <span>•</span>

                                                            <span className="capitalize">
                                                                {notification.type.replace(/_/g, " ")}
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </motion.div>
            </div>

            {activeMainTab === "Alert" && selectedAlert && (
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