import { MdOutlineDashboard } from "react-icons/md";
import SidebarTabs from "./SidebarTabs"
import { MdOutlinePointOfSale } from "react-icons/md";


function Sidebar({active}) {

    const menu = [
  {
    name: "Dashboard",
    icon: MdOutlineDashboard,
    key: "dashboard",
  },
  {
    name: "POS",
    icon: MdOutlinePointOfSale,
    key: "pos",
  },
  {
    name: "Transaction History",
    icon: MdOutlinePointOfSale,
    key: "history",
  },
  {
    name: "Monitoring",
    icon: MdOutlinePointOfSale,
    key: "monitoring",
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
                        />
                    ))}
                </div>
            </div>
        </div>
      
    </>
  )
}

export default Sidebar
