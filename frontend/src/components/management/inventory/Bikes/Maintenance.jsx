import { MdModeEditOutline } from "react-icons/md";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react"
import BikeInventoryInfo from "./BikeInventoryInfo"
import { FaPlus } from "react-icons/fa";
import { RiImageAddFill } from "react-icons/ri";

function BikeRow() {

    const [dropDown, setDropDown] = useState(false);
    const [addBike, setAddBike] = useState(false);

  return (
    <>
        <div className='bg-[#EBEBEB] w-full rounded-lg px-3 py-2 border border-[#c9c9c9]'>
            
        </div>    

    </>
  )
}

export default BikeRow
