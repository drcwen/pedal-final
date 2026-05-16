import CartRentRow from '../layout/cart/CartRentRow'

function CartSection() {


  
  return (
    <div className='box-model flex flex-col gap-5 flex flex-col justify-center'>

        <div className='w-full flex flex-col gap-10'>
            <h1 className="text-4xl font-akagi font-black text-blue">
                Cart
            </h1>

            <div className='h-70 overflow-y-auto flex flex-col gap-7 lg:px-10 px-2'>
                <CartRentRow/>
                <CartRentRow/>
                <CartRentRow/>
                <CartRentRow/>
                <CartRentRow/>
                <CartRentRow/>
            </div>

            <div className='h-1 bg-black/20 rounded-lg'></div>

            <div className='flex flex-row justify-between px-20'>
                <h1 className='text-2xl font-akagi font-bold text-[#6D7172]'>Total</h1>
                <h1 className='text-2xl font-akagi font-bold text-[#6D7172]'>P250</h1>
            </div>
        </div>
        
    </div>
  );
}

export default CartSection;