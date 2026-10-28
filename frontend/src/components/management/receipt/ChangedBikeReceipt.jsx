
import { printReceipt } from "./printReceipt"

function ChangedBikeReceipt({ transaction, fullName, changeBikesData }) {

    function formatDate(dateString) {
        if (!dateString) return "-";

        const date = new Date(`${dateString}T00:00:00`);

        return date.toLocaleDateString("en-PH", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    }

    function formatTime12Hour(time) {
        if (!time) return "-";

        const [hours, minutes, seconds] = time.split(":").map(Number);

        const date = new Date();
        date.setHours(hours, minutes, seconds || 0);

        return date.toLocaleTimeString("en-PH", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    }

    function getEndTimePH(range) {
        if (!range) return "-";

        // Get the end timestamp from the range
        const endTimestamp = range
            .replace("[", "")
            .replace(")", "")
            .split(",")[1];

        if (!endTimestamp) return "-";

        const date = new Date(endTimestamp);

        return date.toLocaleTimeString("en-PH", {
            timeZone: "Asia/Manila",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    }

    function formatDatePH(timestamp) {
        if (!timestamp) return "-";

        const date = new Date(timestamp);

        return date.toLocaleDateString("en-PH", {
            timeZone: "Asia/Manila",
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    }

    function formatTimePH(timestamp) {
        if (!timestamp) return "-";

        const date = new Date(timestamp);

        return date.toLocaleTimeString("en-PH", {
            timeZone: "Asia/Manila",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    }

    return (
    <>

        
        <div className='w-full flex flex-col gap-5 bg-gray/10 border border-gray/30 p-2 py-10 rounded-lg'>
            <div className='flex flex-col items-center justify-center font-akagi font-bold text-gray'>
                <h1 className='text-lg text-blue'>3Jremy's Rent A Bike!</h1>
                <h1 className='font-medium text-sm'>La Mesa Eco Park, Quezon City</h1>
            </div>

            <div className='font-akagi font-medium text-gray text-sm md:text-md lg:px-10 px-2'>
                

                {/*Receipt No*/}
                <div className='flex flex-row justify-between'>
                    <h1>Receipt No:</h1>
                    <h1>#{transaction?.id}</h1>
                </div>

                {/*Customer*/}
                <div className={`${transaction?.type === undefined ? "hidden" : "block"} flex flex-row justify-between`}>
                    <h1>Customer:</h1>
                    <h1>{fullName}</h1>
                </div>

                {/*Type*/}
                <div className={`${transaction?.type === undefined ? "hidden" : "block"} flex flex-row justify-between`}>
                    <h1>Type:</h1>
                    <h1>{transaction?.type}</h1>
                </div>

                {/*Date and Time*/}
                <div className='flex flex-col py-2'>
                    <div className='flex flex-row justify-between'>
                        <h1>Transaction Date:</h1>
                        <h1>{formatDatePH(transaction?.created_at)}</h1>
                    </div>

                    <div className='flex flex-row justify-between'>
                        <h1>Transaction Time:</h1>
                        <h1>{formatTimePH(transaction?.created_at)}</h1>
                    </div>
                </div>

                <div className='flex flex-col py-5'>
                    <div className='w-full bg-gray/40 h-0.5 rounded-xl'></div>
                </div>

                {/*Changed Bikes */}
                {transaction?.type === "change" &&
                <>
                    <div
                        className='flex flex-row justify-between py-2 items-center'
                    >
                        <div className='flex flex-col'>
                            <h1>
                                ORIGINAL BIKE
                            </h1>
                            <div className='flex flex-row gap-2'>
                                <h1>
                                    {changeBikesData?.original_bike_type?.name}
                                </h1>

                                <h1>
                                    {changeBikesData?.original_bike?.code}
                                </h1>
                            </div>

                            <div className='flex flex-row gap-1'>
                                <h1>
                                    {formatTime12Hour(changeBikesData?.orders_mod?.start_time)}
                                </h1>

                                -

                                <h1>
                                    {getEndTimePH(changeBikesData?.orders_mod?.reservation_range) ?? "--"}
                                </h1>
                            </div>

                        </div>

                    </div>

                    <div
                        className='flex flex-row justify-between py-2 items-center'
                    >
                        <div className='flex flex-col'>
                            <h1>
                                CHANGED BIKE
                            </h1>
                            <div className='flex flex-row gap-2'>
                                <h1>
                                    {changeBikesData?.changed_bike_type?.name}
                                </h1>

                                <h1>
                                    {changeBikesData?.changed_bike?.code}
                                </h1>
                            </div>

                            <div className='flex flex-row gap-1'>
                                <h1>
                                    {formatTime12Hour(changeBikesData?.orders_mod?.start_time)}
                                </h1>

                                -

                                <h1>
                                    {getEndTimePH(changeBikesData?.orders_mod?.reservation_range) ?? "--"}
                                </h1>
                            </div>

                        </div>

                        <h1>
                            P{transaction?.total_amount}
                        </h1>

                    </div>
                </>
                }


                <div className='flex flex-col py-5'>
                    <div className='w-full bg-gray/40 h-0.5 rounded-xl'></div>
                </div>

                <div className='flex flex-row justify-between'>
                    <h1>Total:</h1>
                    <h1>P{transaction?.total_amount}</h1>
                </div>

                <div className='flex flex-row justify-between'>
                    <h1>Tendered Amount:</h1>
                    <h1>P{transaction?.amount_paid}</h1>
                </div>

                <div className='flex flex-row justify-between'>
                    <h1>Change:</h1>
                    <h1>P{transaction?.change_amount}</h1>
                </div>

                <div className='flex flex-row justify-between'>
                    <h1>Method:</h1>
                    <h1>{transaction?.payment_method}</h1>
                </div>

                <div className={`${transaction?.type === undefined ? "hidden" : "block"} flex flex-row justify-between`}>
                    <h1>Assisted by:</h1>
                    <h1>{transaction?.profile?.full_name}</h1>
                </div>
            </div>

            <div className='flex justify-end lg:px-10 px-2'>
                <div 
                    onClick={() => {
                    printReceipt({
                        transaction,
                        changeBikesData
                    });
                }}
                    className='cursor-pointer bg-blue rounded-lg px-3 py-0.5 font-akagi font-bold text-[#ffffff] text-xs'>
                    Print
                </div>
            </div>
        </div>

        
    </>
)
}

export default ChangedBikeReceipt
