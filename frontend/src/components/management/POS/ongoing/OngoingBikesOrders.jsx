import { BsThreeDots } from "react-icons/bs";
import { useState } from 'react';
import { FaArrowCircleLeft } from "react-icons/fa";
import { RiArrowDropDownLine } from "react-icons/ri";
import { GoDotFill } from "react-icons/go";

function OngoingBikesOrders({ bikeId, gpsId, type, price, duration, start, end, remaining }) {

    const [dot, setDot] = useState(false);
    const [returned, setReturned] = useState(false);
    const [change, setChange] = useState(false);

    const [dropDown, setDropDown] = useState(false);
    const [dropDownValue, setDropDownValue] = useState("Set Return Status");

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

            { returned && 
            <div className='flex flex-row gap-2 items-center'>
                <div className='w-full border border-[#DBDBDB] py-1 px-4 rounded-lg flex flex-row justify-between shadow-md relative font-akagi font-bold text-md text-gray items-center'>

                    <div className=''>
                        <h1 className=''>{dropDownValue}</h1>
                    </div>

                    <RiArrowDropDownLine onClick={() => {setDropDown(!dropDown), setDot(false)}}/>

                    {dropDown === true &&
                    <>
                        <div 
                            className='w-full absolute left-0 top-12 p-2 border border-[#DBDBDB] rounded-lg bg-[#F0F0F0] z-100'>
                            <div
                                onClick={() => {setDropDownValue("Available"), setDropDown(!dropDown)}}
                                value="Available" 
                                className='px-2 py-1 text-gray flex flex-row gap-1 items-center'
                            >
                                <GoDotFill className='text-green-500 text-2xl'/>
                                Available
                            </div>

                            <div
                                onClick={() => {setDropDownValue("Under Maintenance"), setDropDown(!dropDown)}}
                                value="Available" 
                                className='px-2 py-1 text-gray flex flex-row gap-1 items-center'
                            >
                                <GoDotFill className='text-red-500 text-2xl'/>
                                Under Maintenance
                            </div>

                        </div>
                    </>
                    }   
                </div>

                <div className='h-fit bg-blue items-center px-3 flex py-1 rounded-lg text-md font-akagi font-bold text-[#ffffff] cursor-pointer hover:bg-blue/80 duration-300 transition-all'>
                    Submit
                </div>
            </div>
            }
          <div className='flex justify-end'>
                <div className='relative'>
                    <BsThreeDots 
                        onClick={() => {setDot(!dot), setDropDown(false)}}
                        className='text-xl text-gray justify-end cursor-pointer hover:text-blue duration-300 transition-all'/>
                    {dot === true &&
                        <div className='absolute right-0 w-fit bg-gray p-3 flex flex-col gap-2 font-akagi font-bold text-[#ffffff] rounded-lg cursor-pointer'>
                            <div
                                className=''>
                                <h1>Monitor</h1>
                            </div>

                            <div 
                                onClick={() => {setChange(true), setDot(!dot), setReturned(!returned)}}>
                                <h1>Change</h1>
                            </div>

                            <div 
                                onClick={() => {setReturned(true), setDot(!dot)}}>
                                <h1>Return</h1>
                            </div>

                        </div>
                    }
                </div>
          </div>
      </div>
                                
    </>
  )
}

export default OngoingBikesOrders
