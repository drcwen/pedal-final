import { MdOutlineDashboard } from "react-icons/md";
import SidebarTabs from "./SidebarTabs"
import { MdOutlinePointOfSale } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { TfiMoreAlt } from "react-icons/tfi";
import { FaHistory } from "react-icons/fa";
import { IoIosPin } from "react-icons/io";
import { useState } from 'react';

function SidebarMobile({active}) {

    const navigate = useNavigate();

    const [more, setMore] = useState(false);

    const handleMore = () => {
      setMore((prev) => !prev); // toggle open/close
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
      route: handleMore, // function directly
    },
  ];

  const handleClick = (item) => {
    if (typeof item.route === "function") {
      item.route();
    } else {
      navigate(item.route);
    }
  };

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
                        onClick={() => handleClick(item)}
                    />
                ))}

                
            </div>

            {more && 
              <div className='absolute bottom-14 right-0 left-0 bg-blue rounded-full px-6 py-3'>
                <h1 className='text-[#ffffff] font-akagi font-bold'>Hello</h1>
              </div>}
        </div>
      
    </>
  )
}

export default SidebarMobile
