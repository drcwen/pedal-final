

function OngoingRow({  }) {

  return (
    <>
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 sm:px-10 px-5 md:px-20 lg:px-60 xl:px-100">
            <div className="w-full bg-[#F0F0F0] p-6 rounded-xl font-akagi font-bold text-lg text-gray flex flex-col gap-5">
                <h1 className='text-3xl text-navyblue'>Payment</h1>

                <div className='border border-gray rounded-lg w-fit'>
                    <div className='grid grid-cols-2'>
                        <div className='text-xl text-gray bg-gray flex items-center p-2'>
                            <h1 className='text-[#ffffff] px-2'>GCash</h1>
                        </div>
                        
                        <div className='text-xl text-gray'>
                            <h1 className='text-gray px-2'>GCash</h1>
                        </div>
                    </div>
                </div>
            </div>
        </div>
                                
    </>
  )
}

export default OngoingRow
