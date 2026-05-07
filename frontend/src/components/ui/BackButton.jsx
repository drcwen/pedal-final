import {buttonClickBounce} from "../../animations/buttonClickBounce"
import { motion } from "motion/react"
import { useNavigate } from "react-router-dom";
import { IoChevronBackOutline } from "react-icons/io5";


function BackButton({ backRoute }) {

    const navigate = useNavigate();

    return (
        <div className='absolute lg:top-10 lg:left-10 bottom-11 lg:opacity-100 opacity-40 left-5'>
            <motion.button
                whileHover={buttonClickBounce.whileHover}
                whileTap={buttonClickBounce.whileTap}
                onHoverStart={buttonClickBounce.onHoverStart}
                onClick={ () => navigate(backRoute) }
            >
                <IoChevronBackOutline className='text-2xl text-darkblue cursor-pointer' />
            </motion.button>
        </div>
    )

}

export default BackButton