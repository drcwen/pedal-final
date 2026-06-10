import { supabase } from "../../lib/supabase"
import Sidebar from "./sidebar/Sidebar"
import { MdDirectionsBike } from "react-icons/md";
import { FaPlus } from "react-icons/fa6";


function POS() {

  return (
    <>

        <div className='w-full h-screen bg-[#F2F2F2] flex'>
            <Sidebar active={'pos'}/>

            <div className='flex-1 py-15 px-10'>

                <div className='w-full h-full p-10 bg-[#ffffff] rounded-xl flex flex-col gap-12'>
                    
                    <div className='flex flex-col gap-12'>
                        <div className='flex flex-row gap-5'>
                            {/*Search*/}
                            <div className='rounded-lg bg-[#DBDBDB] px-3 py-2'>
                                <input className='text-xl font-akagi font-bold text-[#9E9E9E]' placeholder='Search'></input>
                            </div>
                        </div>

                        <div className='flex flex-col gap-5'>
                            {/*Date*/}
                            <div className=''>
                                <h1 className='text-2xl font-akagi font-bold text-[#9E9E9E]'>March 13, 2026</h1>
                            </div>

                            <div className='flex flex-row justify-between'>
                                {/*Transaction Types*/}
                                <div className='rounded-2xl border-3 border-blue grid grid-cols-2'>
                                    <div className='p-2 flex justify-center px-5 cursor-pointer'>
                                        <h1 className='text-xl font-akagi font-bold text-blue'>Ongoing</h1>
                                    </div>

                                    <div className='p-2 bg-blue rounded-tr-xl rounded-br-xl flex justify-center px-5 cursor-pointer'>
                                        <h1 className='text-xl font-akagi font-bold text-[#ffffff]'>Reservations</h1>
                                    </div>
                                </div>

                                {/*Add Transactions*/}
                                <div className='rounded-2xl bg-yellow items-center flex flex-row gap-3 px-6'>
                                    <FaPlus className='text-2xl text-darkblue'/>
                                    <h1 className='text-xl font-akagi font-bold text-darkblue tracking-wider'>ADD</h1>
                                </div>


                            </div>
                        </div>
                    </div>

                    <div className='flex-1 bg-blue'>
                        <h1>Hello</h1>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default POS
