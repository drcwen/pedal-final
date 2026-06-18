import { supabase } from "../../../../../lib/supabase"
import { useEffect, useState } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import { RiArrowDropUpLine } from "react-icons/ri";
import DropDown from "./DropDown"

function ProceedWalkInRent() {

    const [bikeId, setBikeId] = useState(false);
    const [gpsId, setGpsId] = useState(false);

  return (
    <>
        <div className='box-model fixed inset-0 bg-black/60 flex items-center justify-center'>
            <div className='bg-[#ffffff] w-full rounded-xl p-10 flex flex-col gap-8'>

                <div className='flex flex-col gap-6'>
                    <h1 className='text-3xl font-akagi font-bold text-navyblue'>Walk-in Rent</h1>

                    <div className='flex flex-col gap-2'>
                        <div className='grid grid-cols-[150px_1fr] items-center'>
                            <h1 className='text-md font-akagi font-bold text-[#6D7172]'>First Name:</h1>
                            <div className='bg-[#D9D9D9] rounded-lg px-3 py-1 flex items-center'>
                                <input className='w-full text-md font-akagi font-bold text-[#6D7172]'></input>
                            </div>
                        </div>

                        <div className='grid grid-cols-[150px_1fr] items-center'>
                            <h1 className='text-md font-akagi font-bold text-[#6D7172]'>Last Name:</h1>
                            <div className='bg-[#D9D9D9] rounded-lg px-3 py-1 flex items-center'>
                                <input className='w-full text-md font-akagi font-bold text-[#6D7172]'></input>
                            </div>
                            
                        </div>

                        <div className='grid grid-cols-[150px_1fr]'>
                            <h1 className='text-md font-akagi font-bold text-[#6D7172]'>ID Type:</h1>
                            <h1 className='text-md font-akagi font-bold text-[#6D7172]'>Student ID</h1>
                        </div>

                    </div>
                </div>

                <div className='w-full h-60 overflow-y-scroll scrollbar-thin scrollbar-thumb-[#B9B9B9] scrollbar-track-[#E2E2E2] px-10'>
                    <div className='grid grid-cols-[100px_1fr_1fr_1fr_120px] text-center gap-2'>
                        <div className='text-md font-akagi font-bold text-[#6D7172]'>Qty</div>
                        <div className='text-md font-akagi font-bold text-[#6D7172]'>Model</div>
                        <div className='text-md font-akagi font-bold text-[#6D7172]'>Bike ID</div>
                        <div className='text-md font-akagi font-bold text-[#6D7172]'>GPS ID</div>
                        <div className='text-md font-akagi font-bold text-[#6D7172]'>Amount</div>

                        <h1 className='text-md font-akagi font-medium text-[#6D7172]'>2</h1>
                        <h1 className='text-md font-akagi font-medium text-[#6D7172]'>Mountain Bike</h1>
                        <div className='flex items-center justify-center'>
                            <DropDown select='GPS ID' options='jipies'/>
                        </div>
                        
                        <div className='flex items-center justify-center '>
                            <DropDown select='GPS ID' options='jipies'/>
                        </div>
                        <h1 className='text-md font-akagi font-medium text-[#6D7172]'>P130</h1>

                        <h1 className='text-md font-akagi font-medium text-[#6D7172]'>2</h1>
                        <h1 className='text-md font-akagi font-medium text-[#6D7172]'>Mountain Bike</h1>
                        <div className='flex items-center justify-center'>
                            <DropDown select='GPS ID' options='jipies'/>
                        </div>
                        
                        <div className='flex items-center justify-center '>
                            <DropDown select='GPS ID' options='jipies'/>
                        </div>
                        <h1 className='text-md font-akagi font-medium text-[#6D7172]'>P130</h1>

                        <h1 className='text-md font-akagi font-medium text-[#6D7172]'>2</h1>
                        <h1 className='text-md font-akagi font-medium text-[#6D7172]'>Mountain Bike</h1>
                        <div className='flex items-center justify-center'>
                            <DropDown select='GPS ID' options='jipies'/>
                        </div>
                        
                        <div className='flex items-center justify-center '>
                            <DropDown select='GPS ID' options='jipies'/>
                        </div>
                        <h1 className='text-md font-akagi font-medium text-[#6D7172]'>P130</h1>

                        
                        
                    </div>
                </div>
            </div>
        </div>
        
    </>
  )
}

export default ProceedWalkInRent
