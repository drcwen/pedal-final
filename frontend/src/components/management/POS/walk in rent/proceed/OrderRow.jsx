import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import { useState, useEffect } from "react";
import DropDown from "./DropDown"
import { supabase } from "../../../../../lib/supabase"

function OrderRow({ duration, model, price, selectedBikeId,  selectedGpsId, onBikeChange, onGpsChange}) {

    const [bikeId, setBikeId] = useState([]);
    const [gpsId, setGpsId] = useState([]);

    const bikeIds = [
        "G1",
        "G2",
        "M1",
        "M2"
    ];

    const gpsIds = [
        "jipies1",
        "jipies2",
        "jipies3",
        "jipies4"
    ];

    useEffect(() => {
        const fetchBikeID = async () => {
            const {data, error} = await supabase
                .from("bikes_mod")
                .select(`code,
                bike_types_mod!inner(name)`)
                .eq("bike_types_mod.name", model);
            
            setBikeId(data.map((bike) => bike.code));
        }

        const fetchGPSID = async () => {
            const {data, error} = await supabase
                .from("gps_mod")
                .select("code")
            
            setGpsId(data.map((gps) => gps.code));
        }

        fetchBikeID();
        fetchGPSID();
    }, [])

  return (
    <>
        <h1 className='text-md font-akagi font-medium text-[#6D7172]'>{duration}</h1>
        <h1 className='text-md font-akagi font-medium text-[#6D7172]'>{model}</h1>
        <div className=''>
            <DropDown options={bikeId} placeholder="Bike ID" onChange={onBikeChange} value={selectedBikeId}/>
        </div>
        
        <div className=''>
            <DropDown options={gpsId} placeholder="GPS ID" onChange={onGpsChange} value={selectedGpsId}/>
        </div>
        <h1 className='text-md font-akagi font-medium text-[#6D7172]'>{price}</h1>
    </>
  );
}

export default OrderRow;