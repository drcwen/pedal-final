import { supabase } from "../../lib/supabase";
import BikesCardDark from "../../components/layout/bikes/BikeCardDark";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { fade } from "../../animations/fade";
import Lenis from "lenis";

function AllBikes({ reservationData }) {
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

  return (
    <div className="w-full md:h-screen py-30 px-10 flex flex-col justify-center gap-15">
      <h1 className="text-4xl font-akagi font-black text-blue">
        All Bikes
      </h1>

      <div className="grid grid-cols-2 lg:grid-cols-3 md:grid-cols-2 lg:gap-20 md:gap-10 gap-10 gap-y-20 place-items-center">
        {bikesWithAvailability.map((allBikes) => (
          <motion.div
            key={allBikes.id}
            initial={fade.initial}
            animate={fade.animate}
            transition={fade.transition}
            className="w-full flex justify-center"
          >
            <BikesCardDark bike={allBikes} reservationData={reservationData} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default AllBikes;