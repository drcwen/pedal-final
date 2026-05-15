import SetTimeAndDate from "../layout/SetTimeAndDate"
import { useState } from "react"
import AllBikes from "../../components/sections/AllBikes"
import BikeExpand from "./bikes/BikeExpand"

function ReservationPage() {

    const [reservationData, setReservationData] = useState(null)

    return (
        <div>

            <SetTimeAndDate
                setReservationData={setReservationData}
            />

            <AllBikes
                reservationData={reservationData}
            />  

            <BikeExpand reservationData={reservationData}/>

        </div>
    )
}

export default ReservationPage