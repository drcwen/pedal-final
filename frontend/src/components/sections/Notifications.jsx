
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    HiOutlineBell,
    HiOutlineCheckCircle,
    HiOutlineClock,
} from "react-icons/hi";
import { supabase } from "../../lib/supabase";
import Navigation from "../../components/layout/Navigation/StaticNavigationPC";

function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [userId, setUserId] = useState(null);
    const [selectedNotification, setSelectedNotification] = useState(null);

    // Fetch the logged-in customer's notifications.
    const fetchNotifications = useCallback(async (customerId) => {
        if (!customerId) return;

        try {
            const { data: notificationData, error: notificationError } =
                await supabase
                    .from("notifications_mod")
                    .select("*")
                    .eq("recipient_id", customerId)
                    .order("created_at", { ascending: false });

            if (notificationError) throw notificationError;

            if (!notificationData?.length) {
                setNotifications([]);
                return;
            }

            // Get transaction IDs from notifications.
            const transactionIds = [
                ...new Set(
                    notificationData
                        .map((item) => item.transaction_id)
                        .filter(Boolean)
                ),
            ];

            let refunds = [];

            // Fetch the corresponding refund requests.
            if (transactionIds.length > 0) {
                const { data: refundData, error: refundError } =
                    await supabase
                        .from("refund_mod")
                        .select("*")
                        .in("original_transaction_id", transactionIds);

                if (refundError) throw refundError;

                refunds = refundData || [];
            }

            // Attach the refund information to each notification.
            const combinedNotifications = notificationData.map((notification) => {
                const refund = refunds.find(
                    (item) =>
                        item.original_transaction_id ===
                        notification.transaction_id
                );

                return {
                    ...notification,
                    refund: refund || null,
                };
            });

            setNotifications(combinedNotifications);
            setErrorMessage("");
        } catch (error) {
            console.error("Error fetching notifications:", error);
            setErrorMessage("Unable to load your notifications.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        let channel;

        const initializeNotifications = async () => {
            try {
                const {
                    data: { user },
                    error,
                } = await supabase.auth.getUser();

                if (error) throw error;

                if (!user) {
                    setErrorMessage("Please log in to view your notifications.");
                    setLoading(false);
                    return;
                }

                setUserId(user.id);

                await fetchNotifications(user.id);

                // Listen for new or updated notifications.
                channel = supabase
                    .channel(`customer-notifications-${user.id}`)
                    .on(
                        "postgres_changes",
                        {
                            event: "*",
                            schema: "public",
                            table: "notifications_mod",
                            filter: `recipient_id=eq.${user.id}`,
                        },
                        () => fetchNotifications(user.id)
                    )
                    .subscribe();
            } catch (error) {
                console.error("Error initializing notifications:", error);
                setErrorMessage("Unable to load your notifications.");
                setLoading(false);
            }
        };

        initializeNotifications();

        return () => {
            if (channel) {
                supabase.removeChannel(channel);
            }
        };
    }, [fetchNotifications]);

    // Mark a notification as read when clicked.
    const markAsRead = async (notification) => {
        if (notification.is_read) return;

        // Update the UI immediately.
        setNotifications((previous) =>
            previous.map((item) =>
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
            .eq("recipient_id", userId);

        if (error) {
            console.error("Error marking notification as read:", error);

            // Restore the notification if the update fails.
            setNotifications((previous) =>
                previous.map((item) =>
                    item.id === notification.id
                        ? { ...item, is_read: false }
                        : item
                )
            );
        }
    };

    const handleNotificationClick = async (notification) => {
        setSelectedNotification(notification);

        // Automatically mark as read.
        await markAsRead(notification);
    };

    const formatDate = (value) => {
        if (!value) return "—";

        return new Date(value).toLocaleString("en-PH", {
            timeZone: "Asia/Manila",
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
        });
    };

    const unreadCount = notifications.filter(
        (notification) => !notification.is_read
    ).length;

    return (
        <div className="w-full min-h-screen bg-[#f7f7f7]">
            <Navigation />

            <div className="w-full flex flex-col gap-8 py-30 px-5 md:px-7 lg:px-20 font-akagi">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <h1 className="text-4xl tracking-wide font-extrabold text-blue">
                            Notifications
                        </h1>

                        <p className="text-gray mt-2 font-medium">
                            Stay updated with your rental and refund requests.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 text-sm font-bold text-gray">
                        <HiOutlineBell className="text-xl text-blue" />
                        {unreadCount} unread
                    </div>
                </div>

                {/* Notifications list */}
                <div className="flex flex-col gap-3">

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 text-gray">
                            <HiOutlineClock className="text-4xl animate-pulse mb-3" />
                            <p className="font-medium">Loading notifications...</p>
                        </div>
                    ) : errorMessage ? (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-center">
                            <p className="text-red-500 font-medium">
                                {errorMessage}
                            </p>

                            <button
                                onClick={() => fetchNotifications(userId)}
                                className="mt-3 text-blue font-bold hover:underline"
                            >
                                Try again
                            </button>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-[#ffffff] border border-gray-200 rounded-2xl text-center px-5">
                            <div className="bg-blue/10 rounded-full p-5 mb-4">
                                <HiOutlineBell className="text-4xl text-blue" />
                            </div>

                            <h2 className="text-xl font-bold text-blue">
                                No notifications yet
                            </h2>

                            <p className="text-gray font-medium mt-2">
                                We'll let you know when there are updates about your reservations or refund requests.
                            </p>
                        </div>
                    ) : (
                        <AnimatePresence>
                            {notifications.map((notification) => (
                                <motion.button
                                    key={notification.id}
                                    type="button"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, height: 0 }}
                                    onClick={() => handleNotificationClick(notification)}
                                    className={`w-full text-left rounded-2xl border p-5 md:p-6 flex gap-4 items-start transition-all ${
                                        notification.is_read
                                            ? "bg-[#ffffff] border-gray-200 hover:bg-gray-50"
                                            : "bg-blue/5 border-blue/30 hover:bg-blue/10"
                                    }`}
                                >
                                    {/* Notification icon */}
                                    <div className={`shrink-0 rounded-full p-3 ${
                                        notification.type === "refund_approved"
                                            ? "bg-green-100 text-green-600"
                                            : notification.type === "refund_rejected"
                                            ? "bg-red-100 text-red-500"
                                            : "bg-blue/10 text-blue"
                                    }`}>
                                        {notification.type === "refund_approved" ? (
                                            <HiOutlineCheckCircle className="text-2xl" />
                                        ) : notification.type === "refund_rejected" ? (
                                            <HiOutlineBell className="text-2xl" />
                                        ) : (
                                            <HiOutlineBell className="text-2xl" />
                                        )}
                                    </div>

                                    {/* Notification content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <h2 className="font-bold text-blue text-lg">
                                                {notification.title}
                                            </h2>

                                            {!notification.is_read && (
                                                <span className="shrink-0 bg-blue text-[#ffffff] text-xs font-bold px-3 py-1 rounded-full">
                                                    NEW
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-gray font-medium text-sm md:text-base mt-2 leading-relaxed">
                                            {notification.message}
                                        </p>

                                        <div className="flex flex-wrap items-center gap-2 mt-4 text-xs text-gray-500 font-medium">
                                            <HiOutlineClock className="text-base" />
                                            <span>
                                                {formatDate(notification.created_at)}
                                            </span>

                                            {notification.transaction_id && (
                                                <>
                                                    <span>•</span>
                                                    <span>
                                                        Transaction #{notification.transaction_id}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </motion.button>
                            ))}
                        </AnimatePresence>
                    )}
                </div>
            </div>

            {/* Notification Details Modal */}
            <AnimatePresence>
                {selectedNotification && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 overflow-y-auto"
                        onClick={() => setSelectedNotification(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 15 }}
                            transition={{ duration: 0.2 }}
                            onClick={(event) => event.stopPropagation()}
                            className="bg-[#ffffff] w-full max-w-lg max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-2xl shadow-xl p-6 md:p-8 font-akagi my-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
                        >
                            {/* Modal Header */}
                            <div className="flex items-start justify-between gap-4 mb-6">
                                <div className="flex items-center gap-3">
                                    <div className={`p-3 rounded-full ${
                                        selectedNotification.type === "refund_approved"
                                            ? "bg-green-100 text-green-600"
                                            : selectedNotification.type === "refund_rejected"
                                            ? "bg-red-100 text-red-500"
                                            : "bg-blue/10 text-blue"
                                    }`}>
                                        {selectedNotification.type === "refund_approved" ? (
                                            <HiOutlineCheckCircle className="text-2xl" />
                                        ) : (
                                            <HiOutlineBell className="text-2xl" />
                                        )}
                                    </div>

                                    <div>
                                        <h2 className="text-xl md:text-2xl font-bold text-blue">
                                            Notification Details
                                        </h2>
                                        <p className="text-xs text-gray mt-1">
                                            {formatDate(selectedNotification.created_at)}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setSelectedNotification(null)}
                                    className="text-gray-400 hover:text-gray-700 text-2xl"
                                >
                                    ×
                                </button>
                            </div>

                            {/* Notification Message */}
                            <div className="bg-gray/5 border border-gray/10 rounded-xl p-5 mb-5">
                                <div className="flex items-center justify-between gap-2 mb-3">
                                    <span className="text-xs font-bold uppercase tracking-wider text-gray">
                                        {selectedNotification.type?.replace(/_/g, " ")}
                                    </span>

                                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                                        selectedNotification.is_read
                                            ? "bg-gray-100 text-gray-500"
                                            : "bg-blue text-[#ffffff]"
                                    }`}>
                                        {selectedNotification.is_read ? "READ" : "UNREAD"}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold text-blue mb-2">
                                    {selectedNotification.title}
                                </h3>

                                <p className="text-gray font-medium leading-relaxed text-sm md:text-base">
                                    {selectedNotification.message}
                                </p>
                            </div>

                            {/* Refund Request Information */}
                            <div className="flex flex-col gap-4">
                                <h3 className="text-sm font-bold text-blue uppercase tracking-wider">
                                    Refund Request Information
                                </h3>

                                {selectedNotification.refund ? (
                                    <>
                                        {[
                                            ["Refund Request ID", selectedNotification.refund.id],
                                            [
                                                "Transaction ID",
                                                selectedNotification.refund.original_transaction_id,
                                            ],
                                            [
                                                "Refund Status",
                                                selectedNotification.refund.status,
                                            ],
                                            [
                                                "Refund Method",
                                                selectedNotification.refund.refund_method,
                                            ],
                                            [
                                                "Account Holder",
                                                selectedNotification.refund.account_holder_name,
                                            ],
                                            [
                                                "Account Number",
                                                selectedNotification.refund.account_number,
                                            ],
                                            [
                                                "Reason",
                                                selectedNotification.refund.reason,
                                            ],
                                            [
                                                "Additional Details",
                                                selectedNotification.refund.additional_details,
                                            ],
                                            [
                                                "Refund Reference Number",
                                                selectedNotification.refund.refund_reference_number,
                                            ],
                                            ...(selectedNotification.refund.status?.toLowerCase() === "rejected"
                                                ? [
                                                    [
                                                        "Admin Rejection Reason",
                                                        selectedNotification.refund.rejection_reason,
                                                    ],
                                                ]
                                                : []),
                                            [
                                                "Request Submitted",
                                                formatDate(selectedNotification.refund.created_at),
                                            ],
                                        ].map(([label, value]) => (
                                            <div
                                                key={label}
                                                className="flex flex-col gap-1 border-b border-gray-100 pb-3"
                                            >
                                                <span className="text-xs font-bold text-gray-400 uppercase">
                                                    {label}
                                                </span>

                                                <span className="text-sm font-semibold text-gray break-words">
                                                    {value || "Not provided"}
                                                </span>
                                            </div>
                                        ))}
                                    </>
                                ) : (
                                    <p className="text-sm text-gray font-medium">
                                        No refund request information is associated with this notification.
                                    </p>
                                )}
                            </div>

                            {/* Close Button */}
                            <button
                                type="button"
                                onClick={() => setSelectedNotification(null)}
                                className="w-full mt-7 bg-blue hover:bg-navyblue text-[#ffffff] rounded-xl py-3 font-bold transition-all"
                            >
                                Close
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default Notifications