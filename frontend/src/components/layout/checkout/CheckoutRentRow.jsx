
function CheckoutRentRow({image, bike, quantity, rentdate, rentstart, duration, price}) {

    
  return (
    
    <div className='flex flex-row gap-5 lg:grid lg:grid-cols-7 items-center justify-items-center text-center justify-between md:px-15 lg:px-0 px-5'>
        <img src={image}
            className='hidden lg:flex w-20'/>

        <h1 className='hidden lg:flex font-akagi font-bold text-[#6D7172]'>{bike}</h1>

        <h1 className='hidden lg:flex font-akagi font-light text-[#6D7172]'>{quantity}</h1>

        <h1 className='hidden lg:flex font-akagi font-light text-[#6D7172]'>{rentdate}</h1>

        <h1 className='hidden lg:flex font-akagi font-light text-[#6D7172]'>{rentstart}</h1>

        <h1 className='hidden lg:flex font-akagi font-light text-[#6D7172]'>{duration}</h1>

        <h1 className='hidden lg:flex font-akagi font-bold text-[#6D7172]'>{price}</h1>

        {/*Mobile*/} 

        <div className='flex flex-row gap-4 items-center'>
            <img src={image}
            className='lg:hidden w-20'/>

            <div className='lg:hidden flex flex-col'>
                <div className='flex flex-row gap-3 text-start'>
                    <h1 className='font-akagi font-bold text-[#6D7172]'>{bike}</h1>
                    <h1 className='font-akagi font-light text-[#6D7172]'>{quantity}</h1>
                </div>

                <div className='flex flex-row gap-2'>
                    <h1 className='font-akagi font-light text-[#6D7172]'>{rentdate}</h1>
                    <h1 className='font-akagi font-light text-[#6D7172]'>{rentstart}</h1>
                </div>
            </div>
        </div>

        <div className='lg:hidden'>
            <h1 className='font-akagi font-bold text-[#6D7172]'>{price}</h1>
        </div>
    </div>
                
  );
}

export default CheckoutRentRow;