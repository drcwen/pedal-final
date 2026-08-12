import { BsThreeDots } from "react-icons/bs";
import { useState, useEffect } from 'react';
import { FaArrowCircleLeft } from "react-icons/fa";
import { RiArrowDropDownLine } from "react-icons/ri";
import { GoDotFill } from "react-icons/go";
import { supabase } from "../../../../lib/supabase"
import WalkInRent from "../ongoing/WalkInRent"

function OngoingBikesOrders({ bikeTypeId, orderId, bikeId, gpsId, type, price, duration, start, end, remaining, image, setExtendOrder, setChangeOrder, pricePerHour }) {

    const [dot, setDot] = useState(false);
    const [returned, setReturned] = useState(false);
    const [change, setChange] = useState(false);

    const [dropDown, setDropDown] = useState(false);
    const [dropDownValue, setDropDownValue] = useState("Set Return Status");

    const [extension, setExtension] = useState([]);

    function getEndTimeOnly(tstzrange) {
        const match = tstzrange.match(/\["[^"]+","([^"]+)"\)/);

        if (!match) return null;

        const utcDate = new Date(
            match[1]
                .replace(" ", "T")
                .replace("+00", "Z")
        );

        return utcDate.toLocaleTimeString("en-PH", {
            timeZone: "Asia/Manila",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    }

    function formatTimeTo12Hour(time) {
        const [hours, minutes, seconds] = time.split(":").map(Number);

        const date = new Date();
        date.setHours(hours, minutes, seconds);

        return date.toLocaleTimeString("en-PH", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    }

    //Progress Bar Converter
    function getStartDate(startTime) {
        const now = new Date();

        const [hours, minutes, seconds] = startTime.split(":").map(Number);

        const date = new Date(now);
        date.setHours(hours, minutes, seconds, 0);

        return date;
    }

    function getEndDate(tstzrange) {
        const match = tstzrange.match(/\["[^"]+","([^"]+)"\)/);

        if (!match) return null;

        return new Date(
            match[1]
                .replace(" ", "T")
                .replace("+00", "Z")
        );
    }

    const [progress, setProgress] = useState(0);

    const getProgress = (startTime, endRange) => {
        const startDate = getStartDate(startTime);
        const endDate = getEndDate(endRange);

        if (!startDate || !endDate) return 0;

        const now = new Date();

        const total = endDate - startDate;
        const elapsed = now - startDate;

        if (elapsed <= 0) return 0;
        if (elapsed >= total) return 100;

        return (elapsed / total) * 100;
    };

    useEffect(() => {

        const update = () => {
            setProgress(getProgress(start, end));
        };

        update();

        const interval = setInterval(update, 1000);

        return () => clearInterval(interval);

    }, [start, end]);


    //Return Bike
    const returnBike = async () => {
        const {data, error} = await supabase
            .from("bikes_mod")
            .update({status: dropDownValue})
            .eq("code", bikeId);
        
        if(error) {
            alert(error);
        }
    }

    const returnGps = async () => {
        const {data, error} = await supabase
            .from("gps_mod")
            .update({status: "Available"})
            .eq("code", gpsId)

        if(error) {
            alert(error);
        }
    }

    const setReturn = async () => {
        const {data, error} = await supabase
            .from("orders_mod")
            .update({status: "returned"})
            .eq("id", orderId)

        if(error) {
            alert(error);
        }
    }

    const handleReturn = async () => {
        await returnBike();
        await returnGps();
        await setReturn();
        
        window.location.reload();
    };

  return (
    <>
        <div className='relative border border-[#DBDBDB] p-3 rounded-lg flex flex-col gap-4 shadow-md'>
          <div className='flex flex-row justify-between items-center'>
              <div className='flex flex-row gap-4 items-center'>
                  {/*Image*/}
                  <div className='items-center bg-yellow p-1 rounded-lg'>
                      <img 
                          src={image}
                          className='w-6'
                      />
                  </div>
                  <h1 className='text-md font-akagi font-bold text-gray'>{type}</h1>
                  <div className='bg-blue rounded-lg px-2 text-[#ffffff] py-0.5 font-akagi text-sm font-bold'>{bikeId}</div>
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
                    <h1 className='text-sm font-akagi font-medium text-gray'>{formatTimeTo12Hour(start)}</h1>
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
                  <h1 className='text-sm font-akagi font-medium text-gray'>{getEndTimeOnly(end)}</h1>
              </div>

              <div className='flex flex-col'>
                  <h1 className='text-sm font-akagi font-bold text-gray'>REMAINING</h1>
                  <h1 className='text-sm font-akagi font-medium text-gray'>{remaining}</h1>
              </div>
          </div>

          <div className='flex flex-col'>
            <h1 className='text-sm font-akagi font-bold text-gray'>EXTENSION</h1>
            <h1 className='text-sm font-akagi font-medium text-gray'>{extension}</h1>
          </div>


            {/*Change*/}
            { change && 
                <></>
            }

            {/*Return*/}
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

                <div 
                    onClick={() => {dropDownValue === "Set Return Status" ? alert("Set Return Status first"): handleReturn()}}
                    className='h-fit bg-blue items-center px-3 flex py-1 rounded-lg text-md font-akagi font-bold text-[#ffffff] cursor-pointer hover:bg-blue/80 duration-300 transition-all'>
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
                        <div className='absolute right-0 w-fit z-100 bg-gray p-3 flex flex-col gap-2 font-akagi font-bold text-[#ffffff] rounded-lg cursor-pointer'>
                            <div
                                className=''>
                                <h1>Monitor</h1>
                            </div>

                            <div 
                                onClick={() => {setChangeOrder({
                                    bikeTypeId,
                                    orderId,
                                    image,
                                    bikeId,
                                    type,
                                    pricePerHour,
                                    name,
                                    gpsId
                                }), setChange(true), setDot(!dot), returned === true ? setReturned(!returned) : null}}>
                                <h1>Change</h1>
                            </div>

                            <div 
                                onClick={() => {setExtendOrder({
                                    orderId,
                                    bikeId,
                                    type,
                                    duration,
                                    end,
                                    image,
                                    start,
                                    pricePerHour
                                }), setDot(!dot), returned === true ? setReturned(!returned) : null, change === true ? setChange(!change) : null}}>
                                <h1>Extend</h1>
                            </div>

                            <div 
                                onClick={() => {setReturned(true), setDot(!dot)}}>
                                <h1>Return</h1>
                            </div>

                        </div>
                    }
                </div>
            </div>

            <div className="absolute left-0 bottom-0 h-1 w-full bg-gray-200 rounded-bl-xl rounded-br-xl">
                <div
                    className={`h-full ${progress < 75 ? "bg-blue" : "bg-red-400"} rounded-bl-xl rounded-br-xl transition-all duration-1000`}
                    style={{ width: `${progress}%` }}
                />
            </div>

        </div>
                                
    </>
  )
}

export default OngoingBikesOrders
