import CartRentRow from '../layout/cart/CartRentRow'
import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"
import { fade } from "../../animations/fade"
import { motion } from "framer-motion";
import { MdDelete } from "react-icons/md";
import { BsCheckAll } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

function CartSection() {

    const [orders, setOrders] = useState([]);

    const navigate = useNavigate();

    const [checkedItems, setCheckedItems] = useState({});

    const [loading, setLoading] = useState(true);

    const [total, setTotal] = useState(0);

    const groupedOrders = groupOrders(orders);

    function groupOrders(orders) {
        const groups = {};

        orders.forEach((order) => {
            const groupKey = [
                order.bike_type_id,
                order.reservation_date,
                order.start_time,
                order.duration_hours
            ].join("-");

            if (!groups[groupKey]) {
                groups[groupKey] = {
                    ...order,
                    groupKey,
                    quantity: 0,
                    orderIds: []
                };
            }

            groups[groupKey].quantity += 1;
            groups[groupKey].orderIds.push(order.id);
        });

        return Object.values(groups);
    }

    function handleCheckout() {
        const selectedOrders = orders.filter(
            (order) => checkedItems[order.id]
        );

        if(selectedOrders.length === 0 ) {
            console.log("No items selected.");
            return;
        }

        navigate("/checkout", {
            state: {
                orders: selectedOrders,
                total
            }
        })
    }
    

    function handleCheckbox(orderIds) {
        setCheckedItems((prev) => {
            const isChecked = orderIds.every((id) => prev[id]);

            const updated = { ...prev };

            orderIds.forEach((id) => {
                updated[id] = !isChecked;
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

        // If nothing selected, reset total
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

        // ADD
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

        <div className='w-full flex flex-col gap-10 xl:px-50 md:px-10 px-5 py-30'>
            <h1 className="md:text-4xl text-2xl font-akagi font-black text-blue">
                Cart
            </h1>

            <div className='w-full flex justify-end gap-3'>
                    <MdDelete className='text-2xl text-red-600 cursor-pointer'
                        onClick={handleDeleteSelected}/>

                    <BsCheckAll className='text-2xl text-blue cursor-pointer'/>
                
            </div>

            <motion.div
                initial={fade.initial}
                animate={fade.animate}
                transition={fade.transition}
                className='flex flex-col gap-5 lg:px-10 px-2'>
                
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
                        groupedOrders.map((order) => {
                            return (
                                <CartRentRow
                                    key={order.groupKey}
                                    image={order.bike_types_mod.image_url}
                                    name={order.bike_types_mod.name}
                                    hour={order.duration_hours}
                                    reservationdate={order.reservation_date}
                                    starttime={order.start_time}
                                    price={order.bike_types_mod.price}
                                    quantity={order.quantity}
                                    orderIds={order.orderIds}
                                    bikeTypeId={order.bike_type_id}
                                    checked={orderIdsChecked(order.orderIds)}
                                    onCheck={() => handleCheckbox(order.orderIds)}
                                    onQuantityChange={(newQuantity) =>
                                        handleQuantityChange(order, newQuantity)
                                    }
                                />
                            );
                        })
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