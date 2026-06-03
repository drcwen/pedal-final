 
import TransactionsSection from "../components/sections/TransactionsSection"
import Navigation from "../components/layout/Navigation/StaticNavigationPC"

function Transactions() {

  return (
    <>

        <div className='w-full bg-[#f7f7f7]'>
            <Navigation />
            <TransactionsSection />
        </div>
        

    </>
  )
}

export default Transactions
