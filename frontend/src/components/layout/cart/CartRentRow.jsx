import AdjustNumber from "../../ui/AdjustNumber"
import { useState } from "react"

function CartRentRow() {

    const [hour, setHour] = useState(1);

  
  return (


            <div className='flex flex-col gap-5'>

                <div className='flex lg:flex-row items-center justify-between'>
                    
                    <div className=''>
                        <input type='checkbox' className='lg:w-5 lg:h-5 accent-blue-500'></input>
                    </div>

                    {/*Image and Details*/}
                    <div className='flex flex-row gap-5'>
                        <div className='bg-yellow rounded-lg'>
                            <img src='https://res.cloudinary.com/dp3vkgxtb/image/upload/v1775882068/bmx__ydrvxq.png' className='px-2 py-2 w-20 rounded-lg'></img>
                        </div>

                        <div className='flex flex-col'>
                            <h1 className='font-akagi text-md font-semibold text-[#6D7172]'>Family Bike</h1>
                            <div className='flex flex-row gap-2'>
                                <h1 className='lg:flex hidden font-akagi text-md font-light text-[#6D7172]'>1 hour</h1>
                                <h1 className='lg:flex hidden font-akagi text-md font-light text-[#6D7172]'>x1</h1>
                            </div>
                            <h1 className='lg:flex hidden font-akagi text-md font-semibold text-[#6D7172]'>P250</h1>
                        </div>
                    </div>

                    <div className='lg:flex lg:flex-row hidden gap-10'>

                        <div className='flex flex-col gap-2 items-center justify-center'>
                            <AdjustNumber value={hour} setValue={setHour}/>
                            <h1 className='font-akagi text-md font-semibold text-[#6D7172]'>Quantity</h1>
                        </div>

                        <div className='flex flex-col gap-2 items-center justify-center'>
                            <AdjustNumber value={hour} setValue={setHour}/>
                            <h1 className='font-akagi text-md font-semibold text-[#6D7172]'>Hour</h1>
                        </div>

                        <div className='flex flex-col gap-2 items-center justify-center'>
                            <div className='rounded-lg border-2 border-[#979B9D]'>
                                <h1 className='py-1 px-4 font-akagi text-lg font-semibold text-[#6D7172]'>03   /    03    /    2026</h1>
                            </div>
                            <h1 className='font-akagi text-md font-semibold text-[#6D7172]'>Date</h1>
                        </div>

                        <div className='flex flex-col gap-2 items-center justify-center'>
                            <div className='rounded-lg border-2 border-[#979B9D]'>
                                <h1 className='py-1 px-4 font-akagi text-lg font-semibold text-[#6D7172]'>03   /    03    /    2026</h1>
                            </div>
                            <h1 className='font-akagi text-md font-semibold text-[#6D7172]'>Time</h1>
                        </div>

                    </div>

                    <div className='flex items-center justify-center'>
                        <h1 className='lg:flex hidden text-3xl font-akagi font-bold text-[#6D7172]'>P250</h1>
                    </div>
                </div>
            </div>

  );
}

export default CartRentRow;