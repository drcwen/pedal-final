import Sidebar from "../sidebar/Sidebar"
import SidebarMobile from "../sidebar/SidebarMobile"
import { useState } from "react";
import { motion } from "motion/react"
import { useEffect, useRef } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { PiGpsFixFill } from "react-icons/pi";
import { setWorkerUrl } from "maplibre-gl";
import maplibreWorkerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";

setWorkerUrl(maplibreWorkerUrl);

function Monitoring() {

    const mapContainer = useRef(null);
    const map = useRef(null);
    const marker = useRef(null);

    const [radiusMeters, setRadiusMeters] = useState(450);

    const pinLocation = [121.07421345160672, 14.7123590730687];

    const createGeofenceCircle = (center, radiusMeters) => {
        const [longitude, latitude] = center;
        const earthRadius = 6371008.8;
        const coordinates = [];

        for (let i = 0; i <= 128; i++) {
            const bearing = (i / 128) * 2 * Math.PI;
            const angularDistance = radiusMeters / earthRadius;

            const lat1 = (latitude * Math.PI) / 180;
            const lon1 = (longitude * Math.PI) / 180;

            const lat2 = Math.asin(
                Math.sin(lat1) * Math.cos(angularDistance) +
                Math.cos(lat1) * Math.sin(angularDistance) *
                Math.cos(bearing)
            );

            const lon2 = lon1 + Math.atan2(
                Math.sin(bearing) * Math.sin(angularDistance) *
                Math.cos(lat1),
                Math.cos(angularDistance) -
                Math.sin(lat1) * Math.sin(lat2)
            );

            coordinates.push([
                (lon2 * 180) / Math.PI,
                (lat2 * 180) / Math.PI,
            ]);
        }

        return {
            type: "Feature",
            properties: { radius: radiusMeters },
            geometry: {
                type: "Polygon",
                coordinates: [coordinates],
            },
        };
    };

    useEffect(() => {
        if (!mapContainer.current || map.current) return;

        const mapInstance = new maplibregl.Map({
            container: mapContainer.current,
            center: pinLocation,
            zoom: 14,
            style: {
                version: 8,
                sources: {
                    osm: {
                        type: "raster",
                        tiles: [
                            "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
                        ],
                        tileSize: 256,
                        attribution: "© OpenStreetMap contributors",
                    },
                    geofence: {
                        type: "geojson",
                        data: createGeofenceCircle(pinLocation, radiusMeters),
                    },
                },
                layers: [
                    {
                        id: "osm",
                        type: "raster",
                        source: "osm",
                    },
                    {
                        id: "geofence-fill",
                        type: "fill",
                        source: "geofence",
                        paint: {
                            "fill-color": "#078BF4",
                            "fill-opacity": 0.3,
                        },
                    },
                    {
                        id: "geofence-outline",
                        type: "line",
                        source: "geofence",
                        paint: {
                            "line-color": "#078BF4",
                            "line-width": 4,
                        },
                    },
                ],
            },
        });

        map.current = mapInstance;

        mapInstance.addControl(
            new maplibregl.NavigationControl(),
            "top-right"
        );

        mapInstance.on("load", () => {
            // Create the marker element
            const markerElement = document.createElement("div");

            markerElement.style.display = "flex";
            markerElement.style.flexDirection = "column";
            markerElement.style.alignItems = "center";

            // Name above the pin
            const nameElement = document.createElement("div");

            nameElement.textContent = "J1";
            nameElement.style.background = "#ffffff";
            nameElement.style.color = "#1e293b";
            nameElement.style.padding = "5px 10px";
            nameElement.style.borderRadius = "10px";
            nameElement.style.fontSize = "12px";
            nameElement.style.fontWeight = "600";
            nameElement.style.whiteSpace = "nowrap";
            nameElement.style.boxShadow = "0 2px 6px rgba(0,0,0,0.2)";
            nameElement.style.marginBottom = "6px";

            // Yellow pin
            const pinElement = document.createElement("div");

            pinElement.style.width = "18px";
            pinElement.style.height = "18px";
            pinElement.style.background = "#E4E017";
            pinElement.style.border = "3px solid white";
            pinElement.style.borderRadius = "100%";
            pinElement.style.boxShadow = "0 2px 6px rgba(0,0,0,0.4)";

            markerElement.appendChild(nameElement);
            markerElement.appendChild(pinElement);

            marker.current = new maplibregl.Marker({
                element: markerElement,
                anchor: "bottom",
            })
                .setLngLat([121.075, 14.713])
                .setPopup(
                    new maplibregl.Popup().setText("J1")
                )
                .addTo(mapInstance);

        });

        mapInstance.on("error", (event) => {
            console.error("MapLibre error:", event.error);
        });

        const resizeObserver = new ResizeObserver(() => {
            mapInstance.resize();
        });

        resizeObserver.observe(mapContainer.current);

        return () => {
            resizeObserver.disconnect();

            if (marker.current) {
                marker.current.remove();
                marker.current = null;
            }

            mapInstance.remove();
            map.current = null;
        };
    }, []);

    useEffect(() => {
        const mapInstance = map.current;
        if (!mapInstance) return;

        const updateGeofence = () => {
            const source = mapInstance.getSource("geofence");

            if (!source) {
                console.error("Geofence source was not found.");
                return;
            }

            source.setData(
                createGeofenceCircle(pinLocation, radiusMeters)
            );

            const latitudeOffset = radiusMeters / 110540;
            const longitudeOffset =
                radiusMeters /
                (111320 * Math.cos(pinLocation[1] * Math.PI / 180));

            mapInstance.fitBounds(
                [
                    [
                        pinLocation[0] - longitudeOffset,
                        pinLocation[1] - latitudeOffset,
                    ],
                    [
                        pinLocation[0] + longitudeOffset,
                        pinLocation[1] + latitudeOffset,
                    ],
                ],
                {
                    padding: 60,
                    maxZoom: 16,
                    duration: 200,
                }
            );
        };

        if (mapInstance.isStyleLoaded()) {
            updateGeofence();
        } else {
            mapInstance.once("load", updateGeofence);
        }
    }, [radiusMeters]);

  return (
    <>
        <div className='w-full h-screen md:h-screen md:bg-[#F2F2F2] flex'>
            <Sidebar active={'monitoring'}/>

            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}  
                className='flex-1 min-w-0 min-h-0 p-3 md:p-5'
            >
                    <SidebarMobile active={'monitoring'}/>

                    <div className='flex flex-col w-full font-akagi font-bold text-blue rounded-xl bg-[#ffffff] h-full md:p-10 px-3 z-100 py-7 gap-5 overflow-y-auto scrollbar-thin scrollbar-thumb-[#B9B9B9] scrollbar-track-[#E2E2E2]'>
                        <h1 className='md:text-4xl text-2xl tracking-wide'>Monitoring</h1>
                        
                        <div className='flex flex-col md:grid md:grid-cols-3 w-full gap-5 md:flex-1 md:min-h-0'>

                            {/* Map and editable geofence radius */}
                            <div className="relative w-full h-[400px] md:h-full md:col-span-2 min-h-0">
                                <div
                                    ref={mapContainer}
                                    className="absolute inset-0 w-full h-full rounded-xl overflow-hidden border-4 border-gray/20"
                                />

                                {/* Radius editor */}
                                <div className="absolute top-3 left-3 z-10 bg-white rounded-xl shadow-lg p-3 flex flex-col gap-2 w-[220px]">
                                    <label className="text-sm font-bold text-blue">
                                        Geofence Radius
                                    </label>

                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            min="50"
                                            max="5000"
                                            step="50"
                                            value={radiusMeters}
                                            onChange={(e) => {
                                                const value = e.target.value;

                                                if (value === "") return;

                                                const number = Number(value);

                                                if (
                                                    Number.isFinite(number) &&
                                                    number >= 50 &&
                                                    number <= 5000
                                                ) {
                                                    setRadiusMeters(number);
                                                }
                                            }}
                                            className="w-full min-w-0 rounded-lg border border-gray/30 px-3 py-2 text-blue outline-none focus:border-blue"
                                        />

                                        <span className="text-sm text-gray">meters</span>
                                    </div>

                                    <input
                                        type="range"
                                        min="50"
                                        max="5000"
                                        step="50"
                                        value={radiusMeters}
                                        onChange={(e) => setRadiusMeters(Number(e.target.value))}
                                        className="w-full accent-blue"
                                    />

                                    <p className="text-xs font-medium text-gray">
                                        Radius: {radiusMeters.toLocaleString()} m
                                    </p>
                                </div>
                            </div>

                            {/* Right panel */}
                            <div className='w-full h-[500px]  px-4 py-7 md:h-full md:col-span-1 bg-gray/10 rounded-xl flex flex-col gap-4 overflow-y-auto scrollbar-thin scrollbar-thumb-[#B9B9B9] scrollbar-track-[#E2E2E2]'>
                                <h1 className='text-xl'>Ongoing Bikes</h1>

                                <div className='w-full flex flex-col gap-2'>
                                    {/* Repeatable bike card item (Fixed className typos from "classname" to "className") */}
                                    <div className='w-full rounded-xl bg-gray/15 p-2 border border-gray/20 grid grid-cols-[40px_1fr] gap-3 items-start'>
                                        <div className='bg-yellow p-1 w-fit rounded-lg'>
                                            <img src='https://res.cloudinary.com/dp3vkgxtb/image/upload/v1775884918/solo_bike_mhxxvb.png' className='w-8'/>
                                        </div>

                                        <div className='flex flex-col'>
                                            <div className='flex gap-2'>
                                                <h1 className='text-gray'>Mountain Bike</h1>
                                                <h1 className='text-gray font-medium'>J1</h1>
                                            </div>

                                            <div className=''>
                                                <h1 className='text-gray font-medium'>10:30 AM - 11:30 AM</h1>
                                            </div>

                                            <div className='pb-1'>
                                                <h1 className='text-gray font-medium'>Hazel Bisnar</h1>
                                            </div>
                                            
                                            <div className='px-2 py-0.5 rounded-lg bg-blue w-fit flex gap-2 items-center'>
                                                <PiGpsFixFill className='text-xs text-[#ffffff]'/>
                                                <h1 className='text-xs font-medium text-[#ffffff]'>jipies6</h1>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

            </motion.div>
        </div>
    </>
  )
}

export default Monitoring