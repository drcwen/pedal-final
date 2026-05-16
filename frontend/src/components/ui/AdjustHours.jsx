import { FiMinus } from "react-icons/fi";
import { FiPlus } from "react-icons/fi";

function AdjustHours({ value, setValue, min = 1, max = 4 }) {

    const addValue = () => {
        if (value < max) {
            setValue((prev) => prev + 1);
        }
    };

    const subtractValue = () => {
        if (value > min) {
            setValue((prev) => prev - 1);
        }
    };

    return(
        <div className='grid grid-cols-3 rounded-lg border-2 border-white overflow-hidden'>

            <div
                className='flex items-center justify-center px-3 cursor-pointer'
                onClick={subtractValue}
            >
                <FiMinus className='text-white'/>
            </div>

            <div className='bg-white flex justify-center items-center px-4 py-2'>
                <h1 className='text-lg text-darkblue font-akagi font-semibold'>
                    {value}
                </h1>
            </div>

            <div
                className='flex items-center justify-center px-3 cursor-pointer'
                onClick={addValue}
            >
                <FiPlus className='text-white'/>
            </div>

        </div>
    );
}

export default AdjustHours;