import BikeCard from "./BikeCard"
import { supabase } from "../../../lib/supabase"
import { useEffect, useState } from "react"

function SoloBikesDisplay() {

    const [info, setInfo] = useState([]);

    useEffect(() => {
        const fetchBikes = async () => {
            const { data, error } = await supabase
                .from("bike_types")
                .select("*")
                .eq("type_isSolo", false)

            console.log("DATA:", data)
            console.log("ERROR:", error)

            setInfo(data || [])
        }

        fetchBikes()
    }, [])


    return (
        <>
            <div className='flex flex-col gap-20'>
                {info.map((bike) => (
                    <div key={bike.type_id}>
                        <BikeCard bike={bike} />
                    </div>
                ))}
            </div>
        </>
    )
}

export default SoloBikesDisplay