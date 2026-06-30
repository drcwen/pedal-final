import { BsThreeDots } from "react-icons/bs";
import { useState } from 'react';

function OngoingBikesOrders({ bikeId, gpsId, type, price, duration, start, end, remaining }) {

    const [dot, setDot] = useState(false);
  return (
    <>
        <div className='border border-[#DBDBDB] p-3 rounded-lg flex flex-col gap-4 shadow-md'>
          <div className='flex flex-row justify-between items-center'>
              <div className='flex flex-row gap-4 items-center'>
                  {/*Image*/}
                  <div className='items-center bg-yellow p-1 rounded-lg'>
                      <img 
                          src='https://res.cloudinary.com/dp3vkgxtb/image/upload/v1775884918/solo_bike_mhxxvb.png'
                          className='w-6'
                      />
                  </div>
                  <h1 className='text-md font-akagi font-bold text-gray'>{type}</h1>
              </div>

              <h1 className='text-md font-akagi font-bold text-gray'>{price}</h1>
          </div>

          <div className='w-full grid grid-cols-3 gap-2'>

                <div className='flex flex-col'>
                    <h1 className='text-sm font-akagi font-bold text-gray'>BIKE ID</h1>
                    <h1 className='text-sm font-akagi font-medium text-gray'>{bikeId}</h1>
                </div>

                <div className='flex flex-col'>
                    <h1 className='text-sm font-akagi font-bold text-gray'>START</h1>
                    <h1 className='text-sm font-akagi font-medium text-gray'>{start}</h1>
                </div>

                <div className='flex flex-col'>
                    <h1 className='text-sm font-akagi font-bold text-gray'>DURATION</h1>
                    <h1 className='text-sm font-akagi font-medium text-gray'>{duration}</h1>
                </div>

                <div className='flex flex-col'>
                    <h1 className='text-sm font-akagi font-bold text-gray'>GPS ID</h1>
                    <h1 className='text-sm font-akagi font-medium text-gray'>{gpsId}</h1>
                </div>

              <div className='flex flex-col'>
                  <h1 className='text-sm font-akagi font-bold text-gray'>END</h1>
                  <h1 className='text-sm font-akagi font-medium text-gray'>{end}</h1>
              </div>

              <div className='flex flex-col'>
                  <h1 className='text-sm font-akagi font-bold text-gray'>REMAINING</h1>
                  <h1 className='text-sm font-akagi font-medium text-gray'>{remaining}</h1>
              </div>
          </div>

          <div className='flex justify-end'>
                <div className='relative'>
                <BsThreeDots 
                    onClick={() => setDot(!dot)}
                    className='text-xl text-gray justify-end cursor-pointer hover:text-blue duration-300 transition-all'/>
                {dot === true &&
                    <div className='absolute right-0 w-fit bg-gray p-3 flex flex-col gap-2 font-akagi font-bold text-[#ffffff] rounded-lg'>
                        <h1>Monitor</h1>
                        <h1>Change</h1>
                        <h1>Return</h1>
                    </div>
                }
                </div>
          </div>
      </div>
                                
    </>
  )
}

export default OngoingBikesOrders
