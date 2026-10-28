import { useState, useEffect, useCallback } from "react";
import { supabase } from "../../../lib/supabase";
import { motion } from "motion/react";
import Sidebar from "../sidebar/Sidebar";
import SidebarMobile from "../sidebar/SidebarMobile";
import {
    HiOutlineCurrencyDollar,
    HiOutlineClock,
    HiOutlineCheckCircle,
    HiOutlineXCircle,
    HiOutlineRefresh,
    HiOutlineSearch,
    HiOutlineEye,
} from "react-icons/hi";

function Refund({role}) {
    const [refunds, setRefunds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [activeTab, setActiveTab] = useState("pending");
    const [search, setSearch] = useState("");
    const [selectedRefund, setSelectedRefund] = useState(null);
    const [processingId, setProcessingId] = useState(null);

    const [refundReferenceNumber, setRefundReferenceNumber] = useState("");

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [pendingAction, setPendingAction] = useState(null);

    const fetchRefunds = useCallback(async () => {
        setLoading(true);
        setErrorMessage("");

        try {
            // Get all refund requests.
            const { data: refundData, error: refundError } = await supabase
                .from("refund_mod")
                .select("*")
                .order("created_at", { ascending: false });

            if (refundError) throw refundError;

            if (!refundData?.length) {
                setRefunds([]);
                return;
            }

            // Get the original transactions for the refund requests.
            const transactionIds = [
                ...new Set(
                    refundData
                        .map((refund) => refund.original_transaction_id)
                        .filter(Boolean)
                ),
            ];

            let transactions = [];
            let orders = [];
            let profiles = [];

            if (transactionIds.length > 0) {
                const { data, error } = await supabase
                    .from("transactions_mod")
                    .select("*")
                    .in("id", transactionIds);

                if (error) throw error;
                transactions = data || [];

                const { data: orderData, error: orderError } = await supabase
                    .from("orders_mod")
                    .select("*")
                    .in("transaction_id", transactionIds);

                if (orderError) throw orderError;
                orders = orderData || [];

                const userIds = [
                    ...new Set(
                        transactions
                            .map((transaction) => transaction.user_id)
                            .filter(Boolean)
                    ),
                ];

                if (userIds.length > 0) {
                    const { data: profileData, error: profileError } =
                        await supabase
                            .from("profiles_mod")
                            .select("id, first_name, last_name, email, contact")
                            .in("id", userIds);

                    if (profileError) throw profileError;
                    profiles = profileData || [];
                }
            }

            // Combine each refund with its original transaction and reservation.
            const combinedRefunds = refundData.map((refund) => {
                const transaction = transactions.find(
                    (item) => item.id === refund.original_transaction_id
                );

                const order = orders.find(
                    (item) =>
                        item.transaction_id === refund.original_transaction_id
                );

                const profile = profiles.find(
                    (item) => item.id === transaction?.user_id
                );

                return {
                    ...refund,
                    transaction,
                    order,
                    profile,
                };
            });

            setRefunds(combinedRefunds);
        } catch (error) {
            console.error("Error fetching refunds:", error);
            setErrorMessage(error.message || "Unable to load refund requests.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRefunds();

        const channel = supabase
            .channel("admin-refund-requests")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "refund_mod",
                },
                () => fetchRefunds()
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [fetchRefunds]);

    const updateRefundStatus = (refund, newStatus) => {
        setPendingAction({ refund, newStatus });
        setRefundReferenceNumber("");
        setErrorMessage("");
        setShowConfirmModal(true);
    };

    const confirmRefundAction = async () => {
    if (!pendingAction) return;

    const { refund, newStatus } = pendingAction;
    const referenceNumber = refundReferenceNumber.trim();

    if (newStatus === "approved" && !referenceNumber) {
        setErrorMessage("Please enter the refund reference number.");
        return;
    }

    setProcessingId(refund.id);
    setErrorMessage("");

    try {
        if (!refund.original_transaction_id) {
            throw new Error("The original transaction ID is missing.");
        }

        const updateData = {
            status: newStatus,
        };

        if (newStatus === "approved") {
            updateData.refund_reference_number = referenceNumber;
        }

        // 1. Update the refund request.
        const { data: refundData, error: refundError } = await supabase
            .from("refund_mod")
            .update(updateData)
            .eq("id", refund.id)
            .eq("status", "pending")
            .select("id");

        if (refundError) throw refundError;

        if (!refundData || refundData.length === 0) {
            throw new Error(
                "This refund has already been processed or you don't have permission to update it."
            );
        }

        // Close the confirmation modal after the refund status is saved.
        setShowConfirmModal(false);
        setPendingAction(null);
        setRefundReferenceNumber("");
        setSelectedRefund(null);

         // 2. Update the original transaction for approval or rejection.
        const transactionStatus =
            newStatus === "approved"
                ? "refunded"
                : "refund rejected";

        console.log("Updating transaction:", {
            transactionId: refund.original_transaction_id,
            newStatus: transactionStatus,
        });

        const {
            data: updatedTransaction,
            error: transactionError,
        } = await supabase
            .from("transactions_mod")
            .update({ status: transactionStatus })
            .eq("id", refund.original_transaction_id)
            .select("id, status");

        if (transactionError) {
            console.error("Transaction update error:", transactionError);
            throw transactionError;
        }

        if (!updatedTransaction || updatedTransaction.length === 0) {
            throw new Error(
                `No transaction was updated. Transaction ID: ${refund.original_transaction_id}. Check the ID and your Supabase RLS policies.`
            );
        }

        console.log("Transaction successfully updated:", updatedTransaction);

        // 3. Refresh the list.
        await fetchRefunds();
    } catch (error) {
        console.error("Error processing refund:", error);

        setErrorMessage(
            error.message || "Unable to update the refund request."
        );

        await fetchRefunds();
    } finally {
        setProcessingId(null);
    }
};

    const cancelRefundAction = () => {
        if (processingId) return;

        setShowConfirmModal(false);
        setPendingAction(null);
    };

    const pendingCount = refunds.filter(
        (refund) => refund.status?.toLowerCase() === "pending"
    ).length;

    const approvedCount = refunds.filter(
        (refund) => refund.status?.toLowerCase() === "approved"
    ).length;

    const rejectedCount = refunds.filter(
        (refund) => refund.status?.toLowerCase() === "rejected"
    ).length;

    const filteredRefunds = refunds.filter((refund) => {
        const status = refund.status?.toLowerCase() || "pending";

        const matchesTab =
            activeTab === "all" ||
            status === activeTab;

        const customerName = [
            refund.profile?.first_name,
            refund.profile?.last_name,
        ]
            .filter(Boolean)
            .join(" ");

        const searchableText = [
            customerName,
            refund.profile?.email,
            refund.reason,
            refund.additional_details,
            refund.refund_method,
            refund.original_transaction_id,
            refund.order?.id,
        ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

        return matchesTab && searchableText.includes(search.toLowerCase());
    });

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

    const formatCurrency = (amount) =>
        new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
        }).format(Number(amount) || 0);

    const getAmount = (refund) => {
        const transaction = refund.transaction;

        return (
            transaction?.total ??
            transaction?.amount ??
            transaction?.total_amount ??
            null
        );
    };

    const statusStyle = {
        pending: "bg-yellow text-navyblue",
        approved: "bg-green-400 text-[#ffffff]",
        rejected: "bg-red-400 text-[#ffffff]",
    };

    const tabs = [
        { key: "pending", label: "Pending", count: pendingCount },
        { key: "approved", label: "Approved", count: approvedCount },
        { key: "rejected", label: "Rejected", count: rejectedCount },
        { key: "all", label: "All Refunds", count: refunds.length },
    ];

    return (
        <div className="w-full h-screen md:bg-[#F2F2F2] flex">
            <Sidebar active="refund" userRole={role}/>

            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="flex-1 min-w-0 p-3 md:p-5"
            >
                <SidebarMobile active="refund" />

                <div className="flex flex-col bg-[#ffffff] w-full h-full rounded-xl md:p-10 px-3 py-7 font-akagi gap-6 overflow-y-auto scrollbar-thin scrollbar-thumb-[#B9B9B9] scrollbar-track-[#E2E2E2]">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-akagi font-bold tracking-wide text-blue">
                                Refund
                            </h1>
                            <p className="text-sm text-gray mt-1">
                                Review and manage reservation refund requests.
                            </p>
                        </div>

                    </div>

                    {/* Summary cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 font-medium">
                        <div className="bg-gradient-to-t from-blue to-blue/65 shadow-md rounded-xl px-4 py-4 p-5 flex items-center justify-between">
                            <div>
                                <p className="text-sm lg:text-lg text-[#ffffff]">
                                    Pending Requests
                                </p>
                                <p className="text-3xl font-akagi font-bold text-[#ffffff] mt-1">
                                    {pendingCount}
                                </p>
                            </div>
                            <div className="bg-[#ffffff] p-3 rounded-xl hidden md:block">
                                <HiOutlineClock className="text-2xl text-blue" />
                            </div>
                        </div>

                        <div className="bg-gradient-to-t from-[#ffffff] to-gray/10 shadow-md rounded-xl px-4 py-4 p-5 flex items-center justify-between">
                            <div>
                                <p className="text-sm lg:text-lg text-gray">
                                    Approved Refunds
                                </p>
                                <p className="text-3xl font-akagi font-bold text-gray mt-1">
                                    {approvedCount}
                                </p>
                            </div>
                            <div className="bg-[#ffffff] p-3 rounded-xl hidden md:block">
                                <HiOutlineCheckCircle className="text-2xl text-gray" />
                            </div>
                        </div>

                        <div className="bg-gradient-to-t from-blue to-blue/65 shadow-md rounded-xl px-4 py-4 p-5 flex items-center justify-between">
                            <div>
                                <p className="text-sm md:text-lg text-[#ffffff]">
                                    Rejected Requests
                                </p>
                                <p className="text-3xl font-akagi font-bold text-[#ffffff] mt-1">
                                    {rejectedCount}
                                </p>
                            </div>
                            <div className="bg-[#ffffff] p-3 rounded-xl hidden md:block">
                                <HiOutlineClock className="text-2xl text-blue" />
                            </div>
                        </div>
                    </div>

                    {/* Search and tabs */}
                    <div className="flex flex-col gap-4 font-medium">
                        <div className="relative w-full md:max-w-md">
                            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                            <input
                                type="text"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search customer, reason, transaction..."
                                className="w-full border font-medium border-gray-300 rounded-xl py-3 pl-10 pr-4 outline-none text-gray"
                            />
                        </div>

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
                    </div>

                    {/* Refund list */}
                    <div className="flex flex-col gap-3">
                        {loading ? (
                            <div className="text-center py-16 text-gray-500">
                                Loading refund requests...
                            </div>
                        ) : filteredRefunds.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center border border-gray-300 rounded-xl">
                                <HiOutlineCurrencyDollar className="text-5xl text-gray mb-3" />
                                <h2 className="font-akagi font-bold text-lg text-gray">
                                    No refund requests found
                                </h2>
                                <p className="text-sm text-gray mt-1 font-medium">
                                    Requests matching this section will appear here.
                                </p>
                            </div>
                        ) : (
                            filteredRefunds.map((refund) => {
                                const status =
                                    refund.status?.toLowerCase() || "pending";

                                const customerName = [
                                    refund.profile?.first_name,
                                    refund.profile?.last_name,
                                ]
                                    .filter(Boolean)
                                    .join(" ") || "Unknown customer";

                                const amount = getAmount(refund);

                                return (
                                    <div
                                        onClick={() => setSelectedRefund(refund)}
                                        key={refund.id}
                                        className="bg-gray/10 border border-gray/20 hover:bg-gray/15 rounded-xl p-4 md:p-5 flex flex-col xl:flex-row xl:items-center justify-between gap-8 transition"
                                    >
                                        <div className="flex flex-col gap-2 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h2 className="font-akagi font-bold text-blue text-lg">
                                                    {customerName}
                                                </h2>

                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                                                        statusStyle[status] ||
                                                        "bg-gray-100 text-gray-600"
                                                    }`}
                                                >
                                                    {status}
                                                </span>
                                            </div>

                                            <p className="text-sm text-gray-600">
                                                Reason: {refund.reason || "Not provided"}
                                            </p>

                                            <p className="text-sm text-gray-500">
                                                Submitted: {formatDate(refund.created_at)}
                                            </p>
                                        </div>

                                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 xl:justify-end">

                                            {status === "pending" && (
                                                <div className="flex gap-2">
                                                    <button
                                                        type="button"
                                                        disabled={processingId === refund.id}
                                                        onClick={() =>
                                                            updateRefundStatus(
                                                                refund,
                                                                "approved"
                                                            )
                                                        }
                                                        className="rounded-lg bg-green-500 text-[#ffffff] px-4 py-2.5 text-sm font-akagi font-bold  hover:bg-green-600 disabled:opacity-50"
                                                    >
                                                        Approve
                                                    </button>

                                                    <button
                                                        type="button"
                                                        disabled={processingId === refund.id}
                                                        onClick={() =>
                                                            updateRefundStatus(
                                                                refund,
                                                                "rejected"
                                                            )
                                                        }
                                                        className="rounded-lg bg-red-500 text-[#ffffff] font-bold px-4 py-2.5 text-sm font-akagi hover:bg-red-600 disabled:opacity-50"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Refund details modal */}
            {selectedRefund && (
                <div
                    className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
                    onClick={() => setSelectedRefund(null)}
                >
                    <div
                        className="bg-[#ffffff] rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 md:p-8"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="flex justify-between items-start gap-4 mb-6 font-akagi">
                            <div>
                                <h2 className="text-2xl font-akagi font-bold text-blue">
                                    Refund Details
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    Submitted {formatDate(selectedRefund.created_at)}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setSelectedRefund(null)}
                                className="text-gray-500 hover:text-gray-900 text-2xl"
                                aria-label="Close"
                            >
                                ×
                            </button>
                        </div>

                        <div className="flex flex-col gap-4 text-sm font-akagi">
                            {[
                                [
                                    "Customer",
                                    [
                                        selectedRefund.profile?.first_name,
                                        selectedRefund.profile?.last_name,
                                    ]
                                        .filter(Boolean)
                                        .join(" ") || "Unknown",
                                ],
                                ["Email", selectedRefund.profile?.email || "—"],
                                ["Contact", selectedRefund.profile?.contact || "—"],
                                [
                                    "Transaction ID",
                                    selectedRefund.original_transaction_id || "—",
                                ],
                                [
                                    "Original amount",
                                    getAmount(selectedRefund) === null
                                        ? "Not available"
                                        : formatCurrency(getAmount(selectedRefund)),
                                ],
                                ["Refund method", selectedRefund.refund_method || "—"],
                                [
                                    "Account holder",
                                    selectedRefund.account_holder_name || "—",
                                ],
                                [
                                    "Account number",
                                    selectedRefund.account_number || "—",
                                ],
                                ["Reason", selectedRefund.reason || "—"],
                                [
                                    "Additional details",
                                    selectedRefund.additional_details || "—",
                                ],
                                [
                                    "Reservation date",
                                    selectedRefund.order?.reservation_date || "—",
                                ],
                                [
                                    "Reservation start",
                                    selectedRefund.order?.start_time || "—",
                                ],
                                [
                                    "Duration",
                                    selectedRefund.order?.duration_hours != null
                                        ? `${selectedRefund.order.duration_hours} hour(s)`
                                        : "—",
                                ],
                                [
                                    "Refund Reference Number",
                                    selectedRefund.refund_reference_number || "—",
                                ],
                            ].map(([label, value]) => (
                                <div
                                    key={label}
                                    className="flex flex-col gap-1 border-b border-gray-100 pb-3"
                                >
                                    <span className="text-gray-500 font-bold">{label}</span>
                                    <span className="font-semibold text-gray break-words">
                                        {String(value)}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {selectedRefund.status?.toLowerCase() === "pending" && (
                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    disabled={processingId === selectedRefund.id}
                                    onClick={() =>
                                        updateRefundStatus(selectedRefund, "approved")
                                    }
                                    className="flex-1 rounded-lg bg-green-600 text-[#ffffff] px-4 py-3 font-akagi hover:bg-green-700 disabled:opacity-50"
                                >
                                    Approve Refund
                                </button>

                                <button
                                    type="button"
                                    disabled={processingId === selectedRefund.id}
                                    onClick={() =>
                                        updateRefundStatus(selectedRefund, "rejected")
                                    }
                                    className="flex-1 rounded-lg bg-red-600 text-[#ffffff] px-4 py-3 font-akagi hover:bg-red-700 disabled:opacity-50"
                                >
                                    Reject Refund
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Confirmation Modal */}
            {showConfirmModal && pendingAction && (
                <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="bg-[#ffffff] w-full max-w-md rounded-2xl p-6 md:p-8 shadow-xl font-akagi"
                    >
                        <div className="flex flex-col items-center text-center">
                            <div
                                className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${
                                    pendingAction.newStatus === "approved"
                                        ? "bg-green-100"
                                        : "bg-red-100"
                                }`}
                            >
                                {pendingAction.newStatus === "approved" ? (
                                    <HiOutlineCheckCircle className="text-3xl text-green-600" />
                                ) : (
                                    <HiOutlineXCircle className="text-3xl text-red-500" />
                                )}
                            </div>

                            <h2 className="text-2xl font-bold text-blue">
                                {pendingAction.newStatus === "approved"
                                    ? "Approve Refund?"
                                    : "Reject Refund?"}
                            </h2>

                            <p className="text-gray mt-3 text-sm leading-relaxed">
                                {pendingAction.newStatus === "approved"
                                    ? "Enter the reference number from the refund transaction to confirm that the refund has been processed."
                                    : "Are you sure you want to reject this refund request? The request will be marked as rejected."}
                            </p>

                            {pendingAction.newStatus === "approved" && (
                                <div className="w-full mt-5 text-left">
                                    <label
                                        htmlFor="refundReferenceNumber"
                                        className="block text-sm font-bold text-gray mb-2"
                                    >
                                        Refund Reference Number
                                        <span className="text-red-500 ml-1">*</span>
                                    </label>

                                    <input
                                        id="refundReferenceNumber"
                                        type="text"
                                        value={refundReferenceNumber}
                                        onChange={(event) =>
                                            setRefundReferenceNumber(event.target.value)
                                        }
                                        placeholder="Enter refund transaction reference"
                                        required
                                        disabled={processingId !== null}
                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray outline-none focus:border-blue focus:ring-1 focus:ring-blue disabled:opacity-50"
                                    />
                                </div>
                            )}

                            {errorMessage && showConfirmModal && (
                                <p className="w-full mt-3 text-sm text-red-500 text-left">
                                    {errorMessage}
                                </p>
                            )}
                        </div>

                        <div className="flex gap-3 mt-7">
                            <button
                                type="button"
                                onClick={cancelRefundAction}
                                disabled={processingId !== null}
                                className="flex-1 rounded-xl border border-gray-300 text-gray-600 px-4 py-3 font-bold hover:bg-gray-100 transition disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={confirmRefundAction}
                                disabled={processingId !== null}
                                className={`flex-1 rounded-xl text-[#ffffff] px-4 py-3 font-bold transition disabled:opacity-50 ${
                                    pendingAction.newStatus === "approved"
                                        ? "bg-green-500 hover:bg-green-600"
                                        : "bg-red-500 hover:bg-red-600"
                                }`}
                            >
                                {processingId !== null
                                    ? "Processing..."
                                    : pendingAction.newStatus === "approved"
                                    ? "Yes, Approve"
                                    : "Yes, Reject"}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}

export default Refund;