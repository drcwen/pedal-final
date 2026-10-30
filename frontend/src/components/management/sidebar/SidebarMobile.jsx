import { MdOutlineDashboard, MdOutlinePointOfSale, MdOutlineInventory, MdManageAccounts } from "react-icons/md";
import SidebarTabs from "./SidebarTabs";
import { useNavigate } from "react-router-dom";
import { TfiMoreAlt } from "react-icons/tfi";
import { FaHistory } from "react-icons/fa";
import { IoIosPin, IoMdSettings } from "react-icons/io";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { supabase } from "../../../lib/supabase";
import { PiSignOutBold } from "react-icons/pi";
import { TbReportAnalytics } from "react-icons/tb";
import { TiUser } from "react-icons/ti";
import { RiRefundFill } from "react-icons/ri";

function SidebarMobile({ active, outOfBoundsCount = 0 }) {
    const navigate = useNavigate();
    const [more, setMore] = useState(false);

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) console.log(error.message);
        navigate("/login");
    };

    const handleMore = () => setMore((prev) => !prev);

    const menu = [
        { name: "Dashboard", icon: MdOutlineDashboard, key: "dashboard", route: "/dashboard" },
        { name: "POS", icon: MdOutlinePointOfSale, key: "pos", route: "/pos" },
        { name: "Transaction History", icon: FaHistory, key: "history", route: "/history" },
        { name: "More", icon: TfiMoreAlt, key: "more", route: handleMore },
    ];

    const moreMenu = [
        { name: "Inventory", icon: MdOutlineInventory, key: "inventory", route: "/inventory" },
        { name: "Refund", icon: RiRefundFill, key: "refund", route: "/refund" },
        { name: "Monitoring", icon: IoIosPin, key: "monitoring", route: "/monitoring" },
        { name: "Manage Accounts", icon: MdManageAccounts, key: "accounts", route: "/accounts" },
        { name: "Reports", icon: TbReportAnalytics, key: "datareports", route: "/data-reports" },
        { name: "Settings", icon: IoMdSettings, key: "settings", route: "/settings" },
        { name: "Profile", icon: TiUser, key: "profile", route: "/prof" },
        { name: "Sign out", icon: PiSignOutBold, key: "signout", route: handleLogout },
    ];

    const handleClick = (item) => {
        if (typeof item.route === "function") item.route();
        else navigate(item.route);
    };

    return (
        <div className="lg:hidden fixed bottom-6 left-6 right-6 rounded-full bg-blue px-6 shadow-xl z-10">
            <div className="flex flex-row justify-between p-2 gap-4">
                {menu.map((item) => (
                    <SidebarTabs
                        key={item.key}
                        icon={item.icon}
                        name={item.name}
                        isActive={active === item.key}
                        onClick={() => handleClick(item)}
                    />
                ))}
            </div>

            <AnimatePresence initial={false}>
                {more && (
                    <motion.div
                        key="more-menu"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="absolute bottom-14 right-0 left-0 bg-blue rounded-3xl px-6 py-6 overflow-hidden flex flex-col gap-3"
                    >
                        {moreMenu.map((item) => (
                            <div
                                key={item.key}
                                onClick={() => handleClick(item)}
                                className="flex flex-row items-center gap-4 cursor-pointer"
                            >
                                <item.icon className="text-2xl text-white transition-all duration-200" />
                                <h1 className="text-white font-akagi font-bold">{item.name}</h1>

                                {item.key === "monitoring" && outOfBoundsCount > 0 && (
                                    <span
                                        className="ml-auto w-5 h-5 rounded-full bg-red-600 flex items-center justify-center font-akagi font-bold text-white text-xs"
                                        title={`${outOfBoundsCount} bike(s) out of bounds`}
                                    >
                                        {outOfBoundsCount > 99 ? "99+" : outOfBoundsCount}
                                    </span>
                                )}
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default SidebarMobile;
