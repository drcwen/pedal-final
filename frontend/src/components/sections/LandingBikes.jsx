
import SoloBikesDisplay from "../layout/bikes/SoloBikesDisplay"
import FamilyBikesDisplay from "../layout/bikes/FamilyBikesDisplay"
import Test from "../sections/Test"

function LandingBikes() {

    return (
        <>
            <div className='min-h-screen bg-[#F7F7F7] px-10 py-20 flex flex-col items-center justify-center gap-10 md:items-start md:py-25 md:px-30 md:flex md:flex-col md:gap-20'>
                
                <h1 className='font-akagi font-black tracking-wide text-blue text-4xl'>
                    Solo Bikes
                </h1>

                <div className='w-full'>
                    <SoloBikesDisplay/>
                </div>


                <h1 className='font-akagi font-black tracking-wide text-blue text-4xl'>
                    Family Bikes
                </h1>

                <div className='w-full'>
                    <FamilyBikesDisplay />
                </div>

                <Test/>
            </div>
        </>
    )
}

export default LandingBikes