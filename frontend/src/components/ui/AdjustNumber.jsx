import { FiMinus } from "react-icons/fi";
import { FiPlus } from "react-icons/fi";

function AdjustNumber({ value, setValue }) {

    const addValue = () => {
        setValue((prev) => prev + 1);
    };

    const subtractValue = () => {
        if (value > 1) {
            setValue((prev) => prev - 1);
        }
    };

    return(
        <div className={`grid grid-cols-3 rounded-lg border-2 border-[#979B9D]`}>

            <div
                className='flex items-center justify-center px-2 cursor-pointer'
                onClick={subtractValue}
            >
                <FiMinus className={`text-[#979B9D]`}/>
            </div>

            <div className={`bg-[#979B9D] flex justify-center items-center lg:py-1`}>
                <h1 className='text-lg text-[#ffffff] font-akagi font-semibold'>
                    {value}
                </h1>
            </div>

            <div
                className='flex items-center justify-center cursor-pointer'
                onClick={addValue}
            >
                <FiPlus className={`text-[#979B9D]`}/>
            </div>

        </div>
    );
}

export default AdjustNumber;