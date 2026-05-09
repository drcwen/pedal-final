
import AllBikes from "../components/sections/AllBikes"
import StaticNavigation from "../components/layout/Navigation/StaticNavigationPC"
import SetTimeAndDate from "../components/layout/SetTimeAndDate"

function Reserve() {


  return (
    <>

        <div className='w-full bg-[#f7f7f7]'>
            <StaticNavigation/>
            
            <AllBikes/> 

            <SetTimeAndDate/>

        </div>
        

    </>
  )
}

export default Reserve
