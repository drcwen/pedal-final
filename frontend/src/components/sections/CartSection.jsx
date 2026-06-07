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

    function handleCheckbox(id) {
        setCheckedItems((prev) => {
            const updated = {
                ...prev,
                [id]: !prev[id]
            };

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

    useEffect(() => {

        setLoading(true);
    
        async function fetchOrders() {

            const { data: { user } } = await supabase.auth.getUser();

            if (!user) return;

            const { data, error } = await supabase
                .from("orders_mod")
                .select(`
                id,
                reservation_date,
                start_time,
                duration_hours,
                status,

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

        fetchOrders();

  }, []);

  return (
    <div className='box-model flex flex-col gap-5 flex flex-col'>

        <div className='w-full flex flex-col gap-10'>
            <h1 className="text-4xl font-akagi font-black text-blue">
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
                className='lg:h-70 h-80 overflow-y-auto flex flex-col gap-7 lg:px-10 px-2'>
                
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
                        orders.map((order) => {
                            return (
                                <CartRentRow
                                    key={order.id}
                                    image={order.bike_types_mod.image_url}
                                    name={order.bike_types_mod.name}
                                    hour={order.duration_hours}
                                    reservationdate={order.reservation_date}
                                    starttime={order.start_time}
                                    price={order.bike_types_mod.price}
                                    checked={checkedItems[order.id] || false}
                                    onCheck={() => handleCheckbox(order.id)}
                                />
                            );
                        })
                    )
                }
                
            </motion.div>

            <div className='h-1 bg-black/20 rounded-lg'></div>

            <div className='flex flex-row justify-between lg:px-20 px-5'>
                <h1 className='text-2xl font-akagi font-bold text-[#6D7172]'>Total</h1>
                <h1 className='text-2xl font-akagi font-bold text-[#6D7172]'>P{total}</h1>
            </div>

            <div 
                onClick={total !== 0 ? handleCheckout : undefined}
                className={`w-full rounded-lg py-2 flex items-center justify-center ${total === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-blue cursor-pointer"}`}
            >
                <h1 className='text-[#ffffff] font-akagi font-bold'>Checkout</h1>
            </div>
        </div>
        
    </div>
  );
}

export default CartSection;