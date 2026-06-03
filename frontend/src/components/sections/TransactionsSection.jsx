
import TransactionCurrentRow from "../transactions/TransactionsCurrentRow"

function TransactionsSection() {

  return (
    <>

        <div className='box-model flex flex-col gap-7 flex flex-col justify-center'>

            <div className=''>
                <h1 className='font-akagi font-black text-blue text-4xl'>Transactions</h1>
            </div>

            <div className='w-fit rounded-2xl border-3 border-blue grid grid-cols-2'>
                <div className='cursor-pointer bg-blue px-8 py-2 rounded-tl-xl rounded-bl-xl flex items-center justify-center'>
                    <h1 className='text-xl font-akagi text-[#FFFFFF] font-black'>Active</h1>
                </div>

                <div className='cursor-pointer px-5 py-2 rounded-tr-xl rounded-br-xl flex items-center justify-center'>
                    <h1 className='text-xl font-akagi text-blue font-black'>Past</h1>
                </div>
            </div>

            <div className='flex flex-col gap-3'>
                <div className='h-90 overflow-y-auto flex flex-col gap-4 py-5'>

                    <div className='rounded-lg bg-[#D9D9D9] flex flex-col gap-4 px-13 py-4'>
                        
                        <TransactionCurrentRow/>
                        <div className='h-0.5 w-full bg-black/10'/>
                        <TransactionCurrentRow/>
                        <div className='h-0.5 w-full bg-black/10'/>
                        <TransactionCurrentRow/>
                        <div className='h-0.5 w-full bg-black/10'/>
                        <TransactionCurrentRow/>
                        <div className='h-0.5 w-full bg-black/10'/>
                        <TransactionCurrentRow/>
                    </div>

                    

                </div>
            </div>

        </div>
        

    </>
  )
}

export default TransactionsSection
