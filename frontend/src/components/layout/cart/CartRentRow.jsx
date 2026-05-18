import { fade } from "../../../animations/fade"
import { motion } from "framer-motion";

function CartRentRow({name, hour, reservationdate, starttime, checked, onCheck, price }) {

  return (

            <motion.div 
                initial={fade.initial}
                animate={fade.animate}
                transition={fade.transition}
                className='flex flex-col gap-5'>

                <div className='flex lg:flex-row items-center lg:justify-between '>
                    
                    <div className=''>
                        <input type='checkbox' className='lg:w-5 lg:h-5 accent-blue-500'
                            checked={checked}
                            onChange={onCheck}></input>
                    </div>

                    {/*Image and Details*/}
                    <div className='flex flex-row gap-5'>
                        <div className='bg-yellow rounded-lg'>
                            <img src='https://res.cloudinary.com/dp3vkgxtb/image/upload/v1775882068/bmx__ydrvxq.png' className='px-2 py-2 w-20 rounded-lg'></img>
                        </div>

                        <div className='flex flex-col'>
                            <h1 className='font-akagi text-md font-semibold text-[#6D7172]'>{name}</h1>

                            {/*Details for PC*/}
                            <div className='lg:flex lg:flex-row hidden gap-2'>
                                <h1 className='lg:flex font-akagi text-md font-light text-[#6D7172]'>{hour} hour</h1>
                                <h1 className='lg:flex font-akagi text-md font-light text-[#6D7172]'>x1</h1>
                            </div>

                            {/*Details for mobile*/}
                            <div className='w-full md:hidden grid grid-cols-2'>
                                <div className='flex flex-row gap-2'>
                                    <h1>Hours</h1>
                                    <div className='rounded-lg border-2 '>
                                        <h1>   2    </h1>
                                    </div>
                                </div>

                                <div>
                                    <h1>Hello</h1>
                                </div>

                                <div>
                                    <h1>Hello</h1>
                                </div>

                                <div>
                                    <h1>Hello</h1>
                                </div>
                            </div>
                            <h1 className='lg:flex hidden font-akagi text-md font-semibold text-[#6D7172]'>1</h1>
                        </div>
                    </div>

                    <div className='lg:flex lg:flex-row hidden gap-10'>

                        <div className='flex flex-col gap-2 items-center justify-center'>
                            <div className='rounded-lg border-2 border-[#979B9D]'>
                                <h1 className='px-10 py-1 text-[#6D7172] font-semibold text-lg'>1</h1>
                            </div>
                            <h1 className='font-akagi text-md font-semibold text-[#6D7172]'>Quantity</h1>
                        </div>

                        <div className='flex flex-col gap-2 items-center justify-center'>
                            <div className='rounded-lg border-2 border-[#979B9D]'>
                                <h1 className='px-10 py-1 text-[#6D7172] font-semibold  text-lg'>{hour}</h1>
                            </div>
                            <h1 className='font-akagi text-md font-semibold text-[#6D7172]'>Hour</h1>
                        </div>

                        <div className='flex flex-col gap-2 items-center justify-center'>
                            <div className='rounded-lg border-2 border-[#979B9D]'>
                                <h1 className='py-1 px-4 font-akagi text-lg font-semibold text-[#6D7172]'>{reservationdate}</h1>
                            </div>
                            <h1 className='font-akagi text-md font-semibold text-[#6D7172]'>Date</h1>
                        </div>

                        <div className='flex flex-col gap-2 items-center justify-center'>
                            <div className='rounded-lg border-2 border-[#979B9D]'>
                                <h1 className='py-1 px-4 font-akagi text-lg font-semibold text-[#6D7172]'>{starttime}</h1>
                            </div>
                            <h1 className='font-akagi text-md font-semibold text-[#6D7172]'>Time</h1>
                        </div>

                    </div>

                    <div className='flex items-center justify-center'>
                        <h1 className='lg:flex hidden text-3xl font-akagi font-bold text-[#6D7172]'>P{price}</h1>
                    </div>
                </div>
            </motion.div>

  );
}

export default CartRentRow;