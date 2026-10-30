import Sidebar from "../sidebar/Sidebar";
import { useNavigate, useParams } from "react-router-dom";
import SidebarMobile from "../sidebar/SidebarMobile";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { PiGpsFixFill } from "react-icons/pi";
import { setWorkerUrl } from "maplibre-gl";
import maplibreWorkerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import { supabase } from "../../../lib/supabase";

setWorkerUrl(maplibreWorkerUrl);

function Monitoring({ role }) {

    const [ongoing, setOngoing] = useState([]);
    const markers = useRef([]);
    const [mapLoaded, setMapLoaded] = useState(false);

    // Track selected bike locally so panning away doesn't constantly re-trigger focus
    const [selectedGpsId, setSelectedGpsId] = useState(null);

    // Toggle state for editing geofence
    const [isEditingGeofence, setIsEditingGeofence] = useState(false);

    const navigate = useNavigate();
    const { gpsId } = useParams();

    // Keep the selected bike synchronized with the URL.
    useEffect(() => {
        setSelectedGpsId(gpsId || null);
    }, [gpsId]);

    function getEndTimeOnly(tstzrange) {
        if (!tstzrange) return null;

        const match = tstzrange.match(/\["[^"]+","([^"]+)"\)/);

        if (!match) return null;

        const utcDate = new Date(
            match[1].replace(" ", "T").replace("+00", "Z")
        );

        return utcDate.toLocaleTimeString("en-PH", {
            timeZone: "Asia/Manila",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    }

    function formatTimeTo12Hour(time) {
        if (!time) return "";

        const [hours, minutes, seconds] = time.split(":").map(Number);
        const date = new Date();

        date.setHours(hours, minutes, seconds);

        return date.toLocaleTimeString("en-PH", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    }

    function formatLastSeen(timestamp) {
        if (!timestamp) return "No signal";

        const date = new Date(timestamp);

        if (isNaN(date.getTime())) return "No signal";

        return date.toLocaleTimeString("en-PH", {
            timeZone: "Asia/Manila",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
        });
    }

    const mapContainer = useRef(null);
    const map = useRef(null);

    const [radiusMeters, setRadiusMeters] = useState(450);

    // Geofence coordinates are loaded from Supabase; no hardcoded fallback.
    const [pinLocation, setPinLocation] = useState(null);
    const [geofenceLoaded, setGeofenceLoaded] = useState(false);

    // Determine whether a GPS point is outside the currently configured geofence.
    const isGpsOutOfBounds = (gps) => {
        if (!gps || !pinLocation) return false;

        const longitude = Number(gps.longitude);
        const latitude = Number(gps.latitude);

        if (
            gps.longitude == null ||
            gps.latitude == null ||
            !Number.isFinite(longitude) ||
            !Number.isFinite(latitude) ||
            (longitude === 0 && latitude === 0)
        ) {
            return false;
        }

        const toRadians = (degrees) => (degrees * Math.PI) / 180;

        const [centerLongitude, centerLatitude] = pinLocation;

        const earthRadiusMeters = 6371008.8;

        const latitudeDifference = toRadians(latitude - centerLatitude);
        const longitudeDifference = toRadians(longitude - centerLongitude);

        const haversine =
            Math.sin(latitudeDifference / 2) ** 2 +
            Math.cos(toRadians(centerLatitude)) *
            Math.cos(toRadians(latitude)) *
            Math.sin(longitudeDifference / 2) ** 2;

        const distanceMeters =
            2 *
            earthRadiusMeters *
            Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));

        return distanceMeters > radiusMeters;
    };

    // Count unique GPS-equipped bikes that are currently in started transactions.
    const outOfBoundsBikeIds = new Set();

    ongoing.forEach((transaction) => {
        (transaction.orders_mod ?? []).forEach((order) => {
            const gps = Array.isArray(order.gps_mod)
                ? order.gps_mod[0]
                : order.gps_mod;

            const bikeGpsId = order.gps_id ?? gps?.id;

            if (bikeGpsId != null && isGpsOutOfBounds(gps)) {
                outOfBoundsBikeIds.add(String(bikeGpsId));
            }
        });
    });

    const outOfBoundsCount = outOfBoundsBikeIds.size;

    // Tracks the last bike focused by an explicit selection.
    const lastFocusedGpsId = useRef(null);

    // Keep active editing state updated on window for map click handlers.
    useEffect(() => {
        window._isEditingGeofenceRef = isEditingGeofence;

        return () => {
            delete window._isEditingGeofenceRef;
        };
    }, [isEditingGeofence]);

    // Function to center map on geofence exactly like the Recenter button.
    const centerOnGeofence = (mapInstance, centerCoords, radius) => {
        if (!mapInstance) return;

        const latitudeOffset = radius / 110540;

        const longitudeOffset =
            radius /
            (111320 * Math.cos((centerCoords[1] * Math.PI) / 180));

        mapInstance.fitBounds(
            [
                [
                    centerCoords[0] - longitudeOffset,
                    centerCoords[1] - latitudeOffset,
                ],
                [
                    centerCoords[0] + longitudeOffset,
                    centerCoords[1] + latitudeOffset,
                ],
            ],
            {
                padding: 60,
                maxZoom: 15,
                duration: 800,
            }
        );
    };

    // Fetch the geofence settings before creating the map.
    useEffect(() => {
        let isMounted = true;

        const fetchGeofenceSettings = async () => {
            try {
                // Use a deterministic row because the geofence settings are
                // stored in gps_mod alongside the GPS device records.
                const { data, error } = await supabase
                    .from("gps_mod")
                    .select("geofence_radius, center_longitude, center_latitude")
                    .not("center_longitude", "is", null)
                    .not("center_latitude", "is", null)
                    .order("id", { ascending: true })
                    .limit(1)
                    .maybeSingle();

                if (error) {
                    console.error("Error fetching geofence settings:", error);
                    return;
                }

                if (
                    !data ||
                    data.center_longitude == null ||
                    data.center_latitude == null
                ) {
                    console.error(
                        "Geofence center coordinates are missing in gps_mod."
                    );
                    return;
                }

                const longitude = Number(data.center_longitude);
                const latitude = Number(data.center_latitude);
                const fetchedRadius = Number(data.geofence_radius);

                const validRadius =
                    Number.isFinite(fetchedRadius) && fetchedRadius > 0
                        ? fetchedRadius
                        : 450;

                if (
                    !Number.isFinite(longitude) ||
                    !Number.isFinite(latitude) ||
                    longitude < -180 ||
                    longitude > 180 ||
                    latitude < -90 ||
                    latitude > 90
                ) {
                    console.error("Invalid geofence center coordinates:", data);
                    return;
                }

                if (!isMounted) return;

                setRadiusMeters(validRadius);
                setPinLocation([longitude, latitude]);
                setGeofenceLoaded(true);

                console.log("Geofence settings loaded:", {
                    center: [longitude, latitude],
                    radius: validRadius,
                });

            } catch (err) {
                console.error("Unexpected geofence fetch error:", err);
            }
        };

        fetchGeofenceSettings();

        return () => {
            isMounted = false;
        };
    }, []);

    // Create the geofence circle.
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
                Math.cos(lat1) * Math.sin(angularDistance) * Math.cos(bearing)
            );

            const lon2 =
                lon1 +
                Math.atan2(
                    Math.sin(bearing) *
                    Math.sin(angularDistance) *
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

    // Save geofence settings to Supabase.
    const updateGeofenceInDB = async (customRadius, customCenter) => {
        try {
            if (!pinLocation && !customCenter) {
                console.error(
                    "Cannot save geofence: center coordinates are not loaded."
                );
                return;
            }

            const payload = {};

            const rToSave =
                customRadius !== undefined ? customRadius : radiusMeters;

            const cToSave =
                customCenter !== undefined ? customCenter : pinLocation;

            payload.geofence_radius = rToSave;
            payload.center_longitude = cToSave[0];
            payload.center_latitude = cToSave[1];

            const { error } = await supabase
                .from("gps_mod")
                .update(payload)
                .neq("id", 0);

            if (error) {
                console.error("Error updating geofence settings:", error);
            } else {
                console.log("Geofence saved to database");
            }

        } catch (err) {
            console.error("Unexpected error saving geofence:", err);
        }
    };

    // Initialize the map only after the actual geofence has been fetched.
    useEffect(() => {
        if (
            !geofenceLoaded ||
            !pinLocation ||
            !mapContainer.current ||
            map.current
        ) {
            return;
        }

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

        mapInstance.on("load", () => {
            setMapLoaded(true);

            // Same fitBounds behavior used by the Recenter button.
            // This runs on every fresh page load / browser refresh.
            centerOnGeofence(mapInstance, pinLocation, radiusMeters);
        });

        // Click the map to reposition the geofence while editing.
        mapInstance.on("click", (e) => {
            if (!window._isEditingGeofenceRef) return;

            setPinLocation([e.lngLat.lng, e.lngLat.lat]);
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
            mapInstance.remove();
            map.current = null;
        };

        // Intentionally initialize once, after geofenceLoaded becomes true.
        // Including pinLocation/radiusMeters would recreate the map during edits.
    }, [geofenceLoaded]);

    // Fetch ongoing transactions periodically.
    useEffect(() => {
        let isMounted = true;
        let isFetching = false;

        const refreshOngoing = async () => {
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
                    console.error(
                        "Error refreshing ongoing transactions:",
                        error
                    );
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

        refreshOngoing();

        const intervalId = setInterval(refreshOngoing, 5000);

        return () => {
            isMounted = false;
            clearInterval(intervalId);
        };
    }, []);

    // Render markers without overriding manual map pans.
    useEffect(() => {
        const mapInstance = map.current;

        if (!mapLoaded || !mapInstance) return;

        markers.current.forEach((marker) => marker.remove());
        markers.current = [];

        let targetCoordinates = null;

        ongoing.forEach((transaction) => {
            const orders = transaction.orders_mod ?? [];

            const customerName = transaction.profile
                ? (
                    transaction.profile.full_name ??
                    `${transaction.profile.first_name ?? ""} ${transaction.profile.last_name ?? ""}`.trim()
                )
                : transaction.walk_in?.[0]?.full_name ?? "Unknown customer";

            orders.forEach((order) => {
                const gps = Array.isArray(order.gps_mod)
                    ? order.gps_mod[0]
                    : order.gps_mod;

                const longitude = Number(gps?.longitude);
                const latitude = Number(gps?.latitude);

                if (
                    gps?.longitude == null ||
                    gps?.latitude == null ||
                    !Number.isFinite(longitude) ||
                    !Number.isFinite(latitude) ||
                    (longitude === 0 && latitude === 0)
                ) {
                    return;
                }

                if (
                    selectedGpsId &&
                    String(order.gps_id) === String(selectedGpsId)
                ) {
                    targetCoordinates = [longitude, latitude];
                }

                const isOutOfBounds = isGpsOutOfBounds(gps);

                const bikeCode = order.current_bike?.code ?? "Unknown bike";
                const bikeName = order.bike_types_mod?.name ?? "Unknown bike type";

                const markerElement = document.createElement("div");

                markerElement.style.cssText = `
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    cursor: pointer;
                `;

                const label = document.createElement("div");

                label.textContent = `${bikeCode}\n${gps?.code ?? "GPS"}`;

                label.style.cssText = `
                    background: ${isOutOfBounds ? "#dc2626" : "white"};
                    color: ${isOutOfBounds ? "white" : "#1e293b"};
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
                    background: ${isOutOfBounds ? "#dc2626" : "#E4E017"};
                    border: 3px solid white;
                    border-radius: 50%;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.4);
                `;

                markerElement.append(label, pin);

                const popupContent = document.createElement("div");

                const title = document.createElement("strong");
                title.textContent = `${bikeCode}\n${bikeName}`;

                const customer = document.createElement("p");
                customer.textContent = `Customer: ${customerName}`;

                const gpsLabel = document.createElement("p");
                gpsLabel.textContent = `GPS: ${gps?.code ?? "No GPS"}`;

                const boundaryStatus = document.createElement("p");

                boundaryStatus.textContent = isOutOfBounds
                    ? "STATUS: OUT OF BOUNDS"
                    : "Status: Within geofence";

                boundaryStatus.style.color = isOutOfBounds
                    ? "#dc2626"
                    : "#15803d";

                boundaryStatus.style.fontWeight = "700";

                popupContent.append(
                    title,
                    customer,
                    gpsLabel,
                    boundaryStatus
                );

                const popup = new maplibregl.Popup({ offset: 15 })
                    .setDOMContent(popupContent);

                const bikeMarker = new maplibregl.Marker({
                    element: markerElement,
                    anchor: "bottom",
                })
                    .setLngLat([longitude, latitude])
                    .setPopup(popup)
                    .addTo(mapInstance);

                markers.current.push(bikeMarker);
            });
        });

        // Focus only when a different bike is explicitly selected.
        // Periodic data refreshes must never override manual map movement.
        if (
            selectedGpsId &&
            targetCoordinates &&
            String(selectedGpsId) !== String(lastFocusedGpsId.current)
        ) {
            mapInstance.flyTo({
                center: targetCoordinates,
                zoom: 17,
                duration: 800,
                essential: true,
            });

            lastFocusedGpsId.current = String(selectedGpsId);
        }

        // Allow the same bike to be selected again after clearing selection.
        if (!selectedGpsId) {
            lastFocusedGpsId.current = null;
        }

        return () => {
            markers.current.forEach((marker) => marker.remove());
            markers.current = [];
        };

    }, [ongoing, mapLoaded, selectedGpsId, pinLocation, radiusMeters]);

    // Redraw geofence circle visually when state changes.
    useEffect(() => {
        const mapInstance = map.current;

        if (!mapInstance || !pinLocation) return;

        const updateGeofence = () => {
            const source = mapInstance.getSource("geofence");

            if (!source) return;

            source.setData(createGeofenceCircle(pinLocation, radiusMeters));
        };

        if (mapInstance.isStyleLoaded()) {
            updateGeofence();
        } else {
            mapInstance.once("load", updateGeofence);
        }

    }, [radiusMeters, pinLocation]);

    return (
        <>
            <div className="w-full h-screen md:h-screen md:bg-[#F2F2F2] flex">

                <Sidebar
                    active="monitoring"
                    userRole={role}
                />

                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="flex-1 min-w-0 min-h-0 p-3 md:p-5"
                >

                    <SidebarMobile
                        active="monitoring"
                        outOfBoundsCount={outOfBoundsCount}
                    />

                    <div className="flex flex-col w-full font-akagi font-bold text-blue rounded-xl bg-[#ffffff] h-full md:p-10 px-3 z-100 py-7 gap-5 overflow-y-auto scrollbar-thin scrollbar-thumb-[#B9B9B9] scrollbar-track-[#E2E2E2]">

                        <h1 className="md:text-4xl text-2xl tracking-wide">
                            Monitoring
                        </h1>

                        <div className="flex flex-col md:grid md:grid-cols-3 w-full gap-5 md:flex-1 md:min-h-0">

                            {/* Map Container */}
                            <div className="relative w-full h-[400px] md:h-full md:col-span-2 min-h-0">
                                <div
                                    ref={mapContainer}
                                    className="absolute inset-0 w-full h-full rounded-xl overflow-hidden border-4 border-gray/25"
                                />
                            </div>

                            {/* Right panel (Ongoing Bikes + Geofence Editor) */}
                            <div className="w-full h-auto md:h-full md:col-span-1 bg-gray/10 rounded-xl flex flex-col gap-4 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-[#B9B9B9] scrollbar-track-[#E2E2E2]">

                                <h1 className="text-xl">Ongoing Bikes</h1>

                                <div className="w-full flex flex-col gap-2">

                                    {(() => {
                                    // Convert transactions into a single list of bike orders.
                                    const allOngoingBikes = ongoing.flatMap((startBikes) => {
                                        const customerName = startBikes.profile
                                            ? (
                                                startBikes.profile.full_name ??
                                                `${startBikes.profile.first_name ?? ""} ${startBikes.profile.last_name ?? ""}`.trim()
                                            )
                                            : startBikes.walk_in?.[0]?.full_name ?? "Unknown customer";

                                        return (startBikes.orders_mod ?? []).map((order) => {
                                            const gpsData = Array.isArray(order.gps_mod)
                                                ? order.gps_mod[0]
                                                : order.gps_mod;

                                            return {
                                                transactionId: startBikes.id,
                                                order,
                                                gpsData,
                                                customerName,
                                                isOutOfBounds: isGpsOutOfBounds(gpsData),
                                                isSelected:
                                                    selectedGpsId != null &&
                                                    String(order.gps_id) === String(selectedGpsId),
                                            };
                                        });
                                    });

                                    // Sort: Out-of-bounds bikes first.
                                    const sortedOngoingBikes = [...allOngoingBikes].sort(
                                        (a, b) => Number(b.isOutOfBounds) - Number(a.isOutOfBounds)
                                    );

                                    return sortedOngoingBikes.map((bike) => {
                                        const {
                                            transactionId,
                                            order,
                                            gpsData,
                                            customerName,
                                            isOutOfBounds,
                                            isSelected,
                                        } = bike;

                                        return (
                                            <div
                                                key={`${transactionId}-${order.id}`}
                                                onClick={() => {
                                                    if (order.gps_id != null) {
                                                        setSelectedGpsId(order.gps_id);
                                                        navigate(`/monitoring/${order.gps_id}`);
                                                    }
                                                }}
                                                className={`w-full rounded-xl p-2 border grid grid-cols-[40px_1fr] gap-3 items-start transition-all duration-200 ${
                                                    isSelected
                                                        ? "bg-blue/10 border-blue ring-2 ring-blue/20 shadow-md"
                                                        : isOutOfBounds
                                                            ? "bg-red-50 border-red-500"
                                                            : "bg-gray/15 border-gray/20"
                                                } ${
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
                                                    <div className="flex flex-wrap gap-2 items-center">
                                                        <h1 className="text-gray">
                                                            {order.bike_types_mod?.name}
                                                        </h1>

                                                        <h1 className={`font-medium ${isSelected ? "text-blue" : "text-gray"}`}>
                                                            {order.current_bike?.code ?? "No bike code"}
                                                        </h1>

                                                    </div>

                                                    <div>
                                                        <h1 className="text-gray font-medium">
                                                            {formatTimeTo12Hour(order.start_time)}{" "}
                                                            {getEndTimeOnly(order.reservation_range)}
                                                        </h1>
                                                    </div>

                                                    <div className="pb-1">
                                                        <h1 className="text-gray font-medium">
                                                            {customerName}
                                                        </h1>
                                                    </div>

                                                    <div className="flex flex-wrap gap-2 items-center">
                                                        <div className="px-2 py-0.5 rounded-lg bg-blue w-fit flex gap-2 items-center">
                                                            <PiGpsFixFill className="text-xs text-white" />

                                                            <h1 className="text-xs font-medium text-[#ffffff]">
                                                                {gpsData?.code ?? "No GPS"}
                                                            </h1>
                                                        </div>

                                                        <span className="text-[11px] text-gray font-medium">
                                                            Seen: {formatLastSeen(gpsData?.updated_at)}
                                                        </span>

                                                        {isOutOfBounds && (
                                                            <span className="text-[10px] font-bold text-red-700 bg-red-100 border border-red-300 rounded-full px-2 py-0.5">
                                                                OUT OF BOUNDS
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    });
                                })()}

                                </div>

                                <hr className="border-gray/20 my-2" />

                                {/* Geofence Editor */}
                                <div className="bg-white rounded-xl shadow-lg p-3 flex flex-col gap-3 w-full">

                                    <div className="flex justify-between items-center">

                                        <h2 className="text-sm font-bold text-blue">
                                            Geofence Settings
                                        </h2>

                                        {!isEditingGeofence ? (
                                            <button
                                                onClick={() => setIsEditingGeofence(true)}
                                                className="text-xs bg-blue/10 text-blue px-2.5 py-1 rounded-md hover:bg-blue/20 transition font-medium"
                                            >
                                                Edit Geofence
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => {
                                                    setIsEditingGeofence(false);
                                                    updateGeofenceInDB(radiusMeters, pinLocation);
                                                }}
                                                className="text-xs bg-green-600 text-white px-2.5 py-1 rounded-md hover:bg-green-700 transition font-medium"
                                            >
                                                Save Geofence
                                            </button>
                                        )}

                                    </div>

                                    {/* Radius */}
                                    <div className="flex flex-col gap-1">

                                        <label className="text-xs text-gray">
                                            Radius (meters)
                                        </label>

                                        <div className="flex items-center gap-2">

                                            <input
                                                type="number"
                                                min="50"
                                                max="5000"
                                                step="50"
                                                disabled={!isEditingGeofence}
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
                                                className={`w-full min-w-0 rounded-lg border border-gray/30 px-3 py-1.5 text-blue outline-none text-sm ${
                                                    !isEditingGeofence
                                                        ? "bg-gray/10 opacity-70 cursor-not-allowed"
                                                        : "focus:border-blue"
                                                }`}
                                            />

                                            <span className="text-xs text-gray">m</span>

                                        </div>

                                        <input
                                            type="range"
                                            min="50"
                                            max="5000"
                                            step="50"
                                            disabled={!isEditingGeofence}
                                            value={radiusMeters}
                                            onChange={(e) => setRadiusMeters(Number(e.target.value))}
                                            className={`w-full accent-blue mt-1 ${
                                                !isEditingGeofence
                                                    ? "opacity-50 cursor-not-allowed"
                                                    : ""
                                            }`}
                                        />

                                    </div>

                                    {/* Center Coordinate Controls */}
                                    <div className="flex flex-col gap-2 pt-1">

                                        <label className="text-xs text-gray">
                                            Center Location (Lng, Lat)
                                        </label>

                                        {isEditingGeofence && (
                                            <p className="text-[11px] text-blue italic">
                                                Click anywhere on the map to change the geofence center.
                                            </p>
                                        )}

                                        <div className="grid grid-cols-2 gap-2">

                                            <input
                                                type="number"
                                                step="0.000001"
                                                disabled={!isEditingGeofence}
                                                value={pinLocation?.[0] ?? ""}
                                                onChange={(e) =>
                                                    setPinLocation([
                                                        Number(e.target.value),
                                                        pinLocation?.[1] ?? 0
                                                    ])
                                                }
                                                className={`rounded-lg border border-gray/30 px-2 py-1 text-xs text-blue outline-none ${
                                                    !isEditingGeofence
                                                        ? "bg-gray/10 opacity-70 cursor-not-allowed"
                                                        : ""
                                                }`}
                                                placeholder="Longitude"
                                            />

                                            <input
                                                type="number"
                                                step="0.000001"
                                                disabled={!isEditingGeofence}
                                                value={pinLocation?.[1] ?? ""}
                                                onChange={(e) =>
                                                    setPinLocation([
                                                        pinLocation?.[0] ?? 0,
                                                        Number(e.target.value)
                                                    ])
                                                }
                                                className={`rounded-lg border border-gray/30 px-2 py-1 text-xs text-blue outline-none ${
                                                    !isEditingGeofence
                                                        ? "bg-gray/10 opacity-70 cursor-not-allowed"
                                                        : ""
                                                }`}
                                                placeholder="Latitude"
                                            />

                                        </div>

                                        <button
                                            onClick={() => {
                                                if (map.current && pinLocation) {
                                                    centerOnGeofence(
                                                        map.current,
                                                        pinLocation,
                                                        radiusMeters
                                                    );
                                                }
                                            }}
                                            disabled={!geofenceLoaded}
                                            className="mt-1 bg-blue text-white text-xs py-1.5 rounded-lg hover:bg-blue/90 transition disabled:opacity-50"
                                        >
                                            Recenter Map on Geofence
                                        </button>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </motion.div>

            </div>
        </>
    );
}

export default Monitoring;