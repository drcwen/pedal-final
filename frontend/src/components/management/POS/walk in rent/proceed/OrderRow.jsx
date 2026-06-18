import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import { useState } from "react";
import DropDown from "./DropDown"

function OrderRow({ quantity, model, price, selectedBikeId,  selectedGpsId, onBikeChange, onGpsChange}) {

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

  return (
    <>
        <h1 className='text-md font-akagi font-medium text-[#6D7172]'>{quantity}</h1>
        <h1 className='text-md font-akagi font-medium text-[#6D7172]'>{model}</h1>
        <div className='flex items-center justify-center'>
            <DropDown options={bikeIds} placeholder="Select Bike ID" onChange={onBikeChange} value={selectedBikeId}/>
        </div>
        
        <div className='flex items-center justify-center '>
            <DropDown options={gpsIds} placeholder="Select GPS ID" onChange={onGpsChange} value={selectedGpsId}/>
        </div>
        <h1 className='text-md font-akagi font-medium text-[#6D7172]'>{price}</h1>
    </>
  );
}

export default OrderRow;