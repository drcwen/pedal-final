import BikeCard from "../layout/bikes/BikeCard"
import { supabase } from "../../lib/supabase"
import { useEffect, useState } from "react"

import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';


function LandingBikes() {

    const [info, setInfo] = useState([]);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 3
    };

    const fetchBikes = async () => {
    const { data, error } = await supabase
        .from("bike_types")
        .select("*")

        console.log("DATA:", data)
        console.log("ERROR:", error)

        setInfo(data)
    }

    useEffect(() => {
        fetchBikes()
    }, [])

    return (
        <>
            <div className='min-h-screen bg-[#F7F7F7] md:py-25 md:px-30 md:flex md:flex-col md:gap-20 justify-center'>
                
                <h1 className='font-akagi font-black tracking-wide text-blue text-4xl'>
                    Solo Bikes
                </h1>

                <div className='w-full'>
                    <Swiper navigation={true} modules={[Navigation]} className="mySwiper" slidesPerView={3} spaceBetween={20} loop={true}>

                        {info.map((bike) => (
                            <SwiperSlide>
                                <div key={bike.type_id} className="px-3">
                                    <BikeCard bike={bike} />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                <h1 className='font-akagi font-black tracking-wide text-blue text-4xl'>
                    Family Bikes
                </h1>

                <Swiper navigation={true} modules={[Navigation]} className="mySwiper" slidesPerView={3} spaceBetween={20}>

                    {info.map((bike) => (
                        <SwiperSlide>
                            <div key={bike.type_id} className="px-3">
                                <BikeCard bike={bike} />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

            </div>
        </>
    )
}

export default LandingBikes