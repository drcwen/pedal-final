
import { motion } from "motion/react"

function BikesTile({
    image,
    price,
    name,
    availableBikes,
    checkingAvailability,
    onHoursChange,
    maxRentalHours,
    isOpen,
    onClick,
    bikeId,
    bikeData,
    setBikeData,
    setCart,
    cart
}) {
    
    const quantity = bikeData[bikeId]?.quantity || 0;
    const hours = bikeData[bikeId]?.hours || 0;

    const cartQuantity = cart.filter(item => item.bikeId === bikeId).length;

    const remainingBikes = Math.max(
        0,
        (availableBikes ?? 0) - cartQuantity
    );

    const handleAdd = (e) => {
        e.stopPropagation();

        if (hours === 0) {
            alert("Please select rental hours first.");
            return;
        }

        if (checkingAvailability || availableBikes === null) {
            alert("Please wait while availability is checked.");
            return;
        }

        if (remainingBikes === 0) {
            alert(`No ${name} units available.`);
            return;
        }

        if (quantity === 0) {
            alert("Please select the quantity.");
            return;
        }

        if (quantity > remainingBikes) {
            alert(`Only ${remainingBikes} ${name} unit(s) available.`);
            return;
        }

        const bikesToAdd = Array.from(
            { length: quantity },
            (_, index) => ({
                cartId: `${bikeId}-${Date.now()}-${index}`,
                bikeId,
                name,
                image,
                hours,
                price,
                total: hours * price
            })
        );

        setCart(prev => [...prev, ...bikesToAdd]);

        setBikeData(prev => ({
            ...prev,
            [bikeId]: {
                quantity: 0,
                hours: 0
            }
        }));
    };

  return (
    <>
        <div 
            onClick={onClick}
            className={`rounded-xl bg-[#EBEBEB] p-4 flex flex-col items-center text-center w-full h-full justify-center gap-4 border border-[#C8C8C8] cursor-pointer
                ${isOpen == true ? `bg-blue` : `bg-[#EBEBEB]`}
                ${availableBikes === 0 ? `opacity-50 bg-black pointer-events-none` : ``}
            `}
        >
            <img 
                className='w-30'
                src={image}/>
            <h1 className={`text-lg font-akagi font-bold tracking-wide
                ${isOpen == true ? `text-[#ffffff]` : `text-[#505050] `}
                `}
            >
                {name}
            </h1>
            
            {isOpen && (
                <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}className='flex flex-col w-full gap-3'
                >

                    <div className="bg-navyblue rounded-lg px-2 py-1 font-akagi font-medium text-sm text-yellow">
                        {hours === 0
                            ? "Select rental hours first"
                            : checkingAvailability
                                ? "Checking availability..."
                                : availableBikes === null
                                    ? "Unable to check availability"
                                    : remainingBikes === 0
                                        ? "No Available Units"
                                        : `${remainingBikes} units available`
                        }
                    </div>

                    <div className='flex md:flex-row flex-col justify-between px-4 md:items-center'>
                        <h1 className='text-md font-akagi font-medium text-[#ffffff]'>
                            Hours
                        </h1>

                        <div className='rounded-lg border-2 border-[#ffffff] grid grid-cols-3 font-akagi font-medium'>

                            {/* Decrease hours */}
                            <div
                                onClick={(e) => {
                                    e.stopPropagation();

                                    const newHours = Math.max(0, hours - 1);

                                    setBikeData(prev => ({
                                        ...prev,
                                        [bikeId]: {
                                            ...prev[bikeId],
                                            hours: newHours,
                                            quantity: 0
                                        }
                                    }));

                                    onHoursChange(newHours);
                                }}
                                className='px-2 text-[#ffffff] cursor-pointer'
                            >
                                -
                            </div>

                            {/* Selected hours */}
                            <div className='bg-white text-blue'>
                                {hours}
                            </div>

                            {/* Increase hours */}
                            <div
                                onClick={(e) => {
                                    e.stopPropagation();

                                    if (hours >= maxRentalHours) return;

                                    const newHours = hours + 1;

                                    setBikeData(prev => ({
                                        ...prev,
                                        [bikeId]: {
                                            ...prev[bikeId],
                                            hours: newHours,
                                            quantity: 0
                                        }
                                    }));

                                    onHoursChange(newHours);
                                }}
                                className={`px-2 ${
                                    hours >= maxRentalHours
                                        ? "text-white/40 cursor-not-allowed"
                                        : "text-white cursor-pointer"
                                }`}
                            >
                                +
                            </div>

                        </div>
                    </div>

                    <p className="text-xs text-white/70">
                        Maximum rental: {maxRentalHours} hour(s)
                    </p>

                    {hours > 0 && remainingBikes > 0 && (
                        <div className="flex md:flex-row flex-col justify-between px-4 md:items-center">
                            <h1 className="text-md font-akagi font-medium text-[#ffffff]">
                                Quantity
                            </h1>

                            <div className="rounded-lg border-2 border-[#ffffff] grid grid-cols-3 font-akagi font-medium">
                                {/* Decrease quantity */}
                                <div
                                    onClick={(e) => {
                                        e.stopPropagation();

                                        setBikeData(prev => ({
                                            ...prev,
                                            [bikeId]: {
                                                ...prev[bikeId],
                                                quantity: Math.max(
                                                    0,
                                                    (prev[bikeId]?.quantity || 0) - 1
                                                )
                                            }
                                        }));
                                    }}
                                    className="px-2 text-[#ffffff] cursor-pointer"
                                >
                                    -
                                </div>

                                <div className="bg-white text-blue">
                                    {quantity}
                                </div>

                                {/* Increase quantity */}
                                <div
                                    onClick={(e) => {
                                        e.stopPropagation();

                                        setBikeData(prev => ({
                                            ...prev,
                                            [bikeId]: {
                                                ...prev[bikeId],
                                                quantity: Math.min(
                                                    remainingBikes,
                                                    (prev[bikeId]?.quantity || 0) + 1
                                                )
                                            }
                                        }));
                                    }}
                                    className="text-[#ffffff] cursor-pointer px-2"
                                >
                                    +
                                </div>
                            </div>
                        </div>
                    )}

                    <button
                        type="button"
                        disabled={
                            remainingBikes === 0 ||
                            checkingAvailability ||
                            availableBikes === null ||
                            quantity === 0
                        }
                        onClick={handleAdd}
                        className={`rounded-xl py-1 font-akagi font-bold w-full
                            ${
                                remainingBikes === 0 ||
                                checkingAvailability ||
                                availableBikes === null ||
                                quantity === 0
                                    ? "bg-gray-400 text-gray-200 opacity-50 cursor-not-allowed"
                                    : "bg-yellow text-darkblue cursor-pointer"
                            }`}
                    >
                        Add
                    </button>
                </motion.div>
            )}
        </div>

    </>
  )
}

export default BikesTile
