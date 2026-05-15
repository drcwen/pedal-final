import { motion } from "framer-motion";
import { useState } from "react"
import { supabase } from "../../../lib/supabase"
import { useLocation } from "react-router-dom";
import Navigation from "../Navigation/StaticNavigationPC"
import AdjustNumber from "../../ui/AdjustNumber"
import { IoMdArrowRoundBack } from "react-icons/io";


function BikeExpand() {

    const location = useLocation();
    const bike = location.state?.bike;
    const reservationData = location.state?.reservationData;

    const [quantity, setQuantity] = useState(1);

    console.log(reservationData.hours);
    return (
        <>

        <Navigation />

        {/*Back Button*/}

            <div className='box-model flex flex-col gap-10 items-center justify-center'>

                {/*Grid*/}
                <div className='lg:grid lg:grid-cols-2 lg:gap-30 gap-10 flex flex-col items-center'>
                    <div className=''>
                        <img src={bike.image_url} className='w-80'/>
                    </div>

                    <div className='flex flex-col gap-5'>

                        <div className='flex flex-col gap-2 items-center lg:items-start'>
                            <h1 className='text-4xl font-akagi font-black text-darkblue'>{bike.name}</h1>
                            
                            {/*Bikes Available*/}
                            <div className='bg-yellow rounded-lg w-fit px-3 py-1'>
                                <h1 className='text-md font-bold font-akagi text-navyblue'>{bike.available_count} units available</h1>
                            </div>
                        </div>

                        <div className="flex">
                            <div className="grid grid-cols-2 lg:gap-x-6 gap-y-4 items-center w-full">

                                {/* Quantity */}
                                <h1 className="font-akagi font-semibold text-lg lg:text-2xl text-[#979B9D]">
                                    Quantity
                                </h1>
                                <div>
                                    <AdjustNumber value={quantity} setValue={setQuantity} />
                                </div>

                                {/* Hours */}
                                <h1 className="font-akagi font-semibold text-lg lg:text-2xl text-[#979B9D]">
                                    Hours
                                </h1>

                                <div className="border-2 border-[#979B9D] rounded-lg flex items-center justify-center lg:py-1 px-4">
                                    <h1 className="text-lg font-bold font-akagi text-[#979B9D]">
                                        {reservationData.hours}
                                    </h1>
                                </div>

                                {/* Date */}
                                <h1 className="font-akagi font-semibold text-lg lg:text-2xl text-[#979B9D]">
                                    Date
                                </h1>
                                <div className="border-2 border-[#979B9D] rounded-lg flex items-center justify-center lg:py-1 px-4">
                                    <h1 className="text-lg font-bold font-akagi text-[#979B9D]">
                                        {reservationData.date}
                                    </h1>
                                </div>

                                {/* Date */}
                                <h1 className="font-akagi font-semibold text-lg lg:text-2xl text-[#979B9D]">
                                    Time
                                </h1>
                                <div className="border-2 border-[#979B9D] rounded-lg flex items-center justify-center lg:py-1 px-4">
                                    <h1 className="text-lg font-bold font-akagi text-[#979B9D]">
                                        {reservationData.startTime}
                                    </h1>
                                </div>

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