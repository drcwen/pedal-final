import { useState, useEffect } from "react";
import DropDown from "./DropDown"
import { supabase } from "../../../../lib/supabase"

function OrderRow({ duration, model, price, selectedBikeId,  selectedGpsId, onBikeChange, onGpsChange}) {

    const [bikeId, setBikeId] = useState([]);
    const [gpsId, setGpsId] = useState([]);

    useEffect(() => {
        const fetchBikeID = async () => {
            const {data} = await supabase
                .from("bikes_mod")
                .select(`code,
                bike_types_mod!inner(name)`)
                .eq("bike_types_mod.name", model)
                .eq("status", "Available");
            
            setBikeId(data.map((bike) => bike.code));
        }

        const fetchGPSID = async () => {
            const {data} = await supabase
                .from("gps_mod")
                .select("code")
                .eq("status", "Available")
            
            setGpsId(data.map((gps) => gps.code));
        }

        fetchBikeID();
        fetchGPSID();
    }, [])

  return (
    <>
        <h1 className='hidden md:block text-md font-akagi font-medium text-[#6D7172]'>{duration === 1 ? duration + " hour" : duration +  " hours"}</h1>
        <h1 className='hidden md:block text-md font-akagi font-medium text-[#6D7172]'>{model}</h1>
        <div className='hidden md:block'>
            <DropDown options={bikeId} placeholder="Bike ID" onChange={onBikeChange} value={selectedBikeId}/>
        </div>
        
        <div className='hidden md:block'>
            <DropDown options={gpsId} placeholder="GPS ID" onChange={onGpsChange} value={selectedGpsId}/>
        </div>
        <h1 className='hidden md:block text-md font-akagi font-medium text-[#6D7172]'>{price}</h1>

        <div className='md:hidden bg-[#F0F0F0] p-2 rounded-lg border border-[#DBDBDB]'>

        </div>
    </>
  );
}

export default OrderRow;