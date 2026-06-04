
import TransactionCurrentRow from "../transactions/TransactionsCurrentRow"
import { IoMdArrowDropdown } from "react-icons/io";
import { useEffect, useState } from "react"

function TransactionsSection() {

    const [onClick, setOnClick] = useState(false);

  return (
    <>

        <div className='box-model flex flex-col gap-20 flex flex-col'>

            <div className='flex flex-col gap-7'>

            
                <div className=''>
                    <h1 className='font-akagi font-black text-blue text-4xl'>Transactions</h1>
                </div>

                <div className='w-fit rounded-2xl border-3 border-blue grid grid-cols-2'>
                    <div className='cursor-pointer bg-blue px-6 py-1 rounded-tl-xl rounded-bl-xl flex items-center justify-center'>
                        <h1 className='text-lg font-akagi text-[#FFFFFF] font-black'>Active</h1>
                    </div>

                    <div className='cursor-pointer px-6 py-1 rounded-tr-xl rounded-br-xl flex items-center justify-center'>
                        <h1 className='text-lg font-akagi text-blue font-black'>Past</h1>
                    </div>
                </div>

            </div>

            <div className='flex flex-col gap-3'>
                
                <TransactionCurrentRow/>
                <div className='h-0.5 w-full bg-black/10 rounded-lg'/>
                <TransactionCurrentRow/>
                <div className='h-0.5 w-full bg-black/10 rounded-lg'/>
                <TransactionCurrentRow/>
                <div className='h-0.5 w-full bg-black/10 rounded-lg'/>
                <TransactionCurrentRow/>
            
            </div>
            

        </div>
        

    </>
  )
}

export default TransactionsSection
