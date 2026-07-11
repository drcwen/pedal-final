import { useState, useEffect } from "react";
import DropDown from "./DropDown"
import { supabase } from "../../../../../lib/supabase"

function OrderRow({ duration, image, model, price, selectedBikeId,  selectedGpsId, onBikeChange, onGpsChange}) {

    const [bikeId, setBikeId] = useState([]);
    const [gpsId, setGpsId] = useState([]);

    useEffect(() => {
        const fetchBikeID = async () => {
            const { data } = await supabase
                .from("bikes_mod")
                .select(`
                    id,
                    code,
                    bike_types_mod!inner(name)
                `)
                .eq("bike_types_mod.name", model)
                .eq("status", "Available");

            setBikeId(data || []);
        }

        const fetchGPSID = async () => {
            const {data} = await supabase
                .from("gps_mod")
                .select("*")
                .eq("status", "Available")
            
            setGpsId(data || []);
        }

        fetchBikeID();
        fetchGPSID();
    }, [])

  return (
    <>
    <div className='md:bg-[#F0F0F0] md:grid md:grid-cols-[100px_1fr_1fr_1fr_120px] md:text-center md:items-center gap-3 md:px-3 md:py-2 md:rounded-xl md:border md:border-[#DBDBDB]'>

        <h1 className='hidden md:block text-md font-akagi font-medium text-[#6D7172]'>{model}</h1>
        <h1 className='hidden md:block text-md font-akagi font-medium text-[#6D7172]'>{duration === 1 ? duration + " hour" : duration +  " hours"}</h1>

        <div className='hidden md:block'>
            <DropDown options={bikeId} placeholder="Bike ID" onChange={onBikeChange} value={selectedBikeId}/>
        </div>
        
        <div className='hidden md:block'>
            <DropDown options={gpsId} placeholder="GPS ID" onChange={onGpsChange} value={selectedGpsId}/>
        </div>
        <h1 className='hidden md:block text-md font-akagi font-medium text-[#6D7172]'>{price}</h1>

        {/*Mobile*/}
        <div className='md:hidden bg-[#F0F0F0] p-4 rounded-lg border border-[#DBDBDB] flex flex-col gap-2'>
            <div className='flex flex-row justify-between pb-3 items-center'>
                <div className='flex flex-row gap-3 items-center'>
                    <div className='bg-yellow p-1 rounded-lg'>
                        <img src={image} className='w-8'/>
                    </div>

                    <h1 className='text-md font-akagi font-bold text-[#6D7172]'>{model}</h1>
                </div>

                <h1 className='text-md font-akagi font-bold text-blue'>{price}</h1>
            </div>

            <div className='grid grid-cols-[70px_1fr] gap-3 items-center font-akagi'>
                <h1 className='text-md font-akagi font-light text-[#6D7172]'>Duration:</h1>
                <h1 className='text-md font-akagi font-medium text-[#6D7172]'>{duration === 1 ? duration + " hour" : duration +  " hours"}</h1>

                <h1 className='text-md font-akagi font-light text-[#6D7172]'>Bike ID:</h1>
                <DropDown options={bikeId} placeholder="Bike ID" onChange={onBikeChange} value={selectedBikeId}/>

                <h1 className='text-md font-akagi font-light text-[#6D7172]'>GPS ID:</h1>
                <DropDown options={gpsId} placeholder="GPS ID" onChange={onGpsChange} value={selectedGpsId}/>
            </div>

        </div>
    </div>
    </>
  );
}

export default OrderRow;