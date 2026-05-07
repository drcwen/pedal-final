import { motion } from "motion/react"
import { fadeScale } from "../../animations/fadeScale"

function CompanyLogo() {

    return (
        <div>
            <motion.div
                initial={fadeScale.initial}
                animate={fadeScale.animate}
                transition={fadeScale.transition}
            >

                {/*3Jremy Title*/}
                <div className='lg:flex lg:h-full items-center justify-center'>
                    <h1 className='lg:text-6xl lg:text-2xl text-3xl font-akagi text-center leading-tight font-black 
                    text-yellow [text-shadow:2px_2px_8px_rgba(0,0,0,0.8)]'>3Jremy's <br/> Rent A Bike!</h1>
                </div>
            </motion.div>
        </div>

    )

}

export default CompanyLogo