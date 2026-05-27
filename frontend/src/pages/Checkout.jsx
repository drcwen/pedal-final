import CheckoutSection from "../components/sections/CheckoutSection"
import Navigation from "../components/layout/Navigation/StaticNavigationPC"

function Checkout() {

  
  return (
    <div className='w-full bg-[#f7f7f7]'>
        <Navigation/>
        <CheckoutSection/>
    </div>
  );
}

export default Checkout;