import { motion } from "motion/react"
import { fadeScale } from "../../animations/fadeScale"
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { IoClose } from "react-icons/io5";

function AddedToCart({setAddToRent, setConfirm} ) {

    const navigate = useNavigate();

    const handleSubmit = () => {
        navigate("/cart");
    }

    return (
        <>
        <div className='box-model fixed inset-0 z-100 bg-black/60 flex items-center justify-center'>
            <motion.div
                initial={fadeScale.initial}
                animate={fadeScale.animate}
                transition={fadeScale.transition}
                className='relative bg-navyblue rounded-2xl px-10 py-10 flex flex-col gap-10 items-center justify-center text-center'
            >
                {/* Close Button */}
                <button
                    type="button"
                    onClick={() => {
                        setConfirm(false);
                        setAddToRent(null);
                    }}
                    className="absolute top-4 right-4 text-white/70 hover:text-white transition"
                    aria-label="Close modal"
                >
                    <IoClose className="text-2xl" />
                </button>

                        <div className='flex flex-col gap-5'>
                            <div className='flex flex-col gap-4 items-center justify-center'>
                                <FaCheckCircle className='text-6xl text-yellow'/>
                                <h1 className='font-akagi font-black text-yellow text-2xl'>Added!</h1>
                            </div>
                            <h1 className='text-gray-300 font-akagi font-semibold text-md'>Your bike is added to your rents.</h1>

                            <div className='w-full flex flex-row justify-between'>
                                <div 
                                    onClick={() => {
                                        setConfirm(false);
                                        setAddToRent(null);
                                    }}
                                    className='bg-white/20 rounded-lg px-3 py-1 cursor-pointer'>
                                    <h1 className='text-sm font-akagi font-semibold text-white'>Order More</h1>
                                </div>
                                <div 
                                    onClick={handleSubmit}
                                    className='w-fit bg-white/20 rounded-lg px-3 py-1 cursor-pointer' >
                                    <h1 className='text-sm font-akagi font-semibold text-white'>Go to Cart</h1>
                                </div>
                            </div>
                        </div>

            </motion.div>
        </div>
        </>
    )
};

export default AddedToCart;