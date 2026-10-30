import CartRentRow from '../layout/cart/CartRentRow'
import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"
import { fade } from "../../animations/fade"
import { motion, AnimatePresence } from "framer-motion";
import { MdDelete } from "react-icons/md";
import { BsCheckAll } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

function CartSection() {

    const [orders, setOrders] = useState([]);

    const [selectionError, setSelectionError] = useState("");

    const navigate = useNavigate();

    const [checkedItems, setCheckedItems] = useState({});

    const [loading, setLoading] = useState(true);

    const [total, setTotal] = useState(0);

    const groupedOrders = groupOrders(orders);

    const [showRules, setShowRules] = useState(false);
    const [agreeRules, setAgreeRules] = useState(false);

    const [rentalRules, setRentalRules] = useState([]);
    const [rulesLoading, setRulesLoading] = useState(false);
    const [rulesError, setRulesError] = useState("");

    async function fetchRentalRules() {
        setRulesLoading(true);
        setRulesError("");

        const { data, error } = await supabase
            .from("rental_rules_mod")
            .select("id, title, content, display_order")
            .eq("is_active", true)
            .order("display_order", { ascending: true });

        if (error) {
            console.error("Error fetching rental rules:", error);
            setRentalRules([]);
            setRulesError(
                "Unable to load the rules and regulations. Please try again."
            );
        } else {
            setRentalRules(data || []);
        }

        setRulesLoading(false);
    }

    function formatDate(date) {
        if (!date) return "";

        return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric"
        }).replace(",", ".").replace(" .", ".");
    }

    function formatTime(time) {
        if (!time) return "";

        const [hours, minutes] = time.split(":");

        const date = new Date();
        date.setHours(Number(hours), Number(minutes), 0, 0);

        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        });
    }

    function groupOrders(orders) {
        const schedules = {};

        orders.forEach((order) => {
            const scheduleKey = [
                order.reservation_date,
                order.start_time
            ].join("-");

            const itemKey = [
                order.bike_type_id,
                order.duration_hours
            ].join("-");

            if (!schedules[scheduleKey]) {
                schedules[scheduleKey] = {
                    groupKey: scheduleKey,
                    reservation_date: order.reservation_date,
                    start_time: order.start_time,
                    items: {}
                };
            }

            if (!schedules[scheduleKey].items[itemKey]) {
                schedules[scheduleKey].items[itemKey] = {
                    ...order,
                    itemKey,
                    quantity: 0,
                    orderIds: []
                };
            }

            schedules[scheduleKey].items[itemKey].quantity += 1;
            schedules[scheduleKey].items[itemKey].orderIds.push(order.id);
        });

        return Object.values(schedules).map((schedule) => ({
            ...schedule,
            items: Object.values(schedule.items)
        }));
    }

    async function handleCheckout() {
        const selectedOrders = orders.filter(
            (order) => checkedItems[order.id]
        );

        if (selectedOrders.length === 0) {
            setSelectionError(
                "Please select at least one bike before checkout."
            );
            return;
        }

        setAgreeRules(false);
        setShowRules(true);

        await fetchRentalRules();
    }

    function handleContinueToCheckout() {
        if (!agreeRules) return;

        const selectedOrders = orders.filter(
            (order) => checkedItems[order.id]
        );

        if (selectedOrders.length === 0) {
            setShowRules(false);
            setSelectionError("Please select at least one bike before checkout.");
            return;
        }

        setShowRules(false);

        navigate("/checkout", {
            state: {
                orders: selectedOrders,
                total
            }
        });
    }
    

    function handleCheckbox(orderIds) {
        const clickedOrders = orders.filter((order) =>
            orderIds.includes(order.id)
        );

        if (clickedOrders.length === 0) return;

        // Determine whether this group is already checked
        const isChecked = orderIds.every((id) => checkedItems[id]);

        // Uncheck the group if it is already selected
        if (isChecked) {
            setCheckedItems((prev) => {
                const updated = { ...prev };

                orderIds.forEach((id) => {
                    delete updated[id];
                });

                sendCheckedToBackend(updated);

                return updated;
            });

            return;
        }

        // Find the first currently selected order
        const selectedOrder = orders.find(
            (order) => checkedItems[order.id]
        );

        // Use the first selected order as the basis
        const basisOrder = selectedOrder || clickedOrders[0];

        // Check whether the date or starting time is different
        const hasDifferentDate = clickedOrders.some(
            (order) =>
                order.reservation_date !== basisOrder.reservation_date
        );

        const hasDifferentStartTime = clickedOrders.some(
            (order) =>
                order.start_time !== basisOrder.start_time
        );

        // Show the appropriate popup
        if (hasDifferentDate && hasDifferentStartTime) {
            setSelectionError(
                "You cannot rent bikes with different rental dates and starting times. To rent bikes at different dates or times, please create a separate transaction for each rental schedule."
            );
            return;
        }

        if (hasDifferentDate) {
            setSelectionError(
                "You cannot rent bikes on different dates. To rent bikes on another date, please create a separate transaction for that rental date."
            );
            return;
        }

        if (hasDifferentStartTime) {
            setSelectionError(
                "You cannot rent bikes with different starting times. To rent bikes at another starting time on the same date, please create a separate transaction for that rental schedule."
            );
            return;
        }

        setSelectionError("");

        setCheckedItems((prev) => {
            const updated = { ...prev };

            orderIds.forEach((id) => {
                updated[id] = true;
            });

            sendCheckedToBackend(updated);

            return updated;
        });
    }

    const getSelectedIds = (checkedObj) =>
        Object.keys(checkedObj)
            .filter((id) => checkedObj[id])
            .map(Number);

    async function handleDeleteSelected() {

        const selectedIds = Object.keys(checkedItems)
            .filter((id) => checkedItems[id])
            .map((id) => Number(id));

        if (selectedIds.length === 0) {
            return;
        }

        const { error } = await supabase
            .from("orders_mod")
            .delete()
            .in("id", selectedIds);

        if (error) {
            console.log(error);
            return;
        }

        setOrders((prev) =>
            prev.filter((order) => !selectedIds.includes(order.id))
        );

        // Clear checked items
        setCheckedItems({});

        // Reset total
        setTotal(0);

    }
    
    async function sendCheckedToBackend(updatedChecked) {

        const selectedIds = Object.keys(updatedChecked)
            .filter((id) => updatedChecked[id])
            .map((id) => Number(id)); 

        if (selectedIds.length === 0) {
            setTotal(0);
            return;
        }

        const { data, error } = await supabase.rpc("calculate_orders_total", {
            order_ids: selectedIds
        });

        if (error) {
            console.log(error);
            return;
        }

        setTotal(data);
    }

    async function handleQuantityChange(order, newQuantity) {

        const currentQuantity = order.quantity;

        if (newQuantity > currentQuantity) {

            const { data: userData, error: userError } =
                await supabase.auth.getUser();

            if (userError || !userData?.user) {
                console.error("No user found");
                return;
            }

            const user = userData.user;

            const { error } = await supabase
                .from("orders_mod")
                .insert({
                    user_id: user.id,
                    transaction_id: null,
                    bike_id: null,
                    reservation_date: order.reservation_date,
                    start_time: order.start_time,
                    duration_hours: order.duration_hours,
                    status: "reserved",
                    reservation_range: order.reservation_range,
                    bike_type_id: order.bike_type_id,
                    type: null,
                    gps_id: null
                });

            if (error) {
                console.error(error);
                return;
            }

            // Refresh orders
            await fetchOrders();

            return;
        }

        // REMOVE
        if (newQuantity < currentQuantity) {

            // Remove one of the existing rows
            const idToDelete = order.orderIds[order.orderIds.length - 1];

            const { error } = await supabase
                .from("orders_mod")
                .delete()
                .eq("id", idToDelete);

            if (error) {
                console.error(error);
                return;
            }

            // Refresh orders
            await fetchOrders();
        }
    }

    async function fetchOrders() {
        setLoading(true);

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            setLoading(false);
            return;
        }

        const { data, error } = await supabase
            .from("orders_mod")
            .select(`
                id,
                reservation_date,
                start_time,
                duration_hours,
                status,
                reservation_range,
                bike_type_id,

                bike_types_mod (
                    image_url,
                    id,
                    name,
                    price
                ),

                transactions_mod (
                    id,
                    total_amount
                )
            `)
            .eq("user_id", user.id)
            .is("transaction_id", null);

        if (error) {
            console.log(error);
        } else {
            setOrders(data);
        }

        setLoading(false);
    }
    

    useEffect(() => {

        fetchOrders();

  }, []);

    function orderIdsChecked(orderIds) {
        return orderIds.every((id) => checkedItems[id]);
    }

  return (
    <div className='w-full min-h-screen gap-5 flex flex-col'>

        <AnimatePresence>
            {showRules && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-5"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 15 }}
                        transition={{ duration: 0.2 }}
                        className="flex max-h-[90vh] w-full max-w-2xl flex-col items-center gap-6 overflow-y-auto rounded-2xl bg-navyblue p-5 py-8 font-akagi font-bold text-[#ffffff] md:p-10"
                    >
                        <div className="text-center">
                            <h1 className="text-3xl font-extrabold tracking-wide text-yellow md:text-4xl">
                                RULES & REGULATIONS
                            </h1>
                        </div>

                        <div className="w-full rounded-lg bg-[#ffffff] p-5 font-medium text-darkblue">
                            {rulesLoading ? (
                                <p className="py-5 text-center">
                                    Loading rules and regulations...
                                </p>
                            ) : rulesError ? (
                                <div className="flex flex-col items-center gap-3 py-5 text-center">
                                    <p className="text-red-600">{rulesError}</p>

                                    <button
                                        type="button"
                                        onClick={fetchRentalRules}
                                        className="rounded-lg bg-blue px-4 py-2 text-[#ffffff]"
                                    >
                                        Try Again
                                    </button>
                                </div>
                            ) : rentalRules.length === 0 ? (
                                <p className="py-5 text-center">
                                    No active rules and regulations are available.
                                    Please contact the administrator.
                                </p>
                            ) : (
                                <div className="flex flex-col gap-5">
                                    {rentalRules.map((rule, index) => (
                                        <div key={rule.id} className="flex flex-col gap-2">
                                            <h2 className="text-lg font-bold">
                                                {index + 1}. {rule.title}
                                            </h2>

                                            <p className="whitespace-pre-line leading-relaxed pl-5">
                                                {rule.content}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <label className="flex w-full cursor-pointer flex-row items-start gap-3 px-1 font-medium">
                            <input
                                type="checkbox"
                                checked={agreeRules}
                                onChange={(e) => setAgreeRules(e.target.checked)}
                                className="mt-1 h-4 w-4 shrink-0 accent-yellow"
                            />

                            <span className="text-sm md:text-base">
                                I agree to the rules and regulations, as well as the
                                terms and conditions of renting bikes in 3Jremy's Rent
                                A Bike!
                            </span>
                        </label>

                        <div className="flex w-full items-center justify-between gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowRules(false);
                                    setAgreeRules(false);
                                }}
                                className="cursor-pointer rounded-lg border-2 border-gray px-4 py-1 font-medium text-gray transition hover:bg-[#ffffff]/10"
                            >
                                Back
                            </button>

                            <button
                                type="button"
                                disabled={
                                    !agreeRules ||
                                    rulesLoading ||
                                    !!rulesError ||
                                    rentalRules.length === 0
                                }
                                onClick={handleContinueToCheckout}
                                className={`rounded-lg border-2 px-4 py-1 font-medium transition ${
                                    agreeRules &&
                                    !rulesLoading &&
                                    !rulesError &&
                                    rentalRules.length > 0
                                        ? "cursor-pointer border-yellow bg-yellow text-navyblue hover:opacity-90"
                                        : "cursor-not-allowed border-gray bg-gray text-navyblue opacity-50"
                                }`}
                            >
                                Continue
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>

        <AnimatePresence>
            {selectionError && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-5"
                    onClick={() => setSelectionError("")}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 15 }}
                        transition={{ duration: 0.2 }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-sm rounded-2xl bg-[#ffffff] p-6 shadow-xl"
                    >
                        <div className="flex flex-col items-center gap-4 text-center">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
                                <MdDelete className="text-3xl text-red-600" />
                            </div>

                            <h2 className="text-xl font-akagi font-bold text-navyblue">
                                Unable to Select Bikes
                            </h2>

                            <p className="font-akagi text-gray-600">
                                {selectionError}
                            </p>

                            <button
                                onClick={() => setSelectionError("")}
                                className="w-full rounded-lg bg-blue py-3 font-akagi font-bold text-[#ffffff] transition hover:opacity-90"
                            >
                                Okay, got it!
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>

        <div className='w-full flex flex-col gap-10 xl:px-50 md:px-10 px-5 py-30'>
            <div className='flex justify-between items-center'>
                <h1 className="md:text-4xl text-2xl font-akagi font-black text-blue">
                    Cart
                </h1>

                <div className='w-full flex justify-end gap-3'>
                        <MdDelete className='text-2xl text-red-600 cursor-pointer'
                            onClick={handleDeleteSelected}/>

                        <BsCheckAll className='text-2xl text-blue cursor-pointer'/>
                    
                </div>
            </div>

            <motion.div
                initial={fade.initial}
                animate={fade.animate}
                transition={fade.transition}
                className='flex flex-col gap-5 px-2 pb-20'>
                
                {
                    loading ? (
                        <div className="w-full text-center">
                            <h1 className='text-gray font-akagi text-lg'>
                                Loading cart...
                            </h1>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="w-full text-center">
                            <h1 className='text-gray font-akagi text-lg'>
                                No bikes are added to cart.
                            </h1>
                        </div> 
                    ) : (
                        groupedOrders.map((group) => (
                            <div
                                key={group.groupKey}
                                className="flex flex-col gap-4 rounded-xl border border-gray-200 p-4"
                            >
                                {/* Group heading */}
                                <div className="flex flex-col gap-1 border-b border-gray-200 pb-3">
                                    <h2 className="font-akagi text-lg font-bold text-blue">
                                        Rental Schedule
                                    </h2>

                                    <p className="font-akagi text-sm text-gray-600">
                                        {formatDate(group.reservation_date)}
                                    </p>

                                    <p className="font-akagi text-sm text-gray-600">
                                        {formatTime(group.start_time)} onwards
                                    </p>
                                </div>

                                {/* Bikes with the same rental schedule */}
                                {group.items.map((item) => (
                                    <CartRentRow
                                        key={item.itemKey}
                                        image={item.bike_types_mod.image_url}
                                        name={item.bike_types_mod.name}
                                        hour={item.duration_hours}
                                        reservationdate={item.reservation_date}
                                        starttime={item.start_time}
                                        range={item.reservation_range}
                                        price={item.bike_types_mod.price}
                                        quantity={item.quantity}
                                        orderIds={item.orderIds}
                                        bikeTypeId={item.bike_type_id}
                                        checked={orderIdsChecked(item.orderIds)}
                                        onCheck={() => handleCheckbox(item.orderIds)}
                                        onQuantityChange={(newQuantity) =>
                                            handleQuantityChange(item, newQuantity)
                                        }
                                    />
                                ))}
                            </div>
                        ))
                    )
                }
                
            </motion.div>

            
            <div className="fixed bottom-0 left-0 w-full z-50">
                
                <div className="xl:px-50 px-2">
                    <div className="bg-blue text-[#ffffff] py-5 lg:px-20 px-10 shadow-lg rounded-t-xl flex flex-col gap-5">

                        <div className="flex flex-row justify-between lg:justify-end lg:gap-5">
                            <h1 className="md:text-2xl font-akagi font-medium">
                                Total:
                            </h1>

                            <h1 className="md:text-2xl font-akagi font-bold">
                                P{total}
                            </h1>
                        </div>

                        <div className="w-full flex flex-row justify-end">
                            <div 
                                onClick={total !== 0 ? handleCheckout : undefined}
                                className={`w-fit text-center justify-end px-5 rounded-lg py-2 flex items-center ${
                                    total === 0
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-yellow text-navyblue cursor-pointer"
                                }`}
                            >
                                <h1 className="font-akagi font-bold">
                                    Checkout
                                </h1>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
        
    </div>
  );
}

export default CartSection;