import { IoMdArrowDropdown } from "react-icons/io";

function CartSection() {

    
  return (
    <div className='box-model flex flex-col gap-5 flex flex-col justify-center'>

        <div className="lg:grid lg:grid-cols-3 lg:gap-15 flex flex-col">

            <div className="col-span-2 flex flex-col gap-5">

                <div className='lg:grid lg:grid-cols-2 lg:grid-rows-2 lg:gap-3 pt-20 flex flex-col gap-3'>

                    <div className='flex flex-row items-center gap-4'>
                        <h1 className='w-28 font-akagi text-[#6D7172] font-bold whitespace-nowrap'>First Name:</h1>
                        <div className='w-full bg-[#D9D9D9] rounded-lg px-3 py-1'>
                            <h1 className='font-akagi text-[#6D7172] font-bold'>Wendel</h1>
                        </div>
                    </div>

                    <div className='flex flex-row items-center gap-4'>
                        <h1 className='w-28 font-akagi text-[#6D7172] font-bold whitespace-nowrap'>Last Name:</h1>
                        <div className='w-full bg-[#D9D9D9] rounded-lg px-3 py-1'>
                            <h1 className='font-akagi text-[#6D7172] font-bold'>Derraco</h1>
                        </div>
                    </div>

                    <div className='flex flex-row items-center gap-4'>
                        <h1 className='w-28 font-akagi text-[#6D7172] font-bold whitespace-nowrap'>Username:</h1>
                        <div className='w-full bg-[#D9D9D9] rounded-lg px-3 py-1'>
                            <h1 className='font-akagi text-[#6D7172] font-bold'>drcwen</h1>
                        </div>
                    </div>

                    <div className='flex flex-row items-center gap-4'>
                        <h1 className='w-28 font-akagi text-[#6D7172] font-bold whitespace-nowrap'>Email:</h1>
                        <div className='w-full bg-[#D9D9D9] rounded-lg px-3 py-1'>
                            <h1 className='font-akagi text-[#6D7172] font-bold'>wendelderraco@gmail.com</h1>
                        </div>
                    </div>
                </div>

                <div className='h-70 overflow-y-auto flex flex-col gap-4 lg:pl-5 lg:pr-10 py-5'>
                    <div className='flex flex-row gap-5 items-center justify-between'>
                        <img src='https://res.cloudinary.com/dp3vkgxtb/image/upload/v1775884921/kiddie_sidecar_oe7wve.png'
                            className='w-20'/>

                        <h1 className='hidden lg:flex font-akagi font-bold text-[#6D7172]'>Family Bike</h1>

                        <h1 className='hidden lg:flex font-akagi font-light text-[#6D7172]'>x1</h1>

                        <h1 className='hidden lg:flex font-akagi font-light text-[#6D7172]'>March 3, 2026</h1>

                        <h1 className='hidden lg:flex font-akagi font-light text-[#6D7172]'>3:00 PM</h1>

                        <h1 className='hidden lg:flex font-akagi font-light text-[#6D7172]'>1 hour</h1>

                        <h1 className='hidden lg:flex font-akagi font-bold text-[#6D7172]'>P250</h1>
                    </div>

                    
                </div>

                <div className='flex flex-col gap-10'>

                    <div className='w-full h-0.5 bg-black/20 rounded-lg'></div>

                    <div className='w-full px-10 flex justify-between items-center'>
                        <h1 className='font-akagi font-bold text-[#6D7172] text-3xl'>Total</h1>
                        <h1 className='font-akagi font-bold text-blue text-3xl'>P450</h1>
                    </div>
                </div>
            </div>

            <div className="col-span-1 flex flex-col gap-5">
                <div className='mt-auto bg-[#D9D9D9] rounded-lg px-5 py-7 flex flex-col gap-2'>
                    <h1 className='font-akagi font-bold text-[#6D7172] text-xl'>Payment</h1>
                    <div className='w-full rounded-lg bg-[#6D7172] p-5 flex items-center justify-between'>
                        <h1 className='font-akagi font-bold text-[#D9D9D9] text-xl'>GCash</h1>
                        <IoMdArrowDropdown className='text-3xl text-white cursor-pointer'/>
                    </div>

                </div>

                <div className='rounded-lg bg-blue flex items-center justify-center py-3 cursor-pointer'>
                    <h1 className='font-akagi font-bold text-[#D9D9D9] text-xl'>Checkout</h1>
                </div>
            </div>
        </div>
        
    </div>
  );
}

export default CartSection;