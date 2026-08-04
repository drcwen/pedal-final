import { supabase } from "../../../../lib/supabase"
import Sidebar from "../../sidebar/Sidebar"
import SidebarMobile from "../../sidebar/SidebarMobile"
import { FaPlus } from "react-icons/fa6";
import ReservationRow from "../reservation/ReservationRow"
import { useState, useEffect } from 'react';
import { motion } from "motion/react"
import { IoChevronBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import BikesTile from "../walk in rent/BikesTile"
import ProceedWalkInRent from "../walk in rent/proceed/ProceedWalkInRent"
import { FaTrash } from "react-icons/fa";

function WalkInRent() {
    
    const navigate = useNavigate();
    const [info, setInfo] = useState([]);
    const [proceed, setProceed] = useState(false);
    const [openBikeId, setOpenBikeId] = useState(null);

    const [bikeData, setBikeData] = useState({});
    const [cart, setCart] = useState([]);

    const grandTotal = cart.reduce((sum, item) => sum + item.total, 0);

    const [gcash, setGcash] = useState(false);
    const [cash, setCash] = useState(false);

    const [cashAmount, setCashAmount] = useState();
    useEffect(() => {
        console.log(cart);
        const fetchBikes = async () => {
            const { data } = await supabase
                .from("bike_types_mod")
                .select(`
                    *,
                    bikes_mod (
                    id,
                    status
                    )
                `)
                .eq("bikes_mod.status", "Available")

            setInfo(data || [])
        }

        fetchBikes()

    }, [cart])

    const handleDelete = (cartId) => {
        setCart(prev => prev.filter(item => item.cartId !== cartId));
    };

    const handleChange = (e) => {
        setCashAmount(e.target.value);

        if (!isNaN(value)) {
            setCashAmount(value);
        }
    };

  return (
    <>

        <div className='w-full h-screen bg-[#F2F2F2] flex'>
            <Sidebar active={'pos'}/>
            <SidebarMobile active={'pos'}/>

            <div className='flex-1 p-4 pb-30 overflow-y-scroll scrollbar-thin scrollbar-thumb-[#B9B9B9] scrollbar-track-[#E2E2E2] min-[1330px]:pr-60'>
                <div className='flex flex-col gap-5'>
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }} 

                        className='md:p-10 p-2 py-8 bg-[#ffffff] rounded-xl flex flex-col gap-12'
                    >
                        <div 
                            onClick={() => navigate("/pos")}
                            className='flex flex-row items-center gap-2 cursor-pointer'
                        >
                            <IoChevronBack className='text-3xl text-gray'/>
                            <h1 className='text-4xl font-akagi font-black tracking-wide text-blue'>Bikes</h1>
                        </div>

                        <div className='h-full flex flex-col gap-7 md:px-5 px-3'>
                            
                            <div className='grid md:grid-cols-3 grid-cols-1 gap-3'>
                                <div className='rounded-xl bg-blue px-6 py-2 text-center cursor-pointer'>
                                    <h1 className='font-akagi font-bold text-[#ffffff] '>All</h1>
                                </div>

                                <div className='rounded-xl bg-[#DBDBDB] px-6 py-2 text-center cursor-pointer'>
                                    <h1 className='font-akagi font-bold text-[#505050] '>Family Bikes</h1>
                                </div>

                                <div className='rounded-xl bg-[#DBDBDB] px-6 py-2 text-center cursor-pointer'>
                                    <h1 className='font-akagi font-bold text-[#505050] '>Solo Bikes</h1>
                                </div>
                            </div>

                            <div className='grid md:grid-cols-3 grid-cols-2 gap-3'>
                                
                                {info.map((bike) => (
                                    <>
                                        
                                        <motion.div
                                            key={bike.id}
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                        >
                                            <BikesTile 
                                                key={bike.id}
                                                bikeId={bike.id}
                                                name={bike.name}
                                                availableBikes={bike.bikes_mod.length}
                                                image={bike.image_url}
                                                isOpen={openBikeId === bike.id}
                                                onClick={() => setOpenBikeId(bike.id)}
                                                bikeData={bikeData}
                                                setBikeData={setBikeData}
                                                setCart={setCart}
                                                price={bike.price}
                                            />
                                        </motion.div>
                                    </>
                                ))}
                                
                            </div>
                        </div>                    
                    </motion.div>

                    <div className='flex bg-[#ffffff] p-10 rounded-xl flex-col gap-6'>
                        <h1 className='font-akagi text-3xl font-black text-blue'>Walk-in Rent</h1>

                        <div className='min-h-70 md:grid md:grid-cols-2 flex flex-col gap-10'>
                            <div className='flex flex-col gap-4'>
                                {cart.map((item) => (
                                    <div key={item.cartId} className='flex flex-row justify-between items-center'>
                                        
                                        <div className='flex flex-row gap-4 items-center font-akagi font-bold'>
                                            <div className='bg-yellow p-2 rounded-lg'>
                                                <img src={item.image} className='w-10' />
                                            </div>

                                            <div>
                                                <h1 className='text-lg font-bold font-akagi text-[#6D7172]'>
                                                    {item.name}
                                                </h1>

                                                <p className='text-sm text-gray'>
                                                    {item.hours} hrs
                                                </p>
                                            </div>
                                        </div>

                                        <div className='flex flex-row gap-4 items-center'>
                                            <h1 className='text-lg font-bold font-akagi text-[#6D7172]'>
                                                ₱{item.total}
                                            </h1>

                                            <button
                                                onClick={() => handleDelete(item.cartId)}
                                                className='text-red-500 font-bold text-sm hover:opacity-70'
                                            >
                                                <FaTrash/> 
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                <div className='w-full bg-black/20 rounded-lg h-0.5'/>

                                <div className='flex flex-row justify-between px-5 font-akagi font-bold text-[#6D7172] items-center text-2xl'>
                                    <h1>Total:</h1>
                                    <h1 className=''>{"P" + grandTotal}</h1>
                                </div>
                            </div>
                            <div className='flex flex-col gap-6 justify-end'>
                                <div className='bg-white p-6 rounded-xl flex flex-col gap-3'>
                                    <h1 className='text-2xl font-bold font-akagi text-[#6D7172]'>Payment</h1>

                                    <div className='grid grid-cols-2 gap-3 pb-5'>
                                        <div 
                                            onClick={grandTotal === 0 ? undefined : () => {setGcash(true), cash === true ? setCash(!cash) : ""}}
                                            className={`border-2 border-gray rounded-lg text-center py-2 ${gcash === true ? `bg-gray text-[#ffffff]` : `bg-transparent `}`}>
                                            <h1 className={`text-xl font-bold font-akagi ${gcash === true ? `text-[#fffffff]` : `text-gray`}`}>GCash</h1>
                                        </div>

                                        <div 
                                            onClick={() => {grandTotal === 0 ? undefined : setCash(true), gcash === true ? setGcash(!gcash) : ""}}
                                            className={`border-2 border-gray rounded-lg text-center py-2 ${cash === true ? `bg-gray text-[#ffffff]` : `bg-transparent`}`}>
                                            <h1 className={`text-xl font-bold font-akagi ${cash === true ? `text-[#fffffff]` : `text-gray`}`}>Cash</h1>
                                        </div>
                                    </div>

                                    {gcash === true && 
                                        <div
                                            onClick={grandTotal === 0 ? setGcash(!gcash) : undefined} 
                                            className='w-full rounded-xl bg-gray p-2'>
                                            
                                        </div>
                                    }

                                    {cash === true && 
                                        <div className='w-full rounded-xl bg-gray p-3 font-akagi font-bold text-gray text-xl'>
                                            <div className='grid grid-cols-3 gap-3'>
                                                <div
                                                    onClick={150 < grandTotal ? undefined : () => setCashAmount(150)}
                                                    className={`
                                                        rounded-lg p-1 border border-[#ffffff] text-center items-center justify-center
                                                        ${cashAmount === 150 ? "bg-[#ffffff] text-[gray]" : "text-[#ffffff]"}
                                                        ${150 < grandTotal ? "pointer-events-none opacity-20" : "cursor-pointer"}
                                                    `}
                                                >
                                                    150
                                                </div>

                                                <div
                                                    onClick={200 < grandTotal ? undefined : () => setCashAmount(200)}
                                                    className={`
                                                        rounded-lg p-1 border border-[#ffffff] text-center items-center justify-center
                                                        ${cashAmount === 200 ? "bg-[#ffffff] text-[gray]" : "text-[#ffffff]"}
                                                        ${200 < grandTotal ? "pointer-events-none opacity-20" : "cursor-pointer"}
                                                    `}
                                                >
                                                    200
                                                </div>

                                                <div
                                                    onClick={250 < grandTotal ? undefined : () => setCashAmount(250)}
                                                    className={`
                                                        rounded-lg p-1 border border-[#ffffff] text-center items-center justify-center
                                                        ${cashAmount === 250 ? "bg-[#ffffff] text-[gray]" : "text-[#ffffff]"}
                                                        ${250 < grandTotal ? "pointer-events-none opacity-20" : "cursor-pointer"}
                                                    `}
                                                >
                                                    250
                                                </div>

                                                <div
                                                    onClick={300 < grandTotal ? undefined : () => setCashAmount(300)}
                                                    className={`
                                                        rounded-lg p-1 border border-[#ffffff] text-center items-center justify-center
                                                        ${cashAmount === 300 ? "bg-[#ffffff] text-[gray]" : "text-[#ffffff]"}
                                                        ${300 < grandTotal ? "pointer-events-none opacity-20" : "cursor-pointer"}
                                                    `}
                                                >
                                                    300
                                                </div>

                                                <div
                                                    onClick={350 < grandTotal ? undefined : () => setCashAmount(350)}
                                                    className={`
                                                        rounded-lg p-1 border border-[#ffffff] text-center items-center justify-center
                                                        ${cashAmount === 350 ? "bg-[#ffffff] text-[gray]" : "text-[#ffffff]"}
                                                        ${350 < grandTotal ? "pointer-events-none opacity-20" : "cursor-pointer"}
                                                    `}
                                                >
                                                    350
                                                </div>
                                                
                                                <div
                                                    onClick={450 < grandTotal ? undefined : () => setCashAmount(450)}
                                                    className={`
                                                        rounded-lg p-1 border border-[#ffffff] text-center items-center justify-center
                                                        ${cashAmount === 450 ? "bg-[#ffffff] text-[gray]" : "text-[#ffffff]"}
                                                        ${450 < grandTotal ? "pointer-events-none opacity-20" : "cursor-pointer"}
                                                    `}
                                                >
                                                    450
                                                </div>

                                                <div
                                                    onClick={500 < grandTotal ? undefined : () => setCashAmount(500)}
                                                    className={`
                                                        rounded-lg p-1 border border-[#ffffff] text-center items-center justify-center
                                                        ${cashAmount === 500 ? "bg-[#ffffff] text-[gray]" : "text-[#ffffff]"}
                                                        ${500 < grandTotal ? "pointer-events-none opacity-20" : "cursor-pointer"}
                                                    `}
                                                >
                                                    500
                                                </div>

                                                <div
                                                    onClick={1000 < grandTotal ? undefined : () => setCashAmount(1000)}
                                                    className={`
                                                        rounded-lg p-1 border border-[#ffffff] text-center items-center justify-center
                                                        ${cashAmount === 1000 ? "bg-[#ffffff] text-[gray]" : "text-[#ffffff]"}
                                                        ${1000 < grandTotal ? "pointer-events-none opacity-20" : "cursor-pointer"}
                                                    `}
                                                >
                                                    1000
                                                </div>

                                                <div 
                                                    onClick={() => {setCashAmount("")}}
                                                    className={`rounded-lg p-1 border border-[#ffffff] text-center items-center justify-center ${cashAmount === null ? `bg-[#ffffff] text-gray` : `text-[#ffffff]`}`}>
                                                    Custom
                                                </div>

                                            </div>
                                            <div className='pt-5'>
                                                <input 
                                                    placeholder="Amount"
                                                    value={cashAmount}
                                                    onChange={handleChange}
                                                    className='bg-[#fffffff] border-2 border-white w-full text-[#ffffff] rounded-xl focus:outline-none px-3 py-1 font-bold'/>
                                            </div>

                                        </div>
                                    }
                                </div>

                                {/*Payment Button*/}
                                <div 
                                    onClick={() => {setProceed(true)}}
                                    className={`${cashAmount < grandTotal ? "hidden":"block"} ${grandTotal === 0 ? "hidden" : "block"} w-fit self-end bg-yellow rounded-xl px-8 py-3 text-center`}>
                                    <h1 className='text-xl font-bold font-akagi text-darkblue'>Payment</h1>
                                </div>

                                {proceed && 
                                    <ProceedWalkInRent 
                                        onClose={() => setProceed(false)}
                                        cart={cart}
                                        cartTotal={grandTotal}
                                        cashTendered={cashAmount}
                                        paymentMethod={gcash === true ? "GCash" : "Cash"}
                                    />   
                                }

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default WalkInRent
