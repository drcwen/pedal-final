
import TransactionCurrentRow from "../transactions/TransactionsCurrentRow"
import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"
import { fade } from "../../animations/fade"
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function TransactionsSection() {

    const [transactions, setTransactions] = useState([]);
    const [pastTransactions, setPastTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [active, setActive] = useState("Active");

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

    async function fetchTransactions() {
        setLoading(true);

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            setLoading(false);
            return;
        }

        const { data, error } = await supabase
            .from("transactions_mod")
            .select(`
                id,
                payment_method,
                amount_paid,
                status,
                created_at,
                orders_mod!orders_mod_transaction_id_fkey (
                    *,
                    bike_types_mod (
                        *
                    ),
                    bikes_mod (
                        *
                    ),
                    gps_mod (
                        *
                    )
                )
            `)
            .eq("user_id", user.id)
            .eq("status", "pending");

        if (error) {
                console.log(error);
            } else {
                setTransactions(data);
            }

        setLoading(false);
    }

    async function fetchPastTransactions() {
        setLoading(true);

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            setLoading(false);
            return;
        }

        const { data, error } = await supabase
            .from("transactions_mod")
            .select(`
                id,
                payment_method,
                amount_paid,
                status,
                created_at,
                orders_mod!orders_mod_transaction_id_fkey (
                    *,
                    bike_types_mod (
                        *
                    ),
                    bikes_mod (
                        *
                    ),
                    gps_mod (
                        *
                    )
                )
            `)
            .eq("user_id", user.id)
            .eq("status", "completed");

        if (error) {
                console.log(error);
            } else {
                setPastTransactions(data);
            }

        setLoading(false);
    }
        

    useEffect(() => {

        fetchTransactions();
        fetchPastTransactions();

    }, []);

  return (
    <>

        <div className='py-30 px-7 lg:px-20 flex flex-col gap-20 flex flex-col'>

            <div className='flex flex-col gap-7'>
            
                <div className=''>
                    <h1 className='font-akagi font-black text-blue text-4xl'>Transactions</h1>
                </div>

                <div className="w-fit rounded-2xl border-3 border-blue overflow-hidden grid grid-cols-2">
                    <button
                        onClick={() => {
                            setActive("Active");
                        }}
                        className={`px-6 py-1 flex items-center justify-center transition-all duration-200 ${
                            active === "Active"
                                ? "bg-blue text-[#ffffff]"
                                : "bg-[#fffffff] text-blue"
                        }`}
                    >
                        <h1 className="text-lg font-akagi font-black">
                            Active
                        </h1>
                    </button>

                    <button
                        onClick={() => {
                            setActive("Past");
                        }}
                        className={`px-6 py-1 flex items-center justify-center transition-all duration-200 ${
                            active === "Past"
                                ? "bg-blue text-[#ffffff]"
                                : "bg-[#fffffff] text-blue"
                        }`}
                    >
                        <h1 className="text-lg font-akagi font-black">
                            Past
                        </h1>
                    </button>
                </div>

            </div>

            {active === "Active" &&
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
                                        transactions={transaction}
                                        startedBikes={transaction?.orders_mod}
                                    />
                                </motion.div>
                            );
                        })
                    )}
                    
                </div>
            }

            {active === "Past" &&
                <div className='flex flex-col gap-3'>
                    
                    {loading ? (
                        <div className="w-full text-center">
                            <h1 className='text-gray font-akagi text-lg'>Loading transactions...</h1>
                        </div>
                    ) : pastTransactions.length === 0 ? (
                        <div className="w-full text-center">
                            <h1 className='text-gray font-akagi text-lg'>
                                No bikes are added to cart.
                            </h1>
                        </div> 
                    ) : (
                        pastTransactions.map((transaction) => {
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
                                        transactions={transaction}
                                        startedBikes={transaction?.orders_mod}
                                    />
                                </motion.div>
                            );
                        })
                    )}
                    
                </div>
            }
            

        </div>
        

    </>
  )
}

export default TransactionsSection
