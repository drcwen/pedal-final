import Navigation from "../components/layout/Navigation/StaticNavigationPC"
import CartSection from "../components/sections/CartSection"

function Cart() {

  
  return (
    <div className='w-full bg-[#f7f7f7]'>
        <Navigation/>

        <CartSection/>
    </div>
  );
}

export default Cart;