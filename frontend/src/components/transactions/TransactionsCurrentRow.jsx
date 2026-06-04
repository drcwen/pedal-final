import { IoMdArrowDropdown } from "react-icons/io";

function TransactionCurrentRow() {

    return (
        <div className='rounded-xl p-2'>
            <div className='grid grid-cols-5 justify-between items-center'>
                <div className='w-fit rounded-lg px-4 py-2 bg-yellow'>
                    <h1 className='text-xl font-akagi font-black text-navyblue'>3</h1>
                </div>

                <div className='flex justify-center'>
                    <h1 className='text-xl font-akagi font-bold text-[#6D7172]'>March 30, 2026</h1>
                </div>

                <div className='flex justify-center'>
                    <h1 className='text-xl font-akagi font-bold text-[#6D7172]'>GCash</h1>
                </div>

                <div className='flex justify-center'>
                    <h1 className='text-xl font-akagi font-bold text-[#6D7172]'>P260</h1>
                </div>

                <div className='flex justify-end'>
                    <IoMdArrowDropdown className='text-2xl text-[#6D7172]'/>
                </div>
            </div>
        </div>
    );
}

export default TransactionCurrentRow;