import BikeCard from "./BikeCard"
import { supabase } from "../../../lib/supabase"
import { useEffect, useState } from "react"
import { motion } from "motion/react"
import { fadeScale } from "../../../animations/fadeScale"

function FamilyBikesDisplay() {

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
            <div className='flex flex-col lg:grid lg:grid-cols-3 lg:gap-15 gap-20'>
        
                {info.map((bike) => (
                    <motion.div
                        initial={fadeScale.initial}
                        animate={fadeScale.animate}
                        transition={fadeScale.transition} 
                        key={bike.type_id}
                    >
                        <BikeCard bike={bike} />
                    </motion.div>
                ))}
            </div> 
        </>
    )
}

export default FamilyBikesDisplay