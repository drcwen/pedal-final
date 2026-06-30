
import Navigation from "../layout/Navigation/StaticNavigationPC"
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase"

function EBankPayment() {

    const location = useLocation();

    const navigate = useNavigate();

    const { checkoutTotal, orders } = location.state || {};  

    const handleSubmit = async (e) => {
        e.preventDefault();

        const cardNumber = document
        .getElementById("card-number")
        .value
        .replace(/\D/g, "");

        if (cardNumber.length !== 16) {
            alert("Please enter a complete 16-digit card number.");
            return;
        }
    
        try {
            const { data: userData, error: userError } = await supabase.auth.getUser();

            if(userError || !userData?.user) {
                console.error("No user found");
                return
            }

            const user = userData.user;

            const { data, error } = await supabase
            .from("transactions_mod")
            .insert([
                {
                user_id: user.id,
                payment_method: "E-Bank",
                total_amount: checkoutTotal,
                amount_paid: checkoutTotal,
                type: "reservation"
                },
            ])
            .select();

            if (error) {
                alert.error("Insert error:", error);
                return;
            }

            const transactionId = data?.[0]?.id;

            const orderIds = orders.map((o) => o.id);

            console.log("ORDER IDS:", orderIds);
            console.log("TRANSACTION ID", transactionId);

            const { error: updateError } = await supabase
            .from("orders_mod")
            .update({ 
                transaction_id: transactionId,
                status: "reserved"
             })
            .in("id", orderIds);

            if (updateError) {
            alert.error(updateError);
            }

            alert("Payment success!");
            navigate("/");

        } catch(err) {
            console.error("Unexpected error:", err);
        }
    }

   
  return (
    <>
        <div className='box-model flex flex-col gap-10 flex flex-col justify-center'>
            <Navigation/>

            <div className='flex flex-col gap-5'>
                <h1 className='text-3xl font-akagi font-bold text-[#6D7172]'>Pay with Card</h1>
            </div>

            <div className='lg:grid lg:grid-cols-2 flex flex-col lg:gap-30 gap-10'>

                <div className='flex flex-col gap-4'>

                    <form id="payment-form" className='flex flex-col gap-4'
                        onSubmit={handleSubmit}>
                        <div className='flex flex-col gap-2'>
                            <h1 className='text-lg font-akagi font-bold text-[#979B9D]'>Email</h1>
                            <div className='w-full bg-[#C6C6C6] rounded-lg px-2 py-1'>
                                <input
                                    type="email"
                                    required
                                    className="w-full font-akagi font-md font-bold text-[#6D7172]"
                                    placeholder="juandelacruz@gmail.com"
                                />
                            </div>
                        </div>

                        <div className='flex flex-col gap-2'>
                            <h1 className='text-lg font-akagi font-bold text-[#979B9D]'>Credit Card Number</h1>
                            <div className='w-full bg-[#C6C6C6] rounded-lg px-2 py-1'>
                                <input
                                    type="text"
                                    required
                                    id="card-number"
                                    className="w-full font-akagi font-md font-bold text-[#6D7172]"
                                    placeholder="•••• •••• ••••"
                                    maxLength={19}
                                    minLength={19}
                                    onChange={(e) => {
                                        let value = e.target.value.replace(/\D/g, ""); // remove non-numbers
                                        value = value.replace(/(.{4})/g, "$1-").trim();

                                        // remove extra dash at end
                                        if (value.endsWith("-")) {
                                        value = value.slice(0, -1);
                                        }

                                        e.target.value = value;
                                    }}
                                />
                            </div>
                        </div>

                        <div className='flex flex-col gap-2'>
                            <h1 className='text-lg font-akagi font-bold text-[#979B9D]'>Cardholder Name</h1>
                            <div className='w-full bg-[#C6C6C6] rounded-lg px-2 py-1'>
                                <input
                                    required
                                    type="text"
                                    className="w-full font-akagi font-md font-bold text-[#6D7172]"
                                    placeholder="Juan Dela Cruz"
                                />
                            </div>
                        </div>

                        <div className='w-full flex flex-row gap-3'>
                            <div className='w-full flex flex-col gap-2'>
                                <h1 className='text-lg font-akagi font-bold text-[#979B9D]'>Expiration Date</h1>

                                <div className='w-full bg-[#C6C6C6] rounded-lg px-2 py-1'>
                                    <input
                                        type="text"
                                        required
                                        className="w-full font-akagi font-md font-bold text-[#6D7172]"
                                        placeholder="MM/YY"
                                        maxLength={5}
                                        onChange={(e) => {
                                            let value = e.target.value.replace(/\D/g, ""); // numbers only

                                            // limit to 4 digits
                                            value = value.slice(0, 4);

                                            // format as MM/YY
                                            if (value.length >= 3) {
                                            value = `${value.slice(0, 2)}/${value.slice(2)}`;
                                            }

                                            // validate month
                                            const month = parseInt(value.slice(0, 2));

                                            if (month > 12) {
                                            value = "12" + value.slice(2);
                                            } else if (month === 0) {
                                            value = "";
                                            }

                                            e.target.value = value;
                                        }}
                                    />
                                </div>
                            </div>

                            <div className='w-full flex flex-col gap-2'>
                                <h1 className='text-lg font-akagi font-bold text-[#979B9D]'>CVV</h1>

                                <div className='w-full bg-[#C6C6C6] rounded-lg px-2 py-1'>
                                <input
                                        required
                                        type="text"
                                        className="w-full font-akagi font-md font-bold text-[#6D7172]"
                                        placeholder="CVV"
                                        maxLength={3}
                                        onChange={(e) => {
                                            e.target.value = e.target.value.replace(/\D/g, "");
                                    }}
                                    />
                                </div>
                            </div>
                        </div>

                        <button 
                            type="submit"
                            className='w-full flex items-center justify-center rounded-lg bg-blue py-2 cursor-pointer'
                        >
                            <h1 className='text-lg font-akagi font-bold text-white'>Place Rent</h1>
                        </button>
                    </form>
                </div>

                <div className='mt-auto flex flex-col gap-3'>
                    <div className='w-full flex flex-row justify-between gap-3'>
                        <h1 className='text-lg font-akagi font-bold text-gray'>Subtotal</h1>
                        <h1 className='text-lg font-akagi font-bold text-gray'>P{checkoutTotal}</h1>
                    </div>

                    <div className='w-full flex flex-row justify-between gap-3'>
                        <h1 className='text-lg font-akagi font-bold text-gray'>Tax</h1>
                        <h1 className='text-lg font-akagi font-bold text-gray'>P30</h1>
                    </div>

                    <div className='w-full h-0.5 bg-gray'></div>

                    <div className='w-full flex flex-row justify-between gap-3'>
                        <h1 className='text-xl font-akagi font-bold text-gray'>Total</h1>
                        <h1 className='text-xl font-akagi font-bold text-gray'>P{checkoutTotal}</h1>
                    </div>

                </div>
            </div>
        </div>
    </>
  )
}

export default EBankPayment
