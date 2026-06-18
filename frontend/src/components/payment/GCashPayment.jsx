
function GCashPayment({payment, onClose}) {

   
  return (
    <>
        <div className="box-model fixed inset-0 bg-black/60 flex items-center justify-center">
    
            <div
                className='bg-white rounded-2xl px-10 py-10 flex flex-col gap-5 items-center justify-center text-center'>
                
                <h1 className='font-akagi font-bold text-[#505050] text-2xl'>
                    Pay with GCash
                </h1>

                <div className='hidden flex flex-row gap-4 items-center'>
                    <div className='w-8 h-8 rounded-full bg-blue flex items-center justify-center'>
                        <h1 className='text-md font-akagi text-white'>1</h1>
                    </div>

                    <div className='w-10 h-0.5 bg-black/20 rounded-xl'></div>

                    <div className='w-8 h-8 rounded-full bg-[#505050] flex items-center justify-center'>
                        <h1 className='text-md font-akagi text-white'>2</h1>
                    </div>
                </div>

                <div className='flex flex-col gap-2'>
                    <h1 className='font-akagi font-bold text-[#505050] text-md'>
                        Scan the QR below using your GCash app
                    </h1>

                </div>

                <div className='flex flex-col gap-5 items-center justify-center'>
                    <img src='https://res.cloudinary.com/dp3vkgxtb/image/upload/v1779959866/qrcode_envfyr.png'
                        className='w-20 h-20'></img>

                    <div className='flex flex-col gap-1'>
                        <h1 className='font-akagi font-bold text-[#505050] text-md'>
                            Amount to pay:
                        </h1>

                        <h1 className='font-akagi font-bold text-blue text-xl'>
                            P{payment}
                        </h1>
                    </div>

                    <div className='flex flex-col gap-5'>
                        <h1 className='font-akagi font-light text-[#505050] text-md'>
                            or
                        </h1>

                        <div className='flex flex-col gap-4'>
                            <div className='px-5 py-2 rounded-full bg-blue cursor-pointer '>
                                <h1 className='font-akagi font-bold text-white text-md'>
                                    Go to GCash
                                </h1>
                            </div>

                            <h1 
                                onClick={onClose}
                                className='text-sm font-akagi text-black/30 hover:underline duration-300 cursor-pointer transition-all'>Cancel</h1>
                        </div>
                    </div>
                </div>
            </div>

        </div>
        
    </>
  )
}

export default GCashPayment
