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
import { RiRefundFill } from "react-icons/ri";

function Sidebar({ active, userRole }) {

    const navigate = useNavigate();
    const [userName, setUserNname] = useState(null);

    const [pendingRefundsCount, setPendingRefundsCount] = useState(0);

    const [pendingAlertsCount, setPendingAlertsCount] = useState(0);

    const [openAlerts, setOpenAlerts] = useState(false);

    const handleLogout = async () => {
      const { error } = await supabase.auth.signOut()

      if (error) {
          console.log(error.message)
      }

      navigate("/login");
    }

    const fetchUserName = async () => { 
      const { data: { user }, error: userError } = await supabase.auth.getUser(); 
        if (userError) 
          { console.log("Error getting logged in user:", userError.message); 
            return; 
          } 
          
          if (!user) { 
            return; 
          } 
          
          const { data, error } = await supabase .from("profiles_mod") 
            .select("first_name, last_name") .eq("id", user.id) 
            .maybeSingle(); 
            
          if (error) { 
            console.log("Error fetching user profile:", error.message); 
            return; 
          } 
          
          if (data) { 
            setUserNname( `${data.first_name || ""} ${data.last_name || ""}`.trim() ); 
          } 
    };

    useEffect(() => { 
      fetchUserName(); 
    }, []);

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
              (payload) => {
                  console.log("Realtime alert change:", payload);
                  fetchPendingAlertsCount();
              }
          )
          .subscribe((status) => {
              console.log("Alerts Realtime status:", status);
          });

      return () => {
          isMounted = false;
          supabase.removeChannel(channel);
      };
  }, []);

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
        name: "Refund",
        icon: RiRefundFill,
        key: "refund",
        route: "/refund",
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
                  table: "refunds_mod",
              },
              () => {
                  fetchPendingRefundsCount();
              }
          )
          .subscribe();

      return () => {
          isMounted = false;
          supabase.removeChannel(channel);
      };
  }, []);

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

  return (
    <>

        <div className='hidden lg:block h-screen w-55 bg-[#FFFFFF] border-r border-r-[#C1C1C1] gap-5 px-3'>

            <div className='h-full flex flex-col justify-between'>
              <div className="flex flex-col flex-1 min-h-0">
                  {/*Logo*/}
                  <div className='w-full py-10 pl-8 flex flex-row items-center gap-3'>
                      <h1 className='font-akagi font-bold text-[#0B5793] text-3xl hover:text-blue duration-300 transition-all cursor-pointer'><span className='text-blue'>3J</span>REMY</h1>
                      <div 
                        onClick={() => navigate('/admin-alerts')}
                        className="cursor-pointer relative inline-flex"
                      >
                        <HiMiniBellAlert className="text-2xl text-darkblue" />

                        {pendingAlertsCount > 0 && (
                          <div className="absolute -top-2 -right-2 min-w-5 h-5 px-1 rounded-full bg-yellow flex items-center justify-center font-akagi font-bold text-red-600 text-xs">
                              {pendingAlertsCount > 99 ? "99+" : pendingAlertsCount}
                          </div>
                        )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 overflow-y-auto overflow-x-hidden scrollbar-none min-h-0 flex-1">
                    {filteredMenu.map((item) => (
                        <div key={item.key} className="relative shrink-0">
                            <SidebarTabs
                                icon={item.icon}
                                name={item.name}
                                isActive={active === item.key}
                                onClick={() => navigate(item.route)}
                            />

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

              <div className='pt-6 flex flex-row justify-between items-center pb-6 px-3 '>
                <div 
                  onClick={() => {navigate('/prof')}}
                  className='flex flex-row gap-3 items-center'>
                  <FaUserCircle className='text-lg text-gray hover:text-blue duration-300 transition-all cursor-pointer' />
                  <h1 className='text-md font-akagi font-bold text-gray hover:text-blue duration-300 transition-all cursor-pointer'>{userName}</h1>
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
