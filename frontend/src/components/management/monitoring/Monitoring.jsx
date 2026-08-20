import Sidebar from "../sidebar/Sidebar"
import SidebarMobile from "../sidebar/SidebarMobile"
import { useState } from "react";
import { motion } from "motion/react"
import { useEffect, useRef } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

function Monitoring() {

    const mapContainer = useRef(null);
    const map = useRef(null);
    const marker = useRef(null);

    useEffect(() => {

        if (map.current) return;

        map.current = new maplibregl.Map({
            container: mapContainer.current,

            center: [120.9660570,
                14.665017],

            zoom: 14,

            style: {
                version: 8,

                sources: {
                    osm: {
                        type: "raster",
                        tiles: [
                            "https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                        ],
                        tileSize: 256,

                        attribution:
                            "© OpenStreetMap contributors"
                    }
                },

                layers: [
                    {
                        id: "osm",
                        type: "raster",
                        source: "osm"
                    }
                ]
            }
        });

        marker.current = new maplibregl.Marker()
            .setLngLat([
                120.9660570,
                14.665017
            ])
            .addTo(map.current);


        map.current.addControl(
            new maplibregl.NavigationControl(),
            "top-right"
        );

    }, []);

  return (
    <>

        <div className='w-full h-screen md:bg-[#F2F2F2] flex'>
            <Sidebar active={'monitoring'}/>

            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}  
                className='flex-1 p-5'>

                    <SidebarMobile active={'monitoring'}/>
                <div className='grid grid-cols-3 bg-[#ffffff] w-full h-full rounded-xl md:p-10 px-3 z-100 py-7 gap-5 overflow-y-scroll scrollbar-thin scrollbar-thumb-[#B9B9B9] scrollbar-track-[#E2E2E2]'>

                    <div className='col-span-2'>

                    <div
            ref={mapContainer}
            className="w-full h-[500px]"
        />
                        
                    </div>

                    <div className='col-span-1 bg-red-100 rounded-xl'>

                    </div>
                    
                </div>

            </motion.div>
        </div>
    </>
  )
}

export default Monitoring
