import { useEffect, useState } from "react";
import OrderRow from "./OrderRow"
import { supabase } from "../../../../../lib/supabase"
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { motion } from "motion/react"

function ProceedWalkInRent({onClose, cart, cartTotal, cashTendered, paymentMethod}) {

    const [selectedItems, setSelectedItems] = useState({});
    const [confirmProceed, setConfirmProceed] = useState(false);
    const [confirmBack, setConfirmBack] = useState(false);

    const [fullName, setFullName] = useState(null);
    const [idType, setIdType] = useState(null);

    const [assisted, setAssisted] = useState();

    const [transId, setTransId] = useState();

    const [rentAdded, setRentAdded] = useState(false);
    const navigate = useNavigate();

    const change = cashTendered - cartTotal;

    const now = new Date();

    const today = now.toLocaleDateString("en-CA");

    const start = now.toLocaleTimeString("en-GB", {
        hour12: false,
    });

    const end = (hoursToAdd) => {
        const endDate = new Date(now);
        endDate.setHours(endDate.getHours() + hoursToAdd);

        return endDate.toLocaleTimeString("en-GB", {
            hour12: false,
        });
    };

    const createTstzRange = (date, startTime, endTime, timezone = "+08") => {
        return `["${date} ${startTime}${timezone}","${date} ${endTime}${timezone}")`;
    };

    useEffect(() => {

        const hours = 3;

        const rentalRange = createTstzRange(
            today,
            start,
            end(hours)
        );

        console.log(rentalRange);
        console.log("SelectedItems",selectedItems);
        console.log(cart);

        const getCurrentUser = async () => {
            const { data, error } = await supabase.auth.getUser();

            const user = data.user;

            setAssisted(user.id);
        }
        getCurrentUser();

    }, [selectedItems]);

    console.log("Assisted by: " + assisted)


    //creates transaction and fetch the created transaction ID
    const getTransactionID = async () => {

        const {data, error} = await supabase
            .from("transactions_mod")
            .insert({
                payment_method: paymentMethod,
                total_amount: cartTotal,
                amount_paid: cashTendered,
                change_amount: change,
                status: "started",
                type: "walk-in",
                assisted_by: assisted,
            })
            .select()
            .single()

        if (error) {
            console.error(error);
            return null;
        }

        return data.id;
    }

    // add walk-in name and id type
    const walkInUserData = async (transactionId) => {

        const {data, error} = await supabase
            .from("walk_ins_users_mod")
            .insert({
                full_name: fullName,
                id_type: idType,
                transaction_id: transactionId
            })

            if (error) {
                console.error(error);
            }
    }

    const walkInOrders = async (transactionId) => {

        const orders = cart.map(item => ({
            bike_type_id: item.bikeId,
            bike_id: selectedItems[item.cartId]?.bike,
            gps_id: selectedItems[item.cartId]?.gps,
            transaction_id: transactionId,
            reservation_date: today,
            start_time: start,
            duration_hours: item.hours,
            status: "started",
            reservation_range: createTstzRange(
                today,
                start,
                end(item.hours)
            ), 
            type: "walk-in"
        }))
        
        console.log("Orders",orders);

        const {data, error} = await supabase
            .from("orders_mod")
            .insert(orders)

            console.log("Orders to insert:", orders);
            console.log("Inserted:", data);
            console.log("Error:", error);

            if (error) {
                console.error(JSON.stringify(error, null, 2));
            }
    }

    //setting bike selected to rented
    const setBikeRented = async () => {

        const bikeIds = Object.values(selectedItems)
            .map(item => item.bike)
            .filter(Boolean)

        const {data, error} = await supabase
            .from("bikes_mod")
            .update({status: "Rented"})
            .in("id", bikeIds);

        if(error){
            console.log(error);
        }
    }

    //setting gps selected to rented
    const setGPSRented = async () => {

        const gpsIds = Object.values(selectedItems)
            .map(item => item.gps)
            .filter(Boolean)

        const {data, error} = await supabase
            .from("gps_mod")
            .update({status: "Rented"})
            .in("id", gpsIds)

        if(error){
            console.log(error);
        }

    }


    const handleProceed = async () => {
 
        const hasUnselected = cart.some(item => {
            const selection = selectedItems[item.cartId];

            return (
                !selection ||
                !selection.bike ||
                !selection.gps
            );
        });


        if (hasUnselected) {
            alert("Please select a Bike ID and GPS ID for every bike.");
            return;
        } else if (!fullName || !idType) {
            alert("Name or ID Type is missing.");
            return;
        }

        const transactionId = await getTransactionID();
        if (!transactionId) return;

        await walkInUserData(transactionId);
        setConfirmProceed(true);
        walkInOrders(transactionId);
        setBikeRented();
        setGPSRented();

        setRentAdded(true);
    };
  

  return (
    <>
        <div className='xl:px-70 lg:px-30 md:px-10 py-10 px-5 fixed inset-0 bg-black/60 flex items-center justify-center z-50'>
            <div className='bg-[#ffffff] w-full h-full overflow-y-scroll scrollbar-thin scrollbar-thumb-[#B9B9B9] scrollbar-track-[#E2E2E2] rounded-xl md:p-10 p-5 py-10 flex flex-col gap-8 '>

                <div className='flex flex-col gap-6'>
                    <h1 className='text-3xl font-akagi font-bold text-navyblue'>Assign Bikes</h1>

                    <div className='flex flex-col gap-2'>
                        <div className='grid lg:grid-cols-[150px_1fr] grid-cols-[90px_1fr] items-center'>
                            <h1 className='md:text-md text-sm font-akagi font-bold text-[#6D7172]'>Full Name:</h1>
                            <div className='bg-[#D9D9D9] rounded-lg px-3 py-1 flex items-center'>
                                <input 
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className='w-full md:text-md text-sm font-akagi font-bold text-[#6D7172] focus:outline-none'/>
                            </div>
                        </div>

                        <div className='grid lg:grid-cols-[150px_1fr] grid-cols-[90px_1fr] items-center'>
                            <h1 className='md:text-md text-sm font-akagi font-bold text-[#6D7172]'>ID Type:</h1>
                            <div className='bg-[#D9D9D9] rounded-lg px-3 py-1 flex items-center'>
                                <input 
                                    value={idType}
                                    onChange={(e) => setIdType(e.target.value)}
                                    className='w-full md:text-md text-sm font-akagi font-bold text-[#6D7172] focus:outline-none'></input>
                            </div>
                        </div>

                    </div>
                </div>

                <div className='w-full md:px-10 flex flex-col gap-5'>
                    <div className='md:grid md:grid-cols-[100px_1fr_1fr_1fr_120px] md:text-center md:items-center gap-2 px-3'>
                        <div className='hidden md:block text-md font-akagi font-bold text-[#6D7172]'>Model</div>
                        <div className='hidden md:block text-md font-akagi font-bold text-[#6D7172]'>Duration</div>
                        <div className='hidden md:block text-md font-akagi font-bold text-[#6D7172]'>Bike ID</div>
                        <div className='hidden md:block text-md font-akagi font-bold text-[#6D7172]'>GPS ID</div>
                        <div className='hidden md:block text-md font-akagi font-bold text-[#6D7172]'>Amount</div>
                    
                    </div>

                    <div className='flex flex-col gap-3'>
                        {cart.map((bikes) => (
                            <OrderRow
                                key={bikes.cartId}
                                image={bikes.image}
                                duration={bikes.hours}
                                model={bikes.name}
                                price={"P" + bikes.price}

                                selectedBikeId={selectedItems[bikes.cartId]?.bike}
                                selectedGpsId={selectedItems[bikes.cartId]?.gps}

                                onBikeChange={(bike) =>
                                    setSelectedItems(prev => ({
                                        ...prev,
                                        [bikes.cartId]: {
                                            ...prev[bikes.cartId],
                                            bike,
                                        },
                                    }))
                                }

                                onGpsChange={(gps) =>
                                    setSelectedItems(prev => ({
                                        ...prev,
                                        [bikes.cartId]: {
                                            ...prev[bikes.cartId],
                                            gps,
                                        },
                                    }))
                                }
                            />
                        ))}

                    </div>
                </div>

                <div className='h-0.5 w-full rounded-lg bg-black/30'/>

                <div className='flex flex-col gap-3 md:px-30 px-7'>
                    <div className='flex flex-row justify-between items-center'>
                        <h1 className='text-lg font-bold font-akagi text-[#6D7172]'>Total</h1>
                        <h1 className='text-xl font-bold font-akagi text-[#6D7172]'>{"P"+cartTotal}</h1>
                    </div>

                    <div className='flex flex-row justify-between items-center'>
                        <h1 className='lg:text-lg font-bold font-akagi text-[#6D7172]'>Amount Tendered</h1>
                        <h1 className='lg:text-lg font-medium font-akagi text-[#6D7172]'>{"P"+cashTendered}</h1>
                    </div>

                    <div className= {`flex flex-row justify-between items-center
                            ${cartTotal === cashTendered ? "hidden" : "block" }
                        `}>
                        <h1 className='lg:text-lg font-bold font-akagi text-[#6D7172]'>Change</h1>
                        <h1 className='lg:text-lg font-medium font-akagi text-[#6D7172]'>{cartTotal === cashTendered ? "No change" :"P" + (cashTendered - cartTotal)}</h1>
                    </div>

                    <div className='flex flex-row justify-between items-center'>
                        <h1 className='lg:text-lg font-bold font-akagi text-[#6D7172]'>Payment Method</h1>
                        <h1 className='lg:text-lg font-medium font-akagi text-[#6D7172]'>{paymentMethod}</h1>
                    </div>

                    <div className={`flex flex-row justify-between items-center md:pl-10 ${paymentMethod === "GCash" ? "block" : "hidden"}`}>
                        <h1 className='lg:text-lg font-medium font-akagi text-[#6D7172]'>Reference No:</h1>
                        <h1 className='lg:text-lg font-medium font-akagi text-[#6D7172]'>123</h1>
                    </div>
                </div>

                <div className='mt-auto flex flex-row justify-between px-10'>
                    <div 
                        onClick={() => {setConfirmBack(true)}}
                        className='bg-red-500 rounded-xl px-7 py-2 cursor-pointer'>
                        <h1 className='text-lg font-akagi font-bold text-[#ffffff]'>Back</h1>
                    </div>

                    <div 
                        onClick={() => {setConfirmProceed(true)}}
                        className='bg-green-500 rounded-xl px-7 py-2 cursor-pointer'>
                        <h1 className='text-lg font-akagi font-bold text-[#ffffff]'>Proceed</h1>
                    </div>
                </div>

                {confirmBack && 
                    <div
                        onClick={() => {setConfirmBack(false)}} 
                        className='fixed inset-0 bg-black/60 flex items-center justify-center'>
                        <div className='bg-white'>
                            <h1>Back</h1>
                        </div>
                    </div>
                }

                {confirmProceed && 
                    <div
                        className='fixed inset-0 bg-black/60 flex items-center justify-center'
                    >
                        <div className='p-5 pt-10 px-10 bg-white rounded-xl flex flex-col gap-10'>

                            <h1 className='text-xl font-akagi font-bold text-darkblue'>Are you sure you want to proceed?</h1>

                            <div className='flex flex-row justify-between'>
                                <div
                                    onClick={() => {setConfirmProceed(false)}}   
                                    className='bg-red-500 rounded-xl px-7 py-2 cursor-pointer'>
                                    <h1 className='text-lg font-akagi font-bold text-[#ffffff]'>No</h1>
                                </div>

                                <div
                                    onClick={handleProceed}   
                                    className='bg-green-500 rounded-xl px-7 py-2 cursor-pointer'>
                                    <h1 className='text-lg font-akagi font-bold text-[#ffffff]'>Yes</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                }

                {confirmBack && 
                    <div
                        className='fixed inset-0 bg-black/60 flex items-center justify-center'
                    >
                        <div className='p-5 pt-10 px-10 bg-white rounded-xl flex flex-col gap-10'>

                            <h1 className='text-xl font-akagi font-bold text-darkblue'>Are you sure you want to exit?</h1>

                            <div className='flex flex-row justify-between'>
                                <div
                                    onClick={() => {setConfirmBack(false)}}   
                                    className='bg-red-500 rounded-xl px-7 py-2 cursor-pointer'>
                                    <h1 className='text-lg font-akagi font-bold text-[#ffffff]'>No</h1>
                                </div>

                                <div
                                    onClick={() => {
                                        setConfirmBack(false)
                                        onClose();
                                    }}   
                                    className='bg-green-500 rounded-xl px-7 py-2 cursor-pointer'>
                                    <h1 className='text-lg font-akagi font-bold text-[#ffffff]'>Yes</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                }

                {rentAdded === true &&
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }} 
                    >
                        <div className='fixed inset-0 bg-black/60 flex items-center justify-center'>
                            <div className='bg-[#ffffff] rounded-lg p-5 font-akagi font-bold text-navyblue flex flex-col gap-10 items-center'>
                                <div className='flex flex-row gap-3 items-center pt-3 px-10'>
                                    <FaCheckCircle className='text-2xl text-green-500'/>
                                    <h1 className='text-2xl'>Rent added.</h1>
                                </div>

                                <div 
                                    onClick={() => {navigate("/pos")}}
                                    className='rounded-lg bg-yellow w-fit px-2 py-1 cursor-pointer hover:bg-yellow-70'>
                                    Return to POS
                                </div>
                            </div>
                        </div>   
                    </motion.div> 
                }
            </div>
        </div>
        
    </>
  )
}

export default ProceedWalkInRent
