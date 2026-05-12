import { useState } from "react";
import AllBikes from "../components/sections/AllBikes";
import StaticNavigation from "../components/layout/Navigation/StaticNavigationPC";
import SetTimeAndDate from "../components/layout/SetTimeAndDate";

function Reserve() {

  const [reservationData, setReservationData] = useState(null);
  const [open, setOpen] = useState(true);

  return (
    <div className="w-full bg-[#f7f7f7]">

      <StaticNavigation />

      <AllBikes reservationData={reservationData}/>

      {open && (
        <SetTimeAndDate
          setReservationData={setReservationData}
          onClose={() => setOpen(false)}
        />
      )}

    </div>
  );
}

export default Reserve;