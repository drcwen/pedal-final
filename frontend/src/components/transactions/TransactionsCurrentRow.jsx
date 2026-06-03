
function TransactionCurrentRow() {

    return (
        <div className='flex flex-row justify-between items-center'>
            <div className='flex flex-row gap-5 py-3 items-center'>
                {/*Image*/}
                <img className='w-15 h-15' src='https://res.cloudinary.com/dp3vkgxtb/image/upload/v1775884918/solo_bike_mhxxvb.png'></img>
                
                <div className='flex flex-col justify-between pt-2 pb-2'>
                    <div className='flex flex-row gap-3 items-center'>
                        <h1 className='text-xl font-akagi font-bold text-[#6D7172]'>Mountain Bike</h1>
                        <h1 className='text-md font-akagi font-light text-[#6D7172]'>x1</h1>
                    </div>
                    <h1 className='text-md font-akagi font-light text-[#6D7172]'>2 hours</h1>
                    
                </div>
                
            </div>

            <div className=''>
                <h1 className='text-md font-akagi font-semibold text-[#6D7172]'>12 / 22 / 2003</h1>
            </div>

            <div className=''>
                <h1 className='text-md font-akagi font-semibold text-[#6D7172]'>3:00 PM</h1>
            </div>

            <div className=''>
                <h1 className='text-md font-akagi font-semibold text-[#6D7172]'>Pending</h1>
            </div>

        </div>
    );
}

export default TransactionCurrentRow;