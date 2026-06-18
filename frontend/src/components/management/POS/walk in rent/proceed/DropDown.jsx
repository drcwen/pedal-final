import { RiArrowDropDownLine } from "react-icons/ri";
import { RiArrowDropUpLine } from "react-icons/ri";
import { useState } from "react";

function DropDown( {select, options, } ) {

    const [dropDown, setDropDown] = useState(false);

  return (
    <>

        <div 
            onClick={() => setDropDown(!dropDown)}
            className='rounded-lg border border-[#9E9E9E] grid grid-cols-[1fr_20px] px-2 relative items-center'>
            <div className='px-15'>
                <h1 className='text-md font-akagi font-medium text-[#6D7172] opacity-50'>{select}</h1>
            </div>
            
            {dropDown ? (
                <>
                <RiArrowDropUpLine className='text-3xl text-gray'/>
                <div className='w-full absolute top-8 left-0 text-left bg-[#ffffff] rounded-lg border border-[#9E9E9E] z-50'>
                    <option className='w-full text-md font-akagi font-medium text-[#6D7172] hover:bg-gray hover:text-[#ffffff] px-2 py-1 rounded-lg'>{options}</option>
                    <option className='w-full text-md font-akagi font-medium text-[#6D7172] hover:bg-gray hover:text-[#ffffff] px-2 py-1 rounded-lg'>{options}</option>
                    <option className='w-full text-md font-akagi font-medium text-[#6D7172] hover:bg-gray hover:text-[#ffffff] px-2 py-1 rounded-lg'>{options}</option>
                    <option className='w-full text-md font-akagi font-medium text-[#6D7172] hover:bg-gray hover:text-[#ffffff] px-2 py-1 rounded-lg'>{options}</option>
                </div>
                </>
            ): (
                <RiArrowDropDownLine className='text-3xl text-gray'/>
            )}
        </div>

    </>  

    )
}

export default DropDown
