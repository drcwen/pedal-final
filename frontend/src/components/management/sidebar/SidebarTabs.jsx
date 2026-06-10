

function SidebarTabs({icon: Icon, name, isActive, onClick}) {
    

  return (
    <>

        <div 
            onClick={onClick}
            className={`group rounded-lg px-8 py-2 flex flex-row gap-3 items-center cursor-pointer hover:bg-yellow duration-300 transition-all ${isActive ? "bg-yellow" : "bg-transparent hover:bg-yellow"}`}>
            <Icon className={`text-2xl transition-all duration-200
                ${isActive ? "text-darkblue" : "text-gray-400 group-hover:text-darkblue"}
            `}/>

            <h1 className={`font-akagi tracking-wide font-bold text-md transition-all duration-200 whitespace-normal break-words flex-1
                ${isActive ? "text-darkblue" : "text-gray-400 group-hover:text-darkblue"}
            `}>
                {name}
            </h1>
        </div>

      
    </>
  )
}

export default SidebarTabs
