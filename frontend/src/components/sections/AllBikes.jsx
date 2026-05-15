import { supabase } from "../../lib/supabase";
import BikesCardDark from "../../components/layout/bikes/BikeCardDark";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { fadeScale } from "../../animations/fadeScale";
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
      available_count: match?.available_count ?? 0,
    };
  });

  return (
    <div className="box-model flex flex-col justify-center gap-15">
      <h1 className="text-4xl font-akagi font-black text-blue">
        All Bikes
      </h1>

      <div className="md:grid lg:grid lg:grid-cols-3 md:grid-cols-2 lg:gap-20 flex flex-col md:gap-10 gap-20 place-items-center">
        {bikesWithAvailability.map((allBikes) => (
          <motion.div
            key={allBikes.id}
            initial={fadeScale.initial}
            animate={fadeScale.animate}
            transition={fadeScale.transition}
            className="lg:w-80 w-full"
          >
            <BikesCardDark bike={allBikes} reservationData={reservationData} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default AllBikes;