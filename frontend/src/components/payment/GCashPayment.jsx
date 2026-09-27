import { useState } from "react";
import { supabase } from "../../lib/supabase"

function GCashPayment({ payment, orders, onClose, onSuccess }) {

    const [gcashStatus, setGcashStatus] = useState("waiting");
    const [referenceNo, setReferenceNo] = useState("");
    const [loading, setLoading] = useState(false);

    const simulatePayment = () => {
        const random = Math.floor(100000 + Math.random() * 900000);
        const reference = `GC-${random}`;

        setReferenceNo(reference);

        setGcashStatus("processing");

        setTimeout(() => {
            setGcashStatus("success");
        }, 2000);
    };

    async function handleSubmit() {

        setLoading(true);

        try {

            const {
                data: userData,
                error: userError
            } = await supabase.auth.getUser();

            if (userError || !userData?.user) {
                console.error("No user found:", userError);
                return;
            }

            const user = userData.user;

            const {
                data: transaction,
                error: transactionError
            } = await supabase
                .from("transactions_mod")
                .insert([
                    {
                        user_id: user.id,
                        payment_method: "GCash",
                        total_amount: payment,
                        amount_paid: payment,
                        change_amount: 0,
                        type: "reservation",
                        reference_number: referenceNo
                    }
                ])
                .select("id")
                .single();

            if (transactionError) {
                console.error("Transaction insert error:", transactionError);
                return;
            }

            const transactionId = transaction.id;

            console.log("TRANSACTION ID:", transactionId);



            const orderIds = orders.map((order) => order.id);

            console.log("ORDER IDS:", orderIds);

            const {
                error: updateError
            } = await supabase
                .from("orders_mod")
                .update({
                    transaction_id: transactionId,
                    status: "reserved"
                })
                .in("id", orderIds);

            if (updateError) {
                console.error("Order update error:", updateError);
                return;
            }


            if (onSuccess) {
                onSuccess();
            }

        } catch (error) {

            console.error("Unexpected error:", error);

        } finally {

            setLoading(false);

        }
    }


    const handleContinue = async () => {

        if (loading) return;

        await handleSubmit();
    };

    return (
        <>
            <div className="fixed z-100 inset-0 bg-black/60 flex items-center justify-center">

                <div className="bg-white rounded-2xl px-10 py-10 flex flex-col gap-5 items-center justify-center text-center">

                    {gcashStatus === "waiting" && (
                        <>
                            <h1 className="font-akagi font-bold text-[#505050] text-2xl">
                                Pay with GCash
                            </h1>

                            <div className="flex flex-col gap-2">
                                <h1 className="font-akagi font-bold text-[#505050] text-md">
                                    Scan the QR below using your GCash app
                                </h1>
                            </div>

                            <div className="flex flex-col gap-5 items-center justify-center">

                                <img
                                    onClick={simulatePayment}
                                    src="https://res.cloudinary.com/dp3vkgxtb/image/upload/v1779959866/qrcode_envfyr.png"
                                    className="w-52 h-52 cursor-pointer hover:scale-105 transition-all duration-300"
                                    alt="GCash QR Code"
                                />

                                <div className="flex flex-col gap-1">
                                    <h1 className="font-akagi font-bold text-[#505050] text-md">
                                        Amount to pay:
                                    </h1>

                                    <h1 className="font-akagi font-bold text-blue text-xl">
                                        ₱{payment}
                                    </h1>
                                </div>

                                <div className="flex flex-col gap-5">

                                    <h1 className="font-akagi font-light text-[#505050] text-md">
                                        Waiting for payment...
                                    </h1>

                                    <div className="flex flex-col gap-4">

                                        <div
                                            onClick={simulatePayment}
                                            className="px-5 py-2 rounded-full bg-blue cursor-pointer hover:scale-105 transition-all duration-300"
                                        >
                                            <h1 className="font-akagi font-bold text-white text-md">
                                                Pay
                                            </h1>
                                        </div>

                                        <h1
                                            onClick={onClose}
                                            className="text-sm font-akagi text-black/30 hover:underline duration-300 cursor-pointer transition-all"
                                        >
                                            Cancel
                                        </h1>

                                    </div>
                                </div>

                            </div>
                        </>
                    )}

                    {/* PROCESSING */}
                    {gcashStatus === "processing" && (
                        <div className="flex flex-col items-center gap-5 py-10">

                            <div className="w-14 h-14 border-4 border-gray/20 border-t-blue rounded-full animate-spin"></div>

                            <h1 className="font-akagi font-bold text-[#505050] text-2xl">
                                Processing Payment
                            </h1>

                            <h1 className="font-akagi text-[#505050]/60 text-md">
                                Verifying GCash payment...
                            </h1>

                            <h1 className="font-akagi font-bold text-blue text-xl">
                                ₱{payment}
                            </h1>

                        </div>
                    )}

                    {/* SUCCESS */}
                    {gcashStatus === "success" && (
                        <div className="flex flex-col items-center gap-5 py-10">

                            <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center">
                                <h1 className="text-white text-3xl font-bold">
                                    ✓
                                </h1>
                            </div>

                            <h1 className="font-akagi font-bold text-[#505050] text-2xl">
                                Payment Successful
                            </h1>

                            <div className="flex flex-col gap-1">
                                <h1 className="font-akagi font-bold text-[#505050] text-md">
                                    Amount Paid
                                </h1>

                                <h1 className="font-akagi font-bold text-blue text-2xl">
                                    ₱{payment}
                                </h1>
                            </div>

                            <h1 className="font-akagi text-[#505050]/60 text-sm">
                                GCash payment has been verified.
                            </h1>

                            <div
                                onClick={handleContinue}
                                className={`px-8 py-3 rounded-full bg-blue text-white transition-all duration-300 ${
                                    loading
                                        ? "opacity-50 pointer-events-none"
                                        : "cursor-pointer hover:scale-105"
                                }`}
                            >
                                <h1 className="font-akagi font-bold text-md">
                                    {loading ? "Processing..." : "Continue"}
                                </h1>
                            </div>

                        </div>
                    )}

                </div>

            </div>
        </>
    );
}

export default GCashPayment;