
import FamilyBikesCarousel from "../layout/bikes/FamilyBikesCarousel"
import SoloBikesCarousel from "../layout/bikes/SoloBikesCarousel"
import SoloBikesDisplay from "../layout/bikes/SoloBikesDisplay"
import FamilyBikesDisplay from "../layout/bikes/FamilyBikesDisplay"
import { motion } from "motion/react"
import { fadeScale } from "../../animations/fadeScale"


function LandingBikes() {

    return (
        <>
            <div className='min-h-screen bg-[#F7F7F7] px-10 py-20 flex flex-col items-center justify-center gap-10 md:items-start md:py-25 md:px-30 md:flex md:flex-col md:gap-20'>
                
                <h1 className='font-akagi font-black tracking-wide text-blue text-4xl'>
                    Solo Bikes
                </h1>

                <div className='w-full'>
                    {/*PC*/}
                    <motion.div
                            initial={fadeScale.initial}
                            animate={fadeScale.animate}
                            transition={fadeScale.transition}
                            className='hidden lg:flex'>
                        <SoloBikesCarousel/>
                    </motion.div>

                    {/*Mobile*/}
                    <div className='flex lg:hidden items-center justify-center'>
                        <SoloBikesDisplay />
                    </div>
                    
                </div>

                <h1 className='font-akagi font-black tracking-wide text-blue text-4xl'>
                    Family Bikes
                </h1>

                <div className='w-full'>
                    {/*PC*/}
                    <div className='hidden lg:flex'>
                        <FamilyBikesCarousel/>
                    </div>

                    {/*Mobile*/}
                    <div className='flex lg:hidden items-center justify-center'>
                        <FamilyBikesDisplay />
                    </div>
                </div>
            </div>
        </>
    )
}

export default LandingBikes