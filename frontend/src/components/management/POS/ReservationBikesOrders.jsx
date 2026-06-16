

import { motion } from "motion/react"

function ReservationBikesOrders({ type, duration, start, end, remaining }) {


    const gridLayout =
  "md:grid md:grid-cols-[1fr_100px_100px_100px_100px_1fr] md:items-center";

  return (
    <>
        <div className={`${gridLayout} w-full font-semibold py-3`}>
            <div className='flex justify-center text-md font-akagi text-gray'>{type}</div>
            <div className='flex justify-center text-md font-akagi text-gray'>{duration}</div>
            <div className='flex justify-center text-md font-akagi text-gray'>{start}</div>
            <div className='flex justify-center text-md font-akagi text-gray'>{end}</div>
            <div className='flex justify-center text-md font-akagi text-gray'>{remaining}</div>
            <div className='flex justify-center text-md font-akagi text-gray'>{type}</div>
        </div>
                                
    </>
  )
}

export default ReservationBikesOrders
