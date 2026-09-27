import { FiMinus } from "react-icons/fi";
import { FiPlus } from "react-icons/fi";
import { useState } from "react";

function AdjustQuantity({ value, setValue, limit }) {

    const [warning, setWarning] = useState(false);

    const addValue = () => {

        if (value < limit) {
            setWarning(false);
            setValue(value + 1);
            return;
        }

        setWarning(true);
    };

    const subtractValue = () => {

        if (value > 1) {
            setValue(value - 1);
            setWarning(false);
        }
    };

    return (
        <div className="flex flex-col">

            <div className="grid grid-cols-3 rounded-lg border border-[#979B9D]">

                <div
                    className="flex items-center justify-center px-2 cursor-pointer"
                    onClick={subtractValue}
                >
                    <FiMinus className="text-[#979B9D]" />
                </div>

                <div className="bg-[#979B9D] flex justify-center items-center lg:py-1">
                    <h1 className="text-sm text-[#ffffff] font-akagi font-medium">
                        {value}
                    </h1>
                </div>

                <div
                    className="flex items-center justify-center cursor-pointer"
                    onClick={addValue}
                >
                    <FiPlus className="text-[#979B9D]" />
                </div>

            </div>

            {warning && (
                <p className="text-red-500 text-xs font-akagi mt-1 text-center">
                    Maximum limit is {limit}.
                </p>
            )}

        </div>
    );
}

export default AdjustQuantity;