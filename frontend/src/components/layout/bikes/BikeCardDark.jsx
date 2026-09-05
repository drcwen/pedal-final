import { motion } from "framer-motion";
import { useEffect } from "react"
import { supabase } from "../../../lib/supabase"
import { useNavigate } from "react-router-dom"

function BikeCardDark({ bike, reservationData }) {

  const navigate = useNavigate();

  if (!bike) return null; 

  return (
    <div className="md:grid md:grid-cols-2 flex md:gap-5 gap-10 md:items-center flex flex-col items-center cursor-pointer">

      <img
        src={bike.image_url}
        alt={bike.name}
        className="w-50"
      />

      <div className="md:flex md:flex-col md:gap-3 flex flex-col gap-5 md:items-start items-center">

        <div className='md:flex md:flex-col md:text-start text-center'>
          <h1 className="text-lg font-bold text-darkblue hover:underline transition-all duration-300 font-akagi">
            {bike.name}
          </h1>

          <div className='flex flex-row gap-3 items-center justify-center lg:justify-start'>
            <h1 className="text-gray font-bold font-akagi">
              ₱{bike.price}/hr
            </h1>

            <div className='bg-yellow px-2 rounded-md'>
              <h1 className='text-sm font-bold font-akagi text-navyblue'>{bike.available_bikes} units</h1>
            </div>
          </div>

        </div>

        <motion.button
          whileHover={bike.available_count > 0 ? { scale: 1.05 } : {}}
          whileTap={bike.available_count > 0 ? { scale: 0.95 } : {}}
          onClick={() => navigate("/rent", {state: { bike, reservationData }})}
          disabled={bike.available_bikes === 0}
          className={`px-4 py-2 rounded-lg font-bold transition-all cursor-pointer
            ${
              bike.available_bikes === 0
                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                : "bg-blue text-[#f7f7f7]"
            }`}
        >
          {bike.available_bikes === 0 ? "Not Available" : "Rent Now"}
        </motion.button>

      </div>

    </div>
  );
}

export default BikeCardDark;