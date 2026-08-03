import { MdOutlineDashboard } from "react-icons/md";
import SidebarTabs from "./SidebarTabs"
import { MdOutlinePointOfSale } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { TfiMoreAlt } from "react-icons/tfi";
import { FaHistory } from "react-icons/fa";
import { IoIosPin } from "react-icons/io";
import { MdOutlineInventory } from "react-icons/md";
import { useState } from 'react';
import { motion, AnimatePresence } from "motion/react"
import { supabase } from "../../../lib/supabase"
import { PiSignOutBold } from "react-icons/pi";
import { MdManageAccounts } from "react-icons/md";

function SidebarMobile({active}) {

    const navigate = useNavigate();

    const [more, setMore] = useState(false);

    const handleLogout = async () => {
      const { error } = await supabase.auth.signOut()

      if (error) {
          console.log(error.message)
      }

      navigate("/login");
    }


    const handleMore = () => {
      setMore((prev) => !prev);
    };

    const menu = [
  {
    name: "Dashboard",
    icon: MdOutlineDashboard,
    key: "dashboard",
    route: "/dashboard",
  },
  {
    name: "POS",
    icon: MdOutlinePointOfSale,
    key: "pos",
    route: "/pos",
  },
  {
    name: "Transaction History",
    icon: FaHistory,
    key: "history",
    route: "/history",
  },
  {
    name: "More",
    icon: TfiMoreAlt,
    key: "more",
    route: handleMore,
  },
];

  const moreMenu = [
    {
      name: "Inventory",
      icon: MdOutlineInventory,
      key: "inventory",
      route: "/inventory",
    },
    {
      name: "Monitoring",
      icon: IoIosPin,
      key: "monitoring",
      route: "/monitoring",
    },
    {
      name: "Manage Accounts",
      icon: MdManageAccounts,
      key: "accounts",
      route: "/accounts",
    },
    {
      name: "Sign out",
      icon: PiSignOutBold,
      key: "signout",
      route: handleLogout,
    },
  ]

  const handleClick = (item) => {
    if (typeof item.route === "function") {
      item.route();
    } else {
      navigate(item.route);
    }
  };

  return (
    <>

      <div className='lg:hidden fixed bottom-6 left-6 right-6 rounded-full bg-blue px-6 shadow-xl z-100'>
          <div className='flex flex-row justify-between p-2 gap-4'>
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
                        className='flex flex-row gap-4'
                      >
                        <item.icon className='text-2xl text-white transition-all duration-200'/>
                        <h1 className="text-white font-akagi font-bold">
                          {item.name}
                        </h1>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
      </div>
      
    </>
  )
}

export default SidebarMobile
