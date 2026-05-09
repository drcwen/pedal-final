import BikeCard from "./BikeCard"
import { supabase } from "../../../lib/supabase"
import { useEffect, useState } from "react"

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';

function FamilyBikesCarousel() {

    const [info, setInfo] = useState([]);

    useEffect(() => {
        const fetchBikes = async () => {
            const { data, error } = await supabase
                .from("bike_types")
                .select("*")
                .eq("type_isSolo", false)

            console.log("DATA:", data)
            console.log("ERROR:", error)

            setInfo(data || [])
        }

        fetchBikes()
    }, [])

    return (
        <div className="w-full">

            <Swiper
                navigation={true}
                modules={[Navigation]}
                slidesPerView={3}
                spaceBetween={50}
                loop={true}
            >
                {info.map((bike) => (
                    <SwiperSlide key={bike.type_id}>
                        <BikeCard bike={bike} />
                    </SwiperSlide>
                ))}
            </Swiper>

        </div>
    )
}

export default FamilyBikesCarousel