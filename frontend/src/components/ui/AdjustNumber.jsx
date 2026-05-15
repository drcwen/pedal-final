import { FiMinus } from "react-icons/fi";
import { FiPlus } from "react-icons/fi";

function AdjustNumber({ value, setValue, color }) {

    const addValue = () => {
        setValue((prev) => prev + 1);
    };

    const subtractValue = () => {
        if (value > 1) {
            setValue((prev) => prev - 1);
        }
    };

    return(
        <div className={`grid grid-cols-3 rounded-lg border-2 border-${color}`}>

            <div
                className='flex items-center justify-center px-2 cursor-pointer'
                onClick={subtractValue}
            >
                <FiMinus className={`text-${color}`}/>
            </div>

            <div className={`bg-${color} flex justify-center items-center`}>
                <h1 className='text-lg text-white font-akagi font-semibold'>
                    {value}
                </h1>
            </div>

            <div
                className='flex items-center justify-center cursor-pointer'
                onClick={addValue}
            >
                <FiPlus className={`text-${color}`}/>
            </div>

        </div>
    );
}

export default AdjustNumber;