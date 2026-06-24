import Sidebar from "../sidebar/Sidebar"
import SidebarMobile from "../sidebar/SidebarMobile"
import { useState } from "react";

function Inventory() {


  return (
    <>

        <div className='w-full h-screen bg-[#F2F2F2] flex'>
            <Sidebar active={'inventory'}/>
            <SidebarMobile active={'inventory'}/>

            <div className='flex-1 p-5'>
                <div className='flex flex-col bg-[#ffffff] w-full h-full rounded-xl p-10 gap-5'>

                    <h1 className='text-4xl font-akagi font-bold tracking-wide text-blue'>Inventory</h1>
                </div>

            </div>
        </div>
    </>
  )
}

export default Inventory
