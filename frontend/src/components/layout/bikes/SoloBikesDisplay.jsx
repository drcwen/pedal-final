import BikeCard from "./BikeCard"
import { supabase } from "../../../lib/supabase"
import { useEffect, useState } from "react"
import { motion } from "motion/react"
import { fadeScale } from "../../../animations/fadeScale"

function SoloBikesDisplay() {

    const [info, setInfo] = useState([]);

    useEffect(() => {
        const fetchBikes = async () => {
            const { data, error } = await supabase
                .from("bike_types_mod")
                .select("*")
                .eq("is_solo", true)

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
                        key={bike.id}
                    >
                        <BikeCard bike={bike} />
                    </motion.div>
                ))}
            </div> 
        </>
    )
}

export default SoloBikesDisplay