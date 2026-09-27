import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import { useState } from "react";

function DropDown({ value, options = [], onChange, placeholder = "Select", allowed = true }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option) => {
    onChange(option.id);
    setIsOpen(false);
  };

  const selectedOption = options.find(option => option.id === value);

  return (
    <div className="relative">
      <div
        onClick={allowed === true ? () => setIsOpen(!isOpen) : undefined}
        className="rounded-lg border border-[#9E9E9E]/50 grid grid-cols-[1fr_20px] px-2 items-center cursor-pointer"
      >
        <div className="py-2 px-2">
          <h1 className="text-md font-akagi font-medium text-[#6D7172]">
            {selectedOption?.code || placeholder}
          </h1>
        </div>

        {isOpen ? (
          <RiArrowDropUpLine className="text-3xl text-gray" />
        ) : (
          <RiArrowDropDownLine className="text-3xl text-gray" />
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white rounded-lg border border-[#9E9E9E] z-50 mt-1">
            {options.map((option) => (
                <div
                    key={option.id}
                    onClick={() => handleSelect(option)}
                    className="text-md font-akagi font-medium text-[#6D7172] hover:bg-gray hover:text-white px-2 py-2 cursor-pointer"
                >
                    {option.code}
                </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default DropDown;