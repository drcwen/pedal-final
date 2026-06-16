

function SidebarTabs({icon: Icon, name, isActive, onClick}) {
    

  return (
    <>

        <div 
            onClick={onClick}
            className={`group rounded-full px-3 py-1 lg:rounded-lg lg:px-8 lg:py-2 flex flex-row lg:gap-3 items-center cursor-pointer hover:bg-yellow duration-300 transition-all ${isActive ? "bg-yellow" : "bg-transparent hover:bg-yellow"}`}>
            <Icon className={`text-2xl transition-all duration-200
                ${isActive ? "text-darkblue" : "lg:text-gray-400 text-[#ffffff] group-hover:text-darkblue"}
            `}/>

            <h1 className={`hidden lg:block font-akagi tracking-wide font-bold text-md transition-all duration-200 whitespace-normal break-words flex-1
                ${isActive ? "text-darkblue" : "text-gray-400 group-hover:text-darkblue"}
            `}>
                {name}
            </h1>
        </div>

      
    </>
  )
}

export default SidebarTabs
