 
import TransactionsSection from "../components/sections/TransactionsSection"
import Navigation from "../components/layout/Navigation/StaticNavigationPC"
import PastTransactionsSection from "../components/sections/PastTransactionsSection"

function PastTransactions() {

  return (
    <>

        <div className='w-full bg-[#f7f7f7]'>
            <Navigation />
            <PastTransactionsSection />
        </div>
        

    </>
  )
}

export default PastTransactions
