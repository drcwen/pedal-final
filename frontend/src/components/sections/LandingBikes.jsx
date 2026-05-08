import BikeCard from "../layout/bikes/BikeCard"
import { supabase } from "../../lib/supabase"
import { useEffect, useState } from "react"

import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';

import FamilyBikesCarousel from "../layout/bikes/FamilyBikesCarousel"
import SoloBikesCarousel from "../layout/bikes/SoloBikesCarousel"

import SoloBikesDisplay from "../layout/bikes/SoloBikesDisplay"
import FamilyBikesDisplay from "../layout/bikes/FamilyBikesDisplay"


function LandingBikes() {

    

    return (
        <>
            <div className='min-h-screen bg-[#F7F7F7] px-10 py-10 flex flex-col items-center justify-center gap-10 md:items-start md:py-25 md:px-30 md:flex md:flex-col md:gap-20'>
                
                <h1 className='font-akagi font-black tracking-wide text-blue text-4xl'>
                    Solo Bikes
                </h1>

                <div className='w-full'>
                    {/*PC*/}
                    <div className='hidden lg:flex'>
                        <SoloBikesCarousel/>
                    </div>

                    {/*Mobile*/}
                    <div className='flex lg:hidden items-center justify-center'>
                        <SoloBikesDisplay />
                    </div>
                    
                </div>

                <h1 className='font-akagi font-black tracking-wide text-blue text-4xl'>
                    Family Bikes
                </h1>

                <div className='w-full'>
                    {/*PC*/}
                    <div className='hidden lg:flex'>
                        <FamilyBikesCarousel/>
                    </div>

                    {/*Mobile*/}
                    <div className='flex lg:hidden items-center justify-center'>
                        <FamilyBikesDisplay />
                    </div>
                </div>
            </div>
        </>
    )
}

export default LandingBikes