import { motion } from "framer-motion";

function BikeCardDark({ bike }) {

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
          <h1 className="text-2xl font-bold text-darkblue hover:underline transition-all duration-300">
            {bike.type_name}
          </h1>

          <div className='flex flex-row gap-3 items-center'>
            <h1 className="text-gray font-bold">
              ₱{bike.type_price}/hr
            </h1>

            <div className='bg-yellow px-2 rounded-md'>
              <h1 className='text-sm font-bold font-akagi text-navyblue'>10 units</h1>
            </div>
          </div>

        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-blue px-4 py-2 rounded-lg text-[#f7f7f7] font-bold"
        >
          Rent Now
        </motion.button>

      </div>

    </div>
  );
}

export default BikeCardDark;