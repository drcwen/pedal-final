import { supabase } from "../../lib/supabase"
import BikesCardDark from "../../components/layout/bikes/BikeCardDark"
import { useEffect, useState } from "react"
import { motion } from "motion/react"
import { fadeScale } from "../../animations/fadeScale"
import Lenis from "lenis";


function AllBikes() {

    const [bikes, setBikes] = useState([]);

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
                .from("bike_types_mod")
                .select("*")

                console.log("DATA: ", data)
                console.log("ERROR: ", error)

                setBikes(data || [])
        }

        fetchBikes()
    }, [])

  return (
    <>
            <div className='box-model flex flex-col justify-center gap-15'>
                
                <h1 className='text-4xl font-akagi font-black text-blue'>All Bikes</h1>

                <div className='md:grid lg:grid lg:grid-cols-3 md:grid-cols-2 lg:gap-20 flex flex-col md:gap-10 gap-20 place-items-center'>
                    {bikes.map((allBikes) => (
                        <motion.div
                            key={allBikes.id}
                            initial={fadeScale.initial}
                            animate={fadeScale.animate}
                            transition={fadeScale.transition}
                            className='lg:w-80 w-full'
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
