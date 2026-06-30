import { MdModeEditOutline } from "react-icons/md";

function BikeInventoryInfo({ bikeCode, status }) {

  return (
    <>

            <div className='md:px-3 px-6 bg-[#ffffff] border border-[#C9C9C9] rounded-lg py-2 flex flex-row justify-between md:grid md:grid-cols-[1fr_1fr_1fr_1fr_1fr_30px] gap-2 font-akagi font-bold text-gray text-md text-center'>
              <div className=''>
                  {bikeCode}
              </div>

              <div className='hidden md:block'>
                  123
              </div>

              <div className='hidden md:block'>
                  12/22/2026
              </div>

              <div className='hidden md:block'>
                  P5000
              </div>

              <div className=''>
                  {status}
              </div>

              <div className='flex items-center justify-center'>
                  <div className='bg-blue rounded-lg p-1'>
                      <MdModeEditOutline className='text-[#ffffff] text-lg'/>
                  </div>
              </div>
          </div>
    </>
  )
}

export default BikeInventoryInfo
