import { supabase } from "../../lib/supabase"
import BikesCardDark from "../../components/layout/bikes/BikeCardDark"
import { useEffect, useState } from "react"
import { motion } from "motion/react"
import { fadeScale } from "../../animations/fadeScale"
import Lenis from "lenis";


function AllBikes() {

    const [bikes, setBikes] = useState([]);
    const [familyBikes, setFamilyBikes] = useState([]);
    const [soloBikes, setSoloBikes] = useState([]);

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


    useEffect(() => {
        
        const fetchBikes = async () => {
            const { data, error } = await supabase
                .from("bike_types")
                .select("*")

                console.log("DATA: ", data)
                console.log("ERROR: ", error)

                setBikes(data || [])
        }

        const fetchFamilyBikes = async () => {
            const { data, error } = await supabase
                .from("bike_types")
                .select("*")
                .eq("type_isSolo", false)

                console.log("DATA: ", data)
                console.log("ERROR: ", error)

                setFamilyBikes(data || [])

        }

        const fetchSoloBikes = async () => {
            const { data, error } = await supabase
                .from("bike_types")
                .select("*")
                .eq("type_isSolo", true)

                console.log("DATA: ", data)
                console.log("ERROR: ", error)

                setSoloBikes(data || [])

        }

        fetchBikes()
        fetchFamilyBikes()
        fetchSoloBikes()
    }, [])

  return (
    <>
            <div className='snap-start h-screen box-model flex flex-col justify-center gap-15'>
                
                <h1 className='text-4xl font-akagi font-black text-blue'>All Bikes</h1>

                <div className='grid grid-cols-3 gap-20 place-items-center'>
                    {bikes.map((allBikes) => (
                        <motion.div
                            key={allBikes.type_id}
                            initial={fadeScale.initial}
                            animate={fadeScale.animate}
                            transition={fadeScale.transition}
                            className='w-80'
                        >
                            <BikesCardDark bike={allBikes} />
                        </motion.div>
                    ))}
                </div>

                
            </div>
        
        
    </>
  )
}

export default AllBikes
