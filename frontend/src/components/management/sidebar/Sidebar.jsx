import {
    MdOutlineDashboard,
    MdOutlinePointOfSale,
    MdOutlineInventory,
    MdManageAccounts
} from "react-icons/md";

import SidebarTabs from "./SidebarTabs";
import { useNavigate } from "react-router-dom";
import { FaHistory, FaUserCircle } from "react-icons/fa";
import { IoIosPin, IoMdSettings } from "react-icons/io";
import { PiSignOutBold } from "react-icons/pi";
import { supabase } from "../../../lib/supabase";
import { TbReportAnalytics } from "react-icons/tb";
import { HiMiniBellAlert } from "react-icons/hi2";
import { useState, useEffect } from "react";
import { RiRefundFill } from "react-icons/ri";

function Sidebar({ active, userRole }) {

    const navigate = useNavigate();

    const [userName, setUserName] = useState(null);
    const [pendingRefundsCount, setPendingRefundsCount] = useState(0);
    const [pendingAlertsCount, setPendingAlertsCount] = useState(0);
    const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

    const [outOfBoundsCount, setOutOfBoundsCount] = useState(0);

    // LOGOUT
    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();

        if (error) {
            console.log(error.message);
            return;
        }

        navigate("/login");
    };

    // FETCH USER NAME
    useEffect(() => {
        const fetchUserName = async () => {
            const {
                data: { user },
                error: userError
            } = await supabase.auth.getUser();

            if (userError) {
                console.log("Error getting logged in user:", userError.message);
                return;
            }

            if (!user) return;

            const { data, error } = await supabase
                .from("profiles_mod")
                .select("first_name, last_name")
                .eq("id", user.id)
                .maybeSingle();

            if (error) {
                console.log("Error fetching user profile:", error.message);
                return;
            }

            if (data) {
                setUserName(
                    `${data.first_name || ""} ${data.last_name || ""}`.trim()
                );
            }
        };

        fetchUserName();
    }, []);

    // PENDING ALERTS COUNT
    useEffect(() => {
        let isMounted = true;

        const fetchPendingAlertsCount = async () => {
            const { count, error } = await supabase
                .from("alerts_mod")
                .select("id", { count: "exact", head: true })
                .or("status.is.null,status.eq.Pending");

            if (error) {
                console.error("Error fetching pending alerts:", error.message);
                return;
            }

            if (isMounted) {
                setPendingAlertsCount(count ?? 0);
            }
        };

        fetchPendingAlertsCount();

        const channel = supabase
            .channel("sidebar-pending-alerts")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "alerts_mod",
                },
                fetchPendingAlertsCount
            )
            .subscribe();

        return () => {
            isMounted = false;
            supabase.removeChannel(channel);
        };
    }, []);

    // UNREAD NOTIFICATIONS COUNT
    useEffect(() => {
        let isMounted = true;
        let channel;

        const initializeNotifications = async () => {
            const {
                data: { user },
                error: userError
            } = await supabase.auth.getUser();

            if (userError) {
                console.error("Error getting logged-in user:", userError.message);
                return;
            }

            if (!user || !isMounted) return;

            const fetchUnreadNotificationsCount = async () => {
                const { count, error } = await supabase
                    .from("notifications_mod")
                    .select("id", { count: "exact", head: true })
                    .eq("recipient_id", user.id)
                    .eq("is_read", false);

                if (error) {
                    console.error("Error fetching unread notifications:", error.message);
                    return;
                }

                if (isMounted) {
                    setUnreadNotificationsCount(count ?? 0);
                }
            };

            await fetchUnreadNotificationsCount();

            if (!isMounted) return;

            channel = supabase
                .channel(`sidebar-notifications-${user.id}`)
                .on(
                    "postgres_changes",
                    {
                        event: "*",
                        schema: "public",
                        table: "notifications_mod",
                        filter: `recipient_id=eq.${user.id}`,
                    },
                    fetchUnreadNotificationsCount
                )
                .subscribe();
        };

        initializeNotifications();

        return () => {
            isMounted = false;

            if (channel) {
                supabase.removeChannel(channel);
            }
        };
    }, []);

    // OUT OF BOUNDS GPS COUNT
useEffect(() => {
    let isMounted = true;
    let isFetching = false;

    const isGpsOutOfBounds = (gps, pinLocation, radiusMeters) => {
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

    const fetchOutOfBoundsCount = async () => {
        if (isFetching) return;

        isFetching = true;

        try {
            // 1. Fetch geofence settings.
            const { data: geofence, error: geofenceError } = await supabase
                .from("gps_mod")
                .select("geofence_radius, center_longitude, center_latitude")
                .not("center_longitude", "is", null)
                .not("center_latitude", "is", null)
                .order("id", { ascending: true })
                .limit(1)
                .maybeSingle();

            if (geofenceError) throw geofenceError;

            if (!geofence) {
                if (isMounted) setOutOfBoundsCount(0);
                return;
            }

            const pinLocation = [
                Number(geofence.center_longitude),
                Number(geofence.center_latitude),
            ];

            const radiusMeters = Number(geofence.geofence_radius);

            if (
                !Number.isFinite(pinLocation[0]) ||
                !Number.isFinite(pinLocation[1]) ||
                !Number.isFinite(radiusMeters) ||
                radiusMeters <= 0
            ) {
                throw new Error("Invalid geofence settings.");
            }

            // 2. Fetch ongoing transactions and their GPS records.
            const { data, error } = await supabase
                .from("transactions_mod")
                .select(`
                    id,
                    orders_mod (
                        id,
                        gps_id,
                        gps_mod (*)
                    )
                `)
                .eq("status", "started");

            if (error) throw error;

            // 3. Count unique GPS devices outside the geofence.
            const outOfBoundsGpsIds = new Set();

            (data ?? []).forEach((transaction) => {
                (transaction.orders_mod ?? []).forEach((order) => {
                    const gps = Array.isArray(order.gps_mod)
                        ? order.gps_mod[0]
                        : order.gps_mod;

                    const gpsId = order.gps_id ?? gps?.id;

                    if (
                        gpsId != null &&
                        isGpsOutOfBounds(gps, pinLocation, radiusMeters)
                    ) {
                        outOfBoundsGpsIds.add(String(gpsId));
                    }
                });
            });

            if (isMounted) {
                setOutOfBoundsCount(outOfBoundsGpsIds.size);
            }

        } catch (error) {
            console.error("Error fetching out-of-bounds GPS count:", error);

        } finally {
            isFetching = false;
        }
    };

    fetchOutOfBoundsCount();

    // Refresh every 5 seconds, matching the Monitoring page.
    const intervalId = setInterval(fetchOutOfBoundsCount, 5000);

    // Listen for database changes.
    const channel = supabase
        .channel(`sidebar-out-of-bounds-${crypto.randomUUID()}`)
        .on(
            "postgres_changes",
            {
                event: "*",
                schema: "public",
                table: "gps_mod",
            },
            fetchOutOfBoundsCount
        )
        .on(
            "postgres_changes",
            {
                event: "*",
                schema: "public",
                table: "transactions_mod",
            },
            fetchOutOfBoundsCount
        )
        .on(
            "postgres_changes",
            {
                event: "*",
                schema: "public",
                table: "orders_mod",
            },
            fetchOutOfBoundsCount
        );

    channel.subscribe();

    return () => {
        isMounted = false;
        clearInterval(intervalId);
        supabase.removeChannel(channel);
    };
}, []);

    // SIDEBAR MENU
    const menu = [
        {
            name: "Dashboard",
            icon: MdOutlineDashboard,
            key: "dashboard",
            route: "/dashboard"
        },
        {
            name: "POS",
            icon: MdOutlinePointOfSale,
            key: "pos",
            route: "/pos"
        },
        {
            name: "Refund",
            icon: RiRefundFill,
            key: "refund",
            route: "/refund"
        },
        {
            name: "Transaction History",
            icon: FaHistory,
            key: "history",
            route: "/history"
        },
        {
            name: "Monitoring",
            icon: IoIosPin,
            key: "monitoring",
            route: "/monitoring"
        },
        {
            name: "Inventory",
            icon: MdOutlineInventory,
            key: "inventory",
            route: "/inventory"
        },
        {
            name: "Manage Accounts",
            icon: MdManageAccounts,
            key: "accounts",
            route: "/accounts"
        },
        {
            name: "Reports",
            icon: TbReportAnalytics,
            key: "datareports",
            route: "/data-reports"
        },
        {
            name: "Settings",
            icon: IoMdSettings,
            key: "settings",
            route: "/settings"
        },
    ];

    // FILTER MENU BASED ON USER ROLE
    const filteredMenu = menu.filter((item) => {

        if (userRole === "cashier") {
            return [
                "dashboard",
                "pos",
                "history",
                "monitoring",
                "inventory",
            ].includes(item.key);
        }

        if (userRole === "admin") {
            return true;
        }

        return false;
    });

    // PENDING REFUNDS COUNT
    useEffect(() => {
        let isMounted = true;

        const fetchPendingRefundsCount = async () => {
            const { count, error } = await supabase
                .from("refund_mod")
                .select("id", { count: "exact", head: true })
                .ilike("status", "pending");

            if (error) {
                console.error("Error fetching pending refunds:", error.message);
                return;
            }

            if (isMounted) {
                setPendingRefundsCount(count ?? 0);
            }
        };

        fetchPendingRefundsCount();

        const channel = supabase
            .channel("sidebar-pending-refunds")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "refund_mod",
                },
                fetchPendingRefundsCount
            )
            .subscribe();

        return () => {
            isMounted = false;
            supabase.removeChannel(channel);
        };
    }, []);

    return (
        <>
            <div className="hidden lg:block h-screen w-55 bg-[#FFFFFF] border-r border-r-[#C1C1C1] gap-5 px-3">

                <div className="h-full flex flex-col justify-between">

                    <div className="flex flex-col flex-1 min-h-0">

                        {/* LOGO AND ALERTS */}
                        <div className="w-full py-10 pl-8 flex flex-row items-center gap-3">

                            <h1
                                className="font-akagi font-bold text-[#0B5793] text-3xl hover:text-blue duration-300 transition-all cursor-pointer"
                                onClick={() => navigate("/dashboard")}
                            >
                                <span className="text-blue">3J</span>REMY
                            </h1>

                            <div
                                onClick={() => navigate("/admin-alerts")}
                                className="cursor-pointer relative inline-flex"
                            >
                                <HiMiniBellAlert className="text-2xl text-darkblue" />

                                {pendingAlertsCount + unreadNotificationsCount > 0 && (
                                    <div className="absolute -top-2 -right-2 min-w-5 h-5 px-1 rounded-full bg-yellow flex items-center justify-center font-akagi font-bold text-red-600 text-xs">
                                        {pendingAlertsCount + unreadNotificationsCount > 99
                                            ? "99+"
                                            : pendingAlertsCount + unreadNotificationsCount}
                                    </div>
                                )}
                            </div>

                        </div>

                        {/* MENU ITEMS */}
                        <div className="flex flex-col gap-4 overflow-y-auto overflow-x-hidden scrollbar-none min-h-0 flex-1">

                            {filteredMenu.map((item) => (
                                <div key={item.key} className="relative shrink-0">

                                    <SidebarTabs
                                        icon={item.icon}
                                        name={item.name}
                                        isActive={active === item.key}
                                        onClick={() => navigate(item.route)}
                                    />

                                    {/* OUT OF BOUNDS COUNT */}
                                    {item.key === "monitoring" && outOfBoundsCount > 0 && (
                                        <div
                                            className="absolute top-1/2 right-3 -translate-y-1/2 w-5 h-5 rounded-full bg-red-600 flex items-center justify-center font-akagi font-bold text-white text-xs pointer-events-none"
                                            title={`${outOfBoundsCount} bike(s) out of bounds`}
                                        >
                                            {outOfBoundsCount > 99
                                                ? "99+"
                                                : outOfBoundsCount}
                                        </div>
                                    )}

                                    {/* PENDING REFUNDS COUNT */}
                                    {item.key === "refund" && pendingRefundsCount > 0 && (
                                        <div className="absolute top-1/2 right-3 -translate-y-1/2 min-w-5 h-5 px-1 rounded-full bg-red-500 flex items-center justify-center font-akagi font-bold text-yellow text-xs pointer-events-none">
                                            {pendingRefundsCount > 99
                                                ? "99+"
                                                : pendingRefundsCount}
                                        </div>
                                    )}

                                </div>
                            ))}

                        </div>

                    </div>

                    {/* PROFILE AND LOGOUT */}
                    <div className="flex flex-row justify-between items-center pb-10 px-3">

                        <div
                            onClick={() => navigate("/prof")}
                            className="flex flex-row gap-3 items-center cursor-pointer"
                        >
                            <FaUserCircle className="text-lg text-gray hover:text-blue duration-300 transition-all" />

                            <h1 className="text-md font-akagi font-bold text-gray hover:text-blue duration-300 transition-all">
                                {userName}
                            </h1>
                        </div>

                        <PiSignOutBold
                            onClick={handleLogout}
                            className="text-lg text-gray hover:text-blue duration-300 transition-all cursor-pointer"
                        />

                    </div>

                </div>

            </div>
        </>
    );
}

export default Sidebar;