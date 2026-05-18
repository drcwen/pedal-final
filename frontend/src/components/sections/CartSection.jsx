import CartRentRow from '../layout/cart/CartRentRow'
import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"
import { fade } from "../../animations/fade"
import { motion } from "framer-motion";
import { MdDelete } from "react-icons/md";
import { BsCheckAll } from "react-icons/bs";

function CartSection() {

    const [orders, setOrders] = useState([]);

    const [checkedItems, setCheckedItems] = useState({});

    const [total, setTotal] = useState(0);

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
    
        console.log("Checked items:", checkedItems);

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
                id,
                name,
                price
                ),

                transactions_mod (
                id,
                total_amount
                )
            `)
            .eq("user_id", user.id);

            if (error) {
            console.log(error);
            } else {
            setOrders(data);
            }
        }

        fetchOrders();

  }, []);

  return (
    <div className='box-model flex flex-col gap-5 flex flex-col justify-center'>

        <div className='w-full flex flex-col gap-10 pt-10'>
            <h1 className="text-4xl font-akagi font-black text-blue">
                Cart
            </h1>

            <div className='w-full flex justify-end gap-3'>
                    <MdDelete className='text-2xl text-red-600'/>

                    <BsCheckAll className='text-2xl text-blue'/>
                
            </div>

            <motion.div
                initial={fade.initial}
                animate={fade.animate}
                transition={fade.transition}
                className='lg:h-70 h-80 overflow-y-auto flex flex-col gap-7 lg:px-10 px-2'>
                
                {orders.map((order) => {
                    return (
                        <CartRentRow
                            key={order.id}
                            name={order.bike_types_mod.name}
                            hour={order.duration_hours}
                            reservationdate={order.reservation_date}
                            starttime={order.start_time}
                            price={order.bike_types_mod.price}

                            checked={checkedItems[order.id] || false}

                            onCheck={() => handleCheckbox(order.id)}
                        />

                        
                    );
                })}
                
            </motion.div>

            <div className='h-1 bg-black/20 rounded-lg'></div>

            <div className='flex flex-row justify-between lg:px-20 px-5'>
                <h1 className='text-2xl font-akagi font-bold text-[#6D7172]'>Total</h1>
                <h1 className='text-2xl font-akagi font-bold text-[#6D7172]'>P{total}</h1>
            </div>

            <div className='w-full bg-blue rounded-lg py-1 flex items-center justify-center'>
                <h1 className='text-[#ffffff] font-akagi font-bold'>Checkout</h1>
            </div>
        </div>
        
    </div>
  );
}

export default CartSection;