import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { useState } from "react"
import { motion } from "motion/react"
import { fadeScale } from "../../animations/fadeScale"
import "../css/boxModel.css"

function SetTimeAndDate({ setReservationData, onClose }) {

    const [selectedDate, setSelectedDate] = useState(null);

    const [selectedStart, setSelectedStart] = useState(null);
    
    const [selectedHours, setSelectedHours] = useState("");

    const formatDate = (date) => {
        if (!date) return null;

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    const formatTime = (date) => {
        if (!date) return null;

        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = "00";

        return `${hours}:${minutes}:${seconds}`;
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
    }

    const getPHNow = () => {
        const now = new Date();

        // convert to PH time (UTC+8)
        const utc = now.getTime() + now.getTimezoneOffset() * 60000;
        return new Date(utc + 8 * 60 * 60000);
    };

    const phNow = getPHNow();

    const minDate = new Date(phNow);
    minDate.setDate(minDate.getDate() + 1);
    minDate.setHours(0, 0, 0, 0);

    const handleSubmit = () => {

        if (!setReservationData) {
            console.error("setReservationData is missing");
            return;
        }

        setReservationData({
            date: formatDate(selectedDate),
            startTime: formatTime(selectedStart),
            hours: selectedHours
        });

        console.log("yehay");

        if (onClose) {
        onClose(); 
    }

    }

    //Date
    const createTime = (hour) => {
        const date = new Date();
        date.setHours(hour, 0, 0, 0);
        return date;
    };

    console.log(formatDate(selectedDate), formatTime(selectedStart), selectedHours);

    console.log("No format", selectedDate, selectedStart, selectedHours)
  return (
    <>
        <div className="box-model fixed inset-0 bg-black/60 flex items-center justify-center">
    
            <motion.div
                    initial={fadeScale.initial}
                    animate={fadeScale.animate}
                    transition={fadeScale.transition} 
                    className='bg-navyblue rounded-2xl px-10 py-10 flex flex-col gap-10 items-center justify-center text-center'>
                
                <h1 className='font-akagi font-black text-yellow text-3xl'>
                    SET RESERVATION
                </h1>

                <div
                    className='flex flex-col gap-5 items-center justify-center'
                >
                    <div className='flex flex-row gap-5 items-center justify-center'>
                        <h1 className='font-akagi font-bold text-white text-xl'>Date</h1>

                        <div className='bg-[#f7f7f7] px-5 py-2 rounded-xl flex justify-between'>
                            <DatePicker 
                                selected={selectedDate}
                                onChange={handleDateChange}
                                dateFormat="MM  /  dd  /  YYYY"
                                minDate={minDate}
                                filterDate={(date) => date.getDay() !== 1}
                                className='w-full py-1 text-md lg:text-xl font-akagi font-bold text-center text-navyblue cursor-pointer'
                            />
                        </div>
                    </div>

                    <div className='flex flex-row gap-5 items-center justify-center'>
                        <h1 className='font-akagi font-bold text-white text-xl'>Start</h1>

                        <div className='bg-[#f7f7f7] px-5 py-2 rounded-xl flex justify-between'>
                            <DatePicker 
                                selected={selectedStart}
                                onChange={(date) => setSelectedStart(date)}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={60}
                                dateFormat="h:mm aa"
                                includeTimes={[
                                    createTime(8),
                                    createTime(9),
                                    createTime(10),
                                    createTime(11),
                                    createTime(12),
                                    createTime(13),
                                    createTime(14),
                                    createTime(15),
                                    createTime(16)
                                ]}  
                                className='w-full py-1 text-md lg:text-xl font-akagi font-bold text-center text-navyblue cursor-pointer'
                            />
                        </div>
                        
                    </div>

                    <div className='flex flex-row gap-5 items-center justify-center'>
                        <h1 className='font-akagi font-bold text-white text-xl'>Hour</h1>

                        <div className='bg-[#f7f7f7] px-5 py-2 rounded-xl flex justify-between'>
                            <input
                                type="number"
                                min={1}
                                max={4}
                                value={selectedHours}
                                onChange={(e) => {
                                    let value = Number(e.target.value);

                                    if (value > 4) value = 4;
                                    if (value < 1) value = 1;

                                    setSelectedHours(value);
                                }}
                                className="text-lg font-akagi font-bold text-navyblue px-3 py-1 rounded-lg text-center"
                                />
                        </div>
                    </div>

                </div>

                

                <div className='w-full flex justify-between'>

                    <div className='bg-lightgray rounded-lg px-5 py-1 cursor-pointer'>
                        <h1 className='font-akagi text-sm font-semibold text-navyblue'>Back</h1>
                    </div>

                    <div 
                        onClick={handleSubmit}
                        className='bg-yellow rounded-lg px-5 py-1 cursor-pointer'
                    >
                        <h1 className='font-akagi text-sm font-semibold text-navyblue'>Submit</h1>
                    </div>
                </div>

            </motion.div>

        </div>
        
    </>
  )
}

export default SetTimeAndDate
