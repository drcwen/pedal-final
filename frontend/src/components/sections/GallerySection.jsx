import "../css/boxModel.css"
import {supabase} from "../../lib/supabase"

import { useEffect, useState } from "react"

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';

function GallerySection() {

    const [photo, setPhoto] = useState([]);

    useEffect(() => {
        const fetchPhotos = async () => {
            const { data, error } = await supabase
                .from("gallery")
                .select("*")

            console.log("DATA:", data)
            console.log("ERROR:", error)

            setPhoto(data || [])
        }

        fetchPhotos()
    }, [])

    return (
        <>
            <div className="box-model bg-navyblue flex flex-col gap-20">
                <h1 className='text-5xl font-akagi text-yellow font-black'>
                    Gallery
                </h1>

                <div className='w-full'>
                    <div className='hidden lg:flex'>
                        <Swiper 
                            navigation={true}
                            modules={[Navigation]}
                            slidesPerView={2}
                            spaceBetween={0}
                            loop={true}
                        >
                            {photo.map((photos) => (
                                <SwiperSlide 
                                    key={photos.id}
                                    className='flex justify-center items-center'
                                >
                                    <div className='flex justify-center items-center w-full'>
                                        <img 
                                            src={photos.image_url}
                                            className='w-120 rounded-3xl border-4 border-blue object-cover'
                                        />
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>

                    {/*Mobile*/}
                    <div className='lg:hidden'>
                        
                    </div>
                </div>
            </div>
        </>
    )
}

export default GallerySection