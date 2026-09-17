import { supabase } from "../../lib/supabase";
import BikesCardDark from "../../components/layout/bikes/BikeCardDark";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { fade } from "../../animations/fade";
import Lenis from "lenis";
import { FaRegCalendarAlt } from "react-icons/fa";
import { FaHourglassHalf } from "react-icons/fa";
import { IoMdTime } from "react-icons/io";

function AllBikes({ reservationData, onOpen, setBike, setAddToRent}) {
  const [bikes, setBikes] = useState([]);
  const [availability, setAvailability] = useState([]);

   // Fetch availability
  useEffect(() => {
    const fetchAvailableBikes = async () => {
      if (
        !reservationData?.date ||
        !reservationData?.startTime ||
        !reservationData?.hours
      ) {
        return;
      }

      const { data, error } = await supabase.rpc(
        "get_available_bike_types",
        {
          p_date: reservationData.date,
          p_time: reservationData.startTime,
          p_hours: reservationData.hours,
        }
      );

      if (!error) setAvailability(data || []);
    };

    fetchAvailableBikes();
  }, [
    reservationData?.date,
    reservationData?.startTime,
    reservationData?.hours,
  ]);

  // Fetch all bikes
  useEffect(() => {
    const fetchBikes = async () => {
      const { data, error } = await supabase
        .from("bike_types_mod")
        .select("*");

      if (!error) setBikes(data || []);
    };

    fetchBikes();
  }, []);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.8,
      smooth: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  const bikesWithAvailability = bikes.map((bike) => {
    const match = availability.find((a) => a.type_id === bike.id);

    return {
      ...bike,
      available_bikes: match?.available_bikes ?? 0,
    };
  });

  const formatDisplayDate = (dateString) => {
    if (!dateString) return "";

    const [year, month, day] = dateString.split("-");

    const months = {
        "01": "Jan",
        "02": "Feb",
        "03": "Mar",
        "04": "Apr",
        "05": "May",
        "06": "Jun",
        "07": "Jul",
        "08": "Aug",
        "09": "Sep",
        "10": "Oct",
        "11": "Nov",
        "12": "Dec"
    };

    return `${months[month]} ${Number(day)}, ${year}`;
  };

  return (
    <div className="w-full py-30 px-10 flex flex-col justify-center gap-10">
      <h1 className="text-4xl font-akagi font-black text-blue">
        All Bikes
      </h1>

      <div 
        className='w-full flex md:w-full md:flex grid grid-cols-2 gap-2 font-akagi font-bold text-gray'>
        <div 
          onClick={onOpen}
          className='w-full md:w-fit flex flex-row gap-2 rounded-lg border-2 border-gray px-3 py-2 items-center'
        >
          <FaRegCalendarAlt className='text-xl text-gray'/>
          <h1 className='text-gray'>{formatDisplayDate(reservationData?.date)}</h1>
        </div>

        <div 
          onClick={onOpen}
          className='w-full md:w-fit flex flex-row gap-2 rounded-lg border-2 border-gray px-3 py-2  items-center'
        >
          <IoMdTime className='text-xl text-gray'/>
          <h1 className='text-gray'>{reservationData?.startTime}</h1>
        </div>

        <div 
          onClick={onOpen}
          className='w-full md:w-fit flex flex-row gap-2 rounded-lg border-2 border-gray px-3 py-2 items-center'
        >
          <FaHourglassHalf 
            className='text-md text-gray'/>
          <h1 className='text-gray'>{reservationData?.hours
            ? `${reservationData.hours} ${reservationData.hours === 1 ? "hour" : "hours"}`
            : ""}
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 md:grid-cols-2 lg:gap-20 md:gap-10 gap-10 gap-y-20 place-items-center">
        {bikesWithAvailability.map((allBikes) => (
          <motion.div
            key={allBikes.id}
            initial={fade.initial}
            animate={fade.animate}
            transition={fade.transition}
            className="w-full flex justify-center"
          >
            <BikesCardDark bike={allBikes} reservationData={reservationData} setBike={setBike} setAddToRent={setAddToRent} />
          </motion.div>
        ))}
      </div>

    </div>
  );
}

export default AllBikes;