import { IoIosArrowBack } from "react-icons/io";
import { useState, useEffect } from 'react';
import { supabase } from "../../../../lib/supabase"
import DropDown from "./DropDown"

function AssignChangeBikes({beforeType, changedType, setConfirmChange, changedImage, gpsAssigned, transaction, orderId, toPay, payment, method, bikeTypeId, bikeId, changedBikeTypeId}) {

    const [bikes, setBikes] = useState([]);
    const [gps, setGps] = useState([]);

    const [selectedBike, setSelectedBike] = useState(null);
    const [selectedGps, setSelectedGps] = useState(gpsAssigned);

    const [loading, setLoading] = useState(false);


    useEffect(() => {
        console.log(method, orderId, toPay, payment)
        console.log(selectedGps)
        console.log("transactionId", transaction)
        const fetchBikeID = async () => {
            const { data } = await supabase
                .from("bikes_mod")
                .select(`
                    id,
                    code,
                    bike_types_mod!inner(name)
                `)
                .eq("bike_types_mod.name", changedType)
                .eq("status", "Available");

            setBikes(data ?? []);
        }

        const fetchGPSID = async () => {
            const { data } = await supabase
                .from("gps_mod")
                .select("id, code")
                .eq("status", "Available");

            setGps(data ?? []);
        }

        fetchBikeID();
        fetchGPSID();
    }, [])

    async function insertTransaction() {
        try {
            const {
                data: { user },
                error: userError
            } = await supabase.auth.getUser();

            if (userError || !user) {
                console.error("User error:", userError);
                return null;
            }

            const { data, error } = await supabase
                .from("transactions_mod")
                .insert({
                    payment_method: method,
                    total_amount: toPay,
                    amount_paid: payment,
                    status: "completed",
                    type: "change",
                    assisted_by: user.id
                })
                .select("id")
                .single();

            if (error) {
                console.error("Transaction error:", error);
                return null;
            }

            console.log("Transaction ID:", data.id);

            return data.id;

        } catch (err) {
            console.error(err);
            return null;
        }
    }

    async function insertChangeBike(transactionId) {
        try {
            const {
                data: { user },
                error: userError
            } = await supabase.auth.getUser();

            if (userError || !user) {
                console.error("User error:", userError);
                return;
            }

            const { data, error } = await supabase
                .from("change_bikes_mod")
                .insert({
                    order_id: orderId,
                    bike_type_id: bikeTypeId,
                    bike_id: bikeId,
                    trans_id: transactionId,
                    assisted_by: user.id
                })

            if (error) {
                console.error("Change bike error:", error);
                return;
            }

        } catch (err) {
            console.error(err);
        }
    }

    async function updateOrder() {
        try {

            const { data, error } = await supabase
                .from("orders_mod")
                .update({
                    bike_id: selectedBike,
                    bike_type_id: changedBikeTypeId,
                })
                .eq("id", orderId)


            if (error) {
                console.error("Update order error:", error);
                return;
            }

        } catch (err) {
            console.error(err);
        }
    }

    async function setBikeToAvailable() {
        try {

            const { data, error } = await supabase
                .from("bikes_mod")
                .update({
                    status: "Available",
                })
                .eq("id", bikeId)

            if (error) {
                console.error("Change bike error:", error);
                return;
            }

        } catch (err) {
            console.error(err);
        }
    }

    async function setBikeToRented() {
        try {

            const { data, error } = await supabase
                .from("bikes_mod")
                .update({
                    status: "Rented",
                })
                .eq("id", selectedBike)

            if (error) {
                console.error("Change bike error:", error);
                return;
            }

        } catch (err) {
            console.error(err);
        }
    }

    async function handleConfirm() {
        setLoading(true);

        try {
            const transactionId = await insertTransaction();

            if (!transactionId) {
                console.error("Transaction was not created");
                return;
            }

            console.log("Created transaction:", transactionId);

            await insertChangeBike(transactionId);
            updateOrder();
            setBikeToAvailable();
            setBikeToRented();

            console.log("Everything completed!");

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
            
        }
    }


  return (
    <>
        <div className="w-full h-full fixed inset-0 bg-black/50 flex justify-center items-center z-51 md:px-30 md:py-20 px-5 py-20">
            <div className='w-full h-full bg-[#ffffff] rounded-xl flex flex-col p-8 gap-5'>
                <h1 className='md:text-4xl text-2xl font-akagi font-bold text-blue'>Assign Bikes</h1>

                <div className='w-full mt-5 flex flex-col gap-1'>
                    <div className='flex flex-row gap-3 font-akagi text-gray text-xl'>
                        <h1>From: </h1>
                        <div className='flex flex-row gap-3'>
                        <h1 className='font-bold'>{beforeType}</h1>
                        </div>
                    </div>

                    <div className='flex flex-row gap-3 font-akagi text-gray text-xl'>
                        <h1>To: </h1>
                        <h1 className='font-bold text-blue'>{changedType}</h1>
                    </div>
                </div>

                <div className='flex flex-col gap-2'>
                    <div className='md:grid md:grid-cols-[400px_1fr_1fr] md:text-center md:items-center gap-2 px-3'>
                        <div className='hidden md:block text-md font-akagi font-bold text-[#6D7172]'>Model</div>
                        <div className='hidden md:block text-md font-akagi font-bold text-[#6D7172]'>Bike ID</div>
                        <div className='hidden md:block text-md font-akagi font-bold text-[#6D7172]'>GPS ID</div>
                    </div>

                    <div className='md:bg-[#F0F0F0] md:grid md:grid-cols-[400px_1fr_1fr] md:text-center md:items-center gap-3 md:px-3 md:py-2 md:rounded-xl md:border md:border-[#DBDBDB]'>

                        <h1 className='hidden md:block text-md font-akagi font-medium text-[#6D7172]'>{changedType}</h1>

                        <div className='hidden md:block'>
                            <DropDown
                                options={bikes}
                                placeholder="Bike ID"
                                value={selectedBike}
                                onChange={setSelectedBike}
                                allowed={true}
                            />
                        </div>
                        
                        <div className='hidden md:block'>
                            <DropDown
                                options={gps}
                                placeholder={selectedGps}
                                value={selectedGps}
                                onChange={setSelectedGps}
                                allowed={false}                    
                            />
                        </div>

                        {/*Mobile*/}
                        <div className='md:hidden bg-[#F0F0F0] p-4 rounded-lg border border-[#DBDBDB] flex flex-col gap-2'>
                            <div className='flex flex-row justify-between pb-3 items-center'>
                                <div className='flex flex-row gap-3 items-center'>
                                    <div className='bg-yellow p-1 rounded-lg'>
                                        <img src={changedImage} className='w-8'/>
                                    </div>

                                    <h1 className='text-md font-akagi font-bold text-[#6D7172]'>{changedType}</h1>
                                </div>
                            </div>

                            <div className='grid grid-cols-[70px_1fr] gap-3 items-center font-akagi'>
                                <h1 className='text-md font-akagi font-light text-[#6D7172]'>Bike ID:</h1>
                                <DropDown
                                    options={bikes}
                                    placeholder="Bike ID"
                                    value={selectedBike}
                                    onChange={setSelectedBike}
                                    allowed={true}
                                />

                                <h1 className='text-md font-akagi font-light text-[#6D7172]'>GPS ID:</h1>
                                <DropDown
                                    options={gps}
                                    placeholder={selectedGps}
                                    value={selectedGps}
                                    onChange={setSelectedGps}
                                    allowed={false}
                                    
                                />
                            </div>

                        </div>
                    </div>
                </div>

                <div className='flex flex-row justify-between mt-auto'>
                    <div
                        onClick={() => {setConfirmChange(false)}}
                        className='border cursor-pointer border-gray px-2 py-0.5 rounded-lg font-bold font-akagi text-md text-gray'>
                        Back
                    </div>

                    <div 
                        onClick={handleConfirm}
                        className={`bg-blue px-2 py-0.5 rounded-lg font-bold font-akagi text-md text-[#ffffff]
                            ${loading ? "opacity-50 pointer-events-none" : "cursor-pointer"}
                        `}>
                        {loading ? "Processing..." : "Confirm"}
                    </div>
                </div>
            </div>
        </div>
              
    </>
  )
}

export default AssignChangeBikes
