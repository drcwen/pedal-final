import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function BikeCard({ bike }) {

  if (!bike) return null;

  const navigate = useNavigate();

  return (
    <div className="md:grid md:grid-cols-2 flex md:gap-5 gap-10 md:items-center flex flex-col items-center cursor-pointer">

      <img
        src={bike.image_url}
        alt={bike.name}
        className="w-40"
      />

      <div className="md:flex md:flex-col md:gap-3 flex flex-col gap-5 md:items-start items-center">

        <div className='md:flex md:flex-col md:text-start text-center'>
          <h1 className="text-md md:text-xl font-bold text-darkblue hover:underline transition-all duration-300 font-akagi">
            {bike.name}
          </h1>

          <h1 className="text-gray font-bold font-akagi">
            ₱{bike.price}/hr
          </h1>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="cursor-pointer bg-blue px-4 py-2 rounded-lg text-[#f7f7f7] font-bold font-akagi"
          onClick={() => navigate("/reserve")}
        >
          Rent Now
        </motion.button>

      </div>

    </div>
  );
}

export default BikeCard;