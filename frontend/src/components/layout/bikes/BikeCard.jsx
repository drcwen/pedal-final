import { motion } from "framer-motion";

function BikeCard({ bike }) {

  if (!bike) return null; // safety check

  return (
    <div className="md:grid md:grid-cols-2 flex md:gap-5 gap-10 md:items-center flex flex-col items-center cursor-pointer">

      <img
        src={bike.type_image}
        alt={bike.type_name}
        className="w-50"
      />

      <div className="md:flex md:flex-col md:gap-3 flex flex-col gap-5 md:items-start items-center">

        <div className='md:flex md:flex-col md:text-start text-center'>
          <h1 className="text-2xl font-bold text-blue hover:underline transition-all duration-300">
            {bike.type_name}
          </h1>

          <h1 className="text-gray font-bold">
            ₱{bike.type_price}/hr
          </h1>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-blue px-4 py-2 rounded-lg text-white font-bold"
        >
          Rent Now
        </motion.button>

      </div>

    </div>
  );
}

export default BikeCard;