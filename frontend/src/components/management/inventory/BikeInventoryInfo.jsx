import { MdModeEditOutline } from "react-icons/md";

function BikeInventoryInfo() {

  return (
    <>

            <div className='px-3 bg-[#ffffff] border border-[#C9C9C9] rounded-lg py-2 grid grid-cols-[1fr_1fr_1fr_1fr_1fr_30px] gap-2 font-akagi font-bold text-gray text-md text-center'>
              <div className=''>
                  M01
              </div>

              <div className=''>
                  123
              </div>

              <div className=''>
                  12/22/2026
              </div>

              <div className=''>
                  P5000
              </div>

              <div className=''>
                  Rented
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
