import { useState } from "react";
import AllBikes from "../components/sections/AllBikes";
import StaticNavigation from "../components/layout/Navigation/StaticNavigationPC";
import SetTimeAndDate from "../components/layout/SetTimeAndDate";
import { IoMdArrowRoundBack } from "react-icons/io";
import AdjustNumberWithLimit from "../components/ui/AdjustNumberWithLimit"
import { IoMdCart } from "react-icons/io";
import { motion } from "motion/react"
import { supabase } from "../lib/supabase"
import AddToCart from "../components/ui/AddedToCart"

function Reserve() {

  const [reservationData, setReservationData] = useState(null);
  const [open, setOpen] = useState(true);

  const [confirm, setConfirm] = useState(false);

  const [addToRent, setAddToRent] = useState(null);
  const [bike, setBike] = useState(null);

  const [quantity, setQuantity] = useState(1);

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

  function formatTime(time) {
    if (!time) return "";

    const [hours, minutes] = time.split(":");

    const hour = Number(hours);

    const period = hour >= 12 ? "PM" : "AM";

    const formattedHour = hour % 12 || 12;

    return `${formattedHour}:${minutes} ${period}`;
}

  const handleSubmit = async () => {

    try {

        const { data: userData, error: userError } =
            await supabase.auth.getUser();

        if (userError || !userData?.user) {
            console.error("No user found");
            return;
        }

        const user = userData.user;

        const start = new Date(
            `${reservationData.date}T${reservationData.startTime}`
        );

        const end = new Date(start);
        end.setHours(
            end.getHours() + Number(reservationData.hours)
        );

        const reservation_range =
            `[${start.toISOString()},${end.toISOString()})`;

        // Create one order for each quantity
        const orders = Array.from({ length: quantity }, () => ({
            user_id: user.id,
            bike_id: null,
            bike_type_id: bike.id,
            reservation_date: reservationData.date,
            start_time: reservationData.startTime,
            duration_hours: reservationData.hours,
            status: "reserved",
            transaction_id: null,
            reservation_range,
        }));

        const { data, error } = await supabase
            .from("orders_mod")
            .insert(orders)
            .select();

        if (error) {
            console.error("Insert error:", error);
            return;
        }

        console.log(`${quantity} orders created:`, data);

        setConfirm(!confirm);

    } catch (err) {
        console.error("Unexpected error:", err);
    }

    console.log("tite");
};


  return (
    <div className="w-full min-h-screen bg-[#f7f7f7]">

      <StaticNavigation />

      {addToRent ? 
        <div className='w-full min-h-screen overflow-y-scroll scrollbar-thin scrollbar-thumb-[#B9B9B9] scrollbar-track-[#E2E2E2] pt-30 px-10 py-10 flex flex-col'>
          <IoMdArrowRoundBack 
            onClick={() => setAddToRent(null)}
            className='text-gray text-2xl'/>

          <div className='lg:grid lg:grid-cols-2 flex flex-col lg:gap-10 gap-8 flex-1'>

              <div className='w-full h-full items-center justify-center flex flex-col gap-2 font-akagi font-bold text-blue'>
                  <img
                      src={bike.image_url}
                      className='w-70 rounded-2xl'
                  />
              </div>

              <div className='w-full h-full flex flex-col gap-5 items-center lg:items-start lg:justify-center font-akagi font-bold text-blue'>
              
                <div className='flex flex-col gap-1 lg:items-start items-center'>
                  <h1 className='text-3xl font-extrabold text-darkblue'>{bike.name}</h1>

                  <div className='w-fit bg-yellow rounded-lg px-3 py-1 text-navyblue'>
                    <h1>{bike.available_bikes} units available</h1>
                  </div>
                </div>

                <div className="pb-20 flex flex-col gap-10 items-center lg:items-start">
                  <div className="grid grid-cols-2 lg:gap-x-6 gap-y-4 items-center w-full">

                      {/* Quantity */}
                      <h1 className="font-akagi font-semibold text-lg lg:text-xl text-[#979B9D]">
                          Quantity
                      </h1>
                      <div>
                          <AdjustNumberWithLimit value={quantity} setValue={setQuantity} limit={bike.available_bikes}/>
                      </div>

                      {/* Hours */}
                      <h1 className="font-akagi font-semibold text-lg lg:text-xl text-[#979B9D]">
                          Hours
                      </h1>

                      <div className="border-2 border-[#979B9D] rounded-lg flex items-center justify-center lg:py-1 px-4">
                          <h1 className="text-lg font-bold font-akagi text-[#979B9D]">
                              {reservationData.hours === 1 ? reservationData.hours + " hour" : reservationData.hours + " hours"}
                          </h1>
                      </div>

                      {/* Date */}
                      <h1 className="font-akagi font-semibold text-lg lg:text-xl text-[#979B9D]">
                          Date
                      </h1>
                      <div className="border-2 border-[#979B9D] rounded-lg flex items-center justify-center lg:py-1 px-4">
                          <h1 className="text-lg font-bold font-akagi text-[#979B9D]">
                              {formatDisplayDate(reservationData.date)}
                          </h1>
                      </div>

                      {/* Date */}
                      <h1 className="font-akagi font-semibold text-lg lg:text-xl text-[#979B9D]">
                          Time
                      </h1>
                      <div className="border-2 border-[#979B9D] rounded-lg flex items-center justify-center lg:py-1 px-4">
                          <h1 className="text-lg font-bold font-akagi text-[#979B9D]">
                              {formatTime(reservationData.startTime)}
                          </h1>
                      </div>

                  </div>

                  <motion.button className='w-fit bg-blue rounded-lg px-3 py-2 flex flex-row items-center gap-2 cursor-pointer'
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onHoverStart={() => console.log('hover started!')}
                      onClick={handleSubmit}
                      
                  >
                      <IoMdCart className='text-xl text-[#FFFFFF]'/>
                      <h1 className="text-lg font-bold font-akagi text-[#FFFFFF]">Add to Rent</h1>
                  </motion.button>
              </div>
            </div>
          </div>
          
        </div> :
        <>
          <AllBikes 
            onOpen={() => setOpen(!open)}
            reservationData={reservationData}
            setAddToRent={setAddToRent}
            setBike={setBike}
          />

          {open && (
            <SetTimeAndDate
              setReservationData={setReservationData}
              onClose={() => setOpen(false)}
              reservationData={reservationData}
            />
          )}
        </> 
      }

      {confirm && 
        <AddToCart setAddToRent={setAddToRent} setConfirm={setConfirm}/>
      }

    </div>
  );
}

export default Reserve;