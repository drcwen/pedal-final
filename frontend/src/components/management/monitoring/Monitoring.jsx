import Sidebar from "../sidebar/Sidebar"
import { useNavigate, useParams } from "react-router-dom";
import SidebarMobile from "../sidebar/SidebarMobile"
import { useState } from "react";
import { motion } from "motion/react"
import { useEffect, useRef } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { PiGpsFixFill } from "react-icons/pi";
import { setWorkerUrl } from "maplibre-gl";
import maplibreWorkerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import { supabase } from "../../../lib/supabase"

setWorkerUrl(maplibreWorkerUrl);

function Monitoring({ role }) {

    const [ongoing, setOngoing] = useState([]);

    const marker = useRef(null);
    const markers = useRef([]);
    const [mapLoaded, setMapLoaded] = useState(false);

    const navigate = useNavigate();
    const { gpsId } = useParams();

    function getEndTimeOnly(tstzrange) {
        const match = tstzrange.match(/\["[^"]+","([^"]+)"\)/);

        if (!match) return null;

        const utcDate = new Date(
            match[1]
                .replace(" ", "T")
                .replace("+00", "Z")
        );

        return utcDate.toLocaleTimeString("en-PH", {
            timeZone: "Asia/Manila",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    }

    function formatTimeTo12Hour(time) {
        const [hours, minutes, seconds] = time.split(":").map(Number);

        const date = new Date();
        date.setHours(hours, minutes, seconds);

        return date.toLocaleTimeString("en-PH", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    }

    const fetchOngoing = async () => {
            const { data, error } = await supabase
                .from("transactions_mod")
                .select(`
                    *,
                    profile:profiles_mod!transactions_mod_user_id_fkey1 (*),
                    walk_in:walk_ins_users_mod (*),
                    orders_mod (
                        *,
                        bike_types_mod (*),
                        current_bike:bikes_mod!orders_mod_bike_id_fkey (
                            *,
                            bike_types_mod (*)
                        ),
                        original_bike:bikes_mod!orders_mod_initial_bike_id_fkey (
                            *,
                            bike_types_mod (*)
                        ),
                        gps_mod (*),
                        extensions_mod (*)
                    ),
                    assisted_by_profile:profiles_mod!transactions_mod_assisted_by_fkey (*)
                `)
                .eq("status", "started");
    
            if (error) {
                console.error("Error fetching ongoing transactions:", error);
                return;
            }
    
            setOngoing(data ?? []);
        };

    const mapContainer = useRef(null);
    const map = useRef(null);

    const [radiusMeters, setRadiusMeters] = useState(450);

    const pinLocation = [121.07421345160672, 14.7123590730687];

    // Fetch initial radius from database on load to prevent reset on refresh
    useEffect(() => {
        const fetchRadius = async () => {
            const { data, error } = await supabase
                .from("gps_mod")
                .select("geofence_radius")
                .limit(1)
                .single();

            if (!error && data?.geofence_radius) {
                setRadiusMeters(data.geofence_radius);
            }
        };
        fetchRadius();
    }, []);

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

    const updateGeofenceRadius = async (newRadius) => {
        try {
            const { error } = await supabase
                .from("gps_mod")
                .update({ geofence_radius: newRadius })
                .neq("id", 0);

            if (error) {
                console.error("Error updating geofence radius in database:", error);
            } else {
                console.log("Geofence radius updated successfully to:", newRadius);
            }
        } catch (err) {
            console.error("Unexpected error updating geofence radius:", err);
        }
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

        // Wait until MapLibre has finished loading the map.
        mapInstance.on("load", () => {
            setMapLoaded(true);
        });

        mapInstance.addControl(
            new maplibregl.NavigationControl(),
            "top-right"
        );


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
        let isMounted = true;
        let isFetching = false;

        const refreshOngoing = async () => {
            // Prevent overlapping Supabase requests.
            if (isFetching) return;

            isFetching = true;

            try {
                const { data, error } = await supabase
                    .from("transactions_mod")
                    .select(`
                        *,
                        profile:profiles_mod!transactions_mod_user_id_fkey1 (*),
                        walk_in:walk_ins_users_mod (*),
                        orders_mod (
                            *,
                            bike_types_mod (*),
                            current_bike:bikes_mod!orders_mod_bike_id_fkey (
                                *,
                                bike_types_mod (*)
                            ),
                            original_bike:bikes_mod!orders_mod_initial_bike_id_fkey (
                                *,
                                bike_types_mod (*)
                            ),
                            gps_mod (*),
                            extensions_mod (*)
                        ),
                        assisted_by_profile:profiles_mod!transactions_mod_assisted_by_fkey (*)
                    `)
                    .eq("status", "started");

                if (error) {
                    console.error("Error refreshing ongoing transactions:", error);
                    return;
                }

                if (isMounted) {
                    setOngoing(data ?? []);
                }
            } catch (error) {
                console.error("Unexpected monitoring refresh error:", error);
            } finally {
                isFetching = false;
            }
        };

        // Fetch immediately when Monitoring opens.
        refreshOngoing();

        // Fetch updated transactions and GPS coordinates every 5 seconds.
        const intervalId = setInterval(refreshOngoing, 5000);

        return () => {
            isMounted = false;
            clearInterval(intervalId);
        };
    }, []);

    useEffect(() => {
        const mapInstance = map.current;

        if (!mapLoaded || !mapInstance) return;

        // Remove markers from the previous render.
        markers.current.forEach((marker) => marker.remove());
        markers.current = [];

        const bounds = new maplibregl.LngLatBounds();
        let validMarkerCount = 0;
        let focusedCoordinates = null;

        ongoing.forEach((transaction) => {
            const orders = transaction.orders_mod ?? [];

            const customerName = transaction.profile
                ? (
                    transaction.profile.full_name ??
                    `${transaction.profile.first_name ?? ""} ${
                        transaction.profile.last_name ?? ""
                    }`.trim()
                )
                : transaction.walk_in?.[0]?.full_name ?? "Unknown customer";

            // Process EVERY order in each transaction.
            orders.forEach((order) => {
                const gps = Array.isArray(order.gps_mod)
                    ? order.gps_mod[0]
                    : order.gps_mod;

                const longitude = Number(gps?.longitude);
                const latitude = Number(gps?.latitude);

                // Skip only orders without usable coordinates.
                if (
                    gps?.longitude == null ||
                    gps?.latitude == null ||
                    gps.longitude === "" ||
                    gps.latitude === "" ||
                    !Number.isFinite(longitude) ||
                    !Number.isFinite(latitude) ||
                    longitude < -180 ||
                    longitude > 180 ||
                    latitude < -90 ||
                    latitude > 90 ||
                    (longitude === 0 && latitude === 0)
                ) {
                    console.warn("Order has no valid GPS coordinates:", {
                        orderId: order.id,
                        gpsId: order.gps_id,
                        gpsCode: gps?.code,
                    });
                    return;
                }

                if (
                    gpsId &&
                    String(order.gps_id) === String(gpsId)
                ) {
                    focusedCoordinates = [longitude, latitude];
                }

                const bikeCode = order.current_bike?.code ?? "Unknown bike";
                const bikeName =
                    order.bike_types_mod?.name ?? "Unknown bike type";

                // Create a marker label.
                const markerElement = document.createElement("div");
                markerElement.style.cssText = `
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    cursor: pointer;
                `;

                const label = document.createElement("div");
                label.textContent = `${bikeCode} - ${gps?.code ?? "GPS"}`;
                label.style.cssText = `
                    background: white;
                    color: #1e293b;
                    padding: 5px 10px;
                    border-radius: 10px;
                    font-size: 12px;
                    font-weight: 600;
                    white-space: nowrap;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
                    margin-bottom: 6px;
                `;

                const pin = document.createElement("div");
                pin.style.cssText = `
                    width: 18px;
                    height: 18px;
                    background: #E4E017;
                    border: 3px solid white;
                    border-radius: 50%;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.4);
                `;

                markerElement.append(label, pin);

                // Create the marker popup.
                const popupContent = document.createElement("div");

                const title = document.createElement("strong");
                title.textContent = `${bikeCode} - ${bikeName}`;

                const customer = document.createElement("p");
                customer.textContent = `Customer: ${customerName}`;

                const gpsLabel = document.createElement("p");
                gpsLabel.textContent = `GPS: ${gps?.code ?? "No GPS"}`;

                popupContent.append(title, customer, gpsLabel);

                const popup = new maplibregl.Popup({ offset: 15 })
                    .setDOMContent(popupContent);

                // Add a marker for THIS order.
                const bikeMarker = new maplibregl.Marker({
                    element: markerElement,
                    anchor: "bottom",
                })
                    .setLngLat([longitude, latitude])
                    .setPopup(popup)
                    .addTo(mapInstance);

                markers.current.push(bikeMarker);

                // Include every marker in the map bounds.
                bounds.extend([longitude, latitude]);
                validMarkerCount++;

                console.log("Added order marker:", {
                    orderId: order.id,
                    gpsId: order.gps_id,
                    gpsCode: gps?.code,
                    longitude,
                    latitude,
                });
            });
        });

        if (gpsId) {
            if (focusedCoordinates) {
                mapInstance.flyTo({
                    center: focusedCoordinates,
                    zoom: 17,
                    duration: 800,
                    essential: true,
                });
            } else if (validMarkerCount > 0) {
                console.warn(
                    `GPS ID ${gpsId} was not found among the fetched orders or has no valid coordinates.`
                );

                mapInstance.fitBounds(bounds, {
                    padding: 80,
                    maxZoom: 15,
                    duration: 800,
                });
            }
        } else if (validMarkerCount === 1) {
            mapInstance.flyTo({
                center: bounds.getCenter(),
                zoom: 15,
                essential: true,
            });
        } else if (validMarkerCount > 1) {
            mapInstance.fitBounds(bounds, {
                padding: 80,
                maxZoom: 15,
                duration: 800,
            });
        }

        console.log("Total order markers displayed:", validMarkerCount);

        return () => {
            markers.current.forEach((marker) => marker.remove());
            markers.current = [];
        };
    }, [ongoing, mapLoaded, gpsId]);

    console.log(ongoing);

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
            <Sidebar active="monitoring" userRole={role} />

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
                                            // Save to database when user finishes typing or leaves the input field
                                            onBlur={(e) => updateGeofenceRadius(Number(e.target.value))}
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
                                        // Save to database only after the user drops/releases the slider handle
                                        onMouseUp={(e) => updateGeofenceRadius(Number(e.target.value))}
                                        onTouchEnd={(e) => updateGeofenceRadius(Number(e.target.value))}
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

                                    {ongoing.map((startBikes) => {
                                        const customerName = startBikes.profile
                                            ? (
                                                startBikes.profile.full_name ??
                                                `${startBikes.profile.first_name ?? ""} ${startBikes.profile.last_name ?? ""}`.trim()
                                            )
                                            : startBikes.walk_in?.[0]?.full_name;

                                        const orders = startBikes.orders_mod ?? [];

                                        return orders.map((order) => (
                                            <div
                                                    key={`${startBikes.id}-${order.id}`}
                                                    onClick={() => {
                                                        if (order.gps_id != null) {
                                                            navigate(`/monitoring/${order.gps_id}`);
                                                        }
                                                    }}
                                                    className={`w-full rounded-xl bg-gray/15 p-2 border border-gray/20 grid grid-cols-[40px_1fr] gap-3 items-start transition-colors ${
                                                        order.gps_id != null
                                                            ? "cursor-pointer hover:bg-blue/10"
                                                            : "cursor-not-allowed opacity-60"
                                                    }`}
                                                >
                                            
                                                <div className="bg-yellow p-1 w-fit rounded-lg">
                                                    <img
                                                        src={order.bike_types_mod?.image_url}
                                                        alt={order.bike_types_mod?.name ?? "Bike"}
                                                        className="w-8"
                                                    />
                                                </div>

                                                <div className="flex flex-col">
                                                    <div className="flex gap-2">
                                                        <h1 className="text-gray">
                                                            {order.bike_types_mod?.name}
                                                        </h1>

                                                        <h1 className="text-gray font-medium">
                                                            {order.current_bike?.code ?? "No bike code"}
                                                        </h1>
                                                    </div>

                                                    <div>
                                                        <h1 className="text-gray font-medium">
                                                            {formatTimeTo12Hour(order.start_time)} - {getEndTimeOnly(order.reservation_range)}
                                                        </h1>
                                                    </div>

                                                    <div className="pb-1">
                                                        <h1 className="text-gray font-medium">
                                                            {customerName}
                                                        </h1>
                                                    </div>

                                                    <div className="px-2 py-0.5 rounded-lg bg-blue w-fit flex gap-2 items-center">
                                                        <PiGpsFixFill className="text-xs text-white" />

                                                        <h1 className="text-xs font-medium text-[#ffffff]">
                                                            {order?.gps_mod?.code ?? "No GPS"}
                                                        </h1>
                                                    </div>
                                                </div>
                                            </div>
                                        ));
                                    })}
                                    
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