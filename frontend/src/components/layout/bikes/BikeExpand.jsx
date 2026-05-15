import { motion } from "framer-motion";
import { useState } from "react"
import { supabase } from "../../../lib/supabase"
import { useLocation } from "react-router-dom";
import Navigation from "../Navigation/StaticNavigationPC"
import AdjustNumber from "../../ui/AdjustNumber"

function BikeExpand() {

    const location = useLocation();
    const bike = location.state?.bike;
    const reservationData = location.state?.reservationData;

    const [quantity, setQuantity] = useState(1);

    console.log(reservationData.hours);
    return (
        <>

        <Navigation />
        
        <div className='box-model flex flex-col gap-10 items-center justify-center'>
            <div className='grid grid-cols-2 gap-20 items-center'>
                <div className=''>
                    <img src={bike.image_url} className='w-80'/>
                </div>

                <div className='flex flex-col gap-5'>

                    <div className='flex flex-col gap-2'>
                        <h1 className='text-4xl font-akagi font-black text-darkblue'>{bike.name}</h1>
                        
                        {/*Bikes Available*/}
                        <div className='bg-yellow rounded-lg w-fit px-3 py-1'>
                            <h1 className='text-md font-bold font-akagi text-navyblue'>{bike.available_count} units available</h1>
                        </div>
                    </div>

                    <div className='grid grid-cols-2 gap-2'>

                        {/*Quanttiy*/}
                        <div className='flex flex-row gap-5'>
                            <h1 className='font-akagi font-semibold text-2xl text-[#979B9D]'>Quantity</h1>
                            
                            <AdjustNumber value={quantity} setValue={setQuantity} color={"[#979B9D]"}/>
                        </div>

                        {/*Quanttiy*/}
                        <div className='flex flex-row gap-5'>
                            <h1 className='font-akagi font-semibold text-2xl text-[#979B9D]'>Hours</h1>
                            
                            
                        </div>
                    </div>
                </div>

            </div>
        </div>
        {/*<div>
            <h1>{bike.name}</h1>
            <img src={bike.image_url} alt={bike.name} />
            <p>₱{bike.price}/hr</p>
        </div>*/}
        </>
    );  
}

export default BikeExpand;