import { MdOutlineDashboard } from "react-icons/md";
import SidebarTabs from "./SidebarTabs"
import { MdOutlinePointOfSale } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { TfiMoreAlt } from "react-icons/tfi";
import { FaHistory } from "react-icons/fa";
import { IoIosPin } from "react-icons/io";

function SidebarMobile({active}) {

    const navigate = useNavigate();

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
    route: "",
  }
]

  return (
    <>

        <div className='lg:hidden fixed bottom-6 left-6 right-6 rounded-full bg-blue px-6 shadow-xl'>
            <div className='flex flex-row justify-between p-2 gap-4'>
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
      
    </>
  )
}

export default SidebarMobile
