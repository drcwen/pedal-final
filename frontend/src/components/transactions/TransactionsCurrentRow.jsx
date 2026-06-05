import { FaArrowRight } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";


function TransactionCurrentRow({ bikeCount, date, method, total, status }) {

    return (
        <div  
            className='rounded-xl p-2 flex flex-col lg:gap-7 gap-4 cursor-pointer'>
            <div className='hidden lg:grid lg:grid-cols-6 justify-between items-center'>
                <div className='w-fit rounded-lg px-4 py-2 bg-yellow'>
                    <h1 className='text-xl font-akagi font-black text-navyblue'>{bikeCount}</h1>
                </div>

                    <div className='flex justify-center'>
                        <h1 className='text-xl font-akagi font-bold text-[#6D7172]'>{date}</h1>
                    </div>

                <div className='flex justify-center'>
                    <h1 className='text-xl font-akagi font-bold text-[#6D7172]'>{method}</h1>
                </div>

                <div className='flex justify-center'>
                    <h1 className='text-xl font-akagi font-bold text-[#6D7172]'>{total}</h1>
                </div>

                <div className='flex justify-center rounded-lg'>
                    
                    <div className='rounded-lg py-1 px-3 bg-yellow'>
                        <h1 className='text-md font-akagi font-bold text-navyblue'>{status}</h1>
                    </div>
                </div>

                <div className='flex justify-end'>
                    <FaArrowRight className='text-2xl text-[#6D7172]'/>
                </div>
            </div>

            <div className='lg:hidden grid grid-cols-4 justify-between items-center'>
                <div className='w-fit rounded-lg px-3 py-1 bg-yellow'>
                    <h1 className='text-lg font-akagi font-black text-navyblue'>{bikeCount}</h1>
                </div>

                <div className=''>
                    <div className='flex justify-center'>
                        <h1 className='text-md font-akagi font-bold text-[#6D7172]'>{date}</h1>
                    </div>
                </div>

                <div className='flex justify-center'>
                    <h1 className='text-md font-akagi font-bold text-[#6D7172]'>{method}</h1>
                </div>

                <div className='flex justify-end'>
                    <FaArrowRight className='text-lg text-[#6D7172]'/>
                </div>

            </div>

            <div className='h-0.5 w-full bg-black/10 rounded-lg'/>

        </div>
    );
}

export default TransactionCurrentRow;