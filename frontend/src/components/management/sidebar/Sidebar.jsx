import { MdOutlineDashboard } from "react-icons/md";
import SidebarTabs from "./SidebarTabs"
import { MdOutlinePointOfSale } from "react-icons/md";
import { useNavigate } from "react-router-dom";

function Sidebar({active}) {

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
    icon: MdOutlinePointOfSale,
    key: "history",
    route: "/history",
  },
  {
    name: "Monitoring",
    icon: MdOutlinePointOfSale,
    key: "monitoring",
    route: "/monitoring",
  },
]

  return (
    <>

        <div className='h-screen w-55 bg-[#FFFFFF] border-r border-r-[#C1C1C1]'>
            <div className='flex flex-col gap-5 px-3'>
                {/*Logo*/}
                <div className='p-10'>
                    <h1 className='font-akagi font-bold text-[#0B5793] text-3xl'>3JREMY</h1>
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
        </div>
      
    </>
  )
}

export default Sidebar
