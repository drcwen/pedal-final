
import TransactionCurrentRow from "../transactions/TransactionsCurrentRow"
import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"
import { fade } from "../../animations/fade"
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function PastTransactionsSection() {

    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const formatPHDateTime = (timestamp) => {
        const date = new Date(timestamp);

        const datePart = date.toLocaleDateString("en-PH", {
            timeZone: "Asia/Manila",
            year: "numeric",
            month: "long",
            day: "2-digit",
        });

        const timePart = date.toLocaleTimeString("en-PH", {
            timeZone: "Asia/Manila",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });

        return { datePart, timePart };
    };

    useEffect(() => {
        
            async function fetchTransactions() {

                setLoading(true);
    
                const { data: { user } } = await supabase.auth.getUser();
    
                if (!user) return;
    
                const { data, error } = await supabase
                    .from("transactions_mod")
                    .select(`
                    id,
                    payment_method,
                    amount_paid,
                    status,
                    created_at,
                    orders_mod!orders_mod_transaction_id_fkey(id)
                `)
                .eq("user_id", user.id)
    
                if (error) {
                console.log(error);
                } else {
                setTransactions(data);
                }

                setLoading(false);
            }
    
            fetchTransactions();

            
    
      }, []);

  return (
    <>

        <div className='box-model flex flex-col gap-20 flex flex-col'>

            <div className='flex flex-col gap-7'>
            
                <div className=''>
                    <h1 className='font-akagi font-black text-blue text-4xl'>Transactions</h1>
                </div>

                <div className='w-fit rounded-2xl border-3 border-blue grid grid-cols-2'>
                    <button 
                        onClick={() => navigate("/transactions")}
                        className='cursor-pointer px-6 py-1 rounded-tl-xl rounded-bl-xl flex items-center justify-center'
                    >
                        <h1 className='text-lg font-akagi text-blue font-black'>Active</h1>
                    </button>

                    <button
                        onClick={() => navigate("/past-transactions")}
                        className='cursor-pointer bg-blue px-6 py-1 rounded-tr-xl rounded-br-xl flex items-center justify-center'>
                        <h1 className='text-lg font-akagi text-[#FFFFFF] font-black'>Past</h1>
                    </button>
                </div>

            </div>

            <div className='flex flex-col gap-3'>
                
                {loading ? (
                    <div className="w-full text-center">
                        <h1 className='text-gray font-akagi text-lg'>Loading transactions...</h1>
                    </div>
                ) : transactions.length === 0 ? (
                    <div className="w-full text-center">
                        <h1 className='text-gray font-akagi text-lg'>
                            No bikes are added to cart.
                        </h1>
                    </div> 
                ) : (
                    transactions.map((transaction) => {
                        const { datePart, timePart } = formatPHDateTime(transaction.created_at);
                        const bikeCount = transaction.orders_mod?.length || 0;

                        return (
                            <motion.div
                                initial={fade.initial}
                                animate={fade.animate}
                                transition={fade.transition} className=''>
                                <TransactionCurrentRow
                                    key={transaction.id}
                                    bikeCount={bikeCount}
                                    date={datePart}
                                    time={timePart}
                                    method={transaction.payment_method}
                                    total={`P${transaction.amount_paid}`}
                                    status={transaction.status}
                                />
                            </motion.div>
                        );
                    })
                )}
                
            </div>
            

        </div>
        

    </>
  )
}

export default PastTransactionsSection
