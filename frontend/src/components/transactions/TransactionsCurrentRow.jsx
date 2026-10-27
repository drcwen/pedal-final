import { FaArrowRight } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { useState, useEffect } from 'react';
import { IoCloseSharp } from "react-icons/io5";
import { IoReceiptSharp } from "react-icons/io5";
import Receipt from "../management/transaction history/Receipt"
import { printReceipt } from "../management/transaction history/printReceipt"
import { RiRefundFill } from "react-icons/ri";
import { MdRateReview } from "react-icons/md";
import { supabase } from "../../lib/supabase";
import { FaStar } from "react-icons/fa";

function TransactionCurrentRow({ bikeCount, date, method, total, status, transactions, startedBikes }) {

    const [openReceipt, setOpenReceipt] = useState(false);
    const [openRefund, setOpenRefund] = useState(false);

    const [refundReason, setRefundReason] = useState("");
    const [refundMethod, setRefundMethod] = useState("");
    const [refundAccountName, setRefundAccountName] = useState("");
    const [refundAccountNumber, setRefundAccountNumber] = useState("");
    const [refundNotes, setRefundNotes] = useState("");
    const [refundError, setRefundError] = useState("");

    const [openReview, setOpenReview] = useState(false);
    const [reviewRating, setReviewRating] = useState(0);
    const [reviewTitle, setReviewTitle] = useState("");
    const [reviewComment, setReviewComment] = useState("");
    const [reviewError, setReviewError] = useState("");

    const [reviewSubmitting, setReviewSubmitting] = useState(false);
    const [existingReview, setExistingReview] = useState(null);
    const [reviewLoading, setReviewLoading] = useState(false);
    const [reviewSuccess, setReviewSuccess] = useState("");

    const [existingRefund, setExistingRefund] = useState(null);
    const [refundLoading, setRefundLoading] = useState(false);
    console.log(startedBikes)
    console.log("Transactions ni mama mama", transactions)

    function formatTime(time) {
        const [hours, minutes] = time.split(":");

        const date = new Date();
        date.setHours(hours, minutes);

        return date.toLocaleTimeString("en-PH", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        });
    }

    function getReservationDatePH(range) {
        if (!range) return null;

        const match = range.match(/^\["([^"]+)/);
        if (!match) return null;

        const startDate = new Date(
            match[1]
                .replace(" ", "T")
                .replace("+00", "Z")
        );

        return startDate.toLocaleDateString("en-US", {
            timeZone: "Asia/Manila",
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
        });
    }

    function getEndTimePH(range) {
        if (!range) return null;

        const match = range.match(/,"([^"]+)"\)/);

        if (!match) return null;

        const endDate = new Date(
            match[1]
                .replace(" ", "T")
                .replace("+00", "Z")
        );

        return endDate.toLocaleTimeString("en-US", {
            timeZone: "Asia/Manila",
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        });
    }
    const [showTransaction, setShowTransaction] = useState(false);

    const [refundSubmitting, setRefundSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (existingRefund || refundSubmitting) {
            return;
        }

        setRefundError("");

        const accountDigits = refundAccountNumber.replace(/\D/g, "");

        // Validate required fields
        if (
            !refundReason.trim() ||
            !refundMethod ||
            !refundAccountName.trim() ||
            !refundAccountNumber.trim() ||
            !refundNotes.trim()
        ) {
            setRefundError("Please complete all required refund fields.");
            return;
        }

        // Validate the original transaction total
        const amount = Number(
            String(total ?? "").replace(/[₱,\s]/g, "")
        );

        // Validate GCash and Maya
        if (refundMethod === "GCash" || refundMethod === "Maya") {
            if (!/^09\d{9}$/.test(accountDigits)) {
                setRefundError(
                    `${refundMethod} number must contain exactly 11 digits and start with 09.`
                );
                return;
            }
        }

        // Validate bank account number
        if (refundMethod === "Bank Transfer") {
            if (!/^\d{8,20}$/.test(accountDigits)) {
                setRefundError(
                    "Bank account number must contain 8 to 20 digits."
                );
                return;
            }
        }

        // Ensure the original transaction ID exists
        const originalTransactionId = transactions?.id;

        if (!originalTransactionId) {
            setRefundError(
                "Unable to identify the original transaction. Please refresh and try again."
            );
            return;
        }

        try {
            setRefundSubmitting(true);

            const refundRequest = {
                original_transaction_id: transactions.id,
                reason: refundReason,
                additional_details: refundNotes.trim(),
                refund_method: refundMethod,
                account_holder_name: refundAccountName.trim(),
                account_number: accountDigits,
                status: existingRefund?.status ?? "pending",
            };

            let data;
            let error;

            if (existingRefund) {
                setRefundError("A refund request already exists for this transaction.");
                return;
            }

            ({ data, error } = await supabase
                .from("refund_mod")
                .insert([refundRequest])
                .select()
                .single());

            if (error) {
                console.error("Supabase refund error:", error);
                setRefundError(error.message || "Failed to save the refund request.");
                return;
            }

            setExistingRefund(data);
            setOpenRefund(false);
            setShowTransaction(false);
        } catch (error) {
            console.error("Refund submission error:", error);
            setRefundError("Something went wrong while saving your refund request.");
        } finally {
            setRefundSubmitting(false);
        }
    };

    const loadExistingRefund = async () => {
        const transactionId = transactions?.id;

        if (!transactionId) {
            setRefundError("Unable to identify the original transaction.");
            return;
        }

        setRefundLoading(true);
        setRefundError("");

        try {
            const { data, error } = await supabase
                .from("refund_mod")
                .select("*")
                .eq("original_transaction_id", transactionId)
                .maybeSingle();

            if (error) throw error;

            if (data) {
                setExistingRefund(data);

                setRefundReason(data.reason ?? "");
                setRefundNotes(data.additional_details ?? "");
                setRefundMethod(data.refund_method ?? "");
                setRefundAccountName(data.account_holder_name ?? "");
                setRefundAccountNumber(data.account_number ?? "");
            } else {
                setExistingRefund(null);
                setRefundReason("");
                setRefundNotes("");
                setRefundMethod("");
                setRefundAccountName("");
                setRefundAccountNumber("");
            }
        } catch (error) {
            console.error("Error loading refund request:", error);
            setRefundError("Unable to load your existing refund request.");
        } finally {
            setRefundLoading(false);
        }
    };

    useEffect(() => {
        if (!showTransaction || !transactions?.id) {
            return;
        }

        if (status === "completed") {
            loadExistingReview();
        }

        if (status === "pending") {
            loadExistingRefund();
        }
    }, [showTransaction, transactions?.id, status]);

    const handleReviewSubmit = async () => {
        if (reviewSubmitting || reviewLoading || existingReview) {
            return;
        }

        setReviewError("");
        setReviewSuccess("");

        if (reviewRating < 1 || reviewRating > 5) {
            setReviewError("Please select a rating from 1 to 5 stars.");
            return;
        }

        if (!reviewComment.trim()) {
            setReviewError("Please enter your review.");
            return;
        }

        const transactionId = transactions?.id;

        if (!transactionId) {
            setReviewError(
                "Unable to identify the transaction. Please refresh and try again."
            );
            return;
        }

        try {
            setReviewSubmitting(true);

            const { data, error } = await supabase
                .from("reviews_mod")
                .insert([
                    {
                        transaction_id: transactionId,
                        stars: reviewRating,
                        title: reviewTitle.trim() || null,
                        review: reviewComment.trim(),
                    },
                ])
                .select()
                .single();

            if (error) {
                if (error.code === "23505") {
                    // A unique constraint prevents duplicate reviews.
                    await loadExistingReview();
                    setReviewError(
                        "A review already exists for this transaction."
                    );
                    return;
                }

                throw error;
            }

            setExistingReview(data);
            setReviewRating(Number(data.stars) || 0);
            setReviewTitle(data.title ?? "");
            setReviewComment(data.review ?? "");

            setReviewSuccess("Your review has been submitted successfully!");
        } catch (error) {
            console.error("Review submission error:", error);
            setReviewError(
                error.message || "Something went wrong while submitting your review."
            );
        } finally {
            setReviewSubmitting(false);
        }
    };
    const loadExistingReview = async () => {
        const transactionId = transactions?.id;

        if (!transactionId) {
            setReviewError("Unable to identify the transaction. Please refresh and try again.");
            return;
        }

        setReviewLoading(true);
        setReviewError("");
        setReviewSuccess("");

        try {
            const { data, error } = await supabase
                .from("reviews_mod")
                .select("*")
                .eq("transaction_id", transactionId)
                .maybeSingle();

            if (error) {
                throw error;
            }

            if (data) {
                // A review already exists: fill in the form.
                setExistingReview(data);
                setReviewRating(Number(data.stars) || 0);
                setReviewTitle(data.title ?? "");
                setReviewComment(data.review ?? "");
            } else {
                // No review yet: show an empty form.
                setExistingReview(null);
                setReviewRating(0);
                setReviewTitle("");
                setReviewComment("");
            }
        } catch (error) {
            console.error("Error loading review:", error);
            setReviewError("Unable to load the review. Please try again.");
        } finally {
            setReviewLoading(false);
        }
    };

    return (
        <>
        <div
            onClick={() => {setShowTransaction(!showTransaction)}}
            className='rounded-xl p-2 flex flex-col lg:gap-7 gap-4 cursor-pointer'>
            <div className='hidden lg:grid lg:grid-cols-6 justify-between items-center'>
                <div className='w-fit rounded-lg px-4 py-2 bg-yellow'>
                    <h1 className='text-xl font-akagi font-black text-navyblue'>{bikeCount}</h1>
                </div>

                    <div className='flex justify-center'>
                        <h1 className='text-xl font-akagi font-bold text-[#6D7172]'>{date}</h1>
                    </div>

                <div className='flex justify-center'>
                    <h1 className='text-xl font-akagi font-bold text-[#6D7172]'>{method}</h1>
                </div>

                <div className='flex justify-center'>
                    <h1 className='text-xl font-akagi font-bold text-[#6D7172]'>{total}</h1>
                </div>

                <div className='flex justify-center rounded-lg'>
                    
                    <div className='rounded-lg py-1 px-3 bg-yellow'>
                        <h1 className='text-md font-akagi font-bold text-navyblue'>{status}</h1>
                    </div>
                </div>

                <div className='flex justify-end'>
                    <FaArrowRight className='text-2xl text-[#6D7172]'/>
                </div>
            </div>

            <div className='lg:hidden grid grid-cols-4 justify-between items-center'>
                <div className='w-fit rounded-lg px-3 py-1 bg-yellow'>
                    <h1 className='text-lg font-akagi font-black text-navyblue'>{bikeCount}</h1>
                </div>

                <div className=''>
                    <div className='flex justify-center'>
                        <h1 className='text-md font-akagi font-bold text-[#6D7172]'>{date}</h1>
                    </div>
                </div>

                <div className='flex justify-center'>
                    <h1 className='text-md font-akagi font-bold text-[#6D7172]'>{method}</h1>
                </div>

                <div className='flex justify-end'>
                    <FaArrowRight className='text-lg text-[#6D7172]'/>
                </div>

            </div>

            <div className='h-0.5 w-full bg-black/10 rounded-lg'/>

        </div>

        {showTransaction && 
            <div className='fixed inset-0 bg-black/50 flex justify-center items-center z-100 p-5'>
                <div className="
                        bg-[#ffffff]
                        py-5
                        p-5 md:p-10
                        rounded-2xl
                        w-full
                        max-w-2xl
                        max-h-[90vh]
                        overflow-y-auto
                        scrollbar-none
                        scrollbar-thumb-[#B9B9B9]
                        scrollbar-track-[#E2E2E2] flex flex-col gap-5
                        font-akagi
                        font-bold
                        text-gray
                    "
                >
                    <div className='flex justify-between'>
                        <h1 className='text-xl'>Transaction Information</h1>
                        <IoCloseSharp 
                            onClick={() => {setShowTransaction(!showTransaction)}}
                            className='text-xl cursor-pointer'/>
                    </div>

                    <div className='flex flex-col gap-2'>
                        <div className='grid grid-cols-[120px_1fr]'>
                            <h1>Payment Date:</h1>
                            <h1>{date}</h1>
                        </div>
                        <div className='grid grid-cols-[120px_1fr]'>
                            <h1>Status:</h1>
                            <h1>{status}</h1>
                        </div>

                    </div>

                    <div className='grid grid-cols-1 lg:grid-cols-2 lg:gap-4 gap-2'>
                        {transactions?.orders_mod?.map((orders) => (
                            
                            <div className='w-full flex flex-col gap-4  rounded-lg border border-gray/30 bg-gray/20 p-3'>
                                <div className='flex flex-row gap-3 items-center'>
                                    <img src={orders?.bike_types_mod?.image_url} className='w-10 bg-yellow rounded-lg p-1'/>
                                    <h1 className='text-sm'>{orders?.bike_types_mod?.name}</h1>
                                </div>

                                <div className='w-full grid grid-cols-3 gap-2'>

                                    <div className='flex flex-col'>
                                        <h1 className='text-sm font-akagi font-bold text-gray'>BIKE ID</h1>
                                        <h1 className='text-sm font-akagi font-medium text-gray'>{orders?.bikes_mod?.code ?? "WAITING"}</h1>
                                    </div>

                                    <div className='flex flex-col'>
                                        <h1 className='text-sm font-akagi font-bold text-gray'>GPS ID</h1>
                                        <h1 className='text-sm font-akagi font-medium text-gray'>{orders?.gps_mod?.code ?? "WAITING"}</h1>
                                    </div>

                                    <div className='flex flex-col'>
                                        <h1 className='text-sm font-akagi font-bold text-gray'>DURATION</h1>
                                        <h1 className='text-sm font-akagi font-medium text-gray'>{orders?.duration_hours === 1 ? orders?.duration_hours + " hour" : orders?.duration_hours + " hours"}</h1>
                                    </div>

                                    <div className='flex flex-col'>
                                        <h1 className='text-sm font-akagi font-bold text-gray'>DATE</h1>
                                        <h1 className='text-sm font-akagi font-medium text-gray'>{getReservationDatePH(orders?.reservation_range)}</h1>
                                    </div>

                                    <div className='flex flex-col'>
                                        <h1 className='text-sm font-akagi font-bold text-gray'>START</h1>
                                        <h1 className='text-sm font-akagi font-medium text-gray'>{formatTime(orders?.start_time)}</h1>
                                    </div>

                                    <div className='flex flex-col'>
                                        <h1 className='text-sm font-akagi font-bold text-gray'>END</h1>
                                        <h1 className='text-sm font-akagi font-medium text-gray'>{getEndTimePH(orders?.reservation_range)}</h1>
                                    </div>
                                    
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className='flex gap-2 justify-end'>

                        {status === "pending" && (
                            <div
                                onClick={async (e) => {
                                    e.stopPropagation();
                                    setRefundError("");
                                    setOpenRefund(true);
                                    await loadExistingRefund();
                                }}
                                className={`px-2 py-1 cursor-pointer rounded-lg flex gap-2 items-center text-[#ffffff] text-sm ${
                                    existingRefund?.status?.toLowerCase() === "approved"
                                        ? "bg-green-500 hover:bg-green-600"
                                        : "bg-red-400 hover:bg-red-500"
                                }`}
                            >
                                <RiRefundFill className="text-md" />

                                {existingRefund?.status?.toLowerCase() === "pending"
                                    ? "View Refund Request"
                                    : existingRefund?.status?.toLowerCase() === "approved"
                                        ? "View Refund Request"
                                        : existingRefund?.status?.toLowerCase() === "rejected"
                                            ? "View Refund Request"
                                            : "Request Refund"}
                            </div>
                        )}

                        {status === "completed" && (
                            <div
                                onClick={async (e) => {
                                    e.stopPropagation();

                                    setReviewError("");
                                    setReviewSuccess("");
                                    setOpenReview(true);

                                    await loadExistingReview();
                                }}
                                className={`px-2 py-1 cursor-pointer rounded-lg flex gap-2 items-center text-[#ffffff] text-sm ${
                                    existingReview ? "border border-blue/70 text-blue" : "bg-blue"
                                }`}
                            >
                                <MdRateReview className="text-md" />
                                {existingReview ? "View Review" : "Add Review"}
                            </div>
                        )}

                        <div 
                            onClick={() => setOpenReceipt(!openReceipt)}
                            className='bg-blue px-2 py-1 cursor-pointer rounded-lg flex gap-2 items-center text-[#ffffff] text-sm'>
                            <IoReceiptSharp className='text-md'/>
                            Receipt
                        </div>
                    </div>

                    {openReceipt &&
                        <Receipt 
                            setReceipt={() => {setOpenReceipt(!openReceipt)}}
                            startedBikes={startedBikes}
                            transaction={transactions}
                            maintenanceData={null}
                            fullName={null}
                            extensionsData={null}
                            changeBikesData={null}
                        />
                    }

                    {openRefund && (
                        
                        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[110] p-5">
                            
                            {existingRefund?.status?.toLowerCase() === "approved" ? (
                            /* APPROVED REFUND VIEW */
                            <div className="bg-[#ffffff] p-5 md:p-8 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto font-akagi text-gray flex flex-col gap-5 border border-green-200 shadow-xl">
                                {/* Header */}
                                <div className="flex justify-between items-start gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="flex flex-col gap-1">
                                            <h1 className="text-xl md:text-2xl font-bold text-green-700">
                                                Refund Approved
                                            </h1>
                                            <p className="text-sm font-medium text-green-600">
                                                Your refund request has been approved and processed.
                                            </p>
                                        </div>
                                    </div>

                                    <IoCloseSharp
                                        onClick={() => setOpenRefund(false)}
                                        className="text-2xl cursor-pointer shrink-0"
                                    />
                                </div>

                                {/* Approval notice */}
                                <div className="rounded-xl border border-green-200 bg-green-50 p-4 flex gap-3 items-start">
                                    <div className="rounded-full bg-green-100 p-2">
                                        <RiRefundFill className="text-xl text-green-600" />
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <h2 className="font-bold text-green-800">
                                            Refund Successfully Approved
                                        </h2>
                                        <p className="text-sm font-medium text-green-700">
                                            Your refund request has been approved by the 3Jremy's POS
                                            administrator. Keep your refund reference number for
                                            future reference.
                                        </p>
                                    </div>
                                </div>

                                {/* Refund reference number */}
                                <div className="rounded-xl border-2 border-green-300 bg-green-50 p-4 flex flex-col gap-2">
                                    <label className="text-sm font-bold text-green-800">
                                        Refund Reference Number
                                    </label>

                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <div className="flex-1 rounded-lg border border-green-200 bg-[#ffffff] px-4 py-3 break-all">
                                            <p className="text-base font-bold text-green-800">
                                                {existingRefund.refund_reference_number || "Reference number not provided"}
                                            </p>
                                        </div>

                                        {existingRefund.refund_reference_number && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(
                                                        existingRefund.refund_reference_number
                                                    );
                                                }}
                                                className="rounded-lg bg-green-700 hover:bg-green-800 text-[#ffffff] px-4 py-3 text-sm font-bold"
                                            >
                                                Copy Reference
                                            </button>
                                        )}
                                    </div>

                                    <p className="text-xs text-green-700">
                                        Save this number as proof of your refund transaction.
                                    </p>
                                </div>

                                {/* Refund details */}
                                <div className="flex flex-col gap-4">
                                    <h2 className="text-lg font-bold text-green-800">
                                        Refund Details
                                    </h2>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-1">
                                            <label className="text-sm font-bold text-gray/70">
                                                Reason for Refund
                                            </label>
                                            <div className="rounded-lg border border-green-100 bg-green-50/50 px-3 py-3 text-sm">
                                                {existingRefund.reason || "—"}
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            <label className="text-sm font-bold text-gray/70">
                                                Refund Method
                                            </label>
                                            <div className="rounded-lg border border-green-100 bg-green-50/50 px-3 py-3 text-sm">
                                                {existingRefund.refund_method || "—"}
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            <label className="text-sm font-bold text-gray/70">
                                                Account Holder Name
                                            </label>
                                            <div className="rounded-lg border border-green-100 bg-green-50/50 px-3 py-3 text-sm break-words">
                                                {existingRefund.account_holder_name || "—"}
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            <label className="text-sm font-bold text-gray/70">
                                                Account Number
                                            </label>
                                            <div className="rounded-lg border border-green-100 bg-green-50/50 px-3 py-3 text-sm break-all">
                                                {existingRefund.account_number || "—"}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm font-bold text-gray/70">
                                            Additional Details
                                        </label>
                                        <div className="rounded-lg border border-green-100 bg-green-50/50 px-3 py-3 text-sm whitespace-pre-wrap break-words">
                                            {existingRefund.additional_details || "—"}
                                        </div>
                                    </div>
                                </div>

                                {/* Close button */}
                                <div className="flex justify-end pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setOpenRefund(false)}
                                        className="rounded-lg bg-green-700 hover:bg-green-800 text-[#ffffff] px-6 py-3 font-bold"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="
                                bg-[#ffffff]
                                p-5 md:p-8
                                rounded-2xl
                                w-full
                                max-w-2xl
                                max-h-[90vh]
                                overflow-y-auto
                                scrollbar-none
                                font-akagi
                                text-gray
                                flex flex-col gap-5
                            ">
                                {/* Header */}
                                <div className="flex justify-between items-start gap-3">
                                    <div className="flex flex-col gap-1">
                                        <h1 className="text-xl md:text-2xl text-red-400 font-bold">
                                            Request Refund
                                        </h1>
                                        <p className="text-sm font-medium text-gray/70">
                                            Provide the details below so the POS can review
                                            and process your refund request.
                                        </p>
                                    </div>

                                    <IoCloseSharp
                                        onClick={() => setOpenRefund(false)}
                                        className="text-2xl cursor-pointer shrink-0"
                                    />
                                </div>

                                {/* Refund information */}
                                <div className="flex flex-col gap-4">

                                    {/* Requested amount */}
                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm font-bold">
                                            Requested Refund Amount
                                        </label>

                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray/60">
                                                ₱
                                            </span>

                                            <input
                                                type="text"
                                                value={String(total).replace(/[₱,\s]/g, "")}
                                                readOnly
                                                className="w-full border border-gray/30 rounded-lg pl-8 pr-3 py-2 outline-none bg-gray/10 cursor-not-allowed"
                                            />
                                        </div>

                                        <p className="text-xs text-gray/60">
                                            The refund amount is fixed to the original transaction total.
                                        </p>
                                    </div>

                                    {/* Reason */}
                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm font-bold">
                                            Reason for Refund
                                        </label>

                                        <select
                                            value={refundReason}
                                            onChange={(e) => setRefundReason(e.target.value)}
                                            className="w-full border border-gray/30 rounded-lg px-3 py-2 outline-none focus:border-red-400 bg-[#fffffff]"
                                            required
                                        >
                                            <option value="">Select a reason</option>
                                            <option value="The bike rental is closed.">
                                                The bike rental is closed.
                                            </option>
                                            <option value="Bad weather.">
                                                Bad weather.
                                            </option>
                                            <option value="Unexpected last-minute agenda.">
                                                Unexpected last-minute agenda.
                                            </option>
                                            <option value="Service issue">
                                                The park is closed.
                                            </option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>

                                    {/* Additional explanation */}
                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm font-bold">
                                            Additional Details
                                        </label>

                                        <textarea
                                            value={refundNotes}
                                            onChange={(e) => setRefundNotes(e.target.value)}
                                            placeholder="Explain why you are requesting a refund..."
                                            rows={3}
                                            className="w-full border border-gray/30 rounded-lg px-3 py-2 outline-none focus:border-red-400 resize-none"
                                            required
                                        />
                                    </div>

                                    {/* Refund destination */}
                                    <div className="border-t border-gray/20 pt-4 flex flex-col gap-3">
                                        <div className="flex flex-col gap-1">
                                            <h2 className="text-lg font-bold">
                                                Refund Destination
                                            </h2>

                                            <p className="text-sm font-medium text-gray/70">
                                                Enter the account where you would like to
                                                receive your refund.
                                            </p>
                                        </div>

                                        {/* Payment provider */}
                                        <div className="flex flex-col gap-1">
                                            <label className="text-sm font-bold">
                                                Refund Method
                                            </label>

                                            <select
                                                value={refundMethod}
                                                onChange={(e) => setRefundMethod(e.target.value)}
                                                className="w-full border border-gray/30 rounded-lg px-3 py-2 outline-none focus:border-red-400 bg-[#fffffff]"
                                                required
                                            >
                                                <option value="">Select refund destination</option>
                                                <option value="GCash">GCash</option>
                                                <option value="Maya">Maya</option>
                                                <option value="Bank Transfer">Bank Transfer</option>
                                            </select>
                                        </div>

                                        {/* Account name */}
                                        <div className="flex flex-col gap-1">
                                            <label className="text-sm font-bold">
                                                Account Holder Name
                                            </label>

                                            <input
                                                type="text"
                                                value={refundAccountName}
                                                onChange={(e) =>
                                                    setRefundAccountName(e.target.value)
                                                }
                                                placeholder="Enter account holder's full name"
                                                className="w-full border border-gray/30 rounded-lg px-3 py-2 outline-none focus:border-red-400"
                                                required
                                            />
                                        </div>

                                        {/* Account number */}
                                            <div className="flex flex-col gap-1">
                                                <label className="text-sm font-bold">
                                                    {refundMethod === "Bank Transfer"
                                                        ? "Bank Account Number"
                                                        : "Mobile Number"}
                                                </label>

                                                <input
                                                    type="text"
                                                    inputMode="numeric"
                                                    value={refundAccountNumber}
                                                    onChange={(e) => {
                                                        const digits = e.target.value.replace(/\D/g, "");

                                                        if (refundMethod === "GCash" || refundMethod === "Maya") {
                                                            // Allow only 11 digits.
                                                            setRefundAccountNumber(digits.slice(0, 11));
                                                        } else if (refundMethod === "Bank Transfer") {
                                                            // Add a dash after every 4 digits.
                                                            const formatted = digits
                                                                .slice(0, 20)
                                                                .replace(/(\d{4})(?=\d)/g, "$1-");

                                                            setRefundAccountNumber(formatted);
                                                        } else {
                                                            setRefundAccountNumber(digits);
                                                        }
                                                    }}
                                                    placeholder={
                                                        refundMethod === "Bank Transfer"
                                                            ? "e.g. 1234-5678-9012"
                                                            : "e.g. 09123456789"
                                                    }
                                                    className="w-full border border-gray/30 rounded-lg px-3 py-2 outline-none focus:border-red-400"
                                                    required
                                                />

                                                {refundMethod === "GCash" || refundMethod === "Maya" ? (
                                                    <p className="text-xs text-gray/60">
                                                        Enter an 11-digit mobile number starting with 09.
                                                        ({refundAccountNumber.length}/11)
                                                    </p>
                                                ) : refundMethod === "Bank Transfer" ? (
                                                    <p className="text-xs text-gray/60">
                                                        Enter your bank account number.
                                                    </p>
                                                ) : null}
                                            </div>
                                    </div>

                                    {/* Refund Status Notice */}
                                        <div
                                            className={`rounded-lg p-3 flex gap-2 items-start border ${
                                                !existingRefund
                                                    ? "bg-red-50 border-red-200"
                                                    : existingRefund.status?.toLowerCase() === "rejected"
                                                        ? "bg-red-50 border-red-200"
                                                        : existingRefund.status?.toLowerCase() === "approved"
                                                            ? "bg-green-50 border-green-200"
                                                            : "bg-yellow-50 border-yellow-200"
                                            }`}
                                        >
                                            <RiRefundFill
                                                className={`text-xl shrink-0 mt-0.5 ${
                                                    !existingRefund
                                                        ? "text-red-400"
                                                        : existingRefund.status?.toLowerCase() === "rejected"
                                                            ? "text-red-500"
                                                            : existingRefund.status?.toLowerCase() === "approved"
                                                                ? "text-green-600"
                                                                : "text-yellow-600"
                                                }`}
                                            />

                                            <p
                                                className={`text-xs md:text-sm font-medium ${
                                                    !existingRefund
                                                        ? "text-red-500"
                                                        : existingRefund.status?.toLowerCase() === "rejected"
                                                            ? "text-red-600"
                                                            : existingRefund.status?.toLowerCase() === "approved"
                                                                ? "text-green-700"
                                                                : "text-yellow-700"
                                                }`}
                                            >
                                                {!existingRefund ? (
                                                    <>
                                                        Submitting this form does not guarantee approval.
                                                        Your refund request will be reviewed by the 3Jremy's POS administrator.
                                                        Please double-check your refund amount and account details.
                                                    </>
                                                ) : existingRefund.status?.toLowerCase() === "rejected" ? (
                                                    <>
                                                        Your refund request has been rejected by 3Jremy's POS administrator.
                                                        Please contact the administrator if you need more information.
                                                    </>
                                                ) : existingRefund.status?.toLowerCase() === "approved" ? (
                                                    <>
                                                        Your refund request has been approved by 3Jremy's POS administrator.
                                                        Please wait for the refund to be processed.
                                                    </>
                                                ) : (
                                                    <>
                                                        Your refund request has been submitted successfully!
                                                        Please check back here once the 3Jremy's POS administrator responds to your request. Thank you for your patience!
                                                    </>
                                                )}
                                            </p>
                                        </div>

                                    {refundError && (
                                        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                                            {refundError}
                                        </p>
                                    )}

                                    {/* Actions */}
                                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-2">
                                        <button
                                            type="button"
                                            onClick={() => setOpenRefund(false)}
                                            className="px-4 py-2 rounded-lg border border-gray/30 text-gray hover:bg-gray/10"
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            type="button"
                                            onClick={handleSubmit}
                                            disabled={refundSubmitting || refundLoading || !!existingRefund}
                                            className="px-4 py-2 rounded-lg bg-red-400 text-[#ffffff] hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            <RiRefundFill />
                                            {refundLoading
                                                ? "Checking Refund..."
                                                : existingRefund
                                                    ? "Continue Refund Request"
                                                    : "Request Refund"}
                                        </button>
                                    </div>
                                </div>
                            </div>)}
                        </div>
                    )}

                    {openReview && (
                        <div
                            className="fixed inset-0 bg-black/50 flex justify-center items-center z-[120] p-5"
                            onClick={() => setOpenReview(false)}
                        >
                            <div
                                className="
                                    bg-[#ffffff]
                                    p-5 md:p-8
                                    rounded-2xl
                                    w-full
                                    max-w-2xl
                                    max-h-[90vh]
                                    overflow-y-auto
                                    scrollbar-none
                                    font-akagi
                                    text-gray
                                    flex flex-col gap-5
                                "
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Header */}
                                <div className="flex justify-between items-start gap-3">
                                    <div className="flex flex-col gap-1">
                                        <h1 className="text-xl md:text-2xl text-blue font-bold">
                                            Add Review
                                        </h1>

                                        <p className="text-sm font-medium text-gray/70">
                                            Share your experience with our bike rental service.
                                            Your feedback helps us improve our service.
                                        </p>
                                    </div>

                                    <IoCloseSharp
                                        onClick={() => setOpenReview(false)}
                                        className="text-2xl cursor-pointer shrink-0"
                                    />
                                </div>

                                {/* Transaction information */}
                                <div className="bg-blue/10 border border-blue/20 rounded-lg p-4 flex flex-col gap-2">
                                    <h2 className="text-lg font-bold text-blue">
                                        Transaction Information
                                    </h2>

                                    <div className="grid grid-cols-[120px_1fr] gap-y-2 text-sm">
                                        <span className="font-bold">Payment Date:</span>
                                        <span>{date}</span>

                                        <span className="font-bold">Payment Method:</span>
                                        <span>{method}</span>

                                        <span className="font-bold">Total Amount:</span>
                                        <span>{total}</span>
                                    </div>
                                </div>

                                {/* Star rating */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold">
                                        How would you rate your experience?
                                    </label>

                                    <div className="flex items-center gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setReviewRating(star)}
                                                aria-label={`Rate ${star} out of 5 stars`}
                                                className="transition-transform hover:scale-110"
                                            >
                                                <FaStar
                                                    className={`text-3xl ${
                                                        star <= reviewRating
                                                            ? "text-blue"
                                                            : "text-gray/20"
                                                    }`}
                                                />
                                            </button>
                                        ))}

                                        <span className="text-sm font-bold text-blue ml-2">
                                            {reviewRating > 0
                                                ? `${reviewRating}/5`
                                                : "Select a rating"}
                                        </span>
                                    </div>
                                </div>

                                {/* Review title */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-bold">
                                        Review Title
                                    </label>

                                    <input
                                        type="text"
                                        value={reviewTitle}
                                        onChange={(e) => setReviewTitle(e.target.value)}
                                        placeholder="Summarize your experience"
                                        maxLength={100}
                                        className="w-full border border-gray/30 rounded-lg px-3 py-2 outline-none focus:border-blue"
                                    />
                                </div>

                                {/* Review comments */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-bold">
                                        Your Review
                                    </label>

                                    <textarea
                                        value={reviewComment}
                                        onChange={(e) => setReviewComment(e.target.value)}
                                        placeholder="Tell us what you liked or what we could improve..."
                                        rows={4}
                                        maxLength={1000}
                                        className="w-full border border-gray/30 rounded-lg px-3 py-2 outline-none focus:border-blue resize-none"
                                    />

                                    <p className="text-xs text-gray/60 text-right">
                                        {reviewComment.length}/1000 characters
                                    </p>
                                </div>

                                {!existingReview && (
                                    <div className="bg-blue/10 border border-blue/20 rounded-lg p-3 flex gap-2 items-start">
                                        <MdRateReview className="text-blue text-xl shrink-0 mt-0.5" />

                                        <p className="text-xs md:text-sm font-medium text-gray">
                                            Please share honest and respectful feedback about your
                                            bike rental experience.
                                        </p>
                                    </div>
                                )}

                                {/* Success message */}
                                {reviewSuccess && (
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex gap-2 items-start">
                                        <FaStar className="text-green-600 text-xl shrink-0 mt-0.5" />

                                        <p className="text-sm font-medium text-green-700">
                                            {reviewSuccess}
                                        </p>
                                    </div>
                                )}

                                {/* Error */}
                                {reviewError && (
                                    <p className="text-sm text-blue bg-blue/10 border border-blue/20 rounded-lg px-3 py-2">
                                        {reviewError}
                                    </p>
                                )}

                                {/* Actions */}
                                <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setOpenReview(false)}
                                        className="px-4 py-2 rounded-lg border border-gray/30 text-gray hover:bg-gray/10"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleReviewSubmit}
                                        disabled={reviewSubmitting || reviewLoading || !!existingReview}
                                        className="px-4 py-2 rounded-lg bg-blue text-[#ffffff] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        <MdRateReview />
                                        {reviewLoading
                                            ? "Checking Review..."
                                            : existingReview
                                                ? "View Review"
                                                : "Add Review"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    
                </div>
            </div>
        }
        </>
    );
}

export default TransactionCurrentRow;