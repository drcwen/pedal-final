
import TransactionCurrentRow from "../transactions/TransactionsCurrentRow"
import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"
import { fade } from "../../animations/fade"
import { motion } from "framer-motion";

function TransactionsSection() {

    const [transactions, setTransactions] = useState([]);
    const [pastTransactions, setPastTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    const [active, setActive] = useState("Active");

    const today = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Manila",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).format(new Date());

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
                    *,
                    profile:profiles_mod!transactions_mod_user_id_fkey1 (
                        *
                    ),
                    walk_in:walk_ins_users_mod (
                        *
                    ),
                    assisted_by_profile:profiles_mod!transactions_mod_assisted_by_fkey (
                        *
                    ),
                    orders_mod (
                        *,
                        bike_types_mod (*),
                        bikes_mod!orders_mod_bike_id_fkey (*),
                        gps_mod (*)
                    ),
                    extensions_mod!extensions_mod_transaction_id_fkey (
                        *,
                        bikes_mod (
                            *
                        ),
                        bike_types_mod (
                            *
                        ),
                        original_transaction:transactions_mod!extensions_mod_original_transaction_id_fkey (
                            *,
                            profile:profiles_mod!transactions_mod_user_id_fkey1 (*),
                            walk_in:walk_ins_users_mod (*)
                        ),
                        orders_mod (
                            *,
                            bikes_mod!orders_mod_bike_id_fkey (
                                *,
                                bike_types_mod (
                                    *
                                )
                            ),
                            transaction:transactions_mod (
                                *,
                                profile:profiles_mod!transactions_mod_user_id_fkey1 (*),
                                walk_in:walk_ins_users_mod (*)
                            )
                        )
                    ),
                    maintenance_mod (
                        *,
                        orders_mod (
                            *,
                            bikes_mod!orders_mod_bike_id_fkey (
                                *,
                                bike_types_mod (
                                    *
                                )
                            ),
                            gps_mod (
                                *
                            ),
                            transaction:transactions_mod (
                                profile:profiles_mod!transactions_mod_user_id_fkey1 (*),
                                walk_in:walk_ins_users_mod (*)
                            )
                        ),
                        bikes_mod (
                            *,
                            bike_types_mod(
                                *
                            )
                        )
                    ),
                    change_bikes_mod!change_bikes_mod_trans_id_fkey (
                        *,
                        original_transaction:transactions_mod!change_bikes_mod_original_transaction_id_fkey (
                            *,
                            profile:profiles_mod!transactions_mod_user_id_fkey1 (*),
                            walk_in:walk_ins_users_mod (*)
                        ),

                        original_bike:bikes_mod!change_bikes_mod_bike_id_fkey (
                            *,
                            bike_type:bike_types_mod (*)
                        ),

                        changed_bike:bikes_mod!change_bikes_mod_changed_bike_id_fkey (
                            *,
                            bike_type:bike_types_mod (*)
                        ),

                        original_bike_type:bike_types_mod!change_bikes_mod_bike_type_id_fkey (*),

                        changed_bike_type:bike_types_mod!change_bikes_mod_changed_bike_type_id_fkey (*),

                        orders_mod (
                            *,
                            current_bike:bikes_mod!orders_mod_bike_id_fkey (
                                *,
                                bike_types_mod (*)
                            ),
                            original_bike:bikes_mod!orders_mod_initial_bike_id_fkey (
                                *,
                                bike_types_mod (*)
                            ),
                            transaction:transactions_mod (
                                *,
                                profile:profiles_mod!transactions_mod_user_id_fkey1 (*),
                                walk_in:walk_ins_users_mod (*)
                            )
                        )
                    ),
                    overtime_mod!overtime_mod_transaction_id_fkey (
                        *,
                        original_transaction:transactions_mod!overtime_mod_original_transaction_id_fkey (
                            *,
                            profile:profiles_mod!transactions_mod_user_id_fkey1 (
                                *
                            ),
                            walk_in:walk_ins_users_mod (
                                *
                            )
                        )
                    )
                    `)
            .eq("user_id", user.id)
            .in("status", [
                "pending",
                "pending refund",
                "refund rejected"
            ])
            .order("created_at", { ascending: false });

        if (error) {
            console.error(error);
        } else {
            const now = new Date();

            const active = data.filter((transaction) => {
                const status = transaction.status?.toLowerCase();

                // Pending stays Active until your scheduled function
                // changes its status to unattended.
                if (status === "pending") {
                    return true;
                }

                // Pending refund and refund rejected are Active
                // only while their rental has not ended.
                if (
                    status === "pending refund" ||
                    status === "refund rejected"
                ) {
                    const orders = Array.isArray(transaction.orders_mod)
                        ? transaction.orders_mod
                        : transaction.orders_mod
                            ? [transaction.orders_mod]
                            : [];

                    return orders.some((order) => {
                        if (
                            !order.reservation_date ||
                            !order.start_time ||
                            order.duration_hours == null
                        ) {
                            return false;
                        }

                        const start = new Date(
                            `${order.reservation_date}T${order.start_time}+08:00`
                        );

                        const end = new Date(
                            start.getTime() +
                            Number(order.duration_hours) * 60 * 60 * 1000
                        );

                        return !Number.isNaN(end.getTime()) && now <= end;
                    });
                }

                return false;
            });

            setTransactions(active);
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
                    *,
                    profile:profiles_mod!transactions_mod_user_id_fkey1 (
                        *
                    ),
                    walk_in:walk_ins_users_mod (
                        *
                    ),
                    assisted_by_profile:profiles_mod!transactions_mod_assisted_by_fkey (
                        *
                    ),
                    orders_mod (
                        *,
                        bike_types_mod (*),
                        bikes_mod!orders_mod_bike_id_fkey (*),
                        gps_mod (*)
                    ),
                    extensions_mod!extensions_mod_transaction_id_fkey (
                        *,
                        bikes_mod (
                            *
                        ),
                        bike_types_mod (
                            *
                        ),
                        original_transaction:transactions_mod!extensions_mod_original_transaction_id_fkey (
                            *,
                            profile:profiles_mod!transactions_mod_user_id_fkey1 (*),
                            walk_in:walk_ins_users_mod (*)
                        ),
                        orders_mod (
                            *,
                            bikes_mod!orders_mod_bike_id_fkey (
                                *,
                                bike_types_mod (
                                    *
                                )
                            ),
                            transaction:transactions_mod (
                                *,
                                profile:profiles_mod!transactions_mod_user_id_fkey1 (*),
                                walk_in:walk_ins_users_mod (*)
                            )
                        )
                    ),
                    maintenance_mod (
                        *,
                        orders_mod (
                            *,
                            bikes_mod!orders_mod_bike_id_fkey (
                                *,
                                bike_types_mod (
                                    *
                                )
                            ),
                            gps_mod (
                                *
                            ),
                            transaction:transactions_mod (
                                profile:profiles_mod!transactions_mod_user_id_fkey1 (*),
                                walk_in:walk_ins_users_mod (*)
                            )
                        ),
                        bikes_mod (
                            *,
                            bike_types_mod(
                                *
                            )
                        )
                    ),
                    change_bikes_mod!change_bikes_mod_trans_id_fkey (
                        *,
                        original_transaction:transactions_mod!change_bikes_mod_original_transaction_id_fkey (
                            *,
                            profile:profiles_mod!transactions_mod_user_id_fkey1 (*),
                            walk_in:walk_ins_users_mod (*)
                        ),

                        original_bike:bikes_mod!change_bikes_mod_bike_id_fkey (
                            *,
                            bike_type:bike_types_mod (*)
                        ),

                        changed_bike:bikes_mod!change_bikes_mod_changed_bike_id_fkey (
                            *,
                            bike_type:bike_types_mod (*)
                        ),

                        original_bike_type:bike_types_mod!change_bikes_mod_bike_type_id_fkey (*),

                        changed_bike_type:bike_types_mod!change_bikes_mod_changed_bike_type_id_fkey (*),

                        orders_mod (
                            *,
                            current_bike:bikes_mod!orders_mod_bike_id_fkey (
                                *,
                                bike_types_mod (*)
                            ),
                            original_bike:bikes_mod!orders_mod_initial_bike_id_fkey (
                                *,
                                bike_types_mod (*)
                            ),
                            transaction:transactions_mod (
                                *,
                                profile:profiles_mod!transactions_mod_user_id_fkey1 (*),
                                walk_in:walk_ins_users_mod (*)
                            )
                        )
                    ),
                    overtime_mod!overtime_mod_transaction_id_fkey (
                        *,
                        original_transaction:transactions_mod!overtime_mod_original_transaction_id_fkey (
                            *,
                            profile:profiles_mod!transactions_mod_user_id_fkey1 (
                                *
                            ),
                            walk_in:walk_ins_users_mod (
                                *
                            )
                        )
                    )
                    `)
            .eq("user_id", user.id)
            .in("status", [
                "refunded",
                "completed",
                "unattended",
                "pending refund",
                "refund rejected"
            ])
            .order("created_at", { ascending: false });

        if (error) {
            console.error(error);
        } else {
            const now = new Date();

            const past = data.filter((transaction) => {
                const status = transaction.status?.toLowerCase();

                // These statuses always belong in Past.
                if (
                    ["refunded", "completed", "unattended"].includes(status)
                ) {
                    return true;
                }

                // These statuses belong in Past only after the rental ends.
                if (
                    status === "pending refund" ||
                    status === "refund rejected"
                ) {
                    const orders = Array.isArray(transaction.orders_mod)
                        ? transaction.orders_mod
                        : transaction.orders_mod
                            ? [transaction.orders_mod]
                            : [];

                    // If any associated rental has not ended,
                    // keep the transaction out of Past.
                    const hasActiveRental = orders.some((order) => {
                        if (
                            !order.reservation_date ||
                            !order.start_time ||
                            order.duration_hours == null
                        ) {
                            return false;
                        }

                        const start = new Date(
                            `${order.reservation_date}T${order.start_time}+08:00`
                        );

                        const end = new Date(
                            start.getTime() +
                            Number(order.duration_hours) * 60 * 60 * 1000
                        );

                        return !Number.isNaN(end.getTime()) && now <= end;
                    });

                    return !hasActiveRental;
                }

                // Pending is intentionally never classified as Past.
                return false;
            });

            setPastTransactions(past);
        }

        setLoading(false);
    }

    function getRentalDateInfo(transaction) {
        const orders = Array.isArray(transaction.orders_mod)
            ? transaction.orders_mod
            : transaction.orders_mod
                ? [transaction.orders_mod]
                : [];

        // Use the reservation range as the source of the rental date.
        const range = orders.find((order) => order.reservation_range)
            ?.reservation_range;

        if (range) {
            const match = range.match(/^[\[(]"([^"]+)"/);

            if (match) {
                const start = new Date(
                    match[1].replace(
                        /([+-]\d{2})(?::?(\d{2}))?$/,
                        (timezone, hours, minutes) =>
                            hours === "+00" || hours === "-00"
                                ? "Z"
                                : timezone
                    ).replace(" ", "T")
                );

                if (!Number.isNaN(start.getTime())) {
                    const dateKey = new Intl.DateTimeFormat("en-CA", {
                        timeZone: "Asia/Manila",
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                    }).format(start);

                    const dateLabel = start.toLocaleDateString("en-PH", {
                        timeZone: "Asia/Manila",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    });

                    return { dateKey, dateLabel };
                }
            }
        }

        // Fallback if a transaction has no reservation range.
        const order = orders[0];

        if (order?.reservation_date) {
            const date = new Date(
                `${order.reservation_date}T12:00:00+08:00`
            );

            if (!Number.isNaN(date.getTime())) {
                return {
                    dateKey: order.reservation_date,
                    dateLabel: date.toLocaleDateString("en-PH", {
                        timeZone: "Asia/Manila",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    }),
                };
            }
        }

        return {
            dateKey: "unknown",
            dateLabel: "Rental date unavailable",
        };
    }

    function groupTransactionsByRentalDate(items, ascending = true) {
        const groups = {};

        items.forEach((transaction) => {
            const { dateKey, dateLabel } = getRentalDateInfo(transaction);

            if (!groups[dateKey]) {
                groups[dateKey] = {
                    dateKey,
                    dateLabel,
                    transactions: [],
                };
            }

            groups[dateKey].transactions.push(transaction);
        });

        return Object.values(groups)
            .sort((a, b) => {
                if (a.dateKey === "unknown") return 1;
                if (b.dateKey === "unknown") return -1;

                return ascending
                    ? a.dateKey.localeCompare(b.dateKey)
                    : b.dateKey.localeCompare(a.dateKey);
            });
    }
        

    useEffect(() => {

        fetchTransactions();
        fetchPastTransactions();

    }, []);

  return (
    <>

        <div className='py-30 px-7 lg:px-20 gap-20 flex flex-col'>

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
                                No active transactions yet.
                            </h1>
                        </div> 
                    ) : (
                        groupTransactionsByRentalDate(transactions, true).map((group) => (
                            <div key={group.dateKey} className="flex flex-col gap-3">
                                <div className="flex items-center gap-2 mt-4 mb-1">
                                    <div className="h-6 w-1.5 rounded-full bg-blue" />
                                    <h2 className="font-akagi font-black text-blue text-xl">
                                        {group.dateLabel}
                                    </h2>
                                    <span className="text-sm text-gray">
                                        ({group.transactions.length})
                                    </span>
                                </div>

                                {group.transactions.map((transaction) => {
                                    const { datePart, timePart } =
                                        formatPHDateTime(transaction.created_at);

                                    const bikeCount = transaction.orders_mod?.length || 0;

                                    return (
                                        <motion.div
                                            key={transaction.id}
                                            initial={fade.initial}
                                            animate={fade.animate}
                                            transition={fade.transition}
                                        >
                                            <TransactionCurrentRow
                                                bikeCount={bikeCount}
                                                date={datePart}
                                                time={timePart}
                                                method={transaction.payment_method}
                                                total={`P${transaction.amount_paid}`}
                                                status={transaction.status}
                                                transactions={transaction}
                                                startedBikes={transaction.orders_mod}
                                                fetchTransactions={fetchTransactions}
                                            />
                                        </motion.div>
                                    );
                                })}
                            </div>
                        ))
                    )}
                    
                </div>
            }

            {active === "Past" && (
                <div className="flex flex-col gap-3">
                    {loading ? (
                        <div className="w-full text-center">
                            <h1 className="text-gray font-akagi text-lg">
                                Loading transactions...
                            </h1>
                        </div>
                    ) : pastTransactions.length === 0 ? (
                        <div className="w-full text-center">
                            <h1 className="text-gray font-akagi text-lg">
                                No past transactions yet.
                            </h1>
                        </div>
                    ) : (
                        groupTransactionsByRentalDate(pastTransactions, false).map(
                            (group) => (
                                <div
                                    key={group.dateKey}
                                    className="flex flex-col gap-3"
                                >
                                    {/* Rental date heading */}
                                    <div className="flex items-center gap-2 mt-4 mb-1">
                                        <div className="h-6 w-1.5 rounded-full bg-blue" />

                                        <h2 className="font-akagi font-black text-blue text-xl">
                                            {group.dateLabel}
                                        </h2>

                                        <span className="text-sm text-gray font-akagi">
                                            ({group.transactions.length})
                                        </span>
                                    </div>

                                    {/* Transactions for this rental date */}
                                    {group.transactions.map((transaction) => {
                                        const { datePart, timePart } =
                                            formatPHDateTime(transaction.created_at);

                                        const bikeCount =
                                            transaction.orders_mod?.length || 0;

                                        return (
                                            <motion.div
                                                key={transaction.id}
                                                initial={fade.initial}
                                                animate={fade.animate}
                                                transition={fade.transition}
                                            >
                                                <TransactionCurrentRow
                                                    bikeCount={bikeCount}
                                                    date={datePart}
                                                    time={timePart}
                                                    method={transaction.payment_method}
                                                    total={`P${transaction.amount_paid}`}
                                                    status={transaction.status}
                                                    transactions={transaction}
                                                    startedBikes={transaction.orders_mod}
                                                    fetchTransactions={fetchTransactions}
                                                />
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            )
                        )
                    )}
                </div>
            )}
            

        </div>
        

    </>
  )
}

export default TransactionsSection
