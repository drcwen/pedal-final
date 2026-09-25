import { MdOutlineDashboard } from "react-icons/md";
import SidebarTabs from "./SidebarTabs"
import { MdOutlinePointOfSale } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { TfiMoreAlt } from "react-icons/tfi";
import { FaHistory } from "react-icons/fa";
import { IoIosPin } from "react-icons/io";
import { MdOutlineInventory } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { PiSignOutBold } from "react-icons/pi";
import { supabase } from "../../../lib/supabase"
import { MdManageAccounts } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";
import { TbReportAnalytics } from "react-icons/tb";
import { HiMiniBellAlert } from "react-icons/hi2";
import Alerts from "../Alerts"
import { useState, useEffect } from 'react';

function Sidebar({active}) {

    const navigate = useNavigate();

    const [openAlerts, setOpenAlerts] = useState(false);

    const handleLogout = async () => {
      const { error } = await supabase.auth.signOut()

      if (error) {
          console.log(error.message)
      }

      navigate("/login");
    }

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
    name: "Monitoring",
    icon: IoIosPin,
    key: "monitoring",
    route: "/monitoring",
  },
  {
    name: "Inventory",
    icon: MdOutlineInventory,
    key: "inventory",
    route: "/inventory",
  },
  {
    name: "Manage Accounts",
    icon: MdManageAccounts,
    key: "accounts",
    route: "/accounts",
  },
  {
    name: "Reports",
    icon: TbReportAnalytics,
    key: "datareports",
    route: "/data-reports",
  },
  {
    name: "Settings",
    icon: IoMdSettings,
    key: "settings",
    route: "/settings",
  },

]

  return (
    <>

        <div className='hidden lg:block h-screen w-55 bg-[#FFFFFF] border-r border-r-[#C1C1C1] gap-5 px-3'>

            <div className='h-full flex flex-col justify-between'>
              <div className='flex flex-col'>
                  {/*Logo*/}
                  <div className='w-full py-10 pl-8 flex flex-row items-center gap-3'>
                      <h1 className='font-akagi font-bold text-[#0B5793] text-3xl hover:text-blue duration-300 transition-all cursor-pointer'><span className='text-blue'>3J</span>REMY</h1>
                      <div 
                        onClick={() => navigate('/admin-alerts')}
                        className="cursor-pointer relative inline-flex"
                      >
                        <HiMiniBellAlert className="text-2xl text-darkblue" />

                        <div 
                          className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-yellow flex items-center justify-center font-akagi font-bold text-red-600 text-xs">
                            1
                        </div>
                    </div>
                  </div>

                  <div className='flex flex-col gap-4'>
                      {menu.map((item) => (
                          <SidebarTabs
                              key={item.key}
                              icon={item.icon}
                              name={item.name}
                              isActive={active === item.key}
                              onClick={() => navigate(item.route)}
                          />
                      ))}
                  </div>
              </div>

              <div className='flex flex-row justify-between items-center pb-10 px-3 '>
                <div className='flex flex-row gap-3 items-center'>
                  <FaUserCircle className='text-lg text-gray hover:text-blue duration-300 transition-all cursor-pointer' />
                  <h1 className='text-lg font-akagi font-bold text-gray hover:text-blue duration-300 transition-all cursor-pointer'>Wendel</h1>
                </div>

                <PiSignOutBold 
                  onClick={handleLogout}
                  className='text-lg text-gray hover:text-blue duration-300 transition-all cursor-pointer'/>
              </div>
            </div>
        </div>

        {openAlerts &&
          <Alerts />
        }
      
    </>
  )
}

export default Sidebar
