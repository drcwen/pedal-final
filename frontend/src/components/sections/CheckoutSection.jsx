import { IoMdArrowDropdown } from "react-icons/io";
import CheckoutRentRow from "../layout/checkout/CheckoutRentRow";
import { useLocation } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useEffect, useState } from "react";
import GCashPayment from "../payment/GCashPayment"

function CartSection() {

    const location = useLocation();

    const { orders, total } = location.state || {};

    const [checkoutTotal, setCheckoutTotal] = useState(total || 0);

    const [dropDown, setDropDown] = useState(false);

    const [paymentMethod, setPaymentMethod] = useState("GCash");

    const [GCashPopUp, setGCashPopUp] = useState(false);

    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        async function fetchCheckoutTotal() {

            if (!orders || orders.length === 0) return;

            const selectedIds = orders.map((order) => order.id);

            const { data, error } = await supabase.rpc(
                "calculate_checkout_total",
                {
                    order_ids: selectedIds
                }
            );

            if (error) {
                console.log(error);
                return;
            }

            setCheckoutTotal(data);
        }

        fetchCheckoutTotal();

    }, [orders]);

    function handleCheckout() {
        if (paymentMethod === "GCash") {
            setShowPopup(true);
            return;
        }
    }


    return (
        <div className='box-model flex flex-col gap-5 flex flex-col justify-center'>

            <div className="lg:grid lg:grid-cols-3 lg:gap-15 flex flex-col gap-10">

                <div className="col-span-2 flex flex-col gap-5">

                    <div className='lg:grid lg:grid-cols-2 lg:grid-rows-2 lg:gap-3 pt-20 flex flex-col gap-3'>

                    <div className='flex flex-row items-center gap-4'>
                        <h1 className='w-28 font-akagi text-[#6D7172] font-bold whitespace-nowrap'>First Name:</h1>
                        <div className='w-full bg-[#D9D9D9] rounded-lg px-3 py-1'>
                            <h1 className='font-akagi text-[#6D7172] font-bold'>Wendel</h1>
                        </div>
                    </div>

                    <div className='flex flex-row items-center gap-4'>
                        <h1 className='w-28 font-akagi text-[#6D7172] font-bold whitespace-nowrap'>Last Name:</h1>
                        <div className='w-full bg-[#D9D9D9] rounded-lg px-3 py-1'>
                            <h1 className='font-akagi text-[#6D7172] font-bold'>Derraco</h1>
                        </div>
                    </div>

                    <div className='flex flex-row items-center gap-4'>
                        <h1 className='w-28 font-akagi text-[#6D7172] font-bold whitespace-nowrap'>Username:</h1>
                        <div className='w-full bg-[#D9D9D9] rounded-lg px-3 py-1'>
                            <h1 className='font-akagi text-[#6D7172] font-bold'>drcwen</h1>
                        </div>
                    </div>

                    <div className='flex flex-row items-center gap-4'>
                        <h1 className='w-28 font-akagi text-[#6D7172] font-bold whitespace-nowrap'>Email:</h1>
                        <div className='w-full bg-[#D9D9D9] rounded-lg px-3 py-1'>
                            <h1 className='font-akagi text-[#6D7172] font-bold'>wendelderraco@gmail.com</h1>
                        </div>
                    </div>
                </div>

                <div className='h-70 overflow-y-auto flex flex-col gap-4 py-5'>

                    {orders?.map((order) => (
                        <CheckoutRentRow
                            key={order.id}

                            image={order.bike_types_mod.image_url}

                            bike={order.bike_types_mod.name}

                            quantity="x1"

                            rentdate={order.reservation_date}

                            rentstart={order.start_time}

                            duration={`${order.duration_hours} hour${order.duration_hours > 1 ? "s" : ""}`}

                            price={
                                order.duration_hours *
                                order.bike_types_mod.price
                            }
                        />
                    ))}

                </div>

                <div className='flex flex-col gap-10'>

                    <div className='w-full h-0.5 bg-black/20 rounded-lg'></div>

                    <div className='w-full px-10 flex justify-between items-center'>
                        <h1 className='font-akagi font-bold text-[#6D7172] text-3xl'>
                            Total
                        </h1>

                        <h1 className='font-akagi font-bold text-blue text-3xl'>
                            P{checkoutTotal}
                        </h1>
                    </div>
                </div>
            </div>

            <div className="col-span-1 flex flex-col gap-5">

                <div className='mt-auto bg-[#D9D9D9] rounded-lg px-5 py-7 flex flex-col gap-2'>

                    <h1 className='font-akagi font-bold text-[#6D7172] text-xl'>
                        Payment
                    </h1>

                    <div 
                        onClick={() => setDropDown((prev) => !prev)}
                        className='relative w-full rounded-lg bg-[#6D7172] p-5 flex items-center justify-between'>
                        <h1 className='font-akagi font-bold text-[#D9D9D9] text-xl'>
                            {paymentMethod}
                        </h1>

                        <IoMdArrowDropdown className='text-3xl text-white cursor-pointer'/>

                        {dropDown && (
                            <div className='absolute top-17 left-0 w-full bg-[#D9D9D9] rounded-bl-lg rounded-br-lg flex flex-col gap-2'>
                                
                                <div 
                                    onClick={() => {
                                        setPaymentMethod("E-Bank");
                                        setDropDown(true);
                                    }}
                                    className='bg-white p-5 rounded-bl-lg rounded-br-lg cursor-pointer hover:bg-gray-100'>
                                    <h1 className='font-akagi font-bold text-[#6D7172] text-xl'>
                                        E-Bank
                                    </h1>
                                </div>

                                <div 
                                    onClick={() => {
                                        setPaymentMethod("GCash");
                                        setDropDown(true);
                                    }}
                                    className='bg-white p-5 rounded-bl-lg rounded-br-lg cursor-pointer hover:bg-gray-100'>
                                    <h1 className='font-akagi font-bold text-[#6D7172] text-xl'>
                                        GCash
                                    </h1>
                                </div>

                            </div>
                        )}
                    </div>

                </div>

                <div className='rounded-lg bg-blue flex items-center justify-center py-3 cursor-pointer'
                    onClick={handleCheckout}>
                    <h1 className='font-akagi font-bold text-[#D9D9D9] text-xl'>
                        Checkout
                    </h1>

                </div>

                { showPopup && (
                    <GCashPayment payment={checkoutTotal}/>
                )}

                

            </div>
        </div>

    </div>
    );
}

export default CartSection;